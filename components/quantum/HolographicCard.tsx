'use client'

import { ReactNode, useState } from 'react'

interface HolographicCardProps {
  children: ReactNode
  className?: string
  interactive?: boolean
  glowColor?: 'cyan' | 'purple' | 'pink' | 'yellow'
  onClick?: () => void
}

export default function HolographicCard({ 
  children, 
  className = '',
  interactive = true,
  glowColor = 'cyan',
  onClick
}: HolographicCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const glowClasses = {
    cyan: 'hover:shadow-cyan-500/20',
    purple: 'hover:shadow-purple-500/20',
    pink: 'hover:shadow-pink-500/20',
    yellow: 'hover:shadow-yellow-500/20'
  }

  return (
    <div
      className={`
        holographic-card
        ${interactive ? 'quantum-hover' : ''}
        ${glowClasses[glowColor]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
      
      {/* Animated border effect */}
      {isHovered && interactive && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-pulse pointer-events-none" />
      )}
    </div>
  )
}
