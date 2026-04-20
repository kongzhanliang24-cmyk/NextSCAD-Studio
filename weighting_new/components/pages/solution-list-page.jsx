'use client'

import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import ContactCta from '@/components/shared/contact-cta'
import SectionHeading from '@/components/shared/section-heading'
import SolutionCard from '@/components/shared/solution-card'
import TransitionLink from '@/components/shared/transition-link'

export default function SolutionListPage({ solutions }) {
  const { t } = useLanguage()

  const values = [
    { number: '30%+', label: { zh: '效率提升', en: 'Efficiency Increase' } },
    { number: '50%+', label: { zh: '人工成本降低', en: 'Labor Reduction' } },
    { number: '90%+', label: { zh: '錯誤率下降', en: 'Error Reduction' } },
    { number: '100%', label: { zh: '資料可追溯', en: 'Traceability' } }
  ]

  return (
    <div>
      <section className="section-space">
        <div className="shell-container">
          <SectionHeading
            eyebrow={{ zh: 'System Solutions', en: 'System Solutions' }}
            title={{ zh: '以流程為中心打造智能稱重系統方案', en: 'Build intelligent weighing systems around operational workflows.' }}
            description={{ zh: '從倉儲稱重到車輛過磅管理，將現場設備、權限、報表與 ERP 串成可運作的系統。', en: 'From warehouse weighing to vehicle-weighing operations, integrate devices, permissions, reporting, and ERP into a working system.' }}
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {solutions.map((solution) => (
              <SolutionCard key={solution.slug} solution={solution} />
            ))}
          </div>
          <div className="mt-12 grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:grid-cols-4 md:p-8">
            {values.map((value) => (
              <div key={value.number} className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                <div className="text-3xl font-semibold text-white">{value.number}</div>
                <div className="mt-2 text-sm text-slate-400">{t(value.label)}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <TransitionLink href="/contact" className="outline-button">
              {t({ zh: '討論整合需求', en: 'Discuss Integration' })}
              <ArrowRight className="h-4 w-4" />
            </TransitionLink>
          </div>
        </div>
      </section>
      <ContactCta />
    </div>
  )
}
