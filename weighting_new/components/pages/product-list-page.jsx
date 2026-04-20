'use client'

import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import ContactCta from '@/components/shared/contact-cta'
import ProductCard from '@/components/shared/product-card'
import SectionHeading from '@/components/shared/section-heading'
import TransitionLink from '@/components/shared/transition-link'

export default function ProductListPage({ categories, currentCategory, products }) {
  const { t } = useLanguage()

  return (
    <div>
      <section className="section-space">
        <div className="shell-container">
          <SectionHeading
            eyebrow={{ zh: 'Product Universe', en: 'Product Universe' }}
            title={currentCategory ? currentCategory.name : { zh: '智能秤產品矩陣', en: 'Intelligent Scale Portfolio' }}
            description={currentCategory ? currentCategory.desc : { zh: '針對不同精度、場域與防護需求，建立可延伸的智能秤產品組合。', en: 'A scalable portfolio of intelligent scales for different precision, environments, and protection requirements.' }}
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <TransitionLink href="/products" className={`rounded-full px-4 py-2 text-sm font-medium ${!currentCategory ? 'bg-white text-primary-dark' : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'}`}>
              {t({ zh: '全部', en: 'All' })}
            </TransitionLink>
            {categories.map((category) => (
              <TransitionLink
                key={category.slug}
                href={`/products/${category.slug}`}
                className={`rounded-full px-4 py-2 text-sm font-medium ${currentCategory?.slug === category.slug ? 'bg-white text-primary-dark' : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'}`}
              >
                {t(category.name)}
              </TransitionLink>
            ))}
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <TransitionLink href="/contact" className="outline-button">
              {t({ zh: '需要選型建議', en: 'Need selection advice?' })}
              <ArrowRight className="h-4 w-4" />
            </TransitionLink>
          </div>
        </div>
      </section>
      <ContactCta />
    </div>
  )
}
