'use client'

import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import MediaShell from '@/components/shared/media-shell'
import TransitionLink from '@/components/shared/transition-link'

export default function ProductCard({ product }) {
  const { t } = useLanguage()

  return (
    <TransitionLink href={`/product/${product.slug}`} className="group block">
      <div className="surface-panel overflow-hidden transition-transform duration-500 group-hover:-translate-y-1">
        <MediaShell
          src={product.hero_image}
          eyebrow={{ zh: 'Product', en: 'Product' }}
          title={product.title}
          description={product.short_desc}
          compact
          className="rounded-none border-0 bg-transparent shadow-none"
        />
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">{product.model}</div>
              <div className="mt-2 text-lg font-medium text-white">{t(product.title)}</div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
          </div>
          <p className="text-sm leading-6 text-slate-400">{t(product.short_desc)}</p>
          <div className="flex flex-wrap gap-3">
            {product.max_capacity ? <span className="data-chip">{t({ zh: '最大秤量', en: 'Max Capacity' })} {product.max_capacity}</span> : null}
            {product.division ? <span className="data-chip">{t({ zh: '分度值', en: 'Division' })} {product.division}</span> : null}
          </div>
        </div>
      </div>
    </TransitionLink>
  )
}
