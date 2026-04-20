'use client'

import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'

export default function ProductStorySection({
  activeScene,
  activeSceneId,
  product,
  scenes,
  selectedAccessoryIds,
  focusedAccessoryId,
  activePresetId,
  onStoryCue,
  configuratorProfile
}) {
  const { t } = useLanguage()

  if (!scenes.length || !activeScene || !configuratorProfile) {
    return null
  }

  const activeSceneIndex = Math.max(
    0,
    scenes.findIndex((scene) => scene.id === activeSceneId)
  )
  const activePreset =
    configuratorProfile.cameraPresets.find((preset) => preset.id === activePresetId) ||
    configuratorProfile.cameraPresets[0]
  const scenePreset =
    configuratorProfile.cameraPresets.find((preset) => preset.id === activeScene.presetId) ||
    activePreset
  const focusedAccessory =
    configuratorProfile.accessories.find((item) => item.id === focusedAccessoryId) || null
  const activeAccessoryLabels = (activeScene.accessoryIds || [])
    .map((id) => configuratorProfile.accessories.find((item) => item.id === id))
    .filter(Boolean)

  const prevScene = scenes[activeSceneIndex - 1] || null
  const nextScene = scenes[activeSceneIndex + 1] || null

  return (
    <section className="section-space overflow-hidden">
      <div className="shell-container">
        {/* ===== Section header ===== */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="eyebrow">
              {t({ zh: 'Product Story Scenes', en: 'Product Story Scenes' })}
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-4xl xl:text-5xl">
              {t({ zh: '把智能秤的功能敘事整理成可切換的產品場景', en: 'Organize smart-scale capabilities into switchable product scenes.' })}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300 md:text-lg">
              {t({ zh: '點選下方場景，即時切換 3D 舞台上的鏡頭與配件，聚焦當前想強調的使用情境。', en: 'Tap a scene below to instantly swap the camera and accessories on the 3D stage, focusing on the use case you want to emphasize.' })}
            </p>
          </div>

          {/* Live progress badge */}
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/60 px-5 py-3 backdrop-blur-xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              {t({ zh: '當前場景', en: 'Scene' })}
            </span>
            <span className="text-lg font-semibold text-white tabular-nums">
              {String(activeSceneIndex + 1).padStart(2, '0')}
              <span className="mx-1 text-slate-600">/</span>
              <span className="text-slate-400">{String(scenes.length).padStart(2, '0')}</span>
            </span>
          </div>
        </div>

        {/* ===== Scene tab strip — horizontal on all breakpoints, snap-scroll on mobile ===== */}
        <div className="mt-10 -mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0">
          <div className="flex gap-3 md:grid md:grid-cols-5 md:gap-4">
            {scenes.map((scene, index) => {
              const isActive = scene.id === activeSceneId
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => onStoryCue(scene)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`group relative flex min-w-[220px] flex-col items-start gap-3 overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 md:min-w-0 ${
                    isActive
                      ? 'border-accent/50 bg-gradient-to-br from-accent/[0.12] to-white/[0.02] shadow-[0_20px_60px_rgba(232,168,56,0.18)]'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05]'
                  }`}
                >
                  {/* Top-left index + top-right tag chip */}
                  <div className="flex w-full items-center justify-between">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold tabular-nums transition-colors ${
                        isActive
                          ? 'bg-accent text-primary-dark'
                          : 'bg-white/10 text-slate-300 group-hover:bg-white/15'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors ${
                        isActive ? 'text-accent' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    >
                      {t(scene.eyebrow)}
                    </span>
                  </div>

                  {/* Scene title */}
                  <div
                    className={`line-clamp-2 text-sm font-semibold leading-5 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                    }`}
                  >
                    {t(scene.title)}
                  </div>

                  {/* Bottom active indicator bar */}
                  <div
                    className={`mt-auto h-0.5 w-full rounded-full transition-all duration-300 ${
                      isActive ? 'bg-accent' : 'bg-white/10 group-hover:bg-white/25'
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* ===== Focus detail card — single scene at a time ===== */}
        <div
          key={activeSceneId}
          className="animate-scene-enter mt-6 overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-950/75 shadow-[0_32px_100px_rgba(2,6,23,0.5)] backdrop-blur-2xl"
        >
          <div className="grid gap-0 lg:grid-cols-[1.25fr_1fr]">
            {/* LEFT: Narrative column */}
            <div className="p-6 md:p-10">
              <div className="flex items-center gap-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-accent">
                  Scene {String(activeSceneIndex + 1).padStart(2, '0')}
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-accent/40 via-white/10 to-transparent" />
              </div>

              <h3 className="mt-6 text-2xl font-semibold leading-tight text-white md:text-3xl xl:text-4xl">
                {t(activeScene.title)}
              </h3>

              <p className="mt-5 text-sm leading-7 text-slate-300 md:text-base md:leading-8">
                {t(activeScene.description)}
              </p>

              {/* Prev / Next nav */}
              <div className="mt-8 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => prevScene && onStoryCue(prevScene)}
                  disabled={!prevScene}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:bg-white/5"
                  aria-label={t({ zh: '上一幕', en: 'Previous scene' })}
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => nextScene && onStoryCue(nextScene)}
                  disabled={!nextScene}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-white/30 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:bg-white/5"
                  aria-label={t({ zh: '下一幕', en: 'Next scene' })}
                >
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* Dot indicator */}
                <div className="ml-2 flex items-center gap-1.5">
                  {scenes.map((scene, index) => (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => onStoryCue(scene)}
                      aria-label={t({ zh: `跳至場景 ${index + 1}`, en: `Jump to scene ${index + 1}` })}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === activeSceneIndex
                          ? 'w-8 bg-accent'
                          : 'w-1.5 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Highlights column with subtle panel bg */}
            <div className="relative border-t border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-6 md:p-10 lg:border-l lg:border-t-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                {t({ zh: '關鍵亮點', en: 'Scene Highlights' })}
              </div>

              <ul className="mt-5 space-y-3">
                {(activeScene.bullets || []).map((bullet, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-accent" />
                    <span className="text-sm leading-6 text-slate-100">{t(bullet)}</span>
                  </li>
                ))}
              </ul>

              {/* Meta chips: camera + accessories + focus */}
              <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                <MetaChip
                  label={t({ zh: '鏡頭', en: 'Camera' })}
                  value={t(scenePreset?.label || { zh: '總覽', en: 'Overview' })}
                />
                {activeAccessoryLabels.length > 0 ? (
                  <MetaChip
                    label={t({ zh: '配件', en: 'Modules' })}
                    value={`${activeAccessoryLabels.length} / ${configuratorProfile.accessories.length}`}
                  />
                ) : null}
                {focusedAccessory ? (
                  <MetaChip
                    label={t({ zh: '聚焦', en: 'Focus' })}
                    value={t(focusedAccessory.label)}
                  />
                ) : null}
                <MetaChip
                  label={t({ zh: '型號', en: 'Model' })}
                  value={product.model}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MetaChip({ label, value }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 px-3.5 py-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </span>
      <span className="text-xs font-medium text-white">{value}</span>
    </div>
  )
}
