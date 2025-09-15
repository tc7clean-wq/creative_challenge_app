'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface AdvancedCardProps {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  clickable?: boolean
  loading?: boolean
  className?: string
  onClick?: () => void
  onHover?: (isHovered: boolean) => void
  gradient?: boolean
  glow?: boolean
  border?: boolean
  shadow?: boolean
}

export default function AdvancedCard({
  children,
  variant = 'default',
  size = 'md',
  hover = true,
  clickable = false,
  loading = false,
  className = '',
  onClick,
  onHover,
  gradient = false,
  glow = false,
  border = true,
  shadow = true
}: AdvancedCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    onHover?.(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onHover?.(false)
  }

  const baseClasses = `
    relative rounded-xl transition-all duration-300
    ${clickable ? 'cursor-pointer' : ''}
    ${loading ? 'pointer-events-none' : ''}
  `

  const variantClasses = {
    default: `
      bg-white dark:bg-gray-800
      ${border ? 'border border-gray-200 dark:border-gray-700' : ''}
      ${shadow ? 'shadow-sm' : ''}
    `,
    elevated: `
      bg-white dark:bg-gray-800
      ${border ? 'border border-gray-200 dark:border-gray-700' : ''}
      ${shadow ? 'shadow-lg' : ''}
    `,
    outlined: `
      bg-transparent
      ${border ? 'border-2 border-gray-300 dark:border-gray-600' : ''}
      ${shadow ? 'shadow-none' : ''}
    `,
    filled: `
      bg-gray-50 dark:bg-gray-900
      ${border ? 'border border-gray-200 dark:border-gray-700' : ''}
      ${shadow ? 'shadow-sm' : ''}
    `
  }

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  }

  const hoverClasses = hover ? `
    hover:shadow-xl hover:scale-105
    ${clickable ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
  ` : ''

  const gradientClasses = gradient ? `
    bg-gradient-to-br from-purple-50 to-blue-50
    dark:from-purple-900/20 dark:to-blue-900/20
  ` : ''

  const glowClasses = glow ? `
    ${isHovered ? 'shadow-purple-500/25 shadow-2xl' : ''}
  ` : ''

  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${hoverClasses}
    ${gradientClasses}
    ${glowClasses}
    ${className}
  `

  const content = (
    <>
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 rounded-xl flex items-center justify-center z-10">
          <motion.div
            className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}

      {/* Gradient overlay */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl pointer-events-none" />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </>
  )

  if (clickable && onClick) {
    return (
      <motion.div
        className={cardClasses}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: hover ? 1.02 : 1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {content}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={cardClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: hover ? 1.01 : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {content}
    </motion.div>
  )
}
