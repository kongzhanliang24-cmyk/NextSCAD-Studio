import ProductListPage from '@/components/pages/product-list-page'
import { createMetadata } from '@/lib/metadata'
import { productCategories, products } from '@/lib/site-data'

export const metadata = createMetadata({
  title: { zh: '產品列表', en: 'Products' },
  description: { zh: '瀏覽智能平台秤、防水智能秤與資料可串接的智能秤產品矩陣。', en: 'Browse smart platform scales, waterproof smart scales, and connected smart weighing products.' },
  path: '/products'
})

export default function ProductsPage() {
  return <ProductListPage categories={productCategories} products={products} currentCategory={null} />
}
