import { createClient } from '@/utils/supabase/client'

export interface JackpotEntryData {
  userId: string
  reason: string
  count: number
  competitionId?: string
}

export interface JackpotEntryResult {
  success: boolean
  entryId?: string
  error?: string
  newTotalEntries?: number
}

export class JackpotServiceClient {
  private supabase: any // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor() {
    this.supabase = createClient()
  }

  /**
   * Add jackpot entries for a user (client-side)
   * @param data - Entry data including userId, reason, count, and optional competitionId
   * @returns Promise<JackpotEntryResult>
   */
  async addJackpotEntry(data: JackpotEntryData): Promise<JackpotEntryResult> {
    try {
      // Validate reason
      const validReasons = [
        'FIRST_PLACE_WIN',
        'SECOND_PLACE_WIN', 
        'THIRD_PLACE_WIN',
        'BASE_SUBMISSION',
        'COMMUNITY_VOTE',
        'PEOPLES_CHOICE',
        'SOCIAL_SHARE',
        'DAILY_LOGIN',
        'REFERRAL',
        'MANUAL_ENTRY'
      ]

      if (!validReasons.includes(data.reason)) {
        return {
          success: false,
          error: `Invalid reason: ${data.reason}. Must be one of: ${validReasons.join(', ')}`
        }
      }

      // Validate count
      if (data.count <= 0) {
        return {
          success: false,
          error: 'Entry count must be greater than 0'
        }
      }

      // Use the API endpoint to add entries
      const response = await fetch('/api/jackpot/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_reason: data.reason,
          entry_count: data.count,
          competition_id: data.competitionId
        })
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Failed to add jackpot entry'
        }
      }

      // Get updated total entries
      const totalResponse = await fetch(`/api/jackpot/entries?user_id=${data.userId}`)
      const totalData = await totalResponse.json()

      return {
        success: true,
        entryId: result.entry_id,
        newTotalEntries: totalData.total_entries || 0
      }

    } catch (error) {
      console.error('JackpotServiceClient.addJackpotEntry error:', error)
      return {
        success: false,
        error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Award entry for art submission
   * @param userId - User ID
   * @param competitionId - Competition ID
   * @returns Promise<JackpotEntryResult>
   */
  async awardArtSubmission(userId: string, competitionId?: string): Promise<JackpotEntryResult> {
    return this.addJackpotEntry({
      userId,
      reason: 'BASE_SUBMISSION',
      count: 1,
      competitionId
    })
  }

  /**
   * Award entry for community vote
   * @param userId - User ID
   * @param competitionId - Competition ID
   * @param entryCount - Number of entries to award (default 1)
   * @returns Promise<JackpotEntryResult>
   */
  async awardCommunityVote(userId: string, competitionId?: string, entryCount: number = 1): Promise<JackpotEntryResult> {
    return this.addJackpotEntry({
      userId,
      reason: 'COMMUNITY_VOTE',
      count: entryCount,
      competitionId
    })
  }

  /**
   * Get user's current jackpot entry count
   * @param userId - User ID
   * @returns Promise<number>
   */
  async getUserEntryCount(userId: string): Promise<number> {
    try {
      const response = await fetch(`/api/jackpot/entries?user_id=${userId}`)
      const data = await response.json()
      return data.total_entries || 0
    } catch (error) {
      console.error('JackpotServiceClient.getUserEntryCount error:', error)
      return 0
    }
  }

  /**
   * Get user's jackpot entry history
   * @param userId - User ID
   * @param limit - Number of entries to return (default 50)
   * @returns Promise<any[]>
   */
  async getUserEntryHistory(userId: string, limit: number = 50): Promise<any[]> { // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
      const response = await fetch(`/api/jackpot/entries?user_id=${userId}&limit=${limit}`)
      const data = await response.json()
      return data.entries || []
    } catch (error) {
      console.error('JackpotServiceClient.getUserEntryHistory error:', error)
      return []
    }
  }

  /**
   * Get active jackpot draw
   * @returns Promise<any | null>
   */
  async getActiveDraw(): Promise<any | null> { // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
      const response = await fetch('/api/jackpot/active')
      const data = await response.json()
      return data.active_draw
    } catch (error) {
      console.error('JackpotServiceClient.getActiveDraw error:', error)
      return null
    }
  }
}

// Export singleton instance
export const jackpotServiceClient = new JackpotServiceClient()
