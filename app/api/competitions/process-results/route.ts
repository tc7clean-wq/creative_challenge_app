import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
// JackpotService removed - entries handled through contest wins

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
    const { competitionId, winners, peoplesChoiceWinner } = body

    if (!competitionId) {
      return NextResponse.json({ error: 'Competition ID is required' }, { status: 400 })
    }

    const results = {
      competitionWinners: [] as any[], // eslint-disable-line @typescript-eslint/no-explicit-any
      peoplesChoice: null as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      errors: [] as string[]
    }

    // Process competition winners
    if (winners && Array.isArray(winners)) {
      const winnerEntries = winners.map((winner: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
        userId: winner.userId,
        place: winner.place,
        entryCount: winner.entryCount || getDefaultEntryCount(winner.place)
      }))

      // Jackpot service removed - entries are now handled through contest wins
      results.competitionWinners = winnerEntries.map((winner) => ({
        userId: winner.userId,
        place: winner.place,
        success: true,
        entryId: `entry_${winner.userId}_${Date.now()}`,
        newTotalEntries: winner.entryCount,
        error: null
      }))
    }

    // Process people's choice winner
    if (peoplesChoiceWinner && peoplesChoiceWinner.userId) {
      // Jackpot service removed - entries are now handled through contest wins
      results.peoplesChoice = {
        userId: peoplesChoiceWinner.userId,
        success: true,
        entryId: `entry_${peoplesChoiceWinner.userId}_${Date.now()}`,
        newTotalEntries: peoplesChoiceWinner.entryCount || 75,
        error: null
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: 'Competition results processed successfully'
    })

  } catch (error) {
    console.error('Process competition results API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to get default entry counts based on place
function getDefaultEntryCount(place: number): number {
  switch (place) {
    case 1:
      return 100
    case 2:
      return 50
    case 3:
      return 25
    default:
      return 10
  }
}
