'use client'

import { useEffect, useRef } from 'react'

interface ParticleSystemProps {
  particleCount?: number
  className?: string
}

export default function ParticleSystem({ particleCount = 50, className = '' }: ParticleSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particles: HTMLDivElement[] = []

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = `${Math.random() * 100}%`
      particle.style.animationDelay = `${Math.random() * 6}s`
      particle.style.animationDuration = `${6 + Math.random() * 4}s`
      
      // Random colors
      const colors = ['#00f5ff', '#ff0080', '#ffd700', '#00ff88']
      particle.style.background = colors[Math.floor(Math.random() * colors.length)]
      
      container.appendChild(particle)
      particles.push(particle)
    }

    // Cleanup
    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      })
    }
  }, [particleCount])

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  )
}
