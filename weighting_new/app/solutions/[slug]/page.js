import { notFound } from 'next/navigation'
import SolutionDetailPage from '@/components/pages/solution-detail-page'
import { createMetadata } from '@/lib/metadata'
import { getRelatedSolutions, getSolutionBySlug, solutions } from '@/lib/site-data'

export function generateStaticParams() {
  return solutions.map((solution) => ({ slug: solution.slug }))
}

export function generateMetadata({ params }) {
  const solution = getSolutionBySlug(params.slug)

  if (!solution) {
    return createMetadata({
      title: { zh: '方案未找到', en: 'Solution Not Found' },
      description: { zh: '找不到指定解決方案。', en: 'The requested solution could not be found.' },
      path: `/solutions/${params.slug}`
    })
  }

  return createMetadata({
    title: solution.title,
    description: solution.subtitle,
    path: `/solutions/${params.slug}`
  })
}

export default function SolutionPage({ params }) {
  const solution = getSolutionBySlug(params.slug)

  if (!solution) {
    notFound()
  }

  return <SolutionDetailPage solution={solution} relatedSolutions={getRelatedSolutions(params.slug)} />
}
