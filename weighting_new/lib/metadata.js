import { resolveText } from '@/lib/i18n'

export function createMetadata({ title, description, path = '/' }) {
  const resolvedTitle = resolveText(title)
  const resolvedDescription = resolveText(description)

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical: path
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      type: 'website',
      locale: 'zh_TW',
      url: path
    }
  }
}
