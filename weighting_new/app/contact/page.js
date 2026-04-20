import ContactPage from '@/components/pages/contact-page'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: { zh: '聯絡我們', en: 'Contact' },
  description: { zh: '聯絡 NextSCAD Studio，透過 GitHub Issues 與 Pull Requests 參與討論。', en: 'Contact NextSCAD Studio via GitHub Issues and Pull Requests.' },
  path: '/contact'
})

export default function Page() {
  return <ContactPage />
}
