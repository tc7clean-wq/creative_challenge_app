import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Responsive breakpoint utilities
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// Common responsive patterns
export const responsiveClasses = {
  // Grid layouts
  gridCols: {
    responsive: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    gallery: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    cards: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  },

  // Text sizes
  text: {
    hero: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
    heading: 'text-2xl sm:text-3xl md:text-4xl',
    subheading: 'text-lg sm:text-xl md:text-2xl',
    body: 'text-sm sm:text-base',
  },

  // Spacing
  spacing: {
    section: 'py-8 sm:py-12 md:py-16 lg:py-20',
    container: 'px-4 sm:px-6 lg:px-8',
    gap: 'gap-4 sm:gap-6 md:gap-8',
  },

  // Component sizes
  button: {
    sm: 'px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm',
    md: 'px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base',
    lg: 'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg',
  }
}

// Utility functions for responsive behavior
export function getResponsiveValue<T>(
  values: { mobile?: T; tablet?: T; desktop?: T },
  defaultValue: T
): T {
  if (typeof window === 'undefined') return defaultValue

  const width = window.innerWidth

  if (width >= 1024 && values.desktop !== undefined) return values.desktop
  if (width >= 768 && values.tablet !== undefined) return values.tablet
  if (values.mobile !== undefined) return values.mobile

  return defaultValue
}

// Touch-friendly sizing utilities
export const touchTargets = {
  minimum: 'min-h-[44px] min-w-[44px]', // WCAG AA minimum
  comfortable: 'min-h-[48px] min-w-[48px]', // Recommended
  spacious: 'min-h-[56px] min-w-[56px]', // Material Design
}

// Accessibility utilities
export function getAriaLabel(text: string, context?: string): string {
  return context ? `${text} - ${context}` : text
}

export function generateId(prefix: string = 'element'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

// Format utilities
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return formatDate(date)
}