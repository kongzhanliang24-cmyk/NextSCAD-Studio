'use client'

import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import MediaShell from '@/components/shared/media-shell'
import TransitionLink from '@/components/shared/transition-link'

export default function CaseCard({ caseItem }) {
  const { t } = useLanguage()

  return (
    <TransitionLink href={`/cases/${caseItem.slug}`} className="group block">
      <div className="surface-panel overflow-hidden transition-transform duration-500 group-hover:-translate-y-1">
        <MediaShell
          src={caseItem.cover_image}
          eyebrow={caseItem.industry_label}
          title={caseItem.title}
          description={caseItem.result_summary}
          compact
          className="rounded-none border-0 bg-transparent shadow-none"
        />
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-white">{t(caseItem.title)}</div>
              <div className="mt-2 text-sm text-slate-400">{t(caseItem.system_used)}</div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
          </div>
        </div>
      </div>
    </TransitionLink>
  )
}
