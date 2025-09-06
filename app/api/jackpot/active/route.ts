import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get active jackpot draw using the database function
    const { data: activeDraw, error } = await supabase.rpc('get_active_jackpot_draw')

    if (error) {
      console.error('Error fetching active jackpot draw:', error)
      return NextResponse.json({ error: 'Failed to fetch active draw' }, { status: 500 })
    }

    if (!activeDraw || activeDraw.length === 0) {
      return NextResponse.json({ 
        active_draw: null,
        message: 'No active jackpot draw'
      })
    }

    return NextResponse.json({ 
      active_draw: activeDraw[0]
    })
  } catch (error) {
    console.error('Active jackpot draw API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
