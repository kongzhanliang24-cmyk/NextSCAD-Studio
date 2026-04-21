'use client'

import { useLanguage } from '@/components/providers/language-provider'
import { homeStoryScenes } from '@/lib/site-data'
import ScenePrecision from './story-scenes/scene-precision'
import SceneIntegration from './story-scenes/scene-integration'
import SceneImpact from './story-scenes/scene-impact'

const stageThemes = [
  {
    backdrop:
      'bg-[radial-gradient(circle_at_18%_22%,rgba(56,189,248,0.22),transparent_24%),radial-gradient(circle_at_82%_20%,rgba(245,158,11,0.14),transparent_22%),linear-gradient(135deg,rgba(15,23,42,0.94),rgba(2,6,23,0.98))]',
    orbA: 'bg-sky-400/25',
    orbB: 'bg-accent/20',
    frame: 'border-sky-300/15',
    accent: 'text-sky-200'
  },
  {
    backdrop:
      'bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.16),transparent_26%),radial-gradient(circle_at_76%_24%,rgba(168,85,247,0.18),transparent_22%),linear-gradient(135deg,rgba(12,18,38,0.96),rgba(5,10,25,0.98))]',
    orbA: 'bg-cyan-400/20',
    orbB: 'bg-violet-400/20',
    frame: 'border-violet-300/15',
    accent: 'text-violet-200'
  },
  {
    backdrop:
      'bg-[radial-gradient(circle_at_18%_24%,rgba(34,197,94,0.2),transparent_24%),radial-gradient(circle_at_78%_18%,rgba(250,204,21,0.16),transparent_20%),linear-gradient(135deg,rgba(10,16,30,0.96),rgba(4,8,20,0.98))]',
    orbA: 'bg-emerald-400/20',
    orbB: 'bg-amber-300/20',
    frame: 'border-emerald-300/15',
    accent: 'text-emerald-200'
  }
]

export default function StorySection({ activeStoryIndex, storyMoments }) {
  const { t } = useLanguage()
  const sceneDatas = [homeStoryScenes.precision, homeStoryScenes.integration, homeStoryScenes.impact]
  const sceneComponents = [ScenePrecision, SceneIntegration, SceneImpact]
  const safeActiveIndex = Math.min(Math.max(activeStoryIndex, 0), storyMoments.length - 1)

  return (
    <section className="section-space relative" data-story-layout>
      <div className="shell-container">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          {/* Left column — natural flow, stacked story blocks */}
          <div className="flex flex-col">
            {storyMoments.map((moment, index) => (
              <article
                key={index}
                data-story-block
                data-story-index={index}
                className="flex min-h-[70vh] flex-col justify-center py-10 lg:min-h-[90vh] lg:py-16"
              >
                <div className="eyebrow w-fit">
                  <span className="text-[11px] font-semibold tracking-[0.28em] text-primary-100">
                    {`0${index + 1}`}
                  </span>
                  <span className="h-3 w-px bg-white/20" />
                  {t(moment.eyebrow)}
                </div>
                <h2 className="section-title mt-6 max-w-xl">{t(moment.title)}</h2>
                <p className="body-copy mt-5 max-w-xl text-slate-300">{t(moment.description)}</p>
              </article>
            ))}
          </div>

          {/* Right column — sticky visual stage, inner scenes crossfade */}
          <div className="relative hidden lg:block">
            <div
              data-story-stage-wrap
              className="sticky top-28 flex h-[calc(100vh-8rem)] items-center"
            >
              <div
                data-story-stage
                className={`story-stage-shell relative h-[min(78vh,680px)] w-full overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_40px_130px_rgba(2,6,23,0.55)] transition-colors duration-700 ${stageThemes[safeActiveIndex].backdrop}`}
              >
                {/* Ambient layers */}
                <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-[0.08]" />
                {stageThemes.map((theme, index) => (
                  <div
                    key={`orbs-${index}`}
                    data-stage-orb-layer
                    data-stage-orb-index={index}
                    className="pointer-events-none absolute inset-0"
                    style={{ opacity: index === safeActiveIndex ? 1 : 0 }}
                  >
                    <div className={`ambient-orb animate-breathing -left-16 top-16 h-72 w-72 ${theme.orbA}`} />
                    <div className={`ambient-orb animate-breathing right-0 top-8 h-64 w-64 ${theme.orbB}`} />
                  </div>
                ))}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_28%,rgba(2,6,23,0.4)_100%)]" />

                {/* Top overlay */}
                <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 p-5 md:p-6">
                  <div className="eyebrow border-white/15 bg-white/[0.04] text-white/80">
                    {t({ zh: 'Cinematic System Story', en: 'Cinematic System Story' })}
                  </div>
                  <div className="hidden items-center gap-1.5 md:flex">
                    {storyMoments.map((_, index) => (
                      <span
                        key={index}
                        className={`h-1 w-8 rounded-full transition-colors duration-500 ${
                          index === safeActiveIndex
                            ? 'bg-accent'
                            : index < safeActiveIndex
                            ? 'bg-accent/40'
                            : 'bg-white/12'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Scene stack — crossfade via GSAP */}
                <div className="absolute inset-0 z-[1] grid [grid-template-areas:'stack']">
                  {sceneComponents.map((SceneComponent, index) => (
                    <div
                      key={`scene-${index}`}
                      data-story-scene
                      data-scene-index={index}
                      className="pointer-events-none [grid-area:stack]"
                      style={{ opacity: index === safeActiveIndex ? 1 : 0 }}
                    >
                      <SceneComponent data={sceneDatas[index]} />
                    </div>
                  ))}
                </div>

                {/* Bottom-right scene counter */}
                <div className="absolute bottom-5 right-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/55 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-300 backdrop-blur-xl md:bottom-6 md:right-6">
                  <span className={stageThemes[safeActiveIndex].accent}>{`0${safeActiveIndex + 1}`}</span>
                  <span className="text-slate-500">/</span>
                  <span>{`0${storyMoments.length}`}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile visual — shown inline under each block on < lg */}
          <div className="lg:hidden">
            <div className="space-y-6">
              {storyMoments.map((_, index) => {
                const SceneComponent = sceneComponents[index]
                const theme = stageThemes[index]
                return (
                  <div
                    key={`mobile-scene-${index}`}
                    className={`story-stage-shell relative h-[520px] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_30px_90px_rgba(2,6,23,0.5)] ${theme.backdrop}`}
                  >
                    <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-[0.08]" />
                    <div className={`ambient-orb animate-breathing -left-16 top-16 h-60 w-60 ${theme.orbA}`} />
                    <div className={`ambient-orb animate-breathing right-0 top-8 h-52 w-52 ${theme.orbB}`} />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_28%,rgba(2,6,23,0.4)_100%)]" />
                    <div className="relative z-[1] h-full">
                      <SceneComponent data={sceneDatas[index]} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
