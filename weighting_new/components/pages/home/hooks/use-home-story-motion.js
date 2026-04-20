'use client'

import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export function useHomeStoryMotion({ pageRef, setActiveStoryIndex }) {
  useEffect(() => {
    if (!pageRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const context = gsap.context(() => {
      const storyCards = gsap.utils.toArray('[data-story-card]')
      const storyLayout = document.querySelector('[data-story-layout]')
      const stagePin = document.querySelector('[data-stage-pin]')

      if (!storyLayout || !stagePin || storyCards.length === 0) return

      // The sticky stage is kept centered in the viewport by CSS position:sticky.
      // GSAP only handles the fade-in on entry and fade-out on exit.
      gsap.set(stagePin, { autoAlpha: 0 })

      ScrollTrigger.create({
        trigger: storyLayout,
        start: 'top 85%',
        end: 'top 40%',
        scrub: true,
        onUpdate: self => gsap.set(stagePin, { autoAlpha: self.progress })
      })

      ScrollTrigger.create({
        trigger: storyLayout,
        start: 'bottom 60%',
        end: 'bottom 15%',
        scrub: true,
        onUpdate: self => gsap.set(stagePin, { autoAlpha: 1 - self.progress })
      })

      // Scene page-flip — all scenes stacked in a 3D perspective container.
      // 前一幕往左翻出（rotateY -90°）、下一幕從右側翻入（rotateY +90° → 0）
      // 搭配 opacity 漸變模擬「翻頁」視覺。
      const sceneEls = gsap.utils.toArray('[data-story-scene]')
      if (sceneEls.length > 0) {
        gsap.set(sceneEls, {
          autoAlpha: 0,
          rotateY: 75,
          transformOrigin: 'left center',
          transformPerspective: 1400,
          transformStyle: 'preserve-3d'
        })
        gsap.set(sceneEls[0], { autoAlpha: 1, rotateY: 0 })

        for (let i = 1; i < sceneEls.length; i += 1) {
          const card = storyCards[i]
          if (!card) continue

          const prev = sceneEls[i - 1]
          const next = sceneEls[i]

          ScrollTrigger.create({
            trigger: card,
            start: 'top 75%',
            end: 'top 25%',
            scrub: true,
            onUpdate: self => {
              const p = self.progress
              // Outgoing scene: 0° → -90°（往左翻走），opacity 1 → 0
              gsap.set(prev, {
                autoAlpha: 1 - p,
                rotateY: p * -90,
                transformOrigin: 'right center'
              })
              // Incoming scene: 75° → 0°（從右翻入），opacity 0 → 1
              gsap.set(next, {
                autoAlpha: p,
                rotateY: (1 - p) * 75,
                transformOrigin: 'left center'
              })
              setActiveStoryIndex(p > 0.5 ? i : i - 1)
            }
          })
        }
      }
    }, pageRef)

    return () => context.revert()
  }, [pageRef, setActiveStoryIndex])
}
