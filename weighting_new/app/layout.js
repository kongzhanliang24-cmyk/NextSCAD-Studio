import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { LanguageProvider } from '@/components/providers/language-provider'
import { PageTransitionProvider } from '@/components/providers/page-transition-provider'
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider'
import { companyInfo } from '@/lib/site-data'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata = {
  title: {
    default: '宏德度量衡｜智能秤與稱重系統',
    template: '%s｜宏德度量衡'
  },
  description: '專注智能秤、智能稱重系統、稱重資料整合與多行業案例的科技品牌官網。',
  applicationName: 'Honder Scale',
  openGraph: {
    title: '宏德度量衡｜智能秤與稱重系統',
    description: '專注智能秤、智能稱重系統、稱重資料整合與多行業案例的科技品牌官網。',
    type: 'website',
    locale: 'zh_TW'
  },
  alternates: {
    canonical: '/'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen`}>
        <LanguageProvider>
          <SmoothScrollProvider>
            <PageTransitionProvider>
              <div className="relative flex min-h-screen flex-col overflow-x-clip">
                <Navbar companyInfo={companyInfo} />
                <main className="flex-1 pt-20">{children}</main>
                <Footer companyInfo={companyInfo} />
              </div>
            </PageTransitionProvider>
          </SmoothScrollProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
