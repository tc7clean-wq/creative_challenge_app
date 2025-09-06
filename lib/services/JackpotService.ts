import { createClient } from '@/utils/supabase/server'

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

export class JackpotService {
  private supabase: any // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor() {
    this.supabase = null // Will be initialized in methods
  }

  private async getSupabaseClient() {
    if (!this.supabase) {
      this.supabase = await createClient()
    }
    return this.supabase
  }

  /**
   * Add jackpot entries for a user
   * @param data - Entry data including userId, reason, count, and optional competitionId
   * @returns Promise<JackpotEntryResult>
   */
  async addJackpotEntry(data: JackpotEntryData): Promise<JackpotEntryResult> {
    try {
      console.log('JackpotService: Adding entry', { 
        userId: data.userId, 
        reason: data.reason, 
        count: data.count, 
        competitionId: data.competitionId 
      })

      const supabase = await this.getSupabaseClient()

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
        console.error('JackpotService: Invalid reason provided', { reason: data.reason })
        return {
          success: false,
          error: `Invalid reason: ${data.reason}. Must be one of: ${validReasons.join(', ')}`
        }
      }

      // Validate count
      if (data.count <= 0 || data.count > 1000) {
        console.error('JackpotService: Invalid entry count', { count: data.count })
        return {
          success: false,
          error: 'Entry count must be between 1 and 1000'
        }
      }

      // Validate userId format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(data.userId)) {
        console.error('JackpotService: Invalid user ID format', { userId: data.userId })
        return {
          success: false,
          error: 'Invalid user ID format'
        }
      }

      // Use the database function to add entries atomically
      const { data: entryId, error: entryError } = await supabase.rpc('add_jackpot_entries', {
        user_uuid: data.userId,
        source_reason_param: data.reason,
        entry_count_param: data.count,
        competition_uuid: data.competitionId || null
      })

      if (entryError) {
        console.error('JackpotService: Error adding jackpot entry', { 
          error: entryError, 
          userId: data.userId, 
          reason: data.reason 
        })
        return {
          success: false,
          error: `Failed to add jackpot entry: ${entryError.message}`
        }
      }

      console.log('JackpotService: Entry added successfully', { entryId, userId: data.userId })

      // Get updated total entries for the user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('current_jackpot_entries')
        .eq('id', data.userId)
        .single()

      if (profileError) {
        console.error('JackpotService: Error fetching updated entry count', { 
          error: profileError, 
          userId: data.userId 
        })
        // Entry was added successfully, but we couldn't fetch the updated count
        return {
          success: true,
          entryId,
          error: 'Entry added but could not fetch updated count'
        }
      }

      const newTotal = profile?.current_jackpot_entries || 0
      console.log('JackpotService: Entry added successfully', { 
        entryId, 
        userId: data.userId, 
        newTotalEntries: newTotal 
      })

      return {
        success: true,
        entryId,
        newTotalEntries: newTotal
      }

    } catch (error) {
      console.error('JackpotService.addJackpotEntry error:', error)
      return {
        success: false,
        error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Add multiple jackpot entries in a batch
   * @param entries - Array of entry data
   * @returns Promise<JackpotEntryResult[]>
   */
  async addMultipleJackpotEntries(entries: JackpotEntryData[]): Promise<JackpotEntryResult[]> {
    const results: JackpotEntryResult[] = []
    
    for (const entry of entries) {
      const result = await this.addJackpotEntry(entry)
      results.push(result)
    }

    return results
  }

  /**
   * Get user's current jackpot entry count
   * @param userId - User ID
   * @returns Promise<number>
   */
  async getUserEntryCount(userId: string): Promise<number> {
    try {
      const supabase = await this.getSupabaseClient()
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('current_jackpot_entries')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user entry count:', error)
        return 0
      }

      return profile?.current_jackpot_entries || 0
    } catch (error) {
      console.error('JackpotService.getUserEntryCount error:', error)
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
      const supabase = await this.getSupabaseClient()
      
      const { data: entries, error } = await supabase
        .from('jackpot_entries')
        .select(`
          entry_id,
          competition_id,
          source_reason,
          entry_count,
          created_at,
          competitions (
            competition_id,
            title
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching user entry history:', error)
        return []
      }

      return entries || []
    } catch (error) {
      console.error('JackpotService.getUserEntryHistory error:', error)
      return []
    }
  }

  /**
   * Get active jackpot draw
   * @returns Promise<any | null>
   */
  async getActiveDraw(): Promise<any | null> { // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
      const supabase = await this.getSupabaseClient()
      
      const { data: activeDraw, error } = await supabase.rpc('get_active_jackpot_draw')

      if (error) {
        console.error('Error fetching active draw:', error)
        return null
      }

      return activeDraw && activeDraw.length > 0 ? activeDraw[0] : null
    } catch (error) {
      console.error('JackpotService.getActiveDraw error:', error)
      return null
    }
  }

  /**
   * Award entries for competition winners
   * @param competitionId - Competition ID
   * @param winners - Array of winner data with userId, place, and entryCount
   * @returns Promise<JackpotEntryResult[]>
   */
  async awardCompetitionWinners(competitionId: string, winners: Array<{userId: string, place: number, entryCount: number}>): Promise<JackpotEntryResult[]> {
    const entries: JackpotEntryData[] = winners.map(winner => ({
      userId: winner.userId,
      reason: this.getPlaceReason(winner.place),
      count: winner.entryCount,
      competitionId
    }))

    return this.addMultipleJackpotEntries(entries)
  }

  /**
   * Award entries for people's choice winner
   * @param userId - Winner's user ID
   * @param competitionId - Competition ID
   * @param entryCount - Number of entries to award (default 75)
   * @returns Promise<JackpotEntryResult>
   */
  async awardPeoplesChoiceWinner(userId: string, competitionId: string, entryCount: number = 75): Promise<JackpotEntryResult> {
    return this.addJackpotEntry({
      userId,
      reason: 'PEOPLES_CHOICE',
      count: entryCount,
      competitionId
    })
  }

  /**
   * Award entry for art submission
   * @param userId - User ID
   * @param competitionId - Competition ID
   * @returns Promise<JackpotEntryResult>
   */
  async awardArtSubmission(userId: string, competitionId: string): Promise<JackpotEntryResult> {
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
  async awardCommunityVote(userId: string, competitionId: string, entryCount: number = 1): Promise<JackpotEntryResult> {
    return this.addJackpotEntry({
      userId,
      reason: 'COMMUNITY_VOTE',
      count: entryCount,
      competitionId
    })
  }

  /**
   * Get reason string based on place
   * @param place - Place number (1, 2, 3, etc.)
   * @returns string
   */
  private getPlaceReason(place: number): string {
    switch (place) {
      case 1:
        return 'FIRST_PLACE_WIN'
      case 2:
        return 'SECOND_PLACE_WIN'
      case 3:
        return 'THIRD_PLACE_WIN'
      default:
        return 'COMMUNITY_VOTE' // For other places
    }
  }
}

// Export singleton instance
export const jackpotService = new JackpotService()
