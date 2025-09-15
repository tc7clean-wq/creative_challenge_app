import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

interface AnalyticsEvent {
  id: string
  type: string
  userId?: string
  sessionId: string
  timestamp: number
  properties: Record<string, unknown>
  context: {
    userAgent: string
    ip: string
    referrer?: string
    url: string
    viewport: { width: number; height: number }
  }
}

export async function POST(request: NextRequest) {
  try {
    const event: AnalyticsEvent = await request.json()

    // Validate event structure
    if (!event.id || !event.type || !event.sessionId) {
      return NextResponse.json(
        { error: 'Invalid event structure' },
        { status: 400 }
      )
    }

    // Get client IP
    const ip = request.ip || 
               request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Add IP to context
    event.context.ip = ip

    // Store in database
    const supabase = await createClient()
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        id: event.id,
        type: event.type,
        user_id: event.userId,
        session_id: event.sessionId,
        timestamp: new Date(event.timestamp).toISOString(),
        properties: event.properties,
        context: event.context
      })

    if (error) {
      console.error('Analytics storage error:', error)
      return NextResponse.json(
        { error: 'Failed to store analytics event' },
        { status: 500 }
      )
    }

    // Process real-time analytics
    await processRealTimeAnalytics(event)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = parseInt(searchParams.get('limit') || '100')

    const supabase = await createClient()
    let query = supabase
      .from('analytics_events')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (type) {
      query = query.eq('type', type)
    }

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (startDate) {
      query = query.gte('timestamp', startDate)
    }

    if (endDate) {
      query = query.lte('timestamp', endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('Analytics retrieval error:', error)
      return NextResponse.json(
        { error: 'Failed to retrieve analytics data' },
        { status: 500 }
      )
    }

    return NextResponse.json({ events: data })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function processRealTimeAnalytics(event: AnalyticsEvent): Promise<void> {
  // Process different event types
  switch (event.type) {
    case 'page_view':
      await processPageView(event)
      break
    case 'user_action':
      await processUserAction(event)
      break
    case 'conversion':
      await processConversion(event)
      break
    case 'error':
      await processError(event)
      break
    case 'performance':
      await processPerformance(event)
      break
  }
}

async function processPageView(event: AnalyticsEvent): Promise<void> {
  // Update page view counts
  const page = event.properties.page as string
  if (page) {
    // Update page statistics
    console.log(`Page view: ${page}`)
  }
}

async function processUserAction(event: AnalyticsEvent): Promise<void> {
  // Process user actions
  const action = event.properties.action as string
  const target = event.properties.target as string
  
  if (action === 'click' && target) {
    console.log(`User clicked: ${target}`)
  }
}

async function processConversion(event: AnalyticsEvent): Promise<void> {
  // Process conversions
  const conversionType = event.properties.conversionType as string
  const value = event.properties.value as number
  
  console.log(`Conversion: ${conversionType}, Value: ${value}`)
}

async function processError(event: AnalyticsEvent): Promise<void> {
  // Process errors
  const errorMessage = event.properties.errorMessage as string
  const errorStack = event.properties.errorStack as string
  
  console.error(`Analytics Error: ${errorMessage}`, errorStack)
}

async function processPerformance(event: AnalyticsEvent): Promise<void> {
  // Process performance metrics
  const pageLoadTime = event.properties.pageLoadTime as number
  const firstContentfulPaint = event.properties.firstContentfulPaint as number
  
  if (pageLoadTime > 3000) {
    console.warn(`Slow page load: ${pageLoadTime}ms`)
  }
}
