'use client'

import { useEffect, useRef } from 'react'

export default function TechGrid() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    
    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const dots = []
    const spacing = 64
    const dotSize = 0.8
    
    // Create grid
    for (let x = 0; x < width + spacing; x += spacing) {
      for (let y = 0; y < height + spacing; y += spacing) {
        dots.push({ x, y, baseAlpha: 0.1 + Math.random() * 0.15 })
      }
    }

    const render = (time) => {
      ctx.clearRect(0, 0, width, height)
      
      dots.forEach(dot => {
        // Subtle breathing for each dot
        const pulse = Math.sin(time * 0.001 + dot.x * 0.01 + dot.y * 0.01) * 0.05
        const alpha = Math.max(0.05, dot.baseAlpha + pulse)
        
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2)
        ctx.fill()
      })
      
      animationFrameId = window.requestAnimationFrame(render)
    }

    render(0)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
    />
  )
}
