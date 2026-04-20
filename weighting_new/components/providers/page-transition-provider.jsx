'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

const COVER_DURATION = 180
const REVEAL_DURATION = 260

const PageTransitionContext = createContext(null)

function clearScheduledTimers(timerRef) {
  timerRef.current.forEach((timer) => window.clearTimeout(timer))
  timerRef.current = []
}

export function PageTransitionProvider({ children }) {
  const pathname = usePathname()
  const timersRef = useRef([])
  const transitionActiveRef = useRef(false)
  const [phase, setPhase] = useState('idle')

  useEffect(() => {
    return () => {
      clearScheduledTimers(timersRef)
    }
  }, [])

  useEffect(() => {
    if (!transitionActiveRef.current) {
      return
    }

    clearScheduledTimers(timersRef)
    setPhase('revealing')
    timersRef.current.push(
      window.setTimeout(() => {
        transitionActiveRef.current = false
        setPhase('idle')
      }, REVEAL_DURATION)
    )
  }, [pathname])

  const startTransition = useCallback((navigate) => {
    if (typeof window === 'undefined') {
      navigate()
      return
    }

    if (phase !== 'idle') {
      navigate()
      return
    }

    clearScheduledTimers(timersRef)
    transitionActiveRef.current = true
    setPhase('covering')

    timersRef.current.push(
      window.setTimeout(() => {
        setPhase('navigating')
        navigate()
      }, COVER_DURATION)
    )
  }, [phase])

  const value = useMemo(
    () => ({
      phase,
      startTransition,
      isTransitioning: phase !== 'idle'
    }),
    [phase, startTransition]
  )

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
      <div aria-hidden className={`page-transition-overlay page-transition-overlay--${phase}`}>
        <div className="page-transition-overlay__grid" />
        <div className="page-transition-overlay__beam" />
      </div>
    </PageTransitionContext.Provider>
  )
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext)

  if (!context) {
    throw new Error('usePageTransition must be used inside PageTransitionProvider')
  }

  return context
}
