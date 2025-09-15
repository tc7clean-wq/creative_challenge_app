// Advanced security system with threat detection and prevention
interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface SecurityThreat {
  type: 'brute_force' | 'ddos' | 'suspicious_pattern' | 'malicious_payload'
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  timestamp: number
  details: Record<string, unknown>
}

interface SecurityPolicy {
  maxLoginAttempts: number
  lockoutDuration: number
  suspiciousActivityThreshold: number
  enableGeolocationBlocking: boolean
  enableDeviceFingerprinting: boolean
  enableBehavioralAnalysis: boolean
}

class AdvancedSecurityManager {
  private rateLimitStore = new Map<string, { count: number; resetTime: number }>()
  private threatLog: SecurityThreat[] = []
  private blockedIPs = new Set<string>()
  private suspiciousPatterns = new Map<string, number>()
  private policy: SecurityPolicy

  constructor() {
    this.policy = {
      maxLoginAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15 minutes
      suspiciousActivityThreshold: 10,
      enableGeolocationBlocking: true,
      enableDeviceFingerprinting: true,
      enableBehavioralAnalysis: true
    }
  }

  // Rate limiting with advanced features
  checkRateLimit(identifier: string, config: RateLimitConfig): boolean {
    const now = Date.now()
    const key = `${identifier}:${config.windowMs}`
    const record = this.rateLimitStore.get(key)

    if (!record || now > record.resetTime) {
      this.rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      })
      return true
    }

    if (record.count >= config.maxRequests) {
      this.logThreat({
        type: 'ddos',
        severity: 'high',
        source: identifier,
        timestamp: now,
        details: { requests: record.count, window: config.windowMs }
      })
      return false
    }

    record.count++
    return true
  }

  // Threat detection and logging
  logThreat(threat: SecurityThreat): void {
    this.threatLog.push(threat)
    
    // Keep only last 1000 threats
    if (this.threatLog.length > 1000) {
      this.threatLog = this.threatLog.slice(-1000)
    }

    // Auto-block critical threats
    if (threat.severity === 'critical') {
      this.blockedIPs.add(threat.source)
    }

    console.warn('Security threat detected:', threat)
  }

  // Brute force detection
  checkBruteForce(identifier: string, success: boolean): boolean {
    const key = `brute_force:${identifier}`
    const attempts = this.suspiciousPatterns.get(key) || 0

    if (!success) {
      const newAttempts = attempts + 1
      this.suspiciousPatterns.set(key, newAttempts)

      if (newAttempts >= this.policy.maxLoginAttempts) {
        this.logThreat({
          type: 'brute_force',
          severity: 'high',
          source: identifier,
          timestamp: Date.now(),
          details: { attempts: newAttempts }
        })
        return false
      }
    } else {
      // Reset on successful login
      this.suspiciousPatterns.delete(key)
    }

    return true
  }

  // IP blocking
  isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip)
  }

  blockIP(ip: string, reason: string): void {
    this.blockedIPs.add(ip)
    this.logThreat({
      type: 'suspicious_pattern',
      severity: 'medium',
      source: ip,
      timestamp: Date.now(),
      details: { reason, action: 'blocked' }
    })
  }

  unblockIP(ip: string): void {
    this.blockedIPs.delete(ip)
  }

  // Suspicious pattern detection
  detectSuspiciousPattern(identifier: string, pattern: string): boolean {
    const key = `pattern:${identifier}:${pattern}`
    const count = this.suspiciousPatterns.get(key) || 0
    const newCount = count + 1

    this.suspiciousPatterns.set(key, newCount)

    if (newCount >= this.policy.suspiciousActivityThreshold) {
      this.logThreat({
        type: 'suspicious_pattern',
        severity: 'medium',
        source: identifier,
        timestamp: Date.now(),
        details: { pattern, count: newCount }
      })
      return true
    }

    return false
  }

  // Input validation and sanitization
  validateInput(input: string, type: 'email' | 'username' | 'password' | 'general'): {
    valid: boolean
    sanitized: string
    errors: string[]
  } {
    const errors: string[] = []
    let sanitized = input.trim()

    // Basic sanitization
    sanitized = sanitized.replace(/[<>]/g, '')
    sanitized = sanitized.replace(/javascript:/gi, '')
    sanitized = sanitized.replace(/on\w+\s*=/gi, '')

    // Type-specific validation
    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(sanitized)) {
          errors.push('Invalid email format')
        }
        break

      case 'username':
        if (sanitized.length < 3 || sanitized.length > 30) {
          errors.push('Username must be between 3 and 30 characters')
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(sanitized)) {
          errors.push('Username can only contain letters, numbers, hyphens, and underscores')
        }
        break

      case 'password':
        if (sanitized.length < 8) {
          errors.push('Password must be at least 8 characters')
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(sanitized)) {
          errors.push('Password must contain at least one lowercase letter, one uppercase letter, and one number')
        }
        break

      case 'general':
        if (sanitized.length > 1000) {
          errors.push('Input too long')
        }
        break
    }

    return {
      valid: errors.length === 0,
      sanitized,
      errors
    }
  }

  // Security headers
  getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
    }
  }

  // Get security statistics
  getSecurityStats(): {
    totalThreats: number
    blockedIPs: number
    activePatterns: number
    recentThreats: SecurityThreat[]
  } {
    const recentThreats = this.threatLog
      .filter(threat => Date.now() - threat.timestamp < 24 * 60 * 60 * 1000) // Last 24 hours
      .slice(-10)

    return {
      totalThreats: this.threatLog.length,
      blockedIPs: this.blockedIPs.size,
      activePatterns: this.suspiciousPatterns.size,
      recentThreats
    }
  }

  // Cleanup old data
  cleanup(): void {
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours

    // Clean old rate limit records
    for (const [key, record] of this.rateLimitStore.entries()) {
      if (now > record.resetTime + maxAge) {
        this.rateLimitStore.delete(key)
      }
    }

    // Clean old threat logs
    this.threatLog = this.threatLog.filter(threat => now - threat.timestamp < maxAge)

    // Clean old suspicious patterns
    for (const [key, count] of this.suspiciousPatterns.entries()) {
      if (count === 0) {
        this.suspiciousPatterns.delete(key)
      }
    }
  }
}

// Global security manager instance
export const securityManager = new AdvancedSecurityManager()

// Utility functions
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

export function generateSecureToken(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function hashString(input: string): string {
  // Simple hash function - in production, use crypto.subtle.digest
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

// Type exports
export type { RateLimitConfig, SecurityThreat, SecurityPolicy }