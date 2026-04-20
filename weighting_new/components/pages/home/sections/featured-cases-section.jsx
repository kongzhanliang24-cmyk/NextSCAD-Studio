'use client'

import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import CaseCard from '@/components/shared/case-card'
import SectionHeading from '@/components/shared/section-heading'
import TransitionLink from '@/components/shared/transition-link'

export default function FeaturedCasesSection({ cases }) {
  const { t } = useLanguage()

  return (
    <section className="section-space" data-reveal>
      <div className="shell-container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={{ zh: 'Case Evidence', en: 'Case Evidence' }}
            title={{ zh: '用案例證明智能秤導入後的效率、準確率與管理成果', en: 'Use real cases to prove the efficiency, accuracy, and management impact of smart-scale deployments.' }}
            description={{ zh: '把產業背景、客戶痛點、解法與結果完整講清楚，降低詢價前的信任門檻。', en: 'Explain industry background, pain points, solutions, and outcomes clearly to lower trust friction before inquiry.' }}
          />
          <TransitionLink href="/cases" className="ghost-button">
            {t({ zh: '瀏覽案例', en: 'Browse Cases' })}
            <ArrowRight className="h-4 w-4" />
          </TransitionLink>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {cases.map((caseItem) => (
            <CaseCard key={caseItem.slug} caseItem={caseItem} />
          ))}
        </div>
      </div>
    </section>
  )
}
