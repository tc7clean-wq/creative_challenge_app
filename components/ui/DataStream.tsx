'use client'

import { useEffect, useRef } from 'react'

interface DataStreamProps {
  count?: number
  speed?: number
  color?: string
}

export default function DataStream({ 
  count = 20, 
  speed = 1, 
  color = '#06b6d4' 
}: DataStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const createStream = () => {
      const stream = document.createElement('div')
      stream.className = 'data-stream'
      stream.style.left = Math.random() * 100 + '%'
      stream.style.animationDelay = Math.random() * 3 + 's'
      stream.style.animationDuration = (Math.random() * 2 + 2) / speed + 's'
      stream.style.background = `linear-gradient(to bottom, transparent, ${color}, transparent)`
      stream.style.height = Math.random() * 100 + 50 + 'px'
      
      container.appendChild(stream)

      // Remove stream after animation
      setTimeout(() => {
        if (stream.parentNode) {
          stream.parentNode.removeChild(stream)
        }
      }, 5000)
    }

    // Create initial streams
    for (let i = 0; i < count; i++) {
      setTimeout(() => createStream(), i * 200)
    }

    // Continue creating streams
    const interval = setInterval(createStream, 1000 / speed)

    return () => {
      clearInterval(interval)
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [count, speed, color])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    />
  )
}
