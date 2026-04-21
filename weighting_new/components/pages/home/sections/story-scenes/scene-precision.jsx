'use client'

import { Activity, Radio, Thermometer } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'

const toneMap = {
  sky: { dot: 'bg-sky-400', text: 'text-sky-200', ring: 'border-sky-300/30 bg-sky-400/10' },
  amber: { dot: 'bg-amber-300', text: 'text-amber-100', ring: 'border-amber-300/30 bg-amber-400/10' },
  emerald: { dot: 'bg-emerald-400', text: 'text-emerald-100', ring: 'border-emerald-300/30 bg-emerald-400/10' }
}

export default function ScenePrecision({ data }) {
  const { t } = useLanguage()

  return (
    <div className="flex h-full w-full flex-col justify-between p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <Radio className="h-4 w-4 text-sky-200" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              {t(data.deviceLabel)}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {t(data.statusLabel)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-sky-300"
              style={{ animation: `breathing-glow 2s ${i * 0.25}s ease-in-out infinite` }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center py-8">
        <div className="text-[10px] font-semibold uppercase tracking-[0.36em] text-slate-500">
          Net weight
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <div className="font-[ui-monospace,Menlo,monospace] text-5xl font-semibold tracking-tight text-white tabular-nums md:text-6xl xl:text-7xl">
            {data.readoutValue}
          </div>
          <div className="text-lg font-semibold text-sky-200 md:text-xl">{data.readoutUnit}</div>
        </div>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-100">
          <Activity className="h-3.5 w-3.5" />
          {t(data.stability)}
        </div>
        <div className="mt-6 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
          {data.unitOptions.map((unit, index) => (
            <span
              key={unit}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                index === 0 ? 'bg-white/10 text-white' : 'text-slate-400'
              }`}
            >
              {unit}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
            <Thermometer className="h-3.5 w-3.5 text-amber-200" />
            Environment
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {data.environment.map((item) => (
              <div key={item.value}>
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {t(item.label)}
                </div>
                <div className="mt-1 font-[ui-monospace,Menlo,monospace] text-sm text-white tabular-nums">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
            Link status
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.links.map((link) => {
              const tone = toneMap[link.tone] || toneMap.sky
              return (
                <span
                  key={link.label}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.16em] ${tone.ring} ${tone.text}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                  {link.label}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
