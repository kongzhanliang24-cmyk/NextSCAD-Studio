'use client'

import { useEffect, useLayoutEffect } from 'react'
import { gsap } from '@/lib/gsap'

// 在 SSR 環境用 useEffect、客戶端用 useLayoutEffect。
// useLayoutEffect 在瀏覽器 paint 前同步觸發，能在畫面第一次渲染前就把 gsap.from 的初始狀態（隱藏 / 偏移）套進 DOM，
// 避免刷新時先閃一下最終畫面才重播動畫。
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function useHomeIntroMotion(pageRef) {
  useIsomorphicLayoutEffect(() => {
    if (!pageRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Safety check: only run if the main title exists
      if (!document.querySelector('[data-hero-title]')) return

      timeline
        .from('[data-hero-kicker]', { y: 18, opacity: 0, duration: 0.58 })
        .from('[data-hero-title]', { y: 34, opacity: 0, duration: 0.82 }, '-=0.26')
        .from('[data-hero-copy]', { y: 26, opacity: 0, duration: 0.72 }, '-=0.46')
        .from('[data-hero-signal]', { y: 16, opacity: 0, duration: 0.42, stagger: 0.06 }, '-=0.34')
        .from('[data-hero-actions]', { y: 20, opacity: 0, duration: 0.58 }, '-=0.42')
        .from('[data-hero-metric]', { y: 18, opacity: 0, duration: 0.46, stagger: 0.08 }, '-=0.18')
        .from('[data-hero-panel]', { y: 42, scale: 0.976, opacity: 0, duration: 0.88 }, '-=0.64')
        .from('[data-hero-floating]', { y: 22, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.5')

      gsap.utils.toArray('[data-hero-orb]').forEach((orb, index) => {
        gsap.to(orb, {
          yPercent: index === 0 ? -18 : -28,
          xPercent: index === 0 ? 6 : -8,
          ease: 'none',
          scrollTrigger: {
            trigger: pageRef.current,
            start: 'top top',
            end: '+=900',
            scrub: true
          }
        })
      })

      // Mouse Parallax Effect
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e
        const { innerWidth, innerHeight } = window
        
        // Calculate normalized coordinates (-1 to 1)
        const xPos = (clientX / innerWidth - 0.5) * 2
        const yPos = (clientY / innerHeight - 0.5) * 2

        // Floating cards subtle move
        gsap.to('[data-hero-floating]', {
          x: xPos * -15,
          y: yPos * -15,
          rotationY: yPos * 4,
          rotationX: xPos * -4,
          duration: 1.2,
          ease: 'power2.out'
        })

        // Main panel micro move
        gsap.to('[data-hero-panel]', {
          x: xPos * -8,
          y: yPos * -8,
          rotationY: yPos * 2,
          rotationX: xPos * -2,
          duration: 1.5,
          ease: 'power2.out'
        })
      }

      window.addEventListener('mousemove', handleMouseMove)

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }, pageRef)

    return () => context.revert()
  }, [pageRef])
}
