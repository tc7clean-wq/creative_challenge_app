import { NextRequest, NextResponse } from 'next/server'

interface MonitoringPayload {
  errors: Array<{
    message: string
    stack?: string
    timestamp: string
    userId?: string
    sessionId: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    context?: Record<string, unknown>
  }>
  metrics: Array<{
    name: string
    value: number
    unit: 'ms' | 'bytes' | 'count'
    timestamp: string
    userId?: string
    sessionId: string
  }>
  sessionId: string
  timestamp: string
}

interface RateLimitRecord {
  count: number
  resetTime: number
}

// Simple in-memory rate limiting
const rateLimitStore = new Map<string, RateLimitRecord>()

function checkRateLimit(identifier: string, maxRequests = 100, windowMs = 60000): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(`monitoring:${clientIP}`)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const payload: MonitoringPayload = await request.json()

    // Validate payload structure
    if (!payload.errors || !payload.metrics || !payload.sessionId) {
      return NextResponse.json(
        { error: 'Invalid payload structure' },
        { status: 400 }
      )
    }

    // Process errors
    const errorCount = payload.errors.length
    const criticalErrors = payload.errors.filter(e => e.severity === 'critical').length
    const highErrors = payload.errors.filter(e => e.severity === 'high').length

    // Process metrics
    const metricCount = payload.metrics.length
    const avgResponseTime = payload.metrics
      .filter(m => m.unit === 'ms')
      .reduce((sum, m) => sum + m.value, 0) / Math.max(1, payload.metrics.filter(m => m.unit === 'ms').length)

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Monitoring data received:', {
        sessionId: payload.sessionId,
        errorCount,
        criticalErrors,
        highErrors,
        metricCount,
        avgResponseTime: Math.round(avgResponseTime)
      })
    }

    // In production, you would send this to your monitoring service
    if (process.env.NODE_ENV === 'production') {
      await sendToExternalMonitoring(payload.errors, 'error')
      await sendToExternalMonitoring(payload.metrics, 'performance')
    }

    return NextResponse.json({
      success: true,
      message: 'Monitoring data processed',
      stats: {
        errorsProcessed: errorCount,
        metricsProcessed: metricCount,
        criticalErrors,
        highErrors,
        avgResponseTime: Math.round(avgResponseTime)
      }
    })

  } catch (error) {
    console.error('Monitoring API error:', error)
    return NextResponse.json(
      { error: 'Failed to process monitoring data' },
      { status: 500 }
    )
  }
}

async function sendToExternalMonitoring(data: unknown[], type: 'error' | 'performance') {
  // This would integrate with your monitoring service (e.g., Sentry, DataDog, etc.)
  // For now, just log the data
  console.log(`Sending ${type} data to external monitoring:`, data.length, 'items')
  
  // Example integration:
  // if (type === 'error') {
  //   await sentry.captureException(data)
  // } else {
  //   await datadog.metrics.increment('performance.metrics', data.length)
  // }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Monitoring API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
}