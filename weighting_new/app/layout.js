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
    default: 'NextSCAD Studio｜參數化 CAD 與智能稱重系統',
    template: '%s｜NextSCAD Studio'
  },
  description: 'NextSCAD Studio：以參數化 CAD 建模、Web 3D 與智能稱重系統整合為核心的開源品牌。',
  applicationName: 'NextSCAD Studio',
  openGraph: {
    title: 'NextSCAD Studio｜參數化 CAD 與智能稱重系統',
    description: 'NextSCAD Studio：以參數化 CAD 建模、Web 3D 與智能稱重系統整合為核心的開源品牌。',
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
