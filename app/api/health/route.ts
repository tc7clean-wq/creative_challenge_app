import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
      stripeSecret: !!process.env.STRIPE_SECRET_KEY,
      stripePublishable: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      stripeWebhook: !!process.env.STRIPE_WEBHOOK_SECRET,
      openaiKey: !!process.env.OPENAI_API_KEY,
      nodeEnv: process.env.NODE_ENV
    }

    const allEnvVarsPresent = Object.values(envCheck).every(value => 
      typeof value === 'boolean' ? value : true
    )

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      checks: {
        environment: allEnvVarsPresent ? 'pass' : 'fail',
        api: 'pass',
        database: 'unknown', // Would need actual DB check
        stripe: envCheck.stripeSecret && envCheck.stripePublishable ? 'pass' : 'fail'
      },
      environment_variables: envCheck
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
