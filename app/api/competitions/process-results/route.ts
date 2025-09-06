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

      try {
        const jackpotResults = await jackpotService.awardCompetitionWinners(competitionId, winnerEntries)
        results.competitionWinners = jackpotResults.map((result, index) => ({
          userId: winnerEntries[index].userId,
          place: winnerEntries[index].place,
          success: result.success,
          entryId: result.entryId,
          newTotalEntries: result.newTotalEntries,
          error: result.error
        }))
      } catch (error) {
        results.errors.push(`Failed to process competition winners: ${error}`)
      }
    }

    // Process people's choice winner
    if (peoplesChoiceWinner && peoplesChoiceWinner.userId) {
      try {
        const jackpotResult = await jackpotService.awardPeoplesChoiceWinner(
          peoplesChoiceWinner.userId,
          competitionId,
          peoplesChoiceWinner.entryCount || 75
        )
        results.peoplesChoice = {
          userId: peoplesChoiceWinner.userId,
          success: jackpotResult.success,
          entryId: jackpotResult.entryId,
          newTotalEntries: jackpotResult.newTotalEntries,
          error: jackpotResult.error
        }
      } catch (error) {
        results.errors.push(`Failed to process people's choice winner: ${error}`)
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
