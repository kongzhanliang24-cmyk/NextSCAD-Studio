'use client'

import { ArrowRight, Phone } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import TransitionLink from '@/components/shared/transition-link'

export default function ContactCta() {
  const { t } = useLanguage()

  return (
    <section className="section-space">
      <div className="shell-container">
        <div className="glass-panel relative overflow-hidden px-6 py-10 md:px-10 md:py-12">
          <div className="ambient-orb -right-10 top-0 h-40 w-40 bg-accent/25" />
          <div className="ambient-orb bottom-0 left-0 h-48 w-48 bg-primary-300/20" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="eyebrow">{t({ zh: 'Ready to Scale', en: 'Ready to Scale' })}</div>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {t({ zh: '把你的智能秤流程升級成可管理、可追溯、可擴充的系統能力', en: 'Turn your smart-scale workflow into a manageable, traceable, and scalable system capability.' })}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                {t({ zh: '不論你需要智能平台秤、防水智能秤、倉儲稱重管理，或車輛過磅與 ERP 串接，我們都能從設備到系統一起規劃。', en: 'Whether you need smart platform scales, waterproof smart scales, warehouse weighing management, or vehicle-weighing integration with ERP, we can plan the full stack from equipment to system.' })}
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <TransitionLink href="/contact" className="solid-button">
                {t({ zh: '聯絡專家', en: 'Contact Experts' })}
                <ArrowRight className="h-4 w-4" />
              </TransitionLink>
              <a href="tel:0222899888" className="outline-button">
                <Phone className="h-4 w-4" />
                {t({ zh: '立即來電', en: 'Call Now' })}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
