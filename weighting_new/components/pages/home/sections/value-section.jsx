'use client'

import { ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import SectionHeading from '@/components/shared/section-heading'

export default function ValueSection({ points }) {
  const { t } = useLanguage()

  return (
    <section className="section-space" data-reveal>
      <div className="shell-container">
        <SectionHeading
          eyebrow={{ zh: 'Core Value', en: 'Core Value' }}
          title={{ zh: '不是只賣一台智能秤，而是打造現場到管理端都能接得上的稱重能力', en: 'We do not just sell smart scales. We build connected weighing capability from field to management.' }}
          description={{ zh: '以品牌視覺、產品力、系統整合與案例證據共同建立信任，讓工業客戶一進站就感受到專業度。', en: 'Brand presentation, product capability, system integration, and case proof work together to establish trust from the first visit.' }}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {points.map((point) => (
            <div key={t(point.title)} className="surface-panel p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-300/15 text-accent">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="mt-5 text-xl font-semibold text-white">{t(point.title)}</div>
              <p className="mt-3 text-sm leading-7 text-slate-300">{t(point.body)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
