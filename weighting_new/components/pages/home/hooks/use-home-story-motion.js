'use client'

import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export function useHomeStoryMotion({ pageRef, setActiveStoryIndex }) {
  useEffect(() => {
    if (!pageRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const context = gsap.context(() => {
      const storyLayout = document.querySelector('[data-story-layout]')
      const storyBlocks = gsap.utils.toArray('[data-story-block]')
      const stageWrap = document.querySelector('[data-story-stage-wrap]')
      const sceneEls = gsap.utils.toArray('[data-story-scene]')
      const orbLayers = gsap.utils.toArray('[data-stage-orb-layer]')

      if (!storyLayout || storyBlocks.length === 0) return

      // 1. Fade the sticky stage in/out as the section enters/leaves the viewport.
      if (stageWrap) {
        gsap.set(stageWrap, { autoAlpha: 0 })

        ScrollTrigger.create({
          trigger: storyLayout,
          start: 'top 80%',
          end: 'top 45%',
          scrub: true,
          onUpdate: self => gsap.set(stageWrap, { autoAlpha: self.progress })
        })

        ScrollTrigger.create({
          trigger: storyLayout,
          start: 'bottom 65%',
          end: 'bottom 25%',
          scrub: true,
          onUpdate: self => gsap.set(stageWrap, { autoAlpha: 1 - self.progress })
        })
      }

      // 2. Prime scenes and orb layers — scene 0 shows by default.
      if (sceneEls.length > 0) {
        gsap.set(sceneEls, { autoAlpha: 0 })
        gsap.set(sceneEls[0], { autoAlpha: 1 })
      }
      if (orbLayers.length > 0) {
        gsap.set(orbLayers, { autoAlpha: 0 })
        gsap.set(orbLayers[0], { autoAlpha: 1 })
      }

      // 3. Switch active scene when each left-column story block enters the
      //    middle of the viewport. Uses discrete crossfade (no scrub) so the
      //    transition reads as a clean page turn, independent of scroll speed.
      const setActiveScene = (index) => {
        setActiveStoryIndex(index)

        sceneEls.forEach((el, i) => {
          gsap.to(el, {
            autoAlpha: i === index ? 1 : 0,
            duration: 0.55,
            ease: 'power2.out',
            overwrite: 'auto'
          })
        })

        orbLayers.forEach((el, i) => {
          gsap.to(el, {
            autoAlpha: i === index ? 1 : 0,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto'
          })
        })
      }

      storyBlocks.forEach((block, index) => {
        ScrollTrigger.create({
          trigger: block,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => setActiveScene(index),
          onEnterBack: () => setActiveScene(index)
        })
      })
    }, pageRef)

    return () => context.revert()
  }, [pageRef, setActiveStoryIndex])
}
