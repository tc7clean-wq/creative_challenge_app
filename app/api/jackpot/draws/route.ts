import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active_only') === 'true'

    let query = supabase
      .from('jackpot_draws')
      .select(`
        draw_id,
        draw_name,
        prize_amount,
        start_date,
        end_date,
        winner_user_id,
        is_active,
        draw_date,
        profiles!jackpot_draws_winner_user_id_fkey (
          username,
          display_name
        )
      `)
      .order('created_at', { ascending: false })

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data: draws, error } = await query

    if (error) {
      console.error('Error fetching jackpot draws:', error)
      return NextResponse.json({ error: 'Failed to fetch draws' }, { status: 500 })
    }

    return NextResponse.json({ draws })
  } catch (error) {
    console.error('Jackpot draws API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
    const { draw_name, prize_amount, start_date, end_date } = body

    // Validate required fields
    if (!draw_name || !prize_amount || !start_date || !end_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate dates
    const start = new Date(start_date)
    const end = new Date(end_date)
    
    if (end <= start) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 })
    }

    // Create new jackpot draw
    const { data, error } = await supabase
      .from('jackpot_draws')
      .insert({
        draw_name,
        prize_amount: parseFloat(prize_amount),
        start_date: start.toISOString(),
        end_date: end.toISOString(),
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating jackpot draw:', error)
      return NextResponse.json({ error: 'Failed to create draw' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      draw: data,
      message: 'Jackpot draw created successfully'
    })
  } catch (error) {
    console.error('Create jackpot draw API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
