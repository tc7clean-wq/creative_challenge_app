import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const submissionId = searchParams.get('submission_id')

    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 })
    }

    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('likes')
      .select('id, user_id')
      .eq('submission_id', submissionId)

    if (error) {
      console.error('Error fetching likes:', error)
      return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 })
    }

    return NextResponse.json({ likes: data || [] })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { submission_id, action } = body // action: 'like' or 'unlike'

    if (!submission_id || !action) {
      return NextResponse.json({ error: 'Submission ID and action are required' }, { status: 400 })
    }

    if (action === 'like') {
      const { data, error } = await supabase
        .from('likes')
        .insert({
          submission_id,
          user_id: user.id
        })
        .select('id')
        .single()

      if (error) {
        // If it's a duplicate key error, the user already liked this
        if (error.code === '23505') {
          return NextResponse.json({ error: 'Already liked' }, { status: 400 })
        }
        console.error('Error creating like:', error)
        return NextResponse.json({ error: 'Failed to create like' }, { status: 500 })
      }

      return NextResponse.json({ success: true, like: data })
    } else if (action === 'unlike') {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('submission_id', submission_id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error removing like:', error)
        return NextResponse.json({ error: 'Failed to remove like' }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
