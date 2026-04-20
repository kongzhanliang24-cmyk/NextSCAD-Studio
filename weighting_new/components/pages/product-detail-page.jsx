'use client'

import { ArrowRight, CheckCircle2, Download, FileText } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import ContactForm from '@/components/shared/contact-form'
import FaqAccordion from '@/components/shared/faq-accordion'
import ProductStorySection from '@/components/pages/product-detail/sections/product-story-section'
import ConfiguratorRail, { ConfiguratorMobileSheet } from '@/components/pages/product-detail/configurator-rail'
import ProductCard from '@/components/shared/product-card'
import SectionHeading from '@/components/shared/section-heading'
import SpecTable from '@/components/shared/spec-table'
import TransitionLink from '@/components/shared/transition-link'
import { contactPromises } from '@/lib/site-data'
import { getIcon } from '@/lib/icon-map'
import { useCallback, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'

// 3D viewer uses WebGL/Canvas — must be client-only
const Product3DViewer = dynamic(
  () => import('@/components/shared/product-3d-viewer'),
  {
    ssr: false,
    loading: () => (
      <div className="relative h-[640px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/75 lg:h-[780px]">
        <div className="flex h-full items-center justify-center">
          <div className="text-sm text-slate-400">Loading 3D viewer…</div>
        </div>
      </div>
    )
  }
)


export default function ProductDetailPage({ product, relatedProducts }) {
  const { t } = useLanguage()
  const configuratorProfile = useMemo(() => product.configurator || null, [product])
  const accessoryOptions = configuratorProfile?.accessories || []
  const cameraPresets = configuratorProfile?.cameraPresets || []
  const storyScenes = configuratorProfile?.storyScenes || []
  const defaultAccessoryIds = configuratorProfile?.defaultAccessoryIds || []
  const defaultPresetId = configuratorProfile?.cameraPresets?.[0]?.id || 'overview'
  const defaultSceneId = configuratorProfile?.storyScenes?.[0]?.id || null
  const accessoryLookup = useMemo(
    () => Object.fromEntries(accessoryOptions.map((item) => [item.id, item])),
    [accessoryOptions]
  )
  const storySceneLookup = useMemo(
    () => Object.fromEntries(storyScenes.map((scene) => [scene.id, scene])),
    [storyScenes]
  )
  const [selectedAccessories, setSelectedAccessories] = useState(defaultAccessoryIds)
  const [activePresetId, setActivePresetId] = useState(defaultPresetId)
  const [focusedAccessoryId, setFocusedAccessoryId] = useState(defaultAccessoryIds[0] || null)
  const [activeStorySceneId, setActiveStorySceneId] = useState(defaultSceneId)

  const resolveAccessoryDependencies = useCallback((ids) => {
    const resolved = new Set(ids)
    const queue = [...ids]

    while (queue.length) {
      const currentId = queue.shift()
      const currentAccessory = accessoryLookup[currentId]

      currentAccessory?.dependencies?.forEach((dependencyId) => {
        if (!resolved.has(dependencyId)) {
          resolved.add(dependencyId)
          queue.push(dependencyId)
        }
      })
    }

    return Array.from(resolved)
  }, [accessoryLookup])

  const removeAccessoryWithDependents = useCallback((ids, targetId) => {
    const next = new Set(ids)
    const stack = [targetId]

    while (stack.length) {
      const currentId = stack.pop()
      next.delete(currentId)

      accessoryOptions.forEach((item) => {
        if (item.dependencies?.includes(currentId) && next.has(item.id)) {
          stack.push(item.id)
        }
      })
    }

    return Array.from(next)
  }, [accessoryOptions])

  const findSceneByAccessoryId = useCallback((accessoryId) => {
    return storyScenes.find((scene) => scene.focusAccessoryId === accessoryId || scene.accessoryIds?.includes(accessoryId)) || null
  }, [storyScenes])

  const findSceneByPresetId = useCallback((presetId) => {
    return storyScenes.find((scene) => scene.presetId === presetId) || null
  }, [storyScenes])

  const applyStoryScene = useCallback((sceneInput) => {
    const scene = typeof sceneInput === 'string' ? storySceneLookup[sceneInput] : sceneInput
    if (!scene) return

    const resolvedAccessoryIds = resolveAccessoryDependencies(scene.accessoryIds || [])

    setSelectedAccessories(resolvedAccessoryIds)
    setActivePresetId(scene.presetId || defaultPresetId)
    setFocusedAccessoryId(scene.focusAccessoryId || resolvedAccessoryIds[0] || null)
    setActiveStorySceneId(scene.id)
  }, [defaultPresetId, resolveAccessoryDependencies, storySceneLookup])

  useEffect(() => {
    const resolvedDefaults = resolveAccessoryDependencies(defaultAccessoryIds)

    setSelectedAccessories(resolvedDefaults)
    setActivePresetId(defaultPresetId)
    setFocusedAccessoryId(resolvedDefaults[0] || null)
    setActiveStorySceneId(defaultSceneId)
  }, [defaultAccessoryIds, defaultPresetId, defaultSceneId, resolveAccessoryDependencies])

  const selectedSet = useMemo(() => new Set(selectedAccessories), [selectedAccessories])
  const activeAccessories = useMemo(
    () => accessoryOptions.filter((item) => selectedSet.has(item.id)),
    [accessoryOptions, selectedSet]
  )
  const activeFocusedAccessory = focusedAccessoryId ? accessoryLookup[focusedAccessoryId] || null : null
  const activeStoryScene =
    (activeStorySceneId && storySceneLookup[activeStorySceneId]) || storyScenes[0] || null

  const toggleAccessory = (accessory) => {
    const isActive = selectedAccessories.includes(accessory.id)

    setSelectedAccessories((prev) => {
      if (isActive) {
        return removeAccessoryWithDependents(prev, accessory.id)
      }

      return resolveAccessoryDependencies([...prev, accessory.id])
    })

    setFocusedAccessoryId((prev) => {
      if (isActive && prev === accessory.id) {
        return null
      }

      if (isActive) {
        return prev
      }

      return accessory.id
    })

    if (accessory.focusPreset) {
      setActivePresetId(accessory.focusPreset)
    }

    if (!isActive) {
      const relatedScene = findSceneByAccessoryId(accessory.id)
      if (relatedScene) {
        setActiveStorySceneId(relatedScene.id)
      }
    }
  }

  const selectPreset = (presetId) => {
    setActivePresetId(presetId)
    setFocusedAccessoryId(null)

    const relatedScene = findSceneByPresetId(presetId)
    if (relatedScene) {
      setActiveStorySceneId(relatedScene.id)
    }
  }

  const focusAccessory = (accessory) => {
    if (!selectedAccessories.includes(accessory.id)) {
      setSelectedAccessories((prev) => resolveAccessoryDependencies([...prev, accessory.id]))
    }

    setFocusedAccessoryId(accessory.id)
    if (accessory.focusPreset) {
      setActivePresetId(accessory.focusPreset)
    }

    const relatedScene = findSceneByAccessoryId(accessory.id)
    if (relatedScene) {
      setActiveStorySceneId(relatedScene.id)
    }
  }

  const resetConfigurator = () => {
    const resolvedDefaults = resolveAccessoryDependencies(defaultAccessoryIds)

    setSelectedAccessories(resolvedDefaults)
    setActivePresetId(defaultPresetId)
    setFocusedAccessoryId(resolvedDefaults[0] || null)
    setActiveStorySceneId(defaultSceneId)
  }

  return (
    <div>
      {/* Hero Title Bar — full width, introduces the product */}
      <section className="pt-24 pb-6 md:pt-28 md:pb-8">
        <div className="shell-container flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow">{t({ zh: 'Product Detail', en: 'Product Detail' })}</div>
            <div className="mt-4 text-sm font-semibold uppercase tracking-[0.28em] text-accent">{product.model}</div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white md:text-5xl">{t(product.title)}</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">{t(product.short_desc)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {configuratorProfile ? (
              <button type="button" onClick={resetConfigurator} className="outline-button">
                {t({ zh: '重置配置', en: 'Reset Configuration' })}
              </button>
            ) : null}
            <a href="#product-inquiry" className="solid-button">
              {t({ zh: '獲取報價', en: 'Get Quote' })}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Configurator Stage — rail + drawer sit OUTSIDE the canvas so the 3D is never covered */}
      <section className="pb-16">
        <div className="relative mx-auto w-full max-w-[1600px] px-4 md:px-6">
          <div className="flex gap-3">
            <ConfiguratorRail
              t={t}
              configuratorProfile={configuratorProfile}
              accessoryOptions={accessoryOptions}
              cameraPresets={cameraPresets}
              selectedAccessories={selectedAccessories}
              activeAccessories={activeAccessories}
              focusedAccessoryId={focusedAccessoryId}
              activeFocusedAccessory={activeFocusedAccessory}
              activePresetId={activePresetId}
              onToggleAccessory={toggleAccessory}
              onSelectPreset={selectPreset}
              onFocusAccessory={focusAccessory}
            />

            {/* 3D CANVAS — expands to fill remaining space, never covered */}
            <div className="min-w-0 flex-1">
              <Product3DViewer
                profile={configuratorProfile}
                selectedAccessoryIds={selectedAccessories}
                focusedAccessoryId={focusedAccessoryId}
                activePresetId={activePresetId}
                t={t}
              />
            </div>
          </div>

          {/* MOBILE: tabbed bottom sheet below the canvas */}
          <div className="mt-6 lg:hidden">
            <ConfiguratorMobileSheet
              t={t}
              configuratorProfile={configuratorProfile}
              accessoryOptions={accessoryOptions}
              cameraPresets={cameraPresets}
              selectedAccessories={selectedAccessories}
              activeAccessories={activeAccessories}
              focusedAccessoryId={focusedAccessoryId}
              activeFocusedAccessory={activeFocusedAccessory}
              activePresetId={activePresetId}
              onToggleAccessory={toggleAccessory}
              onSelectPreset={selectPreset}
              onFocusAccessory={focusAccessory}
            />
          </div>
        </div>
      </section>

      {/* Core Specs Band — below the stage, full width */}
      <section className="pb-16">
        <div className="shell-container">
          <div className="glass-panel p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t({ zh: '產品核心規格', en: 'Core Specs' })}</div>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              {product.specs.slice(0, 4).map((spec, index) => (
                <div key={index}>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{t(spec.name)}</div>
                  <div className="mt-2 text-lg font-medium text-white">{typeof spec.value === 'object' ? t(spec.value) : spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProductStorySection
        activeScene={activeStoryScene}
        activeSceneId={activeStorySceneId}
        product={product}
        scenes={storyScenes}
        selectedAccessoryIds={selectedAccessories}
        focusedAccessoryId={focusedAccessoryId}
        activePresetId={activePresetId}
        onStoryCue={applyStoryScene}
        configuratorProfile={configuratorProfile}
      />

      <section className="section-space">
        <div className="shell-container">
          <SectionHeading
            eyebrow={{ zh: 'Key Features', en: 'Key Features' }}
            title={{ zh: '用清楚的功能語言，把智能秤核心能力說到位', en: 'Express smart-scale capability with clear and confident language.' }}
            description={{ zh: '聚焦高精度感測、資料輸出、結構耐用與日常操作效率，讓客戶快速理解產品價值。', en: 'Highlight precision sensing, connected data output, structural durability, and operating efficiency so customers quickly understand the product value.' }}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {product.features.map((feature, index) => {
              const Icon = getIcon(feature.icon)
              return (
                <div key={index} className="surface-panel p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-300/15 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-5 text-xl font-semibold text-white">{t(feature.title)}</div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{t(feature.desc)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="shell-container grid gap-10 xl:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionHeading
              eyebrow={{ zh: 'Specifications', en: 'Specifications' }}
              title={{ zh: '規格不只是表格，而是導入決策的基礎資料', en: 'Specifications are the foundation of deployment decisions.' }}
              description={{ zh: '我們保留文字化參數呈現方式，兼顧 SEO、可讀性與業務比較需求。', en: 'Text-based parameter presentation supports SEO, readability, and sales comparison.' }}
            />
            <div className="mt-8">
              <SpecTable specs={product.specs} />
            </div>
          </div>
          <div className="space-y-6">
            <div className="surface-panel p-6 md:p-8">
              <div className="eyebrow">{t({ zh: 'Applications', en: 'Applications' })}</div>
              <div className="mt-6 text-2xl font-semibold text-white">{t({ zh: '適用場景', en: 'Application Scenario' })}</div>
              <p className="mt-4 text-base leading-8 text-slate-300">{t(product.applications)}</p>
            </div>
            <div className="surface-panel p-6 md:p-8">
              <div className="eyebrow">{t({ zh: 'Feature Breakdown', en: 'Feature Breakdown' })}</div>
              <div className="mt-6 space-y-4">
                {product.detail_features.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <div className="text-base font-medium text-white">{t(item.title)}</div>
                    <div className="mt-2 text-sm leading-7 text-slate-300">{t(item.desc)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {(product.certifications?.length || product.downloads?.length) ? (
        <section className="section-space">
          <div className="shell-container grid gap-10 lg:grid-cols-2">
            <div className="surface-panel p-6 md:p-8">
              <div className="eyebrow">{t({ zh: 'Certifications', en: 'Certifications' })}</div>
              <div className="mt-6 text-2xl font-semibold text-white">{t({ zh: '認證與品質保證', en: 'Quality Assurance' })}</div>
              <div className="mt-6 flex flex-wrap gap-4">
                {product.certifications?.map((certification) => (
                  <div key={certification} className="glass-panel min-w-[120px] px-5 py-5 text-center">
                    <div className="text-lg font-semibold text-white">{certification}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">{t({ zh: 'Certified', en: 'Certified' })}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="surface-panel p-6 md:p-8">
              <div className="eyebrow">{t({ zh: 'Downloads', en: 'Downloads' })}</div>
              <div className="mt-6 text-2xl font-semibold text-white">{t({ zh: '文件下載', en: 'Document Downloads' })}</div>
              <div className="mt-6 space-y-3">
                {product.downloads?.map((download, index) => (
                  <a
                    key={index}
                    href={download.file}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 hover:border-white/20 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-accent" />
                      <span className="text-sm text-white">{t(download.name)}</span>
                    </div>
                    <Download className="h-4 w-4 text-slate-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section id="product-inquiry" className="section-space">
        <div className="shell-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow={{ zh: 'Inquiry', en: 'Inquiry' }}
              title={{ zh: '讓產品規格快速對上你的使用需求', en: 'Match product specifications to your use case quickly.' }}
              description={{ zh: '你可以直接提供產業、承重範圍、秤台尺寸與使用情境，我們會協助選型與客製建議。', en: 'Share your industry, capacity range, platform size, and usage context, and we will help with selection and customization advice.' }}
            />
            <div className="mt-8 space-y-3">
              {contactPromises.map((promise, index) => (
                <div key={index} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-accent" />
                  <span>{t(promise)}</span>
                </div>
              ))}
            </div>
          </div>
          <ContactForm source={`product/${product.slug}`} />
        </div>
      </section>

      {product.faq?.length ? (
        <section className="section-space">
          <div className="shell-container">
            <SectionHeading
              eyebrow={{ zh: 'FAQ', en: 'FAQ' }}
              title={{ zh: '常見問題', en: 'Frequently Asked Questions' }}
              description={{ zh: '補足客戶在詢價前最常在意的資訊，降低溝通成本。', en: 'Answer the questions customers care about most before they inquire.' }}
            />
            <div className="mt-10 max-w-4xl">
              <FaqAccordion items={product.faq} />
            </div>
          </div>
        </section>
      ) : null}

      {relatedProducts?.length ? (
        <section className="section-space">
          <div className="shell-container">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                eyebrow={{ zh: 'Related Products', en: 'Related Products' }}
                title={{ zh: '你也可以比較這些相關智能秤型號', en: 'You can also compare these related smart-scale models.' }}
                description={{ zh: '把產品選型做成清楚的比較流程，有助於提升信任與轉化。', en: 'A clear model-comparison journey helps increase trust and conversion.' }}
              />
              <TransitionLink href="/products" className="ghost-button">
                {t({ zh: '看全部產品', en: 'See All Products' })}
                <ArrowRight className="h-4 w-4" />
              </TransitionLink>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {relatedProducts.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
