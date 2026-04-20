import { notFound } from 'next/navigation'
import CaseDetailPage from '@/components/pages/case-detail-page'
import { createMetadata } from '@/lib/metadata'
import { cases, getCaseBySlug, getRelatedCases } from '@/lib/site-data'

export function generateStaticParams() {
  return cases.map((caseItem) => ({ slug: caseItem.slug }))
}

export function generateMetadata({ params }) {
  const caseItem = getCaseBySlug(params.slug)

  if (!caseItem) {
    return createMetadata({
      title: { zh: '案例未找到', en: 'Case Not Found' },
      description: { zh: '找不到指定案例。', en: 'The requested case could not be found.' },
      path: `/cases/${params.slug}`
    })
  }

  return createMetadata({
    title: caseItem.title,
    description: caseItem.result_summary,
    path: `/cases/${params.slug}`
  })
}

export default function CasePage({ params }) {
  const caseItem = getCaseBySlug(params.slug)

  if (!caseItem) {
    notFound()
  }

  return <CaseDetailPage caseItem={caseItem} relatedCases={getRelatedCases(params.slug)} />
}
