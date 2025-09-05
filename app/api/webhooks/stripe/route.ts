import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import Stripe from 'stripe'

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
  })
}

const getEndpointSecret = () => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set')
  }
  return process.env.STRIPE_WEBHOOK_SECRET
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Stripe Webhooks API is running',
    methods: ['POST'],
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    const endpointSecret = getEndpointSecret()
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const metadata = session.metadata

        if (!metadata) {
          console.error('No metadata found in session')
          break
        }

        const userId = metadata.userId
        const type = metadata.type
        const amount = Number(metadata.amount)

        // Calculate revenue splits
        let platformCut = 0
        let prizePoolContribution = 0

        if (type === 'entry_fee') {
          platformCut = amount * 0.4
          prizePoolContribution = amount * 0.6
        } else if (['submission_pin', 'vote_multiplier', 'profile_boost'].includes(type)) {
          platformCut = amount * 0.2
          prizePoolContribution = amount * 0.8
        }

        // Insert revenue transaction
        const { error: revenueError } = await supabase
          .from('revenue_transactions')
          .insert([{
            user_id: userId,
            transaction_type: type,
            amount_paid: amount,
            platform_cut: platformCut,
            prize_pool_contribution: prizePoolContribution,
            contest_id: metadata.contestId || null,
            submission_id: metadata.submissionId || null
          }])

        if (revenueError) {
          console.error('Error inserting revenue transaction:', revenueError)
        }

        // Handle specific transaction types
        if (type === 'submission_pin') {
          const { error: pinError } = await supabase
            .from('submission_pins')
            .insert([{
              submission_id: metadata.submissionId,
              user_id: userId,
              amount_paid: amount,
              status: 'active'
            }])

          if (pinError) {
            console.error('Error creating submission pin:', pinError)
          }
        } else if (type === 'vote_multiplier') {
          const { error: multiplierError } = await supabase
            .from('vote_multipliers')
            .insert([{
              user_id: userId,
              submission_id: metadata.submissionId,
              contest_id: metadata.contestId,
              multiplier: Number(metadata.multiplier),
              amount_paid: amount
            }])

          if (multiplierError) {
            console.error('Error creating vote multiplier:', multiplierError)
          }
        } else if (type === 'profile_boost') {
          const { error: boostError } = await supabase
            .from('profile_boosts')
            .insert([{
              user_id: userId,
              boost_duration_hours: Number(metadata.duration),
              amount_paid: amount,
              status: 'active'
            }])

          if (boostError) {
            console.error('Error creating profile boost:', boostError)
          }
        }

        break
      }

      case 'payment_intent.succeeded': {
        // Handle successful payment
        console.log('Payment succeeded:', event.data.object.id)
        break
      }

      case 'payment_intent.payment_failed': {
        // Handle failed payment
        console.log('Payment failed:', event.data.object.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
