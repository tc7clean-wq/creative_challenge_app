'use client'

import { useState, useEffect } from 'react'

interface TickerItem {
  id: string
  text: string
  amount: number
  type: 'submission' | 'vote' | 'contest'
}

export default function LiveTicker() {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])
  const [totalPrizePool, setTotalPrizePool] = useState(0)

  useEffect(() => {
    // Simulate live updates
    const generateTickerItem = (): TickerItem => {
      const types = ['submission', 'vote', 'contest'] as const
      const type = types[Math.floor(Math.random() * types.length)]
      
      const items = {
        submission: [
          'New artwork submitted to Digital Art Showdown',
          'Amazing portrait uploaded to Portrait Contest',
          'Stunning landscape added to Nature Photography',
          'Creative illustration submitted to Fantasy Art',
          'Beautiful abstract piece uploaded to Modern Art'
        ],
        vote: [
          'Free vote cast for "Sunset Dreams" artwork',
          'Community voted for "Urban Legends" piece',
          'Free vote added to "Cosmic Journey" submission',
          'New free vote for "Ocean Waves" photography',
          'Community supported "Digital Dreams" artwork'
        ],
        contest: [
          'New contest "Street Art Challenge" launched',
          'Prize pool increased for "Portrait Masters"',
          'Extended deadline for "Nature Photography"',
          'New tier added to "Digital Art Showdown"',
          'Community milestone reached in "Fantasy Art"'
        ]
      }

      const amounts = {
        submission: Math.floor(Math.random() * 50) + 10,
        vote: 0, // Voting is free, no money added to prize pool
        contest: Math.floor(Math.random() * 200) + 100
      }

      return {
        id: Date.now().toString() + Math.random(),
        text: items[type][Math.floor(Math.random() * items[type].length)],
        amount: amounts[type],
        type
      }
    }

    // Add initial items
    const initialItems = Array.from({ length: 5 }, generateTickerItem)
    setTickerItems(initialItems)

    // Update total prize pool
    const basePrizePool = 25000
    const randomIncrease = Math.floor(Math.random() * 5000) + 1000
    setTotalPrizePool(basePrizePool + randomIncrease)

    // Add new items periodically
    const interval = setInterval(() => {
      const newItem = generateTickerItem()
      setTickerItems(prev => {
        const updated = [newItem, ...prev].slice(0, 10) // Keep only 10 items
        return updated
      })

      // Update prize pool
      setTotalPrizePool(prev => prev + newItem.amount)
    }, 3000 + Math.random() * 4000) // Random interval between 3-7 seconds

    return () => clearInterval(interval)
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'submission': return '🎨'
      case 'vote': return '❤️'
      case 'contest': return '🏆'
      default: return '✨'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'submission': return 'from-blue-400 to-cyan-500'
      case 'vote': return 'from-pink-400 to-rose-500'
      case 'contest': return 'from-yellow-400 to-orange-500'
      default: return 'from-purple-400 to-pink-500'
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">
          <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Live Activity Feed
          </span>
        </h3>
        <div className="text-right">
          <div className="text-3xl font-bold text-yellow-400">
            ${totalPrizePool.toLocaleString()}
          </div>
          <div className="text-white/60 text-sm">Total Prize Pool</div>
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
                 {new Date().toLocaleTimeString()} {item.amount > 0 ? `• +$${item.amount} to prize pool` : '• Free community participation'}
               </p>
             </div>
             
             <div className={`text-sm font-medium ${item.amount > 0 ? 'text-green-400' : 'text-blue-400'}`}>
               {item.amount > 0 ? `+$${item.amount}` : 'FREE'}
             </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-white/60">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live updates every few seconds</span>
          </div>
          <div className="text-white/60">
            {tickerItems.length} recent activities
          </div>
        </div>
      </div>
    </div>
  )
}
