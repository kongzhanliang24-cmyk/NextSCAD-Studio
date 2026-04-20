import ContactPage from '@/components/pages/contact-page'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: { zh: '聯絡我們', en: 'Contact' },
  description: { zh: '聯絡宏德度量衡，討論產品選型、系統規劃與整合需求。', en: 'Contact Honder Scale for product selection, system planning, and integration consultation.' },
  path: '/contact'
})

export default function Page() {
  return <ContactPage />
}
