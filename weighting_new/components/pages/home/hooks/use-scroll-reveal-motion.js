'use client'

import { useEffect } from 'react'
import { gsap } from '@/lib/gsap'

export function useScrollRevealMotion(pageRef) {
  useEffect(() => {
    if (!pageRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const context = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((element, index) => {
        gsap.from(element, {
          y: index % 2 === 0 ? 28 : 34,
          scale: 0.985,
          opacity: 0,
          duration: 0.72,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 84%'
          }
        })
      })
    }, pageRef)

    return () => context.revert()
  }, [pageRef])
}
