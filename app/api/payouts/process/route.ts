import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Payouts API is running',
    methods: ['POST'],
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    const { payoutIds, batchId } = await request.json()
    
    if (!payoutIds || !Array.isArray(payoutIds) || payoutIds.length === 0) {
      return NextResponse.json({ error: 'Invalid payout IDs' }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify admin authorization
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

        // Controlled admin access - only authorized users can process payouts
    const isAdmin = profile?.is_admin || (user.email && user.email.endsWith('@creativechallenge.app'))

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get payout details
    const { data: payouts, error: fetchError } = await supabase
      .from('contest_payouts')
      .select(`
        *,
        artist_accounts(chime_username, paypal_email, stripe_account_id, payout_method)
      `)
      .in('id', payoutIds)
      .eq('payout_status', 'processing')

    if (fetchError) {
      console.error('Error fetching payouts:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch payouts' }, { status: 500 })
    }

    if (!payouts || payouts.length === 0) {
      return NextResponse.json({ error: 'No valid payouts found' }, { status: 404 })
    }

    const results = []

    for (const payout of payouts) {
      try {
        const account = payout.artist_accounts
        let success = false
        let externalTransactionId = null
        let failureReason = null

        // Process based on payout method
        if (account?.payout_method === 'chime') {
          // For Chime, we'll simulate the transfer
          // In a real implementation, you'd integrate with Chime's API
          success = await processChimePayout(payout, account.chime_username)
          externalTransactionId = `chime_${Date.now()}_${payout.id}`
        } else if (account?.payout_method === 'paypal') {
          // For PayPal, we'll simulate the transfer
          // In a real implementation, you'd integrate with PayPal's API
          success = await processPayPalPayout(payout, account.paypal_email)
          externalTransactionId = `paypal_${Date.now()}_${payout.id}`
        } else if (account?.payout_method === 'stripe') {
          // For Stripe, we'll simulate the transfer
          // In a real implementation, you'd use Stripe's transfer API
          success = await processStripePayout(payout, account.stripe_account_id)
          externalTransactionId = `stripe_${Date.now()}_${payout.id}`
        }

        // Update payout status
        const { error: updateError } = await supabase
          .from('contest_payouts')
          .update({
            payout_status: success ? 'paid' : 'failed',
            external_transaction_id: externalTransactionId,
            payout_date: success ? new Date().toISOString() : null,
            failure_reason: failureReason
          })
          .eq('id', payout.id)

        if (updateError) {
          console.error('Error updating payout:', updateError)
          failureReason = 'Database update failed'
        }

        results.push({
          payoutId: payout.id,
          success,
          externalTransactionId,
          failureReason
        })

        // Create notification for user
        if (success) {
          await supabase
            .from('payout_notifications')
            .insert([{
              user_id: payout.user_id,
              contest_id: payout.contest_id,
              payout_id: payout.id,
              notification_type: 'payout_completed',
              title: '💰 Payout Completed!',
              message: `Your payout of $${payout.net_amount} has been successfully processed and sent to your ${account?.payout_method} account.`
            }])
        } else {
          await supabase
            .from('payout_notifications')
            .insert([{
              user_id: payout.user_id,
              contest_id: payout.contest_id,
              payout_id: payout.id,
              notification_type: 'payout_failed',
              title: '❌ Payout Failed',
              message: `Your payout of $${payout.net_amount} failed to process. Please check your ${account?.payout_method} account details and try again.`
            }])
        }

      } catch (error) {
        console.error('Error processing payout:', error)
        results.push({
          payoutId: payout.id,
          success: false,
          failureReason: 'Processing error'
        })
      }
    }

    // Update batch status if provided
    if (batchId) {
      const successfulPayouts = results.filter(r => r.success).length
      const totalPayouts = results.length
      
      let batchStatus = 'completed'
      if (successfulPayouts === 0) {
        batchStatus = 'failed'
      } else if (successfulPayouts < totalPayouts) {
        batchStatus = 'partial'
      }

      await supabase
        .from('payout_batches')
        .update({
          status: batchStatus,
          processed_at: new Date().toISOString()
        })
        .eq('id', batchId)
    }

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    })

  } catch (error) {
    console.error('Payout processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Simulate payout processing functions
async function processChimePayout(payout: { net_amount: number; id: string }, chimeUsername: string): Promise<boolean> {
  // Simulate Chime API call
  // In reality, you'd make an API call to Chime's transfer service
  console.log(`Processing Chime payout: $${payout.net_amount} to @${chimeUsername}`)
  
  // Simulate 95% success rate
  return Math.random() > 0.05
}

async function processPayPalPayout(payout: { net_amount: number; id: string }, paypalEmail: string): Promise<boolean> {
  // Simulate PayPal API call
  // In reality, you'd make an API call to PayPal's payout service
  console.log(`Processing PayPal payout: $${payout.net_amount} to ${paypalEmail}`)
  
  // Simulate 90% success rate
  return Math.random() > 0.1
}

async function processStripePayout(payout: { net_amount: number; id: string }, stripeAccountId: string): Promise<boolean> {
  // Simulate Stripe API call
  // In reality, you'd use Stripe's transfer API
  console.log(`Processing Stripe payout: $${payout.net_amount} to ${stripeAccountId}`)
  
  // Simulate 95% success rate
  return Math.random() > 0.05
}
