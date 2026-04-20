import { notFound } from 'next/navigation'
import ProductDetailPage from '@/components/pages/product-detail-page'
import { createMetadata } from '@/lib/metadata'
import { getProductBySlug, getRelatedProducts, products } from '@/lib/site-data'

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export function generateMetadata({ params }) {
  const product = getProductBySlug(params.slug)

  if (!product) {
    return createMetadata({
      title: { zh: '產品未找到', en: 'Product Not Found' },
      description: { zh: '找不到指定產品。', en: 'The requested product could not be found.' },
      path: `/product/${params.slug}`
    })
  }

  return createMetadata({
    title: product.title,
    description: product.short_desc,
    path: `/product/${params.slug}`
  })
}

export default function ProductPage({ params }) {
  const product = getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  return <ProductDetailPage product={product} relatedProducts={getRelatedProducts(params.slug)} />
}
