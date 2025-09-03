// Input validation and sanitization utilities

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  sanitizedValue?: string
}

// File validation
export const validateFile = (file: File): ValidationResult => {
  const errors: string[] = []
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    errors.push('File type not supported. Please use JPEG, PNG, GIF, or WebP.')
  }
  
  // Check file size (10MB max)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    errors.push('File size must be less than 10MB.')
  }
  
  // Check file name
  if (file.name.length > 255) {
    errors.push('File name is too long.')
  }
  
  // Check for potentially malicious file names
  const dangerousPatterns = /[<>:"/\\|?*\x00-\x1f]/g
  if (dangerousPatterns.test(file.name)) {
    errors.push('File name contains invalid characters.')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: file.name.replace(dangerousPatterns, '_')
  }
}

// Text input sanitization
export const sanitizeText = (input: string, maxLength: number = 1000): ValidationResult => {
  const errors: string[] = []
  
  if (!input || typeof input !== 'string') {
    errors.push('Input must be a valid string.')
    return { isValid: false, errors }
  }
  
  if (input.length > maxLength) {
    errors.push(`Input must be less than ${maxLength} characters.`)
  }
  
  // Remove potentially dangerous HTML/script tags
  const sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: sanitized
  }
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = []
  
  if (!email || typeof email !== 'string') {
    errors.push('Email is required.')
    return { isValid: false, errors }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address.')
  }
  
  if (email.length > 254) {
    errors.push('Email address is too long.')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: email.toLowerCase().trim()
  }
}

// Username validation
export const validateUsername = (username: string): ValidationResult => {
  const errors: string[] = []
  
  if (!username || typeof username !== 'string') {
    errors.push('Username is required.')
    return { isValid: false, errors }
  }
  
  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long.')
  }
  
  if (username.length > 30) {
    errors.push('Username must be less than 30 characters long.')
  }
  
  // Only allow alphanumeric characters, underscores, and hyphens
  const usernameRegex = /^[a-zA-Z0-9_-]+$/
  if (!usernameRegex.test(username)) {
    errors.push('Username can only contain letters, numbers, underscores, and hyphens.')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: username.toLowerCase().trim()
  }
}

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map()
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const record = this.attempts.get(identifier)
    
    if (!record || now > record.resetTime) {
      // Reset or create new record
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      })
      return true
    }
    
    if (record.count >= this.maxAttempts) {
      return false
    }
    
    record.count++
    return true
  }
  
  getRemainingAttempts(identifier: string): number {
    const record = this.attempts.get(identifier)
    if (!record || Date.now() > record.resetTime) {
      return this.maxAttempts
    }
    return Math.max(0, this.maxAttempts - record.count)
  }
  
  getResetTime(identifier: string): number | null {
    const record = this.attempts.get(identifier)
    return record ? record.resetTime : null
  }
}

// Environment variable validation
export const validateEnvironment = (): ValidationResult => {
  const errors: string[] = []
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY'
  ]
  
  for (const varName of required) {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
