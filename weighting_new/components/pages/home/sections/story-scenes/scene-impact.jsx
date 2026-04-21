'use client'

import { ArrowDownRight, ArrowUpRight, Sparkle } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'

const statusTone = {
  Posted: 'text-emerald-200 border-emerald-300/25 bg-emerald-400/10',
  已入帳: 'text-emerald-200 border-emerald-300/25 bg-emerald-400/10',
  Syncing: 'text-amber-100 border-amber-300/25 bg-amber-400/10',
  同步中: 'text-amber-100 border-amber-300/25 bg-amber-400/10'
}

export default function SceneImpact({ data }) {
  const { t } = useLanguage()

  return (
    <div className="flex h-full w-full flex-col justify-between p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
          {t(data.dashboardLabel)}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
          </span>
          {t(data.liveLabel)}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {data.kpis.map((kpi) => {
          const isUp = kpi.trend === 'up'
          const ArrowIcon = isUp ? ArrowUpRight : ArrowDownRight
          return (
            <div
              key={t(kpi.label)}
              className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                {t(kpi.label)}
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <div className="font-[ui-monospace,Menlo,monospace] text-2xl font-semibold tracking-tight text-white tabular-nums md:text-3xl">
                  {kpi.value}
                </div>
                <ArrowIcon className={`h-4 w-4 ${isUp ? 'text-emerald-300' : 'text-amber-200'}`} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-400">
              <Sparkle className="h-3.5 w-3.5 text-amber-200" />
              {t(data.trendLabel)}
            </div>
            <div className="mt-2 font-[ui-monospace,Menlo,monospace] text-xl font-semibold text-white tabular-nums">
              {data.trendValue}
            </div>
          </div>
          <div className="flex items-baseline gap-1 text-emerald-200">
            <ArrowUpRight className="h-4 w-4" />
            <span className="text-xs font-semibold tracking-[0.18em]">+0.42%</span>
          </div>
        </div>
        <svg className="mt-4 h-16 w-full" viewBox="0 0 320 64" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(52, 211, 153, 0.35)" />
              <stop offset="100%" stopColor="rgba(52, 211, 153, 0)" />
            </linearGradient>
            <linearGradient id="trendStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
          <path
            d="M0 48 L20 42 L42 46 L64 36 L88 40 L112 28 L136 32 L160 22 L184 26 L208 18 L232 24 L256 14 L280 20 L304 10 L320 12 L320 64 L0 64 Z"
            fill="url(#trendFill)"
          />
          <path
            d="M0 48 L20 42 L42 46 L64 36 L88 40 L112 28 L136 32 L160 22 L184 26 L208 18 L232 24 L256 14 L280 20 L304 10 L320 12"
            fill="none"
            stroke="url(#trendStroke)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="px-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Recent ledger
        </div>
        {data.ledger.map((row) => {
          const statusKey = typeof row.status === 'string' ? row.status : row.status.en
          const toneClass = statusTone[statusKey] || 'text-slate-200 border-white/10 bg-white/[0.04]'
          return (
            <div
              key={row.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 font-[ui-monospace,Menlo,monospace] text-[11px] text-slate-200"
            >
              <span className="text-slate-300">{row.id}</span>
              <span className="text-white tabular-nums">{row.qty}</span>
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${toneClass}`}>
                {t(row.status)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
