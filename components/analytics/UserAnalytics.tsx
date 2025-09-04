'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

interface UserStats {
  total_submissions: number
  total_votes_received: number
  total_comments_received: number
  total_views: number
  contest_wins: number
  total_earnings: number
}

interface RecentActivity {
  id: string
  type: 'vote' | 'comment' | 'view' | 'win'
  artwork_title: string
  created_at: string
  value?: number
}

export default function UserAnalytics({ userId }: { userId: string }) {
  const [stats, setStats] = useState<UserStats>({
    total_submissions: 0,
    total_votes_received: 0,
    total_comments_received: 0,
    total_views: 0,
    contest_wins: 0,
    total_earnings: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch user stats
      const { data: statsData } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (statsData) {
        setStats(statsData)
      }

      // Fetch recent activity
      const { data: activityData } = await supabase
        .from('user_activity')
        .select(`
          id,
          type,
          artwork_title,
          created_at,
          value
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10)

      setRecentActivity(activityData || [])
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }, [userId, supabase])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Submissions',
      value: stats.total_submissions,
      icon: '🎨',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Votes Received',
      value: stats.total_votes_received,
      icon: '❤️',
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Comments Received',
      value: stats.total_comments_received,
      icon: '💬',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Total Views',
      value: stats.total_views,
      icon: '👀',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Contest Wins',
      value: stats.contest_wins,
      icon: '🏆',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Total Earnings',
      value: `$${stats.total_earnings}`,
      icon: '💰',
      color: 'from-green-600 to-green-500'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vote': return '❤️'
      case 'comment': return '💬'
      case 'view': return '👀'
      case 'win': return '🏆'
      default: return '📊'
    }
  }

  const getActivityText = (activity: RecentActivity) => {
    switch (activity.type) {
      case 'vote':
        return `Received a vote on "${activity.artwork_title}"`
      case 'comment':
        return `New comment on "${activity.artwork_title}"`
      case 'view':
        return `"${activity.artwork_title}" was viewed`
      case 'win':
        return `Won contest with "${activity.artwork_title}" ($${activity.value})`
      default:
        return 'New activity'
    }
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{stat.icon}</div>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
            <div className="text-gray-300 text-sm uppercase tracking-wide">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">📊</div>
            <p>No recent activity to show</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="text-white">{getActivityText(activity)}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </p>
                </div>
                {activity.value && (
                  <div className="text-green-400 font-semibold">
                    +${activity.value}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Performance Over Time</h3>
        <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-2">📈</div>
            <p>Chart visualization coming soon</p>
            <p className="text-sm">Track your growth over time</p>
          </div>
        </div>
      </div>
    </div>
  )
}
