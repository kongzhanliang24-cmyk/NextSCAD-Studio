import HomePage from '@/components/pages/home'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: { zh: '智能秤官網', en: 'Intelligent Weighing Website' },
  description: { zh: '以沉浸式品牌敘事呈現智能秤、智能稱重系統與資料整合能力。', en: 'An immersive brand experience for smart scales, intelligent weighing systems, and data integration.' },
  path: '/'
})

export default function Page() {
  return <HomePage />
}
