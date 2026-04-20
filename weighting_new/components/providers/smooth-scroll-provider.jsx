'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect } from 'react'
import { ScrollTrigger } from '@/lib/gsap'

function ScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update()
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => window.cancelAnimationFrame(frame)
  }, [])

  return null
}

export function SmoothScrollProvider({ children }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  )
}
