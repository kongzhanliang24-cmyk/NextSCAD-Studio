'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '@/components/providers/language-provider'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollTextReveal({ children, className = '' }) {
  const containerRef = useRef(null)
  const { t } = useLanguage()
  const content = typeof children === 'object' ? t(children) : children

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const chars = el.querySelectorAll('.char')
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'top 35%',
        scrub: 0.5,
      }
    })

    tl.to(chars, {
      color: '#ffffff',
      stagger: 0.1,
      ease: 'none'
    })

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill()
      tl.kill()
    }
  }, [content])

  // Split text into characters for fine-grained reveal
  const words = content.split(' ')

  return (
    <span ref={containerRef} className={`inline ${className}`}>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block mr-[0.25em]">
          {word.split('').map((char, cIdx) => (
            <span key={cIdx} className="char text-white/10 transition-colors duration-100">
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}
