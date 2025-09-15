'use client'

import { forwardRef } from 'react'
import { cn, touchTargets } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = cn(
      // Base styling
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black',
      'disabled:opacity-50 disabled:cursor-not-allowed',

      // Touch targets for accessibility
      touchTargets.comfortable,

      // Full width
      fullWidth && 'w-full',

      // Loading state
      isLoading && 'cursor-wait',
    )

    const variantClasses = {
      primary: cn(
        'bg-gradient-to-r from-cyan-500 to-blue-600 text-white',
        'hover:from-cyan-600 hover:to-blue-700',
        'focus:ring-cyan-500',
        'shadow-lg shadow-cyan-500/25',
        'hover:shadow-xl hover:shadow-cyan-500/30'
      ),
      secondary: cn(
        'bg-gradient-to-r from-purple-500 to-pink-600 text-white',
        'hover:from-purple-600 hover:to-pink-700',
        'focus:ring-purple-500',
        'shadow-lg shadow-purple-500/25'
      ),
      outline: cn(
        'border-2 border-cyan-500 text-cyan-400 bg-transparent',
        'hover:bg-cyan-500 hover:text-black',
        'focus:ring-cyan-500'
      ),
      ghost: cn(
        'text-white/80 bg-transparent',
        'hover:bg-white/10 hover:text-white',
        'focus:ring-white/20'
      ),
      destructive: cn(
        'bg-gradient-to-r from-red-500 to-red-600 text-white',
        'hover:from-red-600 hover:to-red-700',
        'focus:ring-red-500',
        'shadow-lg shadow-red-500/25'
      )
    }

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm gap-1.5',
      md: 'px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base gap-2',
      lg: 'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg gap-2.5'
    }

    const iconSizeClasses = {
      sm: 'w-3 h-3 sm:w-4 sm:h-4',
      md: 'w-4 h-4 sm:w-5 sm:h-5',
      lg: 'w-5 h-5 sm:w-6 sm:h-6'
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <div className={cn('animate-spin rounded-full border-2 border-current border-t-transparent', iconSizeClasses[size])} />
            {children && <span className="ml-2">{children}</span>}
          </>
        ) : (
          <>
            {leftIcon && (
              <span className={cn('flex-shrink-0', iconSizeClasses[size])}>
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className={cn('flex-shrink-0', iconSizeClasses[size])}>
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }