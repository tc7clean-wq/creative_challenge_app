'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import type { SupabaseClient } from '@/types/supabase'
import Link from 'next/link'
import LogoutButton from '@/components/auth/LogoutButton'

interface Contest {
  id: string
  title: string
  theme: string
  description: string
  rules: string
  start_date: string
  end_date: string
  prize_pool: number
  max_submissions: number
  status: string
}

export default function RulesPage() {
  const [activeContest, setActiveContest] = useState<Contest | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    // Initialize Supabase client
    const client = createClient()
    setSupabase(client)
  }, [])

  useEffect(() => {
    if (!supabase) return

    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // Fetch active contest
      const { data: contestData } = await supabase
        .from('contests')
        .select('*')
        .eq('status', 'active')
        .single()

      setActiveContest(contestData)
      setLoading(false)
    }

    fetchData()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">📋</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Contest Rules & Guidelines</h1>
                <p className="text-white/60 text-sm">Everything you need to know about participating</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/authenticated-home"
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Back to Home
              </Link>
              {user && <LogoutButton />}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeContest ? (
          <div className="space-y-8">
            {/* Current Contest Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    {activeContest.title}
                  </span>
                </h2>
                <p className="text-2xl text-white/80 mb-2">Theme: {activeContest.theme}</p>
                <p className="text-white/60 mb-4">{activeContest.description}</p>
                <div className="flex justify-center items-center space-x-8 text-white/80">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">${activeContest.prize_pool.toLocaleString()}</div>
                    <div className="text-sm">Prize Pool</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{activeContest.max_submissions}</div>
                    <div className="text-sm">Max Submissions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {new Date(activeContest.end_date).toLocaleDateString()}
                    </div>
                    <div className="text-sm">Deadline</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Entry Tiers */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-3xl font-bold text-white mb-6 text-center">
                <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                  Entry Tiers & Submission Limits
                </span>
              </h3>
              <p className="text-white/60 text-center mb-8">
                Choose your entry tier to submit your artwork. Higher tiers allow more submissions and better visibility!
              </p>
              
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 mb-8 border border-green-500/30">
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-white mb-4">
                    <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                      🎯 How It Works
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/80">
                    <div className="text-center">
                      <div className="text-4xl mb-2">💰</div>
                      <h5 className="font-bold text-white mb-2">Pay to Enter</h5>
                      <p className="text-sm">Choose your entry tier ($5, $15, or $30) to submit your artwork and compete for prizes</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl mb-2">🗳️</div>
                      <h5 className="font-bold text-white mb-2">Vote for Free</h5>
                      <p className="text-sm">Everyone can vote on submissions for free - no payment required to participate in voting</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Standard Entry */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📸</span>
                    </div>
                    <h4 className="text-xl font-bold text-white">Standard Entry</h4>
                    <div className="text-3xl font-bold text-blue-400 mt-2">$5</div>
                    <div className="text-sm text-white/60 mt-1">Entry Fee</div>
                  </div>
                  
                  <div className="space-y-3 text-white/80">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>1 Image or Video submission</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Eligible for all prizes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Community voting</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Community voting only</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Free voting for everyone</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-3 bg-blue-500/20 rounded-lg">
                    <p className="text-blue-200 text-sm text-center">
                      <strong>File Limits:</strong> 1 image (max 10MB) OR 1 video (max 100MB, 2min)
                    </p>
                  </div>
                </div>

                {/* Featured Entry */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 transform scale-105">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                      POPULAR
                    </span>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <h4 className="text-xl font-bold text-white">Featured Entry</h4>
                    <div className="text-3xl font-bold text-pink-400 mt-2">$15</div>
                    <div className="text-sm text-white/60 mt-1">Entry Fee</div>
                  </div>
                  
                  <div className="space-y-3 text-white/80">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>3 Images or 2 Videos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Priority gallery placement</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Enhanced visibility</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Eligible for all prizes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Artist spotlight feature</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Free voting for everyone</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-3 bg-pink-500/20 rounded-lg">
                    <p className="text-pink-200 text-sm text-center">
                      <strong>File Limits:</strong> 3 images (max 10MB each) OR 2 videos (max 100MB, 2min each)
                    </p>
                  </div>
                </div>

                {/* Spotlight Entry */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💎</span>
                    </div>
                    <h4 className="text-xl font-bold text-white">Spotlight Entry</h4>
                    <div className="text-3xl font-bold text-yellow-400 mt-2">$30</div>
                    <div className="text-sm text-white/60 mt-1">Entry Fee</div>
                  </div>
                  
                  <div className="space-y-3 text-white/80">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>5 Images or 3 Videos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Top gallery placement</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Featured gallery spot</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Eligible for all prizes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Artist interview opportunity</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Social media promotion</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>Free voting for everyone</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-3 bg-yellow-500/20 rounded-lg">
                    <p className="text-yellow-200 text-sm text-center">
                      <strong>File Limits:</strong> 5 images (max 10MB each) OR 3 videos (max 100MB, 2min each)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contest Rules */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-3xl font-bold text-white mb-6 text-center">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                  Contest Rules & Guidelines
                </span>
              </h3>
              
              <div className="prose prose-invert max-w-none">
                <div className="text-white/80 whitespace-pre-wrap leading-relaxed">
                  {activeContest.rules || `General Contest Rules:

1. SUBMISSION REQUIREMENTS
   • All submissions must be original artwork created by the participant
   • No copyrighted material, stock photos, or AI-generated content
   • Must follow the contest theme: "${activeContest.theme}"
   • File formats: JPG, PNG, MP4, MOV
   • Images: Maximum 10MB per file
   • Videos: Maximum 100MB, 2 minutes duration

2. JUDGING CRITERIA
   • 75% Community Vote Score (based on user votes)
   • 25% AI Judge Score (transparent and fair)
   • AI judge votes FIRST with public explanation posted
   • Community voting closes after AI judge posts their pick
   • AI judge then does official tally combining all scores
   • Final Score = (Community Score × 0.75) + (AI Score × 0.25)

3. PRIZE DISTRIBUTION
   • 1st Place: 50% of total prize pool
   • 2nd Place: 30% of total prize pool  
   • 3rd Place: 20% of total prize pool
   • Platform commission: 40% of entry fees
   • Prize pool grows with each entry fee paid

4. VOTING RULES
   • Voting is completely FREE for everyone
   • Community voting runs throughout the contest period
   • AI judge votes FIRST with public explanation posted
   • Community voting closes after AI judge posts their pick
   • Each user can vote once per submission
   • Voting is open to all registered users
   • Votes cannot be changed once submitted
   • You only pay to ENTER your artwork, not to vote

5. SUBMISSION DEADLINE
   • All entries must be submitted by: ${new Date(activeContest.end_date).toLocaleString()}
   • Late submissions will not be accepted
   • Maximum ${activeContest.max_submissions} total submissions allowed

6. DISQUALIFICATION
   • Inappropriate or offensive content
   • Plagiarism or copyright infringement
   • Multiple accounts by same person
   • Attempting to manipulate votes

7. AI JUDGE TRANSPARENCY
   • AI judge evaluates all submissions fairly
   • AI judge votes FIRST with detailed explanation posted publicly
   • Community voting closes after AI judge posts their pick
   • AI judge then does official tally combining all scores
   • AI reasoning includes artistic merit, creativity, and theme adherence
   • Full transparency in the judging process

8. WINNER ANNOUNCEMENT
   • Winners will be announced within 48 hours of contest end
   • Prizes will be distributed within 7 business days
   • All decisions by judges are final

Good luck and create something amazing! 🎨✨`}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center">
              <Link
                href="/submit"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="mr-2">🎨</span>
                Submit Your Entry
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-3xl font-bold text-white mb-4">No Active Contest</h2>
            <p className="text-white/60 mb-8">There are currently no active contests. Check back soon for new creative challenges!</p>
            <Link
              href="/authenticated-home"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
