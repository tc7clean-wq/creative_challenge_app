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
      .from('comments')
      .select(`
        id,
        content,
        created_at,
        profiles!inner(username, full_name, avatar_url)
      `)
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
    }

    // Transform the data to ensure profiles is a single object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedData = data?.map((comment: Record<string, any>) => ({
      ...comment,
      profiles: Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles
    })) || []

    return NextResponse.json({ comments: transformedData })
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
    const { submission_id, content } = body

    if (!submission_id || !content) {
      return NextResponse.json({ error: 'Submission ID and content are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        submission_id,
        content: content.trim(),
        user_id: user.id
      })
      .select(`
        id,
        content,
        created_at,
        profiles!inner(username, full_name, avatar_url)
      `)
      .single()

    if (error) {
      console.error('Error creating comment:', error)
      return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
    }

    // Transform the data
    const transformedComment = {
      ...data,
      profiles: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles
    }

    return NextResponse.json({ comment: transformedComment })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
