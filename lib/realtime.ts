// Advanced real-time system with Supabase subscriptions and WebSockets
import { createClient } from '@/utils/supabase/client'

interface RealtimeEvent<T = unknown> {
  event: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: T
  old_record?: T
  timestamp: string
}

interface PresenceState {
  user_id: string
  username: string
  status: 'online' | 'away' | 'busy'
  last_seen: string
}

interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  data?: Record<string, unknown>
  is_read: boolean
  created_at: string
}

class RealtimeManager {
  private supabase = createClient()
  private subscriptions = new Map<string, () => void>()
  private presenceChannel: unknown = null
  private isConnected = false

  constructor() {
    this.setupConnection()
  }

  private setupConnection() {
    this.supabase.realtime.connect()
    this.isConnected = true
  }

  subscribeToTable<T = unknown>(
    table: string,
    callback: (event: RealtimeEvent<T>) => void,
    filter?: { column: string; value: string }
  ) {
    const subscriptionKey = `${table}:${filter ? `${filter.column}=${filter.value}` : 'all'}`
    
    if (this.subscriptions.has(subscriptionKey)) {
      this.subscriptions.get(subscriptionKey)?.()
    }

    const channel = this.supabase
      .channel(`table:${table}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table,
          filter: filter ? `${filter.column}=eq.${filter.value}` : undefined
        }, 
        (payload) => {
          const event: RealtimeEvent<T> = {
            event: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
            table: payload.table,
            record: payload.new as T,
            old_record: payload.old as T,
            timestamp: new Date().toISOString()
          }
          callback(event)
        }
      )
      .subscribe()

    this.subscriptions.set(subscriptionKey, () => {
      this.supabase.removeChannel(channel)
    })

    return () => {
      this.subscriptions.get(subscriptionKey)?.()
      this.subscriptions.delete(subscriptionKey)
    }
  }

  subscribeToSubmissions(callback: (event: RealtimeEvent) => void, contestId?: string) {
    return this.subscribeToTable('submissions', callback, contestId ? { column: 'contest_id', value: contestId } : undefined)
  }

  subscribeToVotes(callback: (event: RealtimeEvent) => void, submissionId?: string) {
    return this.subscribeToTable('votes', callback, submissionId ? { column: 'submission_id', value: submissionId } : undefined)
  }

  subscribeToComments(callback: (event: RealtimeEvent) => void, submissionId?: string) {
    return this.subscribeToTable('comments', callback, submissionId ? { column: 'submission_id', value: submissionId } : undefined)
  }

  subscribeToContests(callback: (event: RealtimeEvent) => void) {
    return this.subscribeToTable('contests', callback)
  }

  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    return this.subscribeToTable('notifications', (event) => {
      if (event.event === 'INSERT' && event.record) {
        const notification = event.record as Notification
        if (notification.user_id === userId) {
          callback(notification)
        }
      }
    }, { column: 'user_id', value: userId })
  }

  // Presence management
  async joinPresence(userId: string, username: string, status: 'online' | 'away' | 'busy' = 'online') {
    if (this.presenceChannel) {
      await this.leavePresence()
    }

    this.presenceChannel = this.supabase
      .channel('presence')
      .on('presence', { event: 'sync' }, () => {
        const state = this.presenceChannel.presenceState()
        console.log('Presence state:', state)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences)
      })
      .subscribe(async () => {
        if (true) {
          await this.presenceChannel.track({
            user_id: userId,
            username,
            status,
            last_seen: new Date().toISOString()
          })
        }
      })
  }

  async leavePresence() {
    if (this.presenceChannel) {
      await this.presenceChannel.untrack()
      this.supabase.removeChannel(this.presenceChannel)
      this.presenceChannel = null
    }
  }

  async updatePresenceStatus(status: 'online' | 'away' | 'busy') {
    if (this.presenceChannel) {
      await this.presenceChannel.track({
        status,
        last_seen: new Date().toISOString()
      })
    }
  }

  // Cleanup
  disconnect() {
    this.subscriptions.forEach(unsubscribe => unsubscribe())
    this.subscriptions.clear()
    
    if (this.presenceChannel) {
      this.supabase.removeChannel(this.presenceChannel)
      this.presenceChannel = null
    }
    
    this.supabase.realtime.disconnect()
    this.isConnected = false
  }

  isRealtimeConnected(): boolean {
    return this.isConnected
  }
}

// Global realtime manager instance
export const realtime = new RealtimeManager()

// Utility functions
export function createRealtimeSubscription<T>(
  table: string,
  callback: (event: RealtimeEvent<T>) => void,
  filter?: { column: string; value: string }
) {
  return realtime.subscribeToTable(table, callback, filter)
}

export function cleanupRealtime() {
  realtime.disconnect()
}

// Type exports
export type { RealtimeEvent, PresenceState, Notification }