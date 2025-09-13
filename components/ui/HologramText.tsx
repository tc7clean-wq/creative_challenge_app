'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface HologramTextProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  glitch?: boolean
  dataStream?: boolean
  className?: string
}

export default function HologramText({
  children,
  variant = 'primary',
  size = 'md',
  glitch = false,
  dataStream = false,
  className = ''
}: HologramTextProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent',
    secondary: 'bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent',
    accent: 'bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent'
  }

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-3xl md:text-4xl',
    xxl: 'text-5xl md:text-6xl lg:text-7xl'
  }

  const textClasses = `
    font-black tracking-tight
    ${variants[variant]}
    ${sizes[size]}
    ${glitch ? 'glitch' : ''}
    ${dataStream ? 'data-stream' : ''}
    neon-text
    ${className}
  `

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={textClasses}
    >
      {children}
      
      {/* Holographic shimmer effect */}
      <style jsx>{`
        .hologram-text {
          background: linear-gradient(
            45deg,
            rgba(0, 247, 255, 0.8) 0%,
            rgba(255, 107, 107, 0.8) 25%,
            rgba(78, 205, 196, 0.8) 50%,
            rgba(155, 89, 182, 0.8) 75%,
            rgba(0, 247, 255, 0.8) 100%
          );
          background-size: 200% 200%;
          animation: hologramShimmer 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes hologramShimmer {
          0%, 100% { 
            background-position: 0% 50%; 
            filter: hue-rotate(0deg);
          }
          50% { 
            background-position: 100% 50%; 
            filter: hue-rotate(180deg);
          }
        }
      `}</style>
    </motion.div>
  )
}