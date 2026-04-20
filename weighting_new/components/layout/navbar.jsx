'use client'

import { usePathname } from 'next/navigation'
import { ArrowRight, ChevronDown, Globe, Menu, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { featuredProducts, featuredSolutions, primaryNavigation, productCategories } from '@/lib/site-data'
import { useLanguage } from '@/components/providers/language-provider'
import TransitionLink from '@/components/shared/transition-link'

export default function Navbar({ companyInfo }) {
  const pathname = usePathname()
  const { lang, mounted, t, toggleLang } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const closeTimerRef = useRef(null)

  const flyoutProducts = useMemo(() => featuredProducts.slice(0, 2), [])

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => clearCloseTimer()
  }, [clearCloseTimer])

  const openMenu = useCallback((menu) => {
    clearCloseTimer()
    setActiveMenu(menu)
  }, [clearCloseTimer])

  const scheduleCloseMenu = useCallback(() => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setActiveMenu(null)
    }, 140)
  }, [clearCloseTimer])

  const navPillClass = useCallback(
    (active) => `nav-pill ${active ? 'nav-pill--active' : 'nav-pill--idle'}`,
    []
  )

  const navigation = primaryNavigation.map((item) => ({
    ...item,
    active: item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
  }))

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 py-3 md:px-6">
      <div className="shell-container">
        <div className="nav-surface rounded-[1.6rem] px-4 py-3 shadow-[0_20px_70px_rgba(2,6,23,0.45)]">
          <div className="flex items-center justify-between gap-4">
            <TransitionLink href="/" className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-accent">
                <span className="text-sm font-semibold tracking-[0.2em]">HD</span>
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white">{t(companyInfo.brandName)}</div>
                <div className="hidden max-w-[18rem] truncate text-xs text-slate-400 xl:block">{t(companyInfo.tagline)}</div>
              </div>
            </TransitionLink>

            <nav className="hidden items-center gap-1 lg:flex">
              {navigation.map((item) => {
                if (item.href === '/products') {
                  return (
                    <div
                      key={item.href}
                      className="relative"
                      onMouseEnter={() => openMenu('products')}
                      onMouseLeave={scheduleCloseMenu}
                    >
                      <TransitionLink
                        href={item.href}
                        className={navPillClass(item.active)}
                      >
                        {t(item.label)}
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${activeMenu === 'products' ? 'rotate-180' : ''}`} />
                      </TransitionLink>
                      {activeMenu === 'products' && (
                        <div className="absolute left-0 top-full w-[620px] pt-4">
                          <div className="nav-dropdown-panel rounded-[1.5rem] border border-white/10 bg-slate-950/95 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.5)] backdrop-blur-2xl">
                            <div className="grid grid-cols-[1.1fr_0.9fr] gap-6">
                              <div>
                                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-primary-100/80">{t({ zh: '產品分類', en: 'Categories' })}</div>
                                <div className="space-y-2">
                                  {productCategories.map((category) => (
                                    <TransitionLink
                                      key={category.slug}
                                      href={`/products/${category.slug}`}
                                      className="hover-glow block rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                                    >
                                      <div className="flex items-center justify-between gap-3">
                                        <div>
                                          <div className="font-medium text-white">{t(category.name)}</div>
                                          <div className="mt-1 text-sm text-slate-400">{t(category.desc)}</div>
                                        </div>
                                        <div className="data-chip">{category.count}</div>
                                      </div>
                                    </TransitionLink>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-primary-100/80">{t({ zh: '推薦型號', en: 'Featured Models' })}</div>
                                <div className="space-y-3">
                                  {flyoutProducts.map((product) => (
                                    <TransitionLink
                                      key={product.slug}
                                      href={`/product/${product.slug}`}
                                      className="ed-2xl border border-white/5 bg-gradient-to-br from-white/[0.06] to-transparent p-4 transition transition-all duration-300 hover:-translate-y-0.5 hover:border-white/10 hover:from-white/[0.08]-all duration-300 hover:-translate-y-0.5 hover:border-white/10 hover:from-white/[0.08]"
                                    >
                                      <div className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">{product.model}</div>
                                      <div className="mt-2 text-lg font-medium text-white">{t(product.title)}</div>
                                      <div className="mt-2 text-sm leading-6 text-slate-400">{t(product.short_desc)}</div>
                                    </TransitionLink>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }

                if (item.href === '/solutions') {
                  return (
                    <div
                      key={item.href}
                      className="relative"
                      onMouseEnter={() => openMenu('solutions')}
                      onMouseLeave={scheduleCloseMenu}
                    >
                      <TransitionLink
                        href={item.href}
                        className={navPillClass(item.active)}
                      >
                        {t(item.label)}
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${activeMenu === 'solutions' ? 'rotate-180' : ''}`} />
                      </TransitionLink>
                      {activeMenu === 'solutions' && (
                        <div className="absolute left-0 top-full w-[440px] pt-4">
                          <div className="nav-dropdown-panel rounded-[1.5rem] border border-white/10 bg-slate-950/95 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.5)] backdrop-blur-2xl">
                            <div className="space-y-3">
                              {featuredSolutions.map((solution) => (
                                <TransitionLink
                                  key={solution.slug}
                                  href={`/solutions/${solution.slug}`}
                                  className="hover-glow block rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                                >
                                  <div className="text-base font-medium text-white">{t(solution.title)}</div>
                                  <div className="mt-2 text-sm leading-6 text-slate-400">{t(solution.subtitle)}</div>
                                </TransitionLink>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <TransitionLink
                    key={item.href}
                    href={item.href}
                    className={navPillClass(item.active)}
                  >
                    {t(item.label)}
                  </TransitionLink>
                )
              })}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <button
                type="button"
                onClick={toggleLang}
                className="motion-preset-default inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <Globe className="h-4 w-4" />
                <span>{mounted && lang === 'zh' ? 'EN' : '中文'}</span>
              </button>
              <TransitionLink href="/contact" className="solid-button whitespace-nowrap">
                {t({ zh: '預約諮詢', en: 'Book a Demo' })}
                <ArrowRight className="h-4 w-4" />
              </TransitionLink>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {mobileOpen && (
            <div className="mt-4 space-y-2 rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4 lg:hidden">
              {navigation.map((item) => (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-2xl px-4 py-3 text-sm font-medium ${item.active ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  {t(item.label)}
                </TransitionLink>
              ))}
              <button
                type="button"
                onClick={() => {
                  toggleLang()
                  setMobileOpen(false)
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white"
              >
                <Globe className="h-4 w-4" />
                <span>{mounted && lang === 'zh' ? 'Switch to English' : '切換中文'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
