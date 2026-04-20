'use client'

import { useLanguage } from '@/components/providers/language-provider'
import ContactCta from '@/components/shared/contact-cta'
import SectionHeading from '@/components/shared/section-heading'
import { aboutAdvantages, aboutCertifications, aboutMetrics, companyInfo } from '@/lib/site-data'
import { getIcon } from '@/lib/icon-map'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div>
      <section className="section-space">
        <div className="shell-container grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="eyebrow">{t({ zh: 'About Honder', en: 'About Honder' })}</div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-5xl">{t(companyInfo.fullName)}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{t(companyInfo.description)}</p>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400">{t(companyInfo.mission)}</p>
          </div>
          <div className="glass-panel grid gap-4 p-6 md:grid-cols-2 md:p-8">
            {aboutMetrics.map((metric) => (
              <div key={metric.number} className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                <div className="text-3xl font-semibold text-white">{metric.number}</div>
                <div className="mt-2 text-sm text-slate-400">{t(metric.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="shell-container">
          <SectionHeading
            eyebrow={{ zh: 'Our Advantage', en: 'Our Advantage' }}
            title={{ zh: '把現場可信度、系統能力與服務整合成品牌優勢', en: 'Combine on-site reliability, system capability, and service into a clear brand advantage.' }}
            description={{ zh: '除了產品本身，我們更重視導入前規劃、導入中協作，以及導入後的持續支援。', en: 'Beyond the product itself, we focus on planning, implementation collaboration, and continuous support.' }}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {aboutAdvantages.map((advantage, index) => {
              const Icon = getIcon(advantage.icon)
              return (
                <div key={index} className="surface-panel p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-300/15 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-5 text-xl font-semibold text-white">{t(advantage.title)}</div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{t(advantage.desc)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="shell-container">
          <SectionHeading
            eyebrow={{ zh: 'Certifications', en: 'Certifications' }}
            title={{ zh: '讓專業與品質更具可驗證性', en: 'Make professionalism and quality more verifiable.' }}
            description={{ zh: '透過國際認證與品質流程，建立工業採購決策所需的信任基礎。', en: 'International certifications and quality processes support industrial procurement confidence.' }}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {aboutCertifications.map((certification) => (
              <div key={certification.name} className="glass-panel p-6 text-center">
                <div className="text-3xl font-semibold text-white">{certification.name}</div>
                <div className="mt-3 text-sm leading-7 text-slate-300">{t(certification.desc)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactCta />
    </div>
  )
}
