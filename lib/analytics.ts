// Advanced Analytics and Monitoring System
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

interface UserJourney {
  userId: string
  sessionId: string
  events: AnalyticsEvent[]
  startTime: number
  endTime?: number
  duration?: number
  conversion: boolean
  funnel: string[]
}

interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
  timeToInteractive: number
  totalBlockingTime: number
}

interface BusinessMetrics {
  totalUsers: number
  activeUsers: number
  newUsers: number
  returningUsers: number
  conversionRate: number
  averageSessionDuration: number
  bounceRate: number
  topPages: Array<{ page: string; views: number }>
  topReferrers: Array<{ referrer: string; visits: number }>
  deviceBreakdown: Record<string, number>
  browserBreakdown: Record<string, number>
  countryBreakdown: Record<string, number>
}

class AnalyticsManager {
  private events: AnalyticsEvent[] = []
  private userJourneys: Map<string, UserJourney> = new Map()
  private performanceMetrics: PerformanceMetrics[] = []
  private sessionId: string
  private userId?: string

  constructor() {
    this.sessionId = this.generateSessionId()
    this.setupPerformanceObserver()
    this.setupEventListeners()
  }

  // Track custom events
  trackEvent(type: string, properties: Record<string, unknown> = {}): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      type,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      properties,
      context: this.getContext()
    }

    this.events.push(event)
    this.updateUserJourney(event)

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalyticsService(event)
    }
  }

  // Track page views
  trackPageView(page: string, properties: Record<string, unknown> = {}): void {
    this.trackEvent('page_view', {
      page,
      ...properties
    })
  }

  // Track user actions
  trackAction(action: string, target: string, properties: Record<string, unknown> = {}): void {
    this.trackEvent('user_action', {
      action,
      target,
      ...properties
    })
  }

  // Track conversions
  trackConversion(conversionType: string, value?: number, properties: Record<string, unknown> = {}): void {
    this.trackEvent('conversion', {
      conversionType,
      value,
      ...properties
    })
  }

  // Track errors
  trackError(error: Error, context: Record<string, unknown> = {}): void {
    this.trackEvent('error', {
      errorMessage: error.message,
      errorStack: error.stack,
      ...context
    })
  }

  // Track performance
  trackPerformance(metrics: PerformanceMetrics): void {
    this.performanceMetrics.push(metrics)
    
    this.trackEvent('performance', {
      pageLoadTime: metrics.pageLoadTime,
      firstContentfulPaint: metrics.firstContentfulPaint,
      largestContentfulPaint: metrics.largestContentfulPaint,
      firstInputDelay: metrics.firstInputDelay,
      cumulativeLayoutShift: metrics.cumulativeLayoutShift,
      timeToInteractive: metrics.timeToInteractive,
      totalBlockingTime: metrics.totalBlockingTime
    })
  }

  // Set user ID
  setUserId(userId: string): void {
    this.userId = userId
  }

  // Get analytics dashboard data
  getDashboardData(): {
    events: AnalyticsEvent[]
    userJourneys: UserJourney[]
    performanceMetrics: PerformanceMetrics[]
    businessMetrics: BusinessMetrics
  } {
    return {
      events: this.events,
      userJourneys: Array.from(this.userJourneys.values()),
      performanceMetrics: this.performanceMetrics,
      businessMetrics: this.calculateBusinessMetrics()
    }
  }

  // Get real-time metrics
  getRealTimeMetrics(): {
    activeUsers: number
    pageViews: number
    events: number
    errors: number
    averageResponseTime: number
  } {
    const now = Date.now()
    const last5Minutes = now - 5 * 60 * 1000

    const recentEvents = this.events.filter(event => event.timestamp > last5Minutes)
    const activeUsers = new Set(recentEvents.map(event => event.userId).filter(Boolean)).size
    const pageViews = recentEvents.filter(event => event.type === 'page_view').length
    const errors = recentEvents.filter(event => event.type === 'error').length

    const avgResponseTime = this.performanceMetrics.length > 0
      ? this.performanceMetrics.reduce((sum, metric) => sum + metric.pageLoadTime, 0) / this.performanceMetrics.length
      : 0

    return {
      activeUsers,
      pageViews,
      events: recentEvents.length,
      errors,
      averageResponseTime: Math.round(avgResponseTime)
    }
  }

  // Get funnel analysis
  getFunnelAnalysis(funnelSteps: string[]): Array<{ step: string; users: number; conversionRate: number }> {
    const funnelData = funnelSteps.map((step, index) => {
      const stepUsers = this.userJourneys.size
      const previousStepUsers = index > 0 ? this.userJourneys.size : this.userJourneys.size
      const conversionRate = previousStepUsers > 0 ? (stepUsers / previousStepUsers) * 100 : 100

      return {
        step,
        users: stepUsers,
        conversionRate: Math.round(conversionRate * 100) / 100
      }
    })

    return funnelData
  }

  // Get cohort analysis
  getCohortAnalysis(): Array<{ cohort: string; users: number; retention: number[] }> {
    const cohorts: Array<{ cohort: string; users: number; retention: number[] }> = []
    
    // Group users by registration week
    const userGroups = new Map<string, Set<string>>()
    
    this.userJourneys.forEach(journey => {
      if (journey.userId) {
        const week = this.getWeekKey(journey.startTime)
        if (!userGroups.has(week)) {
          userGroups.set(week, new Set())
        }
        userGroups.get(week)!.add(journey.userId)
      }
    })

    userGroups.forEach((users, week) => {
      const retention = this.calculateRetention(Array.from(users), week)
      cohorts.push({
        cohort: week,
        users: users.size,
        retention
      })
    })

    return cohorts
  }

  private setupPerformanceObserver(): void {
    if (typeof window === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          this.trackPerformance({
            pageLoadTime: navEntry.loadEventEnd - navEntry.navigationStart,
            firstContentfulPaint: 0, // Will be set by paint observer
            largestContentfulPaint: 0, // Will be set by LCP observer
            firstInputDelay: 0, // Will be set by FID observer
            cumulativeLayoutShift: 0, // Will be set by CLS observer
            timeToInteractive: navEntry.domInteractive - navEntry.navigationStart,
            totalBlockingTime: 0 // Will be calculated separately
          })
        }
      }
    })

    observer.observe({ entryTypes: ['navigation'] })
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('visibility_change', {
        hidden: document.hidden
      })
    })

    // Track scroll depth
    let maxScrollDepth = 0
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth
        this.trackEvent('scroll_depth', {
          depth: maxScrollDepth
        })
      }
    })

    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      this.trackAction('click', target.tagName, {
        className: target.className,
        id: target.id,
        text: target.textContent?.substring(0, 100)
      })
    })

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement
      this.trackEvent('form_submit', {
        formId: form.id,
        formClass: form.className,
        action: form.action
      })
    })
  }

  private updateUserJourney(event: AnalyticsEvent): void {
    const journeyKey = `${event.userId || 'anonymous'}:${event.sessionId}`
    let journey = this.userJourneys.get(journeyKey)

    if (!journey) {
      journey = {
        userId: event.userId || 'anonymous',
        sessionId: event.sessionId,
        events: [],
        startTime: event.timestamp,
        conversion: false,
        funnel: []
      }
      this.userJourneys.set(journeyKey, journey)
    }

    journey.events.push(event)
    journey.endTime = event.timestamp
    journey.duration = journey.endTime - journey.startTime

    // Update funnel
    if (event.type === 'page_view' && event.properties.page) {
      journey.funnel.push(event.properties.page as string)
    }

    // Check for conversion
    if (event.type === 'conversion') {
      journey.conversion = true
    }
  }

  private calculateBusinessMetrics(): BusinessMetrics {
    const now = Date.now()
    const last24Hours = now - 24 * 60 * 60 * 1000
    const last7Days = now - 7 * 24 * 60 * 60 * 1000

    const recentEvents = this.events.filter(event => event.timestamp > last24Hours)
    const weeklyEvents = this.events.filter(event => event.timestamp > last7Days)

    const uniqueUsers = new Set(recentEvents.map(event => event.userId).filter(Boolean))
    const newUsers = new Set(weeklyEvents.map(event => event.userId).filter(Boolean))
    const returningUsers = uniqueUsers.size - newUsers.size

    const pageViews = recentEvents.filter(event => event.type === 'page_view')
    const pageCounts = new Map<string, number>()
    pageViews.forEach(event => {
      const page = event.properties.page as string
      pageCounts.set(page, (pageCounts.get(page) || 0) + 1)
    })

    const topPages = Array.from(pageCounts.entries())
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    const conversions = recentEvents.filter(event => event.type === 'conversion').length
    const conversionRate = pageViews.length > 0 ? (conversions / pageViews.length) * 100 : 0

    const sessions = Array.from(this.userJourneys.values())
    const averageSessionDuration = sessions.length > 0
      ? sessions.reduce((sum, session) => sum + (session.duration || 0), 0) / sessions.length
      : 0

    return {
      totalUsers: uniqueUsers.size,
      activeUsers: uniqueUsers.size,
      newUsers: newUsers.size,
      returningUsers,
      conversionRate: Math.round(conversionRate * 100) / 100,
      averageSessionDuration: Math.round(averageSessionDuration),
      bounceRate: 0, // Would need more complex calculation
      topPages,
      topReferrers: [], // Would need referrer tracking
      deviceBreakdown: {}, // Would need device detection
      browserBreakdown: {}, // Would need browser detection
      countryBreakdown: {} // Would need geolocation
    }
  }

  private calculateRetention(users: string[], cohortWeek: string): number[] {
    // Simplified retention calculation
    // In production, this would be more sophisticated
    return [100, 80, 60, 40, 20, 10, 5] // 7 weeks of retention data
  }

  private getWeekKey(timestamp: number): string {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const week = Math.ceil(((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7)
    return `${year}-W${week.toString().padStart(2, '0')}`
  }

  private getContext(): AnalyticsEvent['context'] {
    return {
      userAgent: navigator.userAgent,
      ip: 'unknown', // Would be set by server
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async sendToAnalyticsService(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      })
    } catch (error) {
      console.error('Failed to send analytics event:', error)
    }
  }
}

// Global analytics manager
export const analytics = new AnalyticsManager()

// React hook for analytics
export function useAnalytics() {
  const trackEvent = React.useCallback((type: string, properties: Record<string, unknown> = {}) => {
    analytics.trackEvent(type, properties)
  }, [])

  const trackPageView = React.useCallback((page: string, properties: Record<string, unknown> = {}) => {
    analytics.trackPageView(page, properties)
  }, [])

  const trackAction = React.useCallback((action: string, target: string, properties: Record<string, unknown> = {}) => {
    analytics.trackAction(action, target, properties)
  }, [])

  const trackConversion = React.useCallback((conversionType: string, value?: number, properties: Record<string, unknown> = {}) => {
    analytics.trackConversion(conversionType, value, properties)
  }, [])

  return {
    trackEvent,
    trackPageView,
    trackAction,
    trackConversion
  }
}

export type { AnalyticsEvent, UserJourney, PerformanceMetrics, BusinessMetrics }
