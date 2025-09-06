import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { jackpotService } from '@/lib/services/JackpotService'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { submissionId, category } = body

    if (!submissionId || !category) {
      return NextResponse.json({ error: 'Submission ID and category are required' }, { status: 400 })
    }

    // Validate submissionId format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission ID format' }, { status: 400 })
    }

    // Validate category
    const validCategories = ['community_vote', 'judge_vote', 'peoples_choice']
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    // Check if user has already voted on this submission in this category
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('submission_id', submissionId)
      .eq('voter_id', user.id)
      .eq('category', category)
      .single()

    if (existingVote) {
      return NextResponse.json({ error: 'You have already voted on this submission in this category' }, { status: 400 })
    }

    // Get submission details to find the competition
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .select('contest_id, user_id')
      .eq('id', submissionId)
      .single()

    if (submissionError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    // Create the vote
    const { error: voteError } = await supabase
      .from('votes')
      .insert({
        submission_id: submissionId,
        voter_id: user.id,
        category: category
      })

    if (voteError) {
      console.error('Error creating vote:', voteError)
      return NextResponse.json({ error: 'Failed to create vote' }, { status: 500 })
    }

    // Update submission vote count
    const { error: updateError } = await supabase.rpc('increment_vote_count', {
      submission_id: submissionId
    })

    if (updateError) {
      console.error('Error updating vote count:', updateError)
      // Don't fail the vote if count update fails
    }

    // Award jackpot entry for community vote
    try {
      const jackpotResult = await jackpotService.awardCommunityVote(
        submission.user_id, // The artist who received the vote
        submission.contest_id,
        1 // 1 entry per vote
      )
      
      if (jackpotResult.success) {
        console.log(`Awarded jackpot entry to artist ${submission.user_id} for community vote`)
      } else {
        console.error('Failed to award jackpot entry for vote:', jackpotResult.error)
      }
    } catch (jackpotError) {
      console.error('Error awarding jackpot entry for vote:', jackpotError)
      // Don't fail the vote if jackpot entry fails
    }

    return NextResponse.json({
      success: true,
      message: 'Vote recorded successfully'
    })

  } catch (error) {
    console.error('Vote API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const submissionId = searchParams.get('submission_id')

    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 })
    }

    // Get votes for the submission
    const { data: votes, error } = await supabase
      .from('votes')
      .select(`
        id,
        category,
        created_at,
        profiles!votes_voter_id_fkey (
          username,
          display_name
        )
      `)
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching votes:', error)
      return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 })
    }

    return NextResponse.json({ votes: votes || [] })

  } catch (error) {
    console.error('Get votes API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
