'use client'

import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import TransitionLink from '@/components/shared/transition-link'

export default function SolutionCard({ solution }) {
  const { t } = useLanguage()

  return (
    <TransitionLink href={`/solutions/${solution.slug}`} className="group block">
      <div className="surface-panel h-full p-6 transition-transform duration-500 group-hover:-translate-y-1">
        <div className="eyebrow">{t({ zh: 'System Solution', en: 'System Solution' })}</div>
        <div className="mt-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-white">{t(solution.title)}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{t(solution.subtitle)}</p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
        </div>
        <p className="mt-6 text-sm leading-7 text-slate-300">{t(solution.short_desc)}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {solution.industries?.map((industry, index) => (
            <span key={`${solution.slug}-${index}`} className="data-chip">{t(industry)}</span>
          ))}
        </div>
      </div>
    </TransitionLink>
  )
}
