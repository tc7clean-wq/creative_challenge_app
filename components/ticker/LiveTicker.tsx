'use client'

import { useState, useEffect } from 'react'

interface TickerItem {
  id: string
  text: string
  amount: number
  type: 'submission' | 'vote' | 'contest' | 'achievement' | 'inspiration'
}

export default function LiveTicker() {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])
  const [communityStats, setCommunityStats] = useState({
    totalArtists: 0,
    totalArtworks: 0,
    totalVotes: 0,
    activeContests: 0
  })

  useEffect(() => {
    // Generate encouraging and engaging messages
    const generateTickerItem = (): TickerItem => {
      const types = ['submission', 'vote', 'contest', 'achievement', 'inspiration'] as const
      const type = types[Math.floor(Math.random() * types.length)]
      
      const items = {
        submission: [
          '🎨 New masterpiece uploaded! "Digital Dreams" is absolutely stunning',
          '✨ Creative genius strikes again! "Cosmic Journey" just dropped',
          '🌟 Another incredible artwork! "Urban Legends" is pure magic',
          '🎭 Artistic brilliance! "Fantasy Realm" takes our breath away',
          '🌈 Stunning creativity! "Ocean Waves" is mesmerizing',
          '🔥 Amazing talent! "Sunset Dreams" is pure artistry',
          '💫 Creative vision! "Abstract Harmony" is thought-provoking',
          '🎪 Incredible skill! "Circus of Colors" is vibrant and alive'
        ],
        vote: [
          '💖 Community showing love! "Digital Dreams" got 50+ votes',
          '👏 Amazing support! "Cosmic Journey" is trending',
          '❤️ Heartwarming! "Urban Legends" touched many hearts',
          '🌟 Community favorite! "Fantasy Realm" is beloved',
          '🔥 Hot pick! "Ocean Waves" is making waves',
          '⭐ Star quality! "Sunset Dreams" is shining bright',
          '💎 Gem discovered! "Abstract Harmony" is treasured',
          '🎉 Celebration! "Circus of Colors" is partying'
        ],
        contest: [
          '🚀 New challenge launched! "Street Art Revolution" is here',
          '🎯 Contest extended! More time for "Portrait Masters"',
          '🏆 Milestone reached! "Nature Photography" hit 1000 entries',
          '🌟 New tier unlocked! "Digital Art Showdown" expanded',
          '🎪 Community celebration! "Fantasy Art" reached new heights',
          '🔥 Hot contest! "Abstract Expression" is heating up',
          '💫 Special event! "Color Theory Challenge" is live',
          '🎨 Creative explosion! "Mixed Media Madness" is wild'
        ],
        achievement: [
          '🏅 New artist joined! Welcome to our creative family',
          '🎖️ First artwork uploaded! The journey begins',
          '🥇 100 votes milestone! Community loves your work',
          '🏆 Featured artist! Your talent is recognized',
          '⭐ Rising star! Your art is trending',
          '💎 Hidden gem! Your unique style is discovered',
          '🌟 Creative breakthrough! Your vision is evolving',
          '🎭 Artistic growth! Your skills are improving'
        ],
        inspiration: [
          '💡 "Creativity takes courage" - Keep pushing boundaries!',
          '🌈 "Art washes away the dust of everyday life" - Keep creating!',
          '✨ "Every artist was first an amateur" - You\'re growing!',
          '🎨 "Art is not what you see, but what you make others see" - Inspire!',
          '🌟 "Creativity is intelligence having fun" - Enjoy the process!',
          '💫 "The purpose of art is washing the dust of daily life off our souls" - Keep going!',
          '🔥 "Art enables us to find ourselves and lose ourselves at the same time" - Explore!',
          '🎪 "Every child is an artist. The problem is staying an artist" - Stay creative!'
        ]
      }

      const amounts = {
        submission: 0,
        vote: 0,
        contest: 0,
        achievement: 0,
        inspiration: 0
      }

      return {
        id: Date.now().toString() + Math.random(),
        text: items[type][Math.floor(Math.random() * items[type].length)],
        amount: amounts[type],
        type
      }
    }

    // Add initial items
    const initialItems = Array.from({ length: 8 }, generateTickerItem)
    setTickerItems(initialItems)

    // Update community stats
    const baseStats = {
      totalArtists: 1247,
      totalArtworks: 8934,
      totalVotes: 45678,
      activeContests: 3
    }
    setCommunityStats(baseStats)

    // Add new items periodically
    const interval = setInterval(() => {
      const newItem = generateTickerItem()
      setTickerItems(prev => {
        const updated = [newItem, ...prev].slice(0, 10) // Keep only 10 items
        return updated
      })

      // Update community stats randomly
      setCommunityStats(prev => ({
        ...prev,
        totalArtists: prev.totalArtists + (Math.random() > 0.8 ? 1 : 0),
        totalArtworks: prev.totalArtworks + (Math.random() > 0.7 ? 1 : 0),
        totalVotes: prev.totalVotes + Math.floor(Math.random() * 5) + 1
      }))
    }, 4000 + Math.random() * 3000) // Random interval between 4-7 seconds

    return () => clearInterval(interval)
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'submission': return '🎨'
      case 'vote': return '💖'
      case 'contest': return '🏆'
      case 'achievement': return '🏅'
      case 'inspiration': return '💡'
      default: return '✨'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'submission': return 'from-blue-400 to-cyan-500'
      case 'vote': return 'from-pink-400 to-rose-500'
      case 'contest': return 'from-yellow-400 to-orange-500'
      case 'achievement': return 'from-green-400 to-emerald-500'
      case 'inspiration': return 'from-purple-400 to-pink-500'
      default: return 'from-purple-400 to-pink-500'
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">
          <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Live Community Feed
          </span>
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-cyan-400">
            {communityStats.totalArtists.toLocaleString()}
          </div>
          <div className="text-white/60 text-sm">Active Artists</div>
        </div>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {tickerItems.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300"
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className={`w-8 h-8 bg-gradient-to-r ${getTypeColor(item.type)} rounded-full flex items-center justify-center text-sm`}>
              {getTypeIcon(item.type)}
            </div>
            
                         <div className="flex-1">
               <p className="text-white text-sm">{item.text}</p>
               <p className="text-white/50 text-xs">
                 {new Date().toLocaleTimeString()} • {item.type === 'inspiration' ? 'Daily inspiration' : 'Community activity'}
               </p>
             </div>
             
             <div className={`text-sm font-medium ${item.type === 'achievement' ? 'text-green-400' : item.type === 'inspiration' ? 'text-purple-400' : 'text-blue-400'}`}>
               {item.type === 'achievement' ? '🏅' : item.type === 'inspiration' ? '💡' : '✨'}
             </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-purple-400">{communityStats.totalArtworks.toLocaleString()}</div>
            <div className="text-xs text-white/60">Artworks</div>
          </div>
          <div>
            <div className="text-lg font-bold text-pink-400">{communityStats.totalVotes.toLocaleString()}</div>
            <div className="text-xs text-white/60">Votes Cast</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400">{communityStats.activeContests}</div>
            <div className="text-xs text-white/60">Active Contests</div>
          </div>
        </div>
        <div className="flex items-center justify-center mt-3 text-sm text-white/60">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
          <span>Live community updates</span>
        </div>
      </div>
    </div>
  )
}
