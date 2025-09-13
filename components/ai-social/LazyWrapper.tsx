'use client'

import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { BsRobot } from 'react-icons/bs'

interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ComponentType
}

function DefaultFallback() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center p-8"
    >
      <div className="glass-card-intense rounded-2xl p-6 flex flex-col items-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl
                   flex items-center justify-center"
        >
          <BsRobot className="w-6 h-6 text-white" />
        </motion.div>
        <div className="text-center">
          <div className="text-neural font-semibold mb-1">Loading AI Component</div>
          <div className="text-gray-400 text-sm">Neural networks initializing...</div>
        </div>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 bg-cyan-400 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function LazyWrapper({ children, fallback: Fallback = DefaultFallback }: LazyWrapperProps) {
  return (
    <Suspense fallback={<Fallback />}>
      {children}
    </Suspense>
  )
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const measurePerformance = (name: string, fn: () => void) => {
    const start = performance.now()
    fn()
    const end = performance.now()
    const duration = end - start

    if (duration > 16) { // If operation takes longer than 16ms (60fps threshold)
      console.warn(`Performance warning in ${componentName}.${name}: ${duration.toFixed(2)}ms`)
    }

    // Report to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // Replace with your analytics service
      console.log(`Performance metric: ${componentName}.${name} = ${duration.toFixed(2)}ms`)
    }
  }

  return { measurePerformance }
}

// Lazy load heavy components
export const LazyParallaxBackground = lazy(() => import('./ParallaxBackground'))
export const LazyLivePresence = lazy(() => import('./LivePresence'))
export const LazyAIRecommendationEngine = lazy(() => import('./AIRecommendationEngine'))

export default LazyWrapper