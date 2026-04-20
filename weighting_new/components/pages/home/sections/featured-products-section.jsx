'use client'

import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import ProductCard from '@/components/shared/product-card'
import SectionHeading from '@/components/shared/section-heading'
import TransitionLink from '@/components/shared/transition-link'

export default function FeaturedProductsSection({ products }) {
  const { t } = useLanguage()

  return (
    <section className="section-space" data-reveal>
      <div className="shell-container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={{ zh: 'Featured Smart Scales', en: 'Featured Smart Scales' }}
            title={{ zh: '用高級產品頁邏輯，呈現智能秤的規格、通訊與應用質感', en: 'Present smart-scale specifications, connectivity, and application value with premium product-page logic.' }}
            description={{ zh: '首頁先建立信任，再把使用者帶入型號頁完成比較、評估與詢價。', en: 'Build trust on the homepage first, then route visitors into model pages for comparison, evaluation, and inquiry.' }}
          />
          <TransitionLink href="/products" className="ghost-button">
            {t({ zh: '查看全部產品', en: 'View All Products' })}
            <ArrowRight className="h-4 w-4" />
          </TransitionLink>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
