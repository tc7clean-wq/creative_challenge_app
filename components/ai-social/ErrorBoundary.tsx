'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'
import { BsRobot } from 'react-icons/bs'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })

    // Send error to monitoring service
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Replace with your error tracking service
      console.error('Production error:', { error, errorInfo })
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback
        return <Fallback error={this.state.error} retry={this.retry} />
      }

      return <DefaultErrorFallback error={this.state.error} retry={this.retry} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card-intense rounded-3xl p-8 max-w-md mx-auto my-8 text-center"
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-red-500 to-orange-500
                   rounded-xl flex items-center justify-center"
      >
        <FiAlertTriangle className="w-8 h-8 text-white" />
      </motion.div>

      <h2 className="text-2xl font-bold text-neural mb-4">
        AI System Error
      </h2>

      <p className="text-gray-300 mb-6">
        Our neural networks encountered an unexpected error. Don&apos;t worry, we&apos;re learning from this!
      </p>

      <div className="glass-card rounded-xl p-4 mb-6 text-left">
        <div className="flex items-center space-x-2 mb-2">
          <BsRobot className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-cyan-400">Error Details</span>
        </div>
        <code className="text-xs text-gray-400 block">
          {error.message}
        </code>
      </div>

      <div className="flex space-x-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={retry}
          className="flex-1 py-3 morph-button text-white font-semibold rounded-xl
                   flex items-center justify-center space-x-2"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="flex-1 py-3 glass-card hover:glass-card-intense text-cyan-300
                   font-semibold rounded-xl border border-cyan-400/30 hover:border-cyan-400/50
                   transition-all duration-300"
        >
          Reload Page
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ErrorBoundary