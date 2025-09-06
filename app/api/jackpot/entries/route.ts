import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const requestedUserId = searchParams.get('user_id')
    
    // Security: Only allow users to view their own entries, or admins to view any
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    const isAdmin = userProfile?.role === 'admin'
    const userId = (requestedUserId && isAdmin) ? requestedUserId : user.id

    // Get user's jackpot entries
    const { data: entries, error } = await supabase
      .from('jackpot_entries')
      .select(`
        entry_id,
        competition_id,
        source_reason,
        entry_count,
        created_at,
        contests:competition_id (
          id,
          title
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching jackpot entries:', error)
      return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
    }

    // Get user's current total entries
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_jackpot_entries')
      .eq('id', userId)
      .single()

    return NextResponse.json({
      entries,
      total_entries: profile?.current_jackpot_entries || 0
    })
  } catch (error) {
    console.error('Jackpot entries API error:', error)
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

    const body = await request.json()
    const { source_reason, entry_count = 1, competition_id } = body

    // Validate source_reason
    const validReasons = [
      'FIRST_PLACE_WIN',
      'SECOND_PLACE_WIN', 
      'THIRD_PLACE_WIN',
      'BASE_SUBMISSION',
      'COMMUNITY_VOTE',
      'SOCIAL_SHARE',
      'DAILY_LOGIN',
      'REFERRAL',
      'MANUAL_ENTRY'
    ]

    if (!validReasons.includes(source_reason)) {
      return NextResponse.json({ error: 'Invalid source reason' }, { status: 400 })
    }

    // Add jackpot entries using the database function
    const { data, error } = await supabase.rpc('add_jackpot_entries', {
      user_uuid: user.id,
      source_reason_param: source_reason,
      entry_count_param: entry_count,
      competition_uuid: competition_id || null
    })

    if (error) {
      console.error('Error adding jackpot entries:', error)
      return NextResponse.json({ error: 'Failed to add entries' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      entry_id: data,
      message: `Added ${entry_count} jackpot ${entry_count === 1 ? 'entry' : 'entries'}`
    })
  } catch (error) {
    console.error('Add jackpot entries API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
