'use client'

import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import SectionHeading from '@/components/shared/section-heading'
import SolutionCard from '@/components/shared/solution-card'
import TransitionLink from '@/components/shared/transition-link'

export default function FeaturedSolutionsSection({ solutions }) {
  const { t } = useLanguage()

  return (
    <section className="section-space" data-reveal>
      <div className="shell-container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={{ zh: 'Solutions', en: 'Solutions' }}
            title={{ zh: '把智能秤從單點設備，升級成跨部門可運作的資料系統', en: 'Elevate smart scales from single devices into cross-functional data systems.' }}
            description={{ zh: '聚焦倉儲與車輛過磅兩大情境，用更清楚的痛點與流程敘事呈現系統價值。', en: 'Focus on warehouse and vehicle-weighing scenarios with clearer pain points and process storytelling.' }}
          />
          <TransitionLink href="/solutions" className="ghost-button">
            {t({ zh: '查看解決方案', en: 'View Solutions' })}
            <ArrowRight className="h-4 w-4" />
          </TransitionLink>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {solutions.map((solution) => (
            <SolutionCard key={solution.slug} solution={solution} />
          ))}
        </div>
      </div>
    </section>
  )
}
