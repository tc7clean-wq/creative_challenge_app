'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AdvancedButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  onClick?: () => void
  href?: string
  target?: string
  className?: string
  hapticFeedback?: boolean
  ripple?: boolean
  tooltip?: string
  fullWidth?: boolean
}

export default function AdvancedButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  onClick,
  href,
  target,
  className = '',
  hapticFeedback = true,
  ripple = true,
  tooltip,
  fullWidth = false
}: AdvancedButtonProps) {
  const [isPressed, setIsPressed] = React.useState(false)
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return

    // Haptic feedback
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }

    // Ripple effect
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const newRipple = {
        id: Date.now(),
        x,
        y
      }
      setRipples(prev => [...prev, newRipple])
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
      }, 600)
    }

    onClick?.()
  }

  const handleMouseDown = () => setIsPressed(true)
  const handleMouseUp = () => setIsPressed(false)
  const handleMouseLeave = () => setIsPressed(false)

  const baseClasses = `
    relative inline-flex items-center justify-center
    font-medium rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-purple-600 to-blue-600
      hover:from-purple-700 hover:to-blue-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-purple-500
    `,
    secondary: `
      bg-gray-100 hover:bg-gray-200
      text-gray-900 border border-gray-300
      focus:ring-gray-500
    `,
    outline: `
      border-2 border-purple-600
      text-purple-600 hover:bg-purple-600
      hover:text-white focus:ring-purple-500
    `,
    ghost: `
      text-purple-600 hover:bg-purple-50
      focus:ring-purple-500
    `,
    danger: `
      bg-red-600 hover:bg-red-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-red-500
    `
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  }

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  }

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${isPressed ? 'scale-95' : 'scale-100'}
    ${className}
  `

  const content = (
    <>
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute bg-white bg-opacity-30 rounded-full pointer-events-none"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20
            }}
          />
        ))}
      </AnimatePresence>

      {/* Loading spinner */}
      {loading && (
        <motion.div
          className={`${iconSizeClasses[size]} mr-2`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </motion.div>
      )}

      {/* Icon */}
      {icon && !loading && iconPosition === 'left' && (
        <span className={`${iconSizeClasses[size]} mr-2`}>
          {icon}
        </span>
      )}

      {/* Button text */}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>

      {/* Icon */}
      {icon && !loading && iconPosition === 'right' && (
        <span className={`${iconSizeClasses[size]} ml-2`}>
          {icon}
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={buttonClasses}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        title={tooltip}
      >
        {content}
      </a>
    )
  }

  return (
    <motion.button
      className={buttonClasses}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || loading}
      title={tooltip}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {content}
    </motion.button>
  )
}
