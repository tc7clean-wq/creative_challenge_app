import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import Stripe from 'stripe'
import { sanitizeText } from '@/lib/validation'

// Initialize Stripe only when needed
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

// Rate limiting for checkout attempts
const rateLimiters = new Map<string, { count: number; resetTime: number }>()

// Revenue split configuration (for future use)
// const REVENUE_SPLITS = {
//   entry_fee: { platform: 0.4, prize_pool: 0.6 },
//   submission_pin: { platform: 0.2, prize_pool: 0.8 },
//   vote_multiplier: { platform: 0.2, prize_pool: 0.8 },
//   profile_boost: { platform: 0.2, prize_pool: 0.8 }
// }

const checkRateLimit = (userId: string): boolean => {
  const now = Date.now()
  const record = rateLimiters.get(userId)
  
  if (!record || now > record.resetTime) {
    rateLimiters.set(userId, {
      count: 1,
      resetTime: now + 15 * 60 * 1000 // 15 minutes
    })
    return true
  }
  
  if (record.count >= 5) { // Max 5 checkout attempts per 15 minutes
    return false
  }
  
  record.count++
  return true
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Checkout API is running',
    methods: ['POST'],
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Rate limiting check
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: 'Too many checkout attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const { 
      packageId, 
      packageName, 
      price, 
      tier, 
      type
    } = body

    // Handle different payment types
    if (type === 'submission_pin') {
      return handleSubmissionPin(supabase, user, body, request)
    } else if (type === 'vote_multiplier') {
      return handleVoteMultiplier(supabase, user, body, request)
    } else if (type === 'profile_boost') {
      return handleProfileBoost(supabase, user, body, request)
    }

    // Original entry fee validation
    if (!packageId || !packageName || !price || !tier) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate and sanitize inputs
    const packageNameValidation = sanitizeText(packageName, 100)
    if (!packageNameValidation.isValid) {
      return NextResponse.json(
        { error: 'Invalid package name' },
        { status: 400 }
      )
    }

    const tierValidation = sanitizeText(tier, 50)
    if (!tierValidation.isValid) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      )
    }

    // Validate price
    const numericPrice = Number(price)
    if (isNaN(numericPrice) || numericPrice <= 0 || numericPrice > 1000) {
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      )
    }

    // Validate package ID format (should be a valid UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(packageId)) {
      return NextResponse.json(
        { error: 'Invalid package ID format' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const stripe = getStripe()
    // @ts-expect-error - Stripe types issue with payment_method_types
    const session = await (stripe.checkout.sessions.create as unknown)({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${packageNameValidation.sanitizedValue} - Creative Contest Entry`,
              description: `Submit your creative work with ${tierValidation.sanitizedValue} tier benefits`,
              images: ['https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Creative+Contest'],
            },
            unit_amount: Math.round(numericPrice * 100), // Convert to cents and ensure integer
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/submit/success?session_id={CHECKOUT_SESSION_ID}&tier=${encodeURIComponent(tierValidation.sanitizedValue!)}`,
      cancel_url: `${request.nextUrl.origin}/submit?canceled=true`,
      metadata: {
        userId: user.id,
        packageId,
        packageName: packageNameValidation.sanitizedValue,
        tier: tierValidation.sanitizedValue,
        price: numericPrice.toString(),
        timestamp: new Date().toISOString(),
      },
      customer_email: user.email,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    })

    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url 
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    
    // Don't expose internal errors to client in production
    const isProduction = process.env.NODE_ENV === 'production'
    const errorMessage = isProduction 
      ? 'Failed to create checkout session' 
      : error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

// Handler for submission pin payments
async function handleSubmissionPin(supabase: unknown, user: { id: string; email?: string }, body: Record<string, unknown>, request: NextRequest) {
  const { submissionId, contestId, amount } = body
  
  if (!submissionId || !contestId || !amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const stripe = getStripe()
  // @ts-expect-error - Stripe types issue with payment_method_types
  const session = await (stripe.checkout.sessions.create as unknown)({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Pin Submission to Top',
          description: 'Pin your submission to the top of the gallery for 6 hours',
        },
        unit_amount: amount,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: body.successUrl || `${request.nextUrl.origin}/submit/success?type=pin&submissionId=${submissionId}`,
    cancel_url: `${request.nextUrl.origin}/submit?canceled=true`,
    metadata: {
      userId: user.id,
      type: 'submission_pin',
      submissionId,
      contestId,
      amount: amount.toString(),
    },
    customer_email: user.email,
  })

  return NextResponse.json({ sessionId: session.id, url: session.url })
}

// Handler for vote multiplier payments
async function handleVoteMultiplier(supabase: unknown, user: { id: string; email?: string }, body: Record<string, unknown>, request: NextRequest) {
  const { submissionId, contestId, multiplier, amount } = body
  
  if (!submissionId || !contestId || !multiplier || !amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const stripe = getStripe()
  // @ts-expect-error - Stripe types issue with payment_method_types
  const session = await (stripe.checkout.sessions.create as unknown)({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${multiplier}x Super Vote`,
          description: `Make your vote count as ${multiplier} votes`,
        },
        unit_amount: amount,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: body.successUrl || `${request.nextUrl.origin}/submit/success?type=multiplier&submissionId=${submissionId}&multiplier=${multiplier}`,
    cancel_url: `${request.nextUrl.origin}/submit?canceled=true`,
    metadata: {
      userId: user.id,
      type: 'vote_multiplier',
      submissionId,
      contestId,
      multiplier: multiplier.toString(),
      amount: amount.toString(),
    },
    customer_email: user.email,
  })

  return NextResponse.json({ sessionId: session.id, url: session.url })
}

// Handler for profile boost payments
async function handleProfileBoost(supabase: unknown, user: { id: string; email?: string }, body: Record<string, unknown>, request: NextRequest) {
  const { userId, duration, amount } = body
  
  if (!userId || !duration || !amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const stripe = getStripe()
  // @ts-expect-error - Stripe types issue with payment_method_types
  const session = await (stripe.checkout.sessions.create as unknown)({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Profile Boost - ${duration} Hours`,
          description: `Boost your profile visibility for ${duration} hours`,
        },
        unit_amount: amount,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: body.successUrl || `${request.nextUrl.origin}/authenticated-home?boosted=true`,
    cancel_url: `${request.nextUrl.origin}/authenticated-home?canceled=true`,
    metadata: {
      userId: user.id,
      type: 'profile_boost',
      duration: duration.toString(),
      amount: amount.toString(),
    },
    customer_email: user.email,
  })

  return NextResponse.json({ sessionId: session.id, url: session.url })
}
