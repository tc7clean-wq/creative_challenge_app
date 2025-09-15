// Enterprise-Grade Security System
interface SecurityPolicy {
  maxLoginAttempts: number
  lockoutDuration: number
  sessionTimeout: number
  passwordRequirements: {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSymbols: boolean
  }
  twoFactorAuth: boolean
  ipWhitelist: string[]
  rateLimiting: {
    requestsPerMinute: number
    requestsPerHour: number
    requestsPerDay: number
  }
  contentModeration: {
    enableAI: boolean
    enableManual: boolean
    autoBlock: boolean
  }
}

interface SecurityEvent {
  id: string
  type: 'login_attempt' | 'suspicious_activity' | 'content_violation' | 'rate_limit_exceeded'
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  details: Record<string, unknown>
  timestamp: number
  resolved: boolean
}

interface ThreatIntelligence {
  ip: string
  riskScore: number
  country: string
  isp: string
  threatTypes: string[]
  lastSeen: number
}

class EnterpriseSecurityManager {
  private policy: SecurityPolicy
  private events: SecurityEvent[] = []
  private blockedIPs = new Set<string>()
  private suspiciousIPs = new Map<string, number>()
  private threatIntelligence = new Map<string, ThreatIntelligence>()
  private activeSessions = new Map<string, { userId: string; lastActivity: number }>()

