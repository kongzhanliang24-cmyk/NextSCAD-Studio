import SolutionListPage from '@/components/pages/solution-list-page'
import { createMetadata } from '@/lib/metadata'
import { solutions } from '@/lib/site-data'

export const metadata = createMetadata({
  title: { zh: '解決方案', en: 'Solutions' },
  description: { zh: '瀏覽倉儲與車輛過磅等智能稱重系統解決方案。', en: 'Browse intelligent weighing system solutions for warehouse and vehicle-weighing operations.' },
  path: '/solutions'
})

export default function SolutionsPage() {
  return <SolutionListPage solutions={solutions} />
}
