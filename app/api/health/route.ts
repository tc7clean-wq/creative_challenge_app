import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const healthChecks = {
    status: 'healthy' as 'healthy' | 'degraded' | 'down',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database: false,
      auth: false,
      memory: false,
      disk: false
    },
    metrics: {
      memory: {
        used: 0,
        total: 0,
        percentage: 0
      },
      response_time: 0
    }
  }

  const startTime = Date.now()

  try {
    // Check database connection
    const supabase = await createClient()
    const { error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    healthChecks.checks.database = !error

    // Check auth service
    try {
      await supabase.auth.getSession()
      healthChecks.checks.auth = true
    } catch {
      healthChecks.checks.auth = false
    }

    // Check memory usage
    const memUsage = process.memoryUsage()
    healthChecks.checks.memory = memUsage.heapUsed < memUsage.heapTotal * 0.9 // Alert if >90% memory used

    healthChecks.metrics.memory = {
      used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
    }

    // Check disk usage (simplified)
    healthChecks.checks.disk = true // Assume healthy for now

    // Calculate response time
    healthChecks.metrics.response_time = Date.now() - startTime

    // Determine overall status
    const healthyChecks = Object.values(healthChecks.checks).filter(Boolean).length
    const totalChecks = Object.keys(healthChecks.checks).length

    if (healthyChecks === totalChecks) {
      healthChecks.status = 'healthy'
    } else if (healthyChecks >= totalChecks * 0.5) {
      healthChecks.status = 'degraded'
    } else {
      healthChecks.status = 'down'
    }

    const statusCode = healthChecks.status === 'healthy' ? 200 : 
                      healthChecks.status === 'degraded' ? 200 : 503

    return NextResponse.json(healthChecks, { status: statusCode })

  } catch (error) {
    console.error('Health check failed:', error)
    
    healthChecks.status = 'down'
    healthChecks.metrics.response_time = Date.now() - startTime

    return NextResponse.json(healthChecks, { status: 503 })
  }
}