import { notFound } from 'next/navigation'
import ProductListPage from '@/components/pages/product-list-page'
import { createMetadata } from '@/lib/metadata'
import { getCategoryBySlug, getProductsByCategory, productCategories } from '@/lib/site-data'

export function generateStaticParams() {
  return productCategories.map((category) => ({ categorySlug: category.slug }))
}

export function generateMetadata({ params }) {
  const category = getCategoryBySlug(params.categorySlug)

  if (!category) {
    return createMetadata({
      title: { zh: '找不到分類', en: 'Category Not Found' },
      description: { zh: '找不到對應的產品分類。', en: 'The requested product category could not be found.' },
      path: `/products/${params.categorySlug}`
    })
  }

  return createMetadata({
    title: category.name,
    description: category.desc,
    path: `/products/${params.categorySlug}`
  })
}

export default function ProductCategoryPage({ params }) {
  const category = getCategoryBySlug(params.categorySlug)

  if (!category) {
    notFound()
  }

  return (
    <ProductListPage
      categories={productCategories}
      currentCategory={category}
      products={getProductsByCategory(params.categorySlug)}
    />
  )
}
