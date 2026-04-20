'use client'

import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import CaseCard from '@/components/shared/case-card'
import MediaShell from '@/components/shared/media-shell'
import SectionHeading from '@/components/shared/section-heading'
import TransitionLink from '@/components/shared/transition-link'

export default function CaseDetailPage({ caseItem, relatedCases }) {
  const { t } = useLanguage()

  return (
    <div>
      <section className="section-space">
        <div className="shell-container grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="eyebrow">{t(caseItem.industry_label)}</div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-5xl">{t(caseItem.title)}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{t(caseItem.result_summary)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {caseItem.results.map((result) => (
                <div key={result.number} className="glass-panel px-5 py-4">
                  <div className="text-2xl font-semibold text-white">{result.number}</div>
                  <div className="mt-1 text-sm text-slate-400">{t(result.label)}</div>
                </div>
              ))}
            </div>
          </div>
          <MediaShell
            src={caseItem.cover_image}
            eyebrow={{ zh: 'Implementation Snapshot', en: 'Implementation Snapshot' }}
            title={caseItem.title}
            description={caseItem.background}
          />
        </div>
      </section>

      <section className="section-space">
        <div className="shell-container grid gap-10 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-panel p-6 md:p-8">
            <div className="eyebrow">{t({ zh: 'Background', en: 'Background' })}</div>
            <p className="mt-6 text-base leading-8 text-slate-300">{t(caseItem.background)}</p>
            <div className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">{t({ zh: '使用系統', en: 'System Used' })}</div>
            <div className="mt-2 text-xl font-semibold text-white">{t(caseItem.system_used)}</div>
          </div>
          <div>
            <SectionHeading
              eyebrow={{ zh: 'Pain Points', en: 'Pain Points' }}
              title={{ zh: '客戶在導入前遇到的核心問題', en: 'Core operational issues before implementation.' }}
              description={{ zh: '用清楚的問題描述把案例價值建立起來。', en: 'Frame the case value through clearly stated problems.' }}
            />
            <div className="mt-8 space-y-4">
              {caseItem.pain_points.map((pain, index) => (
                <div key={index} className="surface-panel p-5 text-sm leading-7 text-slate-200">
                  {t(pain)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="shell-container grid gap-10 xl:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SectionHeading
              eyebrow={{ zh: 'Solution Design', en: 'Solution Design' }}
              title={{ zh: '我們如何把設備與系統對位到客戶現場', en: 'How we aligned equipment and systems to the client environment.' }}
              description={{ zh: '不只交付產品，而是依據流程、權限、資料流向與使用環境做整體規劃。', en: 'We did not just deliver devices. We planned around workflow, permissions, data flow, and operating environments.' }}
            />
            <div className="mt-8 space-y-4">
              {caseItem.solution.details.map((detail, index) => (
                <div key={index} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-accent" />
                  <span>{t(detail)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="surface-panel p-6 md:p-8">
            <div className="eyebrow">{t({ zh: 'Implementation Result', en: 'Implementation Result' })}</div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {caseItem.results.map((result) => (
                <div key={result.number} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-center">
                  <div className="text-3xl font-semibold text-white">{result.number}</div>
                  <div className="mt-2 text-sm text-slate-400">{t(result.label)}</div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-base leading-8 text-slate-300">{t(caseItem.result_detail)}</p>
          </div>
        </div>
      </section>

      {caseItem.gallery?.length ? (
        <section className="section-space">
          <div className="shell-container">
            <SectionHeading
              eyebrow={{ zh: 'Project Gallery', en: 'Project Gallery' }}
              title={{ zh: '專案現場與導入氛圍', en: 'Project scenes and implementation atmosphere.' }}
              description={{ zh: '目前先保留媒體入口，後續補上真實現場照片即可直接升級質感。', en: 'Media slots are ready now, and real project photography can upgrade the presentation later.' }}
            />
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {caseItem.gallery.map((image, index) => (
                <MediaShell
                  key={index}
                  src={image}
                  eyebrow={{ zh: 'Gallery', en: 'Gallery' }}
                  title={{ zh: `現場片段 ${index + 1}`, en: `Scene ${index + 1}` }}
                  description={caseItem.result_summary}
                  compact
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relatedCases?.length ? (
        <section className="section-space">
          <div className="shell-container">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                eyebrow={{ zh: 'More Cases', en: 'More Cases' }}
                title={{ zh: '延伸查看其他產業導入成果', en: 'Explore more implementation results across industries.' }}
                description={{ zh: '讓案例列表不只是展示，而是引導客戶找到與自己最接近的情境。', en: 'Use case studies not just as showcases, but to guide visitors toward the closest use case.' }}
              />
              <TransitionLink href="/cases" className="ghost-button">
                {t({ zh: '返回案例列表', en: 'Back to Cases' })}
                <ArrowRight className="h-4 w-4" />
              </TransitionLink>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {relatedCases.map((item) => (
                <CaseCard key={item.slug} caseItem={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
