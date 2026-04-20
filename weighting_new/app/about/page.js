import AboutPage from '@/components/pages/about-page'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: { zh: '關於我們', en: 'About' },
  description: { zh: '認識宏德度量衡的品牌定位、產業經驗與品質優勢。', en: 'Learn about Honder Scale, our industry experience, and quality strengths.' },
  path: '/about'
})

export default function Page() {
  return <AboutPage />
}
