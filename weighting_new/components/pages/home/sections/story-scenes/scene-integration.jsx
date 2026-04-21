'use client'

import { Database, Network, Server } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'

const nodeIcons = [Network, Server, Database]
const nodeAccents = [
  { icon: 'text-cyan-200', ring: 'border-cyan-300/25 bg-cyan-400/10' },
  { icon: 'text-violet-200', ring: 'border-violet-300/25 bg-violet-400/10' },
  { icon: 'text-fuchsia-100', ring: 'border-fuchsia-300/25 bg-fuchsia-400/10' }
]

export default function SceneIntegration({ data }) {
  const { t } = useLanguage()

  return (
    <div className="flex h-full w-full flex-col justify-between p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
          {t(data.pipelineLabel)}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300" />
          </span>
          {t(data.pulseLabel)}
        </div>
      </div>

      <div className="relative flex-1 py-6">
        {/* Connector track */}
        <svg
          className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-20 -translate-y-1/2 md:block"
          viewBox="0 0 600 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="pipelineTrack" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(103, 232, 249, 0.4)" />
              <stop offset="50%" stopColor="rgba(167, 139, 250, 0.5)" />
              <stop offset="100%" stopColor="rgba(232, 121, 249, 0.35)" />
            </linearGradient>
          </defs>
          <path
            d="M30 40 C 150 40, 200 40, 300 40 S 450 40, 570 40"
            fill="none"
            stroke="url(#pipelineTrack)"
            strokeWidth="2"
            strokeDasharray="6 8"
          />
          <circle r="4" fill="#67e8f9">
            <animateMotion dur="3.6s" repeatCount="indefinite" path="M30 40 C 150 40, 200 40, 300 40 S 450 40, 570 40" />
          </circle>
          <circle r="3" fill="#a78bfa">
            <animateMotion dur="3.6s" begin="1.2s" repeatCount="indefinite" path="M30 40 C 150 40, 200 40, 300 40 S 450 40, 570 40" />
          </circle>
          <circle r="3" fill="#f0abfc">
            <animateMotion dur="3.6s" begin="2.4s" repeatCount="indefinite" path="M30 40 C 150 40, 200 40, 300 40 S 450 40, 570 40" />
          </circle>
        </svg>

        <div className="relative grid gap-4 md:grid-cols-3">
          {data.nodes.map((node, index) => {
            const Icon = nodeIcons[index] || Network
            const accent = nodeAccents[index] || nodeAccents[0]
            return (
              <div
                key={t(node.title)}
                className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl"
              >
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border ${accent.ring}`}>
                  <Icon className={`h-4 w-4 ${accent.icon}`} />
                </div>
                <div className="mt-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                  {t(node.tag)}
                </div>
                <div className="mt-1.5 text-sm font-semibold text-white">{t(node.title)}</div>
                <div className="mt-2 text-[11px] leading-relaxed text-slate-400">{t(node.meta)}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Packet metadata
        </div>
        {data.chips.map((chip) => (
          <span
            key={t(chip)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-[ui-monospace,Menlo,monospace] text-[11px] text-slate-200"
          >
            <span className="h-1 w-1 rounded-full bg-violet-300" />
            {t(chip)}
          </span>
        ))}
      </div>
    </div>
  )
}
