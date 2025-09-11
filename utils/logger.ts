import { isDev, isProd } from '@/lib/env'

// Enhanced logging system for AI ArtVerse
export interface LogContext {
  userId?: string
  component?: string
  action?: string
  metadata?: Record<string, unknown>
}

class Logger {
  private isDev = isDev
  private isProd = isProd

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` [${Object.entries(context).map(([k, v]) => `${k}:${v}`).join(', ')}]` : ''
    return `[${timestamp}] [${level}] ${message}${contextStr}`
  }

  private shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
    if (this.isDev) return true
    if (this.isProd && (level === 'warn' || level === 'error')) return true
    return false
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('DEBUG', message, context))
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('INFO', message, context))
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('WARN', message, context))
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('ERROR', message, context))
      if (error) {
        console.error(error)
      }
    }

    // Send to monitoring service in production
    if (this.isProd && typeof window !== 'undefined') {
      this.sendToMonitoring('error', message, error, context)
    }
  }

  // User action tracking for analytics
  trackEvent(event: string, properties?: Record<string, unknown>): void {
    if (this.isDev) {
      console.log(`[EVENT] ${event}`, properties)
    }

    // Send to analytics service
    if (typeof window !== 'undefined') {
      this.sendToAnalytics(event, properties)
    }
  }

  // Performance tracking
  performance(operation: string, duration: number, context?: LogContext): void {
    const message = `Operation '${operation}' took ${duration}ms`
    
    if (duration > 1000) {
      this.warn(message, context)
    } else if (this.isDev) {
      this.debug(message, context)
    }
  }

  private async sendToMonitoring(_level: string, _message: string, _error?: unknown, _context?: LogContext): Promise<void> {
    try {
      // Example: Send to external monitoring service
      // await fetch('/api/monitoring', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ level, message, error: error?.stack, context, timestamp: Date.now() })
      // })
    } catch (e) {
      console.error('Failed to send log to monitoring service:', e)
    }
  }

  private async sendToAnalytics(_event: string, _properties?: Record<string, unknown>): Promise<void> {
    try {
      // Example: Send to analytics service
      // if (window.gtag) {
      //   window.gtag('event', event, properties)
      // }
    } catch (e) {
      console.error('Failed to send analytics event:', e)
    }
  }
}

export const logger = new Logger()

// Convenience functions for common use cases
export const logError = (message: string, error?: Error, context?: LogContext) => 
  logger.error(message, error, context)

export const logPerformance = (operation: string, startTime: number, context?: LogContext) => 
  logger.performance(operation, Date.now() - startTime, context)

export const trackUserAction = (action: string, properties?: Record<string, unknown>) => 
  logger.trackEvent(action, properties)

// React hook for component-level logging
export const useLogger = (component: string) => {
  const log = {
    debug: (message: string, metadata?: Record<string, unknown>) => 
      logger.debug(message, { component, metadata }),
    info: (message: string, metadata?: Record<string, unknown>) => 
      logger.info(message, { component, metadata }),
    warn: (message: string, metadata?: Record<string, unknown>) => 
      logger.warn(message, { component, metadata }),
    error: (message: string, error?: Error, metadata?: Record<string, unknown>) => 
      logger.error(message, error, { component, metadata }),
    trackEvent: (event: string, properties?: Record<string, unknown>) =>
      logger.trackEvent(event, { component, ...properties })
  }
  
  return log
}
