'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface FutureCardProps {
  children: React.ReactNode
  variant?: 'glass' | 'solid' | 'hologram'
  glow?: boolean
  className?: string
  hover?: boolean
  delay?: number
}

export default function FutureCard({
  children,
  variant = 'glass',
  glow = false,
  className = '',
  hover = true,
  delay = 0
}: FutureCardProps) {
  const baseClasses = `
    relative overflow-hidden backdrop-blur-sm border rounded-2xl
    transition-all duration-500 future-card
  `

  const variants = {
    glass: `
      bg-white/5 border-white/10 hover:bg-white/10 
      hover:border-purple-500/30 hover:shadow-2xl 
      hover:shadow-purple-500/20
    `,
    solid: `
      bg-slate-900/80 border-slate-700/50 hover:bg-slate-800/80 
      hover:border-purple-500/50 hover:shadow-xl 
      hover:shadow-purple-500/25
    `,
    hologram: `
      bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-cyan-900/20 
      border-white/20 holographic-bg hover:border-cyan-400/50
    `
  }

  const cardClasses = `
    ${baseClasses} 
    ${variants[variant]} 
    ${glow ? 'neon-glow' : ''} 
    ${className}
  `

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      className={cardClasses}
    >
      {/* Scan line effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Neural circuit pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="circuit" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="2" fill="currentColor" opacity="0.3" />
              <line x1="0" y1="25" x2="50" y2="25" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
              <line x1="25" y1="0" x2="25" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" className="text-cyan-400" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  )
}