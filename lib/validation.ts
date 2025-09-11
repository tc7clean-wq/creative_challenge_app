import { z } from 'zod'

// Common validation schemas for AI ArtVerse platform

// User-related schemas
export const userProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  avatar_url: z.string().url('Invalid avatar URL').optional(),
})

// Art submission schemas
export const artSubmissionSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  image_url: z.string().url('Invalid image URL'),
  ai_model: z.string()
    .min(1, 'AI model is required')
    .max(50, 'AI model name must be less than 50 characters'),
  prompt: z.string()
    .min(1, 'Prompt is required')
    .max(2000, 'Prompt must be less than 2000 characters'),
  negative_prompt: z.string()
    .max(1000, 'Negative prompt must be less than 1000 characters')
    .optional(),
  seed: z.number().int().optional(),
  steps: z.number().int().min(1).max(100).optional(),
  cfg_scale: z.number().min(1).max(20).optional(),
  tags: z.array(z.string().max(30)).max(10, 'Maximum 10 tags allowed').optional(),
  is_nsfw: z.boolean().default(false),
  contest_id: z.string().uuid().optional(),
})

// Contest schemas
export const contestSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be less than 2000 characters'),
  theme: z.string()
    .min(1, 'Theme is required')
    .max(100, 'Theme must be less than 100 characters'),
  start_date: z.string().datetime('Invalid start date'),
  end_date: z.string().datetime('Invalid end date'),
  max_submissions: z.number().int().min(1).max(1000).optional(),
  prize_pool: z.number().min(0).optional(),
  rules: z.array(z.string().max(200)).max(20, 'Maximum 20 rules allowed').optional(),
  allowed_models: z.array(z.string()).optional(),
  is_featured: z.boolean().default(false),
})

// Comment schemas
export const commentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment must be less than 500 characters'),
  parent_id: z.string().uuid().optional(), // For replies
})

// Vote schemas
export const voteSchema = z.object({
  type: z.enum(['like', 'dislike', 'favorite']),
  target_type: z.enum(['submission', 'comment']),
  target_id: z.string().uuid(),
})

// Search and filter schemas
export const searchSchema = z.object({
  query: z.string().max(100, 'Search query too long').optional(),
  tags: z.array(z.string()).max(10).optional(),
  ai_model: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'popular', 'trending']).default('newest'),
  time_range: z.enum(['day', 'week', 'month', 'year', 'all']).default('all'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
})

// Report schemas
export const reportSchema = z.object({
  target_type: z.enum(['submission', 'comment', 'user']),
  target_id: z.string().uuid(),
  reason: z.enum([
    'inappropriate_content',
    'copyright_infringement', 
    'spam',
    'harassment',
    'fake_content',
    'other'
  ]),
  description: z.string()
    .min(10, 'Please provide more details')
    .max(500, 'Description must be less than 500 characters'),
})

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
})

// Validation helper functions
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: true
  data: T
} | {
  success: false
  errors: z.ZodError
} {
  try {
    const validData = schema.parse(data)
    return { success: true, data: validData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

export function createValidationErrorResponse(errors: z.ZodError) {
  return {
    success: false,
    error: 'Validation failed',
    details: errors.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    })),
  }
}

// Sanitization helpers
export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 100)
}

export function sanitizeText(text: string, maxLength?: number): {
  isValid: boolean
  sanitizedValue: string | null
  error?: string
} {
  if (!text || typeof text !== 'string') {
    return { isValid: false, sanitizedValue: null, error: 'Text must be a string' }
  }

  // Remove any HTML tags and dangerous characters
  const sanitized = text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>&"']/g, '') // Remove dangerous characters
    .trim()

  // Check length constraint
  if (maxLength && sanitized.length > maxLength) {
    return { 
      isValid: false, 
      sanitizedValue: null, 
      error: `Text must be ${maxLength} characters or less` 
    }
  }

  // Check if text is empty after sanitization
  if (sanitized.length === 0) {
    return { 
      isValid: false, 
      sanitizedValue: null, 
      error: 'Text cannot be empty' 
    }
  }

  return { isValid: true, sanitizedValue: sanitized }
}

// Rate limiting helpers
export interface RateLimitRule {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

export const rateLimitRules: Record<string, RateLimitRule> = {
  'api.submissions.create': { windowMs: 60000, maxRequests: 5 }, // 5 per minute
  'api.comments.create': { windowMs: 60000, maxRequests: 10 }, // 10 per minute
  'api.votes.create': { windowMs: 60000, maxRequests: 50 }, // 50 per minute
  'api.auth.login': { windowMs: 900000, maxRequests: 5 }, // 5 per 15 minutes
  'api.search': { windowMs: 60000, maxRequests: 100 }, // 100 per minute
}