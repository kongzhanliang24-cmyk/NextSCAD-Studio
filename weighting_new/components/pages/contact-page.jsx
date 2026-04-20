'use client'

import { Clock3, Mail, MapPin, Phone, Smartphone } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import ContactForm from '@/components/shared/contact-form'
import SectionHeading from '@/components/shared/section-heading'
import { companyInfo, contactPromises, heroMetrics } from '@/lib/site-data'

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <div>
      <section className="section-space">
        <div className="shell-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow={{ zh: 'Contact', en: 'Contact' }}
              title={{ zh: '把你的需求、場景與導入目標一次說清楚', en: 'Tell us your requirements, scenario, and implementation goals clearly.' }}
              description={{ zh: '無論你正在找產品、規劃系統，或需要整合既有 ERP / WMS，我們都能協助你評估方向。', en: 'Whether you need products, systems, or integration with ERP or WMS, we can help assess the next step.' }}
            />
            <div className="mt-8 space-y-4 text-sm leading-7 text-slate-300">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <Phone className="mt-0.5 h-5 w-5 text-accent" />
                <span>{companyInfo.phone}</span>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <Smartphone className="mt-0.5 h-5 w-5 text-accent" />
                <span>{companyInfo.mobile}</span>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <Mail className="mt-0.5 h-5 w-5 text-accent" />
                <span>{companyInfo.email}</span>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <MapPin className="mt-0.5 h-5 w-5 text-accent" />
                <span>{t(companyInfo.storeAddress)}</span>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <MapPin className="mt-0.5 h-5 w-5 text-accent" />
                <span>{t(companyInfo.factoryAddress)}</span>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <Clock3 className="mt-0.5 h-5 w-5 text-accent" />
                <span>{t(companyInfo.hours)}</span>
              </div>
            </div>
            <div className="mt-8 space-y-3">
              {contactPromises.map((promise, index) => (
                <div key={index} className="glass-panel px-4 py-4 text-sm leading-7 text-slate-200">
                  {t(promise)}
                </div>
              ))}
            </div>
          </div>
          <ContactForm source="contact/page" />
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="shell-container grid gap-6 md:grid-cols-4">
          {heroMetrics.map((metric) => (
            <div key={metric.number} className="surface-panel p-6 text-center">
              <div className="text-4xl font-semibold text-white">{metric.number}</div>
              <div className="mt-2 text-sm text-slate-400">{t(metric.label)}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
