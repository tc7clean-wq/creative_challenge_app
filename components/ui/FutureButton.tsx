'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface FutureButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string
  disabled?: boolean
  loading?: boolean
}

export default function FutureButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  loading = false
}: FutureButtonProps) {
  const baseClasses = `
    relative overflow-hidden font-semibold transition-all duration-300
    transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed
    disabled:transform-none future-card
  `

  const variants = {
    primary: `
      bg-gradient-to-r from-purple-600 to-pink-600 
      hover:from-purple-700 hover:to-pink-700 
      text-white shadow-lg hover:shadow-xl neon-glow
      border border-purple-500/30
    `,
    secondary: `
      bg-white/5 backdrop-blur-sm border border-white/10 
      text-white hover:bg-white/10 hover:border-white/20
      hover:neon-glow
    `,
    ghost: `
      bg-transparent border border-cyan-500/50 
      text-cyan-400 hover:bg-cyan-500/10 
      hover:border-cyan-400 hover:text-cyan-300
    `
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl'
  }

  const buttonClasses = `
    ${baseClasses} 
    ${variants[variant]} 
    ${sizes[size]} 
    ${className}
  `

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 -skew-x-12 animate-pulse" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          children
        )}
      </span>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-pink-600/50 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-xl" />
    </motion.button>
  )
}