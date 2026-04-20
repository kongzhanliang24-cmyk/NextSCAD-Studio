import AboutPage from '@/components/pages/about-page'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: { zh: '關於我們', en: 'About' },
  description: { zh: '認識 NextSCAD Studio 的品牌定位、技術能力與開源理念。', en: 'Learn about NextSCAD Studio—brand positioning, technical capabilities, and open-source philosophy.' },
  path: '/about'
})

export default function Page() {
  return <AboutPage />
}
