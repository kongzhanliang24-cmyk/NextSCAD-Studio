'use client'

import { ArrowUpRight, Clock3, Mail, MapPin, Phone, Smartphone } from 'lucide-react'
import { featuredSolutions, primaryNavigation, productCategories } from '@/lib/site-data'
import { useLanguage } from '@/components/providers/language-provider'
import TransitionLink from '@/components/shared/transition-link'

export default function Footer({ companyInfo }) {
  const { t } = useLanguage()

  return (
    <footer className="relative border-t border-white/10 bg-slate-950/80 py-16">
      <div className="ambient-orb left-0 top-0 h-64 w-64 bg-primary/20" />
      <div className="shell-container relative z-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.7fr_0.9fr_1fr]">
          <div>
            <div className="eyebrow">{t({ zh: 'Smart Weighing Precision', en: 'Smart Weighing Precision' })}</div>
            <h2 className="mt-6 text-2xl font-semibold text-white md:text-3xl">{t(companyInfo.fullName)}</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">{t(companyInfo.description)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {companyInfo.socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="outline-button"
                >
                  {link.label}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">{t({ zh: '網站地圖', en: 'Sitemap' })}</div>
            <div className="mt-5 space-y-3">
              {primaryNavigation.map((item) => (
                <TransitionLink key={item.href} href={item.href} className="block text-sm text-slate-300 hover:text-white">
                  {t(item.label)}
                </TransitionLink>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">{t({ zh: '產品與系統', en: 'Products & Systems' })}</div>
            <div className="mt-5 space-y-3">
              {productCategories.map((category) => (
                <TransitionLink key={category.slug} href={`/products/${category.slug}`} className="block text-sm text-slate-300 hover:text-white">
                  {t(category.name)}
                </TransitionLink>
              ))}
              {featuredSolutions.map((solution) => (
                <TransitionLink key={solution.slug} href={`/solutions/${solution.slug}`} className="block text-sm text-slate-300 hover:text-white">
                  {t(solution.title)}
                </TransitionLink>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">{t({ zh: '聯絡資訊', en: 'Contact' })}</div>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-accent" />
                <span>{companyInfo.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <Smartphone className="mt-0.5 h-4 w-4 text-accent" />
                <span>{companyInfo.mobile}</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-accent" />
                <span>{companyInfo.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-accent" />
                <span>{t(companyInfo.storeAddress)}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-accent" />
                <span>{t(companyInfo.factoryAddress)}</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-4 w-4 text-accent" />
                <span>{t(companyInfo.hours)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} {t(companyInfo.fullName)}</div>
          <div>{t({ zh: '智能秤與智慧化稱重系統品牌官網', en: 'Official brand website for smart scales and intelligent weighing systems' })}</div>
        </div>
      </div>
    </footer>
  )
}
