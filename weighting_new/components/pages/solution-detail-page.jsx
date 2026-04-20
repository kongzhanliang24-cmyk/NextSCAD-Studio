'use client'

import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import ContactForm from '@/components/shared/contact-form'
import SectionHeading from '@/components/shared/section-heading'
import SpecTable from '@/components/shared/spec-table'
import SolutionCard from '@/components/shared/solution-card'
import TransitionLink from '@/components/shared/transition-link'
import { getIcon } from '@/lib/icon-map'

export default function SolutionDetailPage({ solution, relatedSolutions }) {
  const { t } = useLanguage()

  return (
    <div>
      <section className="section-space">
        <div className="shell-container grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="eyebrow">{t({ zh: 'Solution Overview', en: 'Solution Overview' })}</div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-5xl">{t(solution.title)}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{t(solution.subtitle)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {solution.industries.map((industry, index) => (
                <span key={index} className="data-chip">{t(industry)}</span>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#solution-inquiry" className="solid-button">
                {t({ zh: '獲取方案', en: 'Get Solution' })}
                <ArrowRight className="h-4 w-4" />
              </a>
              <TransitionLink href="/solutions" className="outline-button">
                {t({ zh: '返回方案列表', en: 'Back to Solutions' })}
              </TransitionLink>
            </div>
          </div>
          <div className="surface-panel grid-backdrop overflow-hidden p-6 md:p-8">
            <div className="eyebrow">{t({ zh: 'System Architecture', en: 'System Architecture' })}</div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {solution.architecture.flow.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-white">{t(step)}</div>
                  {index < solution.architecture.flow.length - 1 ? <ArrowRight className="h-4 w-4 text-slate-500" /> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="shell-container">
          <SectionHeading
            eyebrow={{ zh: 'Pain Points', en: 'Pain Points' }}
            title={{ zh: '先講問題，再講解法，讓導入理由更有說服力', en: 'Address the problems first so the solution becomes more compelling.' }}
            description={{ zh: '透過清楚的痛點拆解，幫助客戶快速對號入座，降低溝通成本。', en: 'Clear pain-point breakdown helps customers immediately recognize their own operational issues.' }}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {solution.pain_points.map((pain, index) => (
              <div key={index} className="surface-panel p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-300">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="mt-5 text-base leading-8 text-slate-200">{t(pain)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="shell-container grid gap-10 xl:grid-cols-3">
          {[
            { title: { zh: '硬體設備', en: 'Hardware' }, items: solution.composition.hardware },
            { title: { zh: '軟體功能', en: 'Software' }, items: solution.composition.software },
            { title: { zh: '擴充設備', en: 'Extensions' }, items: solution.composition.extensions }
          ].map((group) => (
            <div key={t(group.title)} className="surface-panel p-6 md:p-8">
              <div className="eyebrow">{t(group.title)}</div>
              <div className="mt-6 space-y-4">
                {group.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-accent" />
                    <span>{t(item)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-space">
        <div className="shell-container">
          <SectionHeading
            eyebrow={{ zh: 'Core Features', en: 'Core Features' }}
            title={{ zh: '把稱重現場轉成資料化、可管理的流程', en: 'Turn weighing operations into structured, manageable flows.' }}
            description={{ zh: '每一個功能都不是為了炫技，而是為了縮短作業時間、降低錯誤、提升決策效率。', en: 'Every feature exists to shorten operation time, reduce errors, and improve decisions.' }}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {solution.core_features.map((feature, index) => {
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
        <div className="shell-container grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="surface-panel p-6 md:p-8">
            <div className="eyebrow">{t({ zh: 'Process Flow', en: 'Process Flow' })}</div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {solution.process.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-5 py-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-accent">0{index + 1}</div>
                    <div className="mt-2 text-sm font-medium text-white">{t(step)}</div>
                  </div>
                  {index < solution.process.length - 1 ? <ArrowRight className="h-4 w-4 text-slate-500" /> : null}
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow={{ zh: 'Technical Specs', en: 'Technical Specs' }}
              title={{ zh: '技術規格與導入彈性', en: 'Technical specifications and deployment flexibility.' }}
              description={{ zh: '保留可文字化的技術欄位，讓部署能力與擴充性更容易被理解。', en: 'Text-based technical capability makes deployment and scalability easier to understand.' }}
            />
            <div className="mt-8">
              <SpecTable specs={solution.tech_specs} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="shell-container">
          <SectionHeading
            eyebrow={{ zh: 'Business Impact', en: 'Business Impact' }}
            title={{ zh: '最後要交付的是成果，不只是功能', en: 'The final deliverable is business impact, not just functionality.' }}
            description={{ zh: '以數字化成果強化方案說服力，讓客戶快速理解投資價值。', en: 'Quantified results make the value of the solution easier to evaluate.' }}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {solution.values.map((value) => (
              <div key={value.number} className="glass-panel p-6 text-center">
                <div className="text-4xl font-semibold text-white">{value.number}</div>
                <div className="mt-3 text-sm text-slate-400">{t(value.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="solution-inquiry" className="section-space">
        <div className="shell-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow={{ zh: 'Consultation', en: 'Consultation' }}
              title={{ zh: '把你的流程、設備與系統需求一起梳理清楚', en: 'Clarify your operational, equipment, and system requirements together.' }}
              description={{ zh: '留下產業、站點數量、是否需串 ERP / WMS / 財務系統等資訊，我們可先協助評估。', en: 'Tell us your industry, number of stations, and whether ERP, WMS, or finance integration is needed, and we can help assess the project.' }}
            />
            <div className="mt-8 space-y-3">
              {solution.architecture.extensions.map((item, index) => (
                <div key={index} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-accent" />
                  <span>{t(item)}</span>
                </div>
              ))}
            </div>
          </div>
          <ContactForm source={`solution/${solution.slug}`} />
        </div>
      </section>

      {relatedSolutions?.length ? (
        <section className="section-space">
          <div className="shell-container">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                eyebrow={{ zh: 'Related Solutions', en: 'Related Solutions' }}
                title={{ zh: '延伸了解其他系統場景', en: 'Explore additional system scenarios.' }}
                description={{ zh: '同一套資料能力，能延伸到更多流程場景與產業需求。', en: 'The same data capability can extend to more workflows and industries.' }}
              />
              <TransitionLink href="/solutions" className="ghost-button">
                {t({ zh: '回到方案列表', en: 'Back to Solutions' })}
                <ArrowRight className="h-4 w-4" />
              </TransitionLink>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {relatedSolutions.map((item) => (
                <SolutionCard key={item.slug} solution={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