  constructor() {
    this.policy = {
      maxLoginAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15 minutes
      sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
      passwordRequirements: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true
      },
      twoFactorAuth: true,
      ipWhitelist: [],
      rateLimiting: {
        requestsPerMinute: 60,
        requestsPerHour: 1000,
        requestsPerDay: 10000
      },
      contentModeration: {
        enableAI: true,
        enableManual: true,
        autoBlock: true
      }
    }
  }

  // Advanced authentication security
  async validatePassword(password: string): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = []
    const { passwordRequirements } = this.policy

    if (password.length < passwordRequirements.minLength) {
      errors.push(`Password must be at least ${passwordRequirements.minLength} characters`)
    }

    if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (passwordRequirements.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (passwordRequirements.requireSymbols && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one symbol')
    }

    // Check against common passwords
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein']
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Rate limiting with advanced features
  checkRateLimit(identifier: string, endpoint: string): boolean {
    const key = `${identifier}:${endpoint}`
    const now = Date.now()
    const limits = this.policy.rateLimiting

    // Check minute limit
    const minuteKey = `${key}:minute:${Math.floor(now / 60000)}`
    const minuteCount = this.getRequestCount(minuteKey)
    if (minuteCount >= limits.requestsPerMinute) {
      this.logSecurityEvent({
        type: 'rate_limit_exceeded',
        severity: 'medium',
        source: identifier,
        details: { endpoint, limit: 'minute', count: minuteCount }
      })
      return false
    }

    // Check hour limit
    const hourKey = `${key}:hour:${Math.floor(now / 3600000)}`
    const hourCount = this.getRequestCount(hourKey)
    if (hourCount >= limits.requestsPerHour) {
      this.logSecurityEvent({
        type: 'rate_limit_exceeded',
        severity: 'high',
        source: identifier,
        details: { endpoint, limit: 'hour', count: hourCount }
      })
      return false
    }

    // Check day limit
    const dayKey = `${key}:day:${Math.floor(now / 86400000)}`
    const dayCount = this.getRequestCount(dayKey)
    if (dayCount >= limits.requestsPerDay) {
      this.logSecurityEvent({
        type: 'rate_limit_exceeded',
        severity: 'critical',
        source: identifier,
        details: { endpoint, limit: 'day', count: dayCount }
      })
      return false
    }

    // Increment counters
    this.incrementRequestCount(minuteKey)
    this.incrementRequestCount(hourKey)
    this.incrementRequestCount(dayKey)

    return true
  }

  // IP reputation checking
  async checkIPReputation(ip: string): Promise<ThreatIntelligence> {
    // Check cache first
    if (this.threatIntelligence.has(ip)) {
      return this.threatIntelligence.get(ip)!
    }

    try {
      // In production, integrate with threat intelligence APIs
      const response = await fetch(`https://ipapi.co/${ip}/json/`)
      const data = await response.json()

      const threatInfo: ThreatIntelligence = {
        ip,
        riskScore: this.calculateRiskScore(ip, data),
        country: data.country_name || 'Unknown',
        isp: data.org || 'Unknown',
        threatTypes: this.identifyThreatTypes(ip, data),
        lastSeen: Date.now()
      }

      this.threatIntelligence.set(ip, threatInfo)
      return threatInfo
    } catch (error) {
      console.error('IP reputation check failed:', error)
      return {
        ip,
        riskScore: 0.5, // Default medium risk
        country: 'Unknown',
        isp: 'Unknown',
        threatTypes: [],
        lastSeen: Date.now()
      }
    }
  }

  // Session management
  createSession(userId: string, ip: string): string {
    const sessionId = this.generateSecureToken(32)
    this.activeSessions.set(sessionId, {
      userId,
      lastActivity: Date.now()
    })
    return sessionId
  }

  validateSession(sessionId: string): { valid: boolean; userId?: string } {
    const session = this.activeSessions.get(sessionId)
    if (!session) {
      return { valid: false }
    }

    const now = Date.now()
    if (now - session.lastActivity > this.policy.sessionTimeout) {
      this.activeSessions.delete(sessionId)
      return { valid: false }
    }

    // Update last activity
    session.lastActivity = now
    return { valid: true, userId: session.userId }
  }

  // Content security policy
  generateCSP(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://yrbbqxdimyqdfmezxmgp.supabase.co wss://yrbbqxdimyqdfmezxmgp.supabase.co",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'"
    ].join('; ')
  }

  // Security headers
  getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Content-Security-Policy': this.generateCSP(),
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin'
    }
  }

  // Threat detection
  detectThreats(ip: string, userAgent: string, behavior: Record<string, unknown>): string[] {
    const threats: string[] = []

    // Check for bot patterns
    if (this.isBot(userAgent)) {
      threats.push('bot_detected')
    }

    // Check for suspicious behavior
    if (behavior.rapidRequests && behavior.rapidRequests > 100) {
      threats.push('rapid_requests')
    }

    // Check for known attack patterns
    if (behavior.sqlInjection) {
      threats.push('sql_injection_attempt')
    }

    if (behavior.xssAttempt) {
      threats.push('xss_attempt')
    }

    // Check IP reputation
    const threatInfo = this.threatIntelligence.get(ip)
    if (threatInfo && threatInfo.riskScore > 0.8) {
      threats.push('high_risk_ip')
    }

    return threats
  }

  // Security event logging
  logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp' | 'resolved'>): void {
    const securityEvent: SecurityEvent = {
      id: this.generateSecureToken(16),
      timestamp: Date.now(),
      resolved: false,
      ...event
    }

    this.events.push(securityEvent)

    // Auto-resolve low severity events after 24 hours
    if (event.severity === 'low') {
      setTimeout(() => {
        securityEvent.resolved = true
      }, 24 * 60 * 60 * 1000)
    }

    // Auto-block critical threats
    if (event.severity === 'critical') {
      this.blockedIPs.add(event.source)
    }

    console.warn('Security event:', securityEvent)
  }

  // Security analytics
  getSecurityAnalytics(): {
    totalEvents: number
    eventsByType: Record<string, number>
    eventsBySeverity: Record<string, number>
    topThreats: Array<{ type: string; count: number }>
    blockedIPs: number
    activeSessions: number
  } {
    const eventsByType: Record<string, number> = {}
    const eventsBySeverity: Record<string, number> = {}
    const threatCounts: Record<string, number> = {}

    this.events.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1
      
      if (event.details.threatType) {
        const threatType = event.details.threatType as string
        threatCounts[threatType] = (threatCounts[threatType] || 0) + 1
      }
    })

    const topThreats = Object.entries(threatCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      totalEvents: this.events.length,
      eventsByType,
      eventsBySeverity,
      topThreats,
      blockedIPs: this.blockedIPs.size,
      activeSessions: this.activeSessions.size
    }
  }

  private getRequestCount(key: string): number {
    return parseInt(localStorage.getItem(`rate_limit:${key}`) || '0')
  }

  private incrementRequestCount(key: string): void {
    const count = this.getRequestCount(key) + 1
    localStorage.setItem(`rate_limit:${key}`, count.toString())
  }

  private calculateRiskScore(ip: string, data: any): number {
    let score = 0.1 // Base score

    // Check if IP is in known bad ranges
    if (this.isPrivateIP(ip)) {
      score += 0.1
    }

    // Check country risk
    const highRiskCountries = ['CN', 'RU', 'KP', 'IR']
    if (highRiskCountries.includes(data.country_code)) {
      score += 0.3
    }

    // Check if IP has been seen before
    if (this.suspiciousIPs.has(ip)) {
      score += 0.2
    }

    return Math.min(score, 1.0)
  }

  private identifyThreatTypes(ip: string, data: any): string[] {
    const threats: string[] = []

    if (this.isPrivateIP(ip)) {
      threats.push('private_ip')
    }

    if (data.proxy || data.tor) {
      threats.push('proxy')
    }

    if (data.mobile) {
      threats.push('mobile')
    }

    return threats
  }

  private isBot(userAgent: string): boolean {
    const botPatterns = [
      /bot/i, /crawler/i, /spider/i, /scraper/i,
      /curl/i, /wget/i, /python/i, /java/i
    ]
    return botPatterns.some(pattern => pattern.test(userAgent))
  }

  private isPrivateIP(ip: string): boolean {
    const privateRanges = [
      /^10\./, /^172\.(1[6-9]|2[0-9]|3[0-1])\./, /^192\.168\./
    ]
    return privateRanges.some(range => range.test(ip))
  }

  private generateSecureToken(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}

// Global enterprise security manager
export const enterpriseSecurity = new EnterpriseSecurityManager()

export type { SecurityPolicy, SecurityEvent, ThreatIntelligence }
