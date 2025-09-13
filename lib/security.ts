// Security utilities for the AI social platform

/**
 * Input sanitization to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''

  return input
    .replace(/[<>\"']/g, (match) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;'
      }
      return entities[match] || match
    })
    .trim()
    .slice(0, 10000) // Limit input length
}

/**
 * Validate file uploads
 */
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File too large (max 10MB)' }
  }

  // Check for malicious file names
  const dangerousPatterns = /[<>:"/\\|?*\x00-\x1f]/
  if (dangerousPatterns.test(file.name)) {
    return { valid: false, error: 'Invalid file name' }
  }

  return { valid: true }
}

/**
 * Rate limiting functionality
 */
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map()

  isAllowed(identifier: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now()
    const attempt = this.attempts.get(identifier)

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (attempt.count >= maxAttempts) {
      return false
    }

    attempt.count++
    return true
  }

  getRemainingTime(identifier: string): number {
    const attempt = this.attempts.get(identifier)
    if (!attempt) return 0
    return Math.max(0, attempt.resetTime - Date.now())
  }
}

export const rateLimiter = new RateLimiter()

/**
 * Validate AI prompt content
 */
export function validatePrompt(prompt: string): { valid: boolean; error?: string } {
  if (!prompt || typeof prompt !== 'string') {
    return { valid: false, error: 'Prompt is required' }
  }

  const sanitized = sanitizeInput(prompt)

  if (sanitized.length < 10) {
    return { valid: false, error: 'Prompt too short (minimum 10 characters)' }
  }

  if (sanitized.length > 2000) {
    return { valid: false, error: 'Prompt too long (maximum 2000 characters)' }
  }

  // Check for harmful content patterns
  const harmfulPatterns = [
    /violence/i,
    /hate/i,
    /illegal/i,
    /(adult|nsfw|explicit)/i
  ]

  for (const pattern of harmfulPatterns) {
    if (pattern.test(sanitized)) {
      return { valid: false, error: 'Prompt contains inappropriate content' }
    }
  }

  return { valid: true }
}

/**
 * Generate secure session tokens
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

/**
 * Validate user session
 */
export function validateSession(sessionData: Record<string, unknown>): boolean {
  if (!sessionData || typeof sessionData !== 'object') return false

  const required = ['userId', 'timestamp', 'token']
  const hasRequired = required.every(field => sessionData[field])

  if (!hasRequired) return false

  // Check if session is expired (24 hours)
  const timestamp = sessionData.timestamp as number
  const sessionAge = Date.now() - timestamp
  const maxAge = 24 * 60 * 60 * 1000 // 24 hours

  return sessionAge < maxAge
}

/**
 * Content Security Policy headers
 */
export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.dicebear.com https://images.unsplash.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}