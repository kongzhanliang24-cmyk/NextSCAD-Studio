'use client'

import { ArrowRight, MoveRight, Sparkles } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import TransitionLink from '@/components/shared/transition-link'
import MediaShell from '@/components/shared/media-shell'
import TechGrid from './tech-grid'
import ScrollTextReveal from '@/components/shared/scroll-text-reveal'

export default function HeroSection({ heroMetrics }) {
  const { t } = useLanguage()
  const heroSignals = [
    { zh: 'ERP / WMS 即時串接', en: 'ERP / WMS Live Sync' },
    { zh: '批次資料全程可追溯', en: 'Traceable Batch Data' },
    { zh: '規格到案例一站完成評估', en: 'Specs-to-case evaluation' }
  ]

  return (
    <section className="relative overflow-hidden pb-16 pt-10 md:pb-24 md:pt-16">
      <TechGrid />
      <div className="grid-backdrop absolute inset-x-0 top-[-120px] h-[620px] opacity-[0.08]" />
      <div data-hero-orb className="ambient-orb animate-breathing -left-28 top-24 h-80 w-80 bg-primary/20" />
      <div data-hero-orb className="ambient-orb animate-breathing right-0 top-8 h-72 w-72 bg-accent/15" />
      <div className="shell-container relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div data-hero-kicker className="eyebrow">
              <Sparkles className="h-4 w-4 text-accent" />
              {t({ zh: 'Scroll-driven Smart Scale Experience', en: 'Scroll-driven Smart Scale Experience' })}
            </div>
            <div data-hero-title className="mt-8 max-w-5xl">
              <h1 className="headline-lg">
                <span className="block">
                  <ScrollTextReveal>
                    {{ zh: '讓智能秤與智能稱重系統', en: 'Give smart scales and intelligent weighing systems' }}
                  </ScrollTextReveal>
                </span>
                <span className="mt-3 block text-gradient">
                  <ScrollTextReveal>
                    {{ zh: '擁有真正有品牌張力的科技官網', en: 'a brand-led high-tech digital presence.' }}
                  </ScrollTextReveal>
                </span>
              </h1>
            </div>
            <p data-hero-copy className="body-copy mt-6 max-w-2xl">
              {t({ zh: '從智能平台秤、防水智能秤到倉儲與車輛過磅管理系統，我們用沉浸式敘事呈現設備能力、資料串接與營運價值。', en: 'From smart platform scales and waterproof smart scales to warehouse and vehicle-weighing systems, we present device capability, data integration, and operational value through immersive storytelling.' })}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {heroSignals.map((signal) => (
                <div key={signal.zh} data-hero-signal className="data-chip hover-glow border-white/10 bg-white/[0.04] text-slate-100">
                  {t(signal)}
                </div>
              ))}
            </div>
            <div data-hero-actions className="mt-8 flex flex-col gap-4 sm:flex-row">
              <TransitionLink href="/contact" className="solid-button">
                {t({ zh: '開始規劃專案', en: 'Start Planning' })}
                <ArrowRight className="h-4 w-4" />
              </TransitionLink>
              <TransitionLink href="/solutions" className="outline-button">
                {t({ zh: '查看系統方案', en: 'View Solutions' })}
                <MoveRight className="h-4 w-4" />
              </TransitionLink>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {heroMetrics.map((metric) => (
                <div key={metric.number} data-hero-metric className="glass-panel hover-lift p-5">
                  <div className="text-3xl font-semibold text-white">{metric.number}</div>
                  <div className="mt-2 text-sm text-slate-400">{t(metric.label)}</div>
                </div>
              ))}
            </div>
          </div>

          <div data-hero-panel className="relative lg:pl-8">
            <div data-hero-floating className="absolute -left-4 top-10 hidden xl:block">
              <div className="glass-panel px-4 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary-100/80">{t({ zh: 'Live Systems', en: 'Live Systems' })}</div>
                <div className="mt-2 text-sm font-medium text-white">ERP · WMS · MES</div>
              </div>
            </div>
            <div data-hero-floating className="absolute -bottom-5 right-2 hidden xl:block">
              <div className="glass-panel px-4 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary-100/80">{t({ zh: 'Traceable Flow', en: 'Traceable Flow' })}</div>
                <div className="mt-2 text-sm font-medium text-white">Batch · User · Timestamp</div>
              </div>
            </div>
            <MediaShell
              eyebrow={{ zh: 'Smart Scale Brand Platform', en: 'Smart Scale Brand Platform' }}
              title={{ zh: '讓智能秤不只是設備，而是企業流程中的資料節點', en: 'Position smart scales not only as devices, but as data nodes inside enterprise workflows.' }}
              description={{ zh: '先用高質感沉浸式視覺建立信任，再用規格、案例與系統能力完成轉化。', en: 'Build trust with premium immersive visuals first, then convert through specifications, cases, and system capability.' }}
              className="border-white/15 shadow-[0_40px_120px_rgba(2,6,23,0.58)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
