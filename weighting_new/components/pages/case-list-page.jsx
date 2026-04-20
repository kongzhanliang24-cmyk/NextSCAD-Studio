'use client'

import { useMemo, useState } from 'react'
import { useLanguage } from '@/components/providers/language-provider'
import ContactCta from '@/components/shared/contact-cta'
import CaseCard from '@/components/shared/case-card'
import SectionHeading from '@/components/shared/section-heading'

export default function CaseListPage({ industries, cases }) {
  const { t } = useLanguage()
  const [activeIndustry, setActiveIndustry] = useState('all')

  const filteredCases = useMemo(() => {
    if (activeIndustry === 'all') return cases
    return cases.filter((caseItem) => caseItem.industry === activeIndustry)
  }, [activeIndustry, cases])

  return (
    <div>
      <section className="section-space">
        <div className="shell-container">
          <SectionHeading
            eyebrow={{ zh: 'Client Success', en: 'Client Success' }}
            title={{ zh: '用導入成果說服客戶：效率、準確率、追溯性', en: 'Convince with implementation results: efficiency, accuracy, and traceability.' }}
            description={{ zh: '把每個案例的產業背景、痛點、方案與實施成效完整說清楚，讓詢價前就能建立信任。', en: 'Explain industry context, pain points, solutions, and results clearly so trust is built before inquiry.' }}
          />
          <div className="mt-8 flex flex-wrap gap-3">
            {industries.map((industry) => (
              <button
                key={industry.slug}
                type="button"
                onClick={() => setActiveIndustry(industry.slug)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${activeIndustry === industry.slug ? 'bg-white text-primary-dark' : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'}`}
              >
                {t(industry.name)}
              </button>
            ))}
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {filteredCases.map((caseItem) => (
              <CaseCard key={caseItem.slug} caseItem={caseItem} />
            ))}
          </div>
        </div>
      </section>
      <ContactCta />
    </div>
  )
}
