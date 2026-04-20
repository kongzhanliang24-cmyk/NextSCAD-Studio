'use client'

import { CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'

export default function StorySection({ activeStoryIndex, storyMoments }) {
  const { t } = useLanguage()
  const stageThemes = [
    {
      backdrop: 'bg-[radial-gradient(circle_at_18%_22%,rgba(56,189,248,0.2),transparent_24%),radial-gradient(circle_at_82%_20%,rgba(245,158,11,0.12),transparent_20%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(2,6,23,0.98))]',
      orbA: 'bg-sky-400/25',
      orbB: 'bg-accent/20',
      frame: 'border-sky-300/15',
      accent: 'text-sky-200'
    },
    {
      backdrop: 'bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.16),transparent_26%),radial-gradient(circle_at_76%_24%,rgba(168,85,247,0.16),transparent_22%),linear-gradient(135deg,rgba(12,18,38,0.96),rgba(5,10,25,0.98))]',
      orbA: 'bg-cyan-400/20',
      orbB: 'bg-violet-400/20',
      frame: 'border-violet-300/15',
      accent: 'text-violet-200'
    },
    {
      backdrop: 'bg-[radial-gradient(circle_at_18%_24%,rgba(34,197,94,0.18),transparent_24%),radial-gradient(circle_at_78%_18%,rgba(250,204,21,0.16),transparent_20%),linear-gradient(135deg,rgba(10,16,30,0.96),rgba(4,8,20,0.98))]',
      orbA: 'bg-emerald-400/20',
      orbB: 'bg-amber-300/20',
      frame: 'border-emerald-300/15',
      accent: 'text-emerald-200'
    }
  ]
  const activeTheme = stageThemes[activeStoryIndex] || stageThemes[0]

  return (
    <section className="relative h-[300vh]" data-story-layout>
      {/* Sticky stage — stays centered in the viewport while scrolling through the section */}
      <div data-stage-pin className="sticky top-0 flex h-screen items-center justify-center">
        <div className="shell-container w-full">
          <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
            <div data-story-panel className={`story-stage-shell relative h-[calc(100vh-10rem)] overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_40px_130px_rgba(2,6,23,0.52)] ${activeTheme.backdrop}`}>
              <div data-story-stage-layer className="grid-backdrop absolute inset-0 opacity-[0.08]" />
              <div data-story-stage-layer className={`ambient-orb animate-breathing -left-20 top-20 h-72 w-72 ${activeTheme.orbA}`} />
              <div data-story-stage-layer className={`ambient-orb animate-breathing right-0 top-10 h-64 w-64 ${activeTheme.orbB}`} />
              <div data-story-stage-layer className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_28%,rgba(2,6,23,0.42)_100%)]" />

              <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-4 p-6 md:p-8">
                <div className="eyebrow border-white/15 bg-white/[0.04] text-white/80">{t({ zh: 'Cinematic System Story', en: 'Cinematic System Story' })}</div>
                <div className="hidden items-center gap-2 md:flex">
                  {storyMoments.map((_, index) => (
                    <span key={index} className={`h-1.5 w-14 rounded-full transition-colors duration-300 ${index <= activeStoryIndex ? 'bg-accent' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>

              <div className={`absolute left-6 top-24 hidden rounded-full border bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] md:left-8 lg:block ${activeTheme.frame} ${activeTheme.accent}`}>
                {t({ zh: 'Live Scene Control', en: 'Live Scene Control' })}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <div className="rounded-[2rem] border border-white/10 bg-slate-950/28 p-5 backdrop-blur-2xl md:p-6">
                  <div className="grid gap-6">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-400">0{activeStoryIndex + 1} / 0{storyMoments.length}</div>
                      <div className="relative mt-4 grid [grid-template-areas:'stack'] [perspective:1400px] [perspective-origin:left_center]">
                        {storyMoments.map((moment, index) => (
                          <div
                            key={index}
                            data-story-scene
                            data-scene-index={index}
                            className="[grid-area:stack] max-w-3xl [backface-visibility:hidden]"
                          >
                            <div className="eyebrow border-white/15 bg-white/[0.04] text-white/85">{t(moment.eyebrow)}</div>
                            <h2 className="mt-5 max-w-3xl text-2xl font-semibold leading-tight tracking-tight text-white md:text-3xl xl:text-4xl">{t(moment.title)}</h2>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base md:leading-8">{t(moment.description)}</p>
                            <div className="mt-6 flex flex-wrap gap-2.5">
                              {moment.bullets.map((bullet, bulletIndex) => (
                                <div key={bulletIndex} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-100 backdrop-blur-xl">
                                  <CheckCircle2 className="h-4 w-4 text-accent" />
                                  <span>{t(bullet)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-4 md:p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">{t({ zh: 'Scene Timeline', en: 'Scene Timeline' })}</div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-500">{t({ zh: '滾動切換場景', en: 'Scroll to switch scenes' })}</div>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        {storyMoments.map((moment, index) => (
                          <div key={`step-${index}`} className={`rounded-[1.4rem] border p-4 transition-all duration-300 ${index === activeStoryIndex ? 'border-primary-200/35 bg-primary-300/10 shadow-[0_18px_48px_rgba(45,90,142,0.2)]' : 'border-white/10 bg-white/[0.03]'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold uppercase tracking-[0.22em] ${index === activeStoryIndex ? 'border-accent/50 bg-accent/12 text-accent-light' : 'border-white/10 bg-white/[0.03] text-slate-400'}`}>
                                0{index + 1}
                              </div>
                              <div className={`h-px flex-1 ${index <= activeStoryIndex ? 'bg-accent/50' : 'bg-white/10'}`} />
                            </div>
                            <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{t(moment.eyebrow)}</div>
                            <div className="mt-2 text-sm leading-6 text-slate-200">{t(moment.bullets[0])}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invisible scroll trigger zones — 3 scenes × 100vh */}
      <div className="pointer-events-none absolute inset-0">
        <div data-story-card className="h-[100vh]" />
        <div data-story-card className="h-[100vh]" />
        <div data-story-card className="h-[100vh]" />
      </div>
    </section>
  )
}
