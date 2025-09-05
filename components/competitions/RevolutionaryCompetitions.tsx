'use client'

import { useState, useEffect } from 'react'

interface Contest {
  id: string
  title: string
  description: string
  theme: string
  prize_amount: number
  start_date: string
  end_date: string
  status: 'upcoming' | 'active' | 'ended'
  submissions_count: number
  max_submissions: number
  rules: string[]
  featured_image: string
}

export default function RevolutionaryCompetitions() {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'upcoming' | 'ended'>('all')
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null)

  useEffect(() => {
    fetchContests()
  }, [])

  const fetchContests = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockContests: Contest[] = [
        {
          id: '1',
          title: 'Digital Dreams Challenge',
          description: 'Create stunning AI-generated artwork that explores the intersection of technology and human creativity.',
          theme: 'Futuristic Technology',
          prize_amount: 5000,
          start_date: '2024-01-01',
          end_date: '2024-01-31',
          status: 'active',
          submissions_count: 127,
          max_submissions: 500,
          rules: [
            'Artwork must be 100% AI-generated',
            'No copyrighted material',
            'Original concept required',
            'High resolution (min 1920x1080)'
          ],
          featured_image: '/contest-1.jpg'
        },
        {
          id: '2',
          title: 'Nature&apos;s Symphony',
          description: 'Capture the beauty of nature through AI art. Show us landscapes, wildlife, or natural phenomena.',
          theme: 'Natural Beauty',
          prize_amount: 3000,
          start_date: '2024-02-01',
          end_date: '2024-02-28',
          status: 'upcoming',
          submissions_count: 0,
          max_submissions: 300,
          rules: [
            'Nature-themed artwork only',
            'AI-generated with natural elements',
            'No human-made objects',
            'Creative interpretation welcome'
          ],
          featured_image: '/contest-2.jpg'
        },
        {
          id: '3',
          title: 'Abstract Expressionism',
          description: 'Push the boundaries of abstract art with AI. Create emotionally powerful, non-representational pieces.',
          theme: 'Abstract Art',
          prize_amount: 2500,
          start_date: '2023-12-01',
          end_date: '2023-12-31',
          status: 'ended',
          submissions_count: 89,
          max_submissions: 200,
          rules: [
            'Abstract composition required',
            'Emotional impact important',
            'AI-generated with artistic intent',
            'Unique color palette'
          ],
          featured_image: '/contest-3.jpg'
        }
      ]

      setContests(mockContests)
    } catch (error) {
      console.error('Error fetching contests:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContests = contests.filter(contest => {
    if (activeFilter === 'all') return true
    return contest.status === activeFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-green-400 to-emerald-500'
      case 'upcoming': return 'from-blue-400 to-cyan-500'
      case 'ended': return 'from-gray-400 to-gray-500'
      default: return 'from-purple-400 to-pink-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🔥'
      case 'upcoming': return '⏰'
      case 'ended': return '🏁'
      default: return '🎯'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-quantum-entanglement w-16 h-16 mx-auto mb-4">
            <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
          </div>
          <p className="text-white/80 text-xl">Loading quantum competitions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text-holographic">
            Quantum Competitions
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Compete with the world&apos;s best AI artists and win amazing prizes
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="glass-card p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Contests', icon: '🌟' },
              { key: 'active', label: 'Active', icon: '🔥' },
              { key: 'upcoming', label: 'Upcoming', icon: '⏰' },
              { key: 'ended', label: 'Ended', icon: '🏁' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key as 'all' | 'active' | 'upcoming' | 'ended')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeFilter === key
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="mr-2">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Contests Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContests.map((contest, index) => (
            <div
              key={contest.id}
              className="group glass-card p-6 interactive-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedContest(contest)}
            >
              {/* Contest Image */}
              <div className="relative aspect-video mb-4 rounded-xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-cyan-400/20 to-purple-400/20 flex items-center justify-center">
                  <div className="text-6xl animate-quantum-float">🎨</div>
                </div>
                
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getStatusColor(contest.status)} text-white`}>
                  {getStatusIcon(contest.status)} {contest.status.toUpperCase()}
                </div>
              </div>

              {/* Contest Info */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white group-hover:gradient-text-cyber transition-all duration-300">
                  {contest.title}
                </h3>
                
                <p className="text-gray-400 text-sm line-clamp-2">
                  {contest.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-cyan-400 font-medium">Theme: {contest.theme}</span>
                  <span className="text-yellow-400 font-bold">${contest.prize_amount.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>📅 {new Date(contest.end_date).toLocaleDateString()}</span>
                  <span>🎨 {contest.submissions_count}/{contest.max_submissions}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(contest.submissions_count / contest.max_submissions) * 100}%` }}
                  ></div>
                </div>

                <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl neu-button interactive-hover interactive-press">
                  {contest.status === 'active' ? 'Join Contest' : 
                   contest.status === 'upcoming' ? 'Notify Me' : 'View Results'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredContests.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-4">No contests found</h3>
            <p className="text-gray-400 mb-8">
              {activeFilter === 'all' ? 'No contests available at the moment' : `No ${activeFilter} contests found`}
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl neu-button interactive-hover interactive-press">
              Create Contest
            </button>
          </div>
        )}
      </div>

      {/* Contest Modal */}
      {selectedContest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold gradient-text-holographic mb-2">
                    {selectedContest.title}
                  </h2>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getStatusColor(selectedContest.status)} text-white`}>
                    {getStatusIcon(selectedContest.status)} {selectedContest.status.toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContest(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="aspect-video bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-xl mb-6 flex items-center justify-center">
                    <div className="text-6xl animate-quantum-float">🎨</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Prize Pool</h3>
                      <div className="text-3xl font-bold gradient-text-cyber">
                        ${selectedContest.prize_amount.toLocaleString()}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Theme</h3>
                      <div className="text-cyan-400 font-medium">{selectedContest.theme}</div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Deadline</h3>
                      <div className="text-gray-300">
                        {new Date(selectedContest.end_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Description</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {selectedContest.description}
                  </p>
                  
                  <h3 className="text-lg font-bold text-white mb-4">Rules</h3>
                  <ul className="space-y-2 mb-6">
                    {selectedContest.rules.map((rule, index) => (
                      <li key={index} className="flex items-start space-x-2 text-gray-300">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Submissions</span>
                      <span className="text-white font-medium">
                        {selectedContest.submissions_count}/{selectedContest.max_submissions}
                      </span>
                    </div>
                    
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(selectedContest.submissions_count / selectedContest.max_submissions) * 100}%` }}
                      ></div>
                    </div>
                    
                    <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl neu-button interactive-hover interactive-press">
                      {selectedContest.status === 'active' ? 'Submit Artwork' : 
                       selectedContest.status === 'upcoming' ? 'Set Reminder' : 'View Results'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
