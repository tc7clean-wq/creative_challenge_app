'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface AccessibilityContextType {
  reducedMotion: boolean
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
  screenReader: boolean
  toggleReducedMotion: () => void
  toggleHighContrast: () => void
  setFontSize: (size: 'small' | 'medium' | 'large') => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [screenReader, setScreenReader] = useState(false)

  // Detect system preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setReducedMotion(prefersReducedMotion)

      // Check for high contrast preference
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
      setHighContrast(prefersHighContrast)

      // Detect screen reader
      const hasScreenReader = window.navigator.userAgent.includes('NVDA') ||
                             window.navigator.userAgent.includes('JAWS') ||
                             window.speechSynthesis?.getVoices().length > 0
      setScreenReader(hasScreenReader)

      // Apply accessibility classes to document
      const root = document.documentElement
      if (prefersReducedMotion) root.classList.add('reduce-motion')
      if (prefersHighContrast) root.classList.add('high-contrast')
    }
  }, [])

  // Apply changes to document
  useEffect(() => {
    const root = document.documentElement

    if (reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    if (highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    root.setAttribute('data-font-size', fontSize)
  }, [reducedMotion, highContrast, fontSize])

  const toggleReducedMotion = () => setReducedMotion(prev => !prev)
  const toggleHighContrast = () => setHighContrast(prev => !prev)

  return (
    <AccessibilityContext.Provider value={{
      reducedMotion,
      highContrast,
      fontSize,
      screenReader,
      toggleReducedMotion,
      toggleHighContrast,
      setFontSize
    }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}