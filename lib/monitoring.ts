// Simplified monitoring and error tracking system

interface ErrorEvent {
  message: string
  stack?: string
  timestamp: string
  userId?: string
  sessionId: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  context?: Record<string, unknown>
}

interface PerformanceMetric {
  name: string
  value: number
  unit: 'ms' | 'bytes' | 'count'
  timestamp: string
  userId?: string
  sessionId: string
}

class MonitoringService {
  private sessionId: string
  private userId?: string
  private isProduction: boolean
  private errorQueue: ErrorEvent[] = []
  private metricQueue: PerformanceMetric[] = []

  constructor() {
    this.sessionId = this.generateSessionId()
    this.isProduction = process.env.NODE_ENV === 'production'

    if (typeof window !== 'undefined') {
      this.setupErrorListeners()
      this.startFlushInterval()
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  setUserId(userId: string) {
    this.userId = userId
  }

  logError(error: Error | string, context?: Record<string, unknown>, severity: ErrorEvent['severity'] = 'medium') {
    const errorEvent: ErrorEvent = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId,
      severity,
      context
    }

    this.errorQueue.push(errorEvent)

    if (!this.isProduction) {
      console.error('Error logged:', errorEvent)
    }

    if (severity === 'critical') {
      this.flush()
    }
  }

  logMetric(name: string, value: number, unit: PerformanceMetric['unit'] = 'ms') {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId
    }

    this.metricQueue.push(metric)

    if (!this.isProduction) {
      console.log('Metric logged:', metric)
    }
  }

  startTimer(name: string): () => void {
    const startTime = performance.now()
    return () => {
      const duration = performance.now() - startTime
      this.logMetric(name, duration, 'ms')
    }
  }

  async measureAsyncOperation<T>(name: string, operation: () => Promise<T>): Promise<T> {
    const stopTimer = this.startTimer(name)
    try {
      const result = await operation()
      stopTimer()
      return result
    } catch (error) {
      stopTimer()
      this.logError(error as Error, { operation: name }, 'high')
      throw error
    }
  }

  private setupErrorListeners() {
    if (typeof window === 'undefined') return

    window.addEventListener('error', (event) => {
      this.logError(
        event.error || event.message,
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          source: 'window.error'
        },
        'high'
      )
    })

    window.addEventListener('unhandledrejection', (event) => {
      this.logError(
        event.reason instanceof Error ? event.reason : String(event.reason),
        { source: 'unhandledrejection' },
        'high'
      )
    })
  }

  private async flush() {
    if (this.errorQueue.length === 0 && this.metricQueue.length === 0) {
      return
    }

    try {
      const payload = {
        errors: [...this.errorQueue],
        metrics: [...this.metricQueue],
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      }

      this.errorQueue = []
      this.metricQueue = []

      if (this.isProduction) {
        await fetch('/api/monitoring', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      } else {
        console.log('Monitoring data (would be sent in production):', payload)
      }
    } catch (error) {
      console.error('Failed to send monitoring data:', error)
    }
  }

  private startFlushInterval() {
    setInterval(() => {
      this.flush()
    }, 30000)

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flush()
      })
    }
  }
}

// Global monitoring instance
export const monitoring = new MonitoringService()

// Hook for easy access to monitoring
export function useMonitoring() {
  return {
    logError: monitoring.logError.bind(monitoring),
    logMetric: monitoring.logMetric.bind(monitoring),
    startTimer: monitoring.startTimer.bind(monitoring),
    measureAsyncOperation: monitoring.measureAsyncOperation.bind(monitoring),
    setUserId: monitoring.setUserId.bind(monitoring)
  }
}