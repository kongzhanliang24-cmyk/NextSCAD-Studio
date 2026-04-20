'use client'

import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export function useProductStoryMotion({ activeSceneId, containerRef, stickyRef, enabled, onSceneEnter }) {
  useEffect(() => {
    if (!enabled || !containerRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const context = gsap.context(() => {
      const sceneCards = gsap.utils.toArray('[data-product-story-card]')
      const hudItems = gsap.utils.toArray('[data-product-story-hud-item]')

      if (!sceneCards.length) return

      sceneCards.forEach((element) => {
        const sceneId = element.getAttribute('data-product-story-scene-id')
        const content = element.querySelector('[data-product-story-card-content]')

        gsap.from(element, {
          y: 52,
          opacity: 0,
          duration: 0.82,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 84%'
          }
        })

        if (content) {
          gsap.from(content, {
            y: 24,
            opacity: 0,
            scale: 0.985,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 72%'
            }
          })
        }

        ScrollTrigger.create({
          trigger: element,
          start: 'top 58%',
          end: 'bottom 58%',
          onEnter: () => {
            if (sceneId) onSceneEnter(sceneId)
          },
          onEnterBack: () => {
            if (sceneId) onSceneEnter(sceneId)
          }
        })
      })

      hudItems.forEach((item, index) => {
        gsap.from(item, {
          y: 18,
          opacity: 0,
          duration: 0.48,
          delay: index * 0.03,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%'
          }
        })
      })

      if (stickyRef.current && window.innerWidth >= 1024) {
        gsap.to(stickyRef.current, {
          yPercent: -2.5,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: 'bottom bottom',
            scrub: 1
          }
        })
      }
    }, containerRef)

    return () => context.revert()
  }, [containerRef, enabled, onSceneEnter, stickyRef])

  useEffect(() => {
    if (!enabled || !containerRef.current) return undefined

    const shell = containerRef.current.querySelector('[data-active-product-scene-shell]')
    if (!shell) return undefined

    const context = gsap.context(() => {
      gsap.fromTo(
        shell,
        { opacity: 0.16, y: 16, scale: 0.988, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.72, ease: 'power3.out' }
      )
    }, containerRef)

    return () => context.revert()
  }, [activeSceneId, containerRef, enabled])
}
