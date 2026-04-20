import TransitionLink from '@/components/shared/transition-link'

export default function NotFound() {
  return (
    <div className="section-space">
      <div className="shell-container text-center">
        <div className="mx-auto max-w-2xl glass-panel px-6 py-12 md:px-10 md:py-16">
          <div className="eyebrow mx-auto">404</div>
          <h1 className="mt-6 text-4xl font-semibold text-white md:text-5xl">頁面不存在</h1>
          <p className="mt-4 text-base leading-8 text-slate-300">你要找的頁面目前不存在，請回到首頁或繼續瀏覽產品與解決方案。</p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <TransitionLink href="/" className="solid-button">返回首頁</TransitionLink>
            <TransitionLink href="/products" className="outline-button">查看產品</TransitionLink>
          </div>
        </div>
      </div>
    </div>
  )
}
