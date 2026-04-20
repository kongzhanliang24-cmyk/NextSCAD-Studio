import CaseListPage from '@/components/pages/case-list-page'
import { createMetadata } from '@/lib/metadata'
import { caseIndustries, cases } from '@/lib/site-data'

export const metadata = createMetadata({
  title: { zh: '成功案例', en: 'Cases' },
  description: { zh: '查看食品、冷鏈、倉儲與其他行業的智能稱重案例。', en: 'Explore intelligent weighing projects across food, cold-chain, warehouse, and other industries.' },
  path: '/cases'
})

export default function CasesPage() {
  return <CaseListPage industries={caseIndustries} cases={cases} />
}
