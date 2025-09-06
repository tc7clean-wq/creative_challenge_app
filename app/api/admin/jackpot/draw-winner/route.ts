import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { drawId } = body

    if (!drawId) {
      return NextResponse.json({ error: 'Draw ID is required' }, { status: 400 })
    }

    // Validate draw ID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(drawId)) {
      return NextResponse.json({ error: 'Invalid draw ID format' }, { status: 400 })
    }

    // Call the database function to select the winner
    const { data, error } = await supabase.rpc('select_jackpot_winner', {
      draw_id_param: drawId
    })

    if (error) {
      console.error('Error selecting jackpot winner:', error)
      return NextResponse.json({ 
        error: 'Failed to select winner',
        details: error.message 
      }, { status: 500 })
    }

    if (!data.success) {
      return NextResponse.json({ 
        error: data.error || 'Failed to select winner'
      }, { status: 400 })
    }

    // Log the draw for audit purposes
    console.log('Jackpot winner selected:', {
      drawId,
      winner: data.winner,
      draw: data.draw,
      timestamp: new Date().toISOString(),
      adminUserId: user.id
    })

    return NextResponse.json({
      success: true,
      message: 'Jackpot winner selected successfully',
      data: data
    })

  } catch (error) {
    console.error('Draw winner API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get all draws with their status
    const { data: draws, error } = await supabase
      .from('jackpot_draws')
      .select(`
        draw_id,
        draw_name,
        prize_amount,
        start_date,
        end_date,
        is_active,
        winner_user_id,
        draw_date,
        profiles!jackpot_draws_winner_user_id_fkey (
          username,
          display_name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching draws:', error)
      return NextResponse.json({ error: 'Failed to fetch draws' }, { status: 500 })
    }

    return NextResponse.json({ draws: draws || [] })

  } catch (error) {
    console.error('Get draws API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
