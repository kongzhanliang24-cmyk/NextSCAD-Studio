'use client'

import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import TransitionLink from '@/components/shared/transition-link'
import SectionHeading from '@/components/shared/section-heading'

export default function CategoriesSection({ categories }) {
  const { t } = useLanguage()

  return (
    <section className="section-space" data-reveal>
      <div className="shell-container">
        <SectionHeading
          eyebrow={{ zh: 'Smart Scale Categories', en: 'Smart Scale Categories' }}
          title={{ zh: '從智能秤能力到應用場景，把產品類型清楚對位', en: 'Align smart-scale categories directly with operational needs and use scenarios.' }}
          description={{ zh: '針對不同工作環境、資料串接需求與防護等級，快速找到適合的智能秤設備。', en: 'Find the right smart-scale device based on environment, connectivity needs, and protection requirements.' }}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {categories.map((category) => (
            <TransitionLink key={category.slug} href={`/products/${category.slug}`} className="surface-panel group p-6 transition-transform duration-500 hover:-translate-y-1">
              <div className="flex items-center justify-between gap-3">
                <div className="eyebrow">0{category.id}</div>
                <div className="data-chip">{category.count}</div>
              </div>
              <div className="mt-6 text-2xl font-semibold text-white">{t(category.name)}</div>
              <p className="mt-4 text-sm leading-7 text-slate-300">{t(category.desc)}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-100 group-hover:text-white">
                {t({ zh: '查看分類', en: 'Explore Category' })}
                <ArrowRight className="h-4 w-4" />
              </div>
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  )
}
