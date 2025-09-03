import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function HeroSection() {
  const supabase = await createClient()

  // Fetch currently active contest
  const now = new Date().toISOString()
  const { data: activeContest, error: contestError } = await supabase
    .from('contests')
    .select('title, prompt, end_date, prize_amount, description')
    .lte('start_date', now)
    .gte('end_date', now)
    .eq('is_active', true)
    .order('end_date', { ascending: true })
    .limit(1)
    .single()

  // Handle case where no contests exist (normal for new installations)
  if (contestError && contestError.code === 'PGRST116') {
    // No contests found - this is normal for new installations
    console.log('No active contests found in database')
  } else if (contestError) {
    console.error('Error fetching active contest:', contestError)
  }

  // Calculate days left
  const daysLeft = activeContest
    ? Math.ceil((new Date(activeContest.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          {activeContest ? (
            <>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {activeContest.title}
              </span>
              <span className="block text-gray-900">
                Creative Contest
              </span>
            </>
          ) : (
            <>
              Creative
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Challenges
              </span>
              Await
            </>
          )}
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
          {activeContest ? (
            <>
              <span className="font-semibold text-gray-800">{activeContest.prompt}</span>
              {activeContest.description && (
                <span className="block mt-2 text-lg text-gray-700">
                  {activeContest.description}
                </span>
              )}
              {activeContest.prize_amount && (
                <span className="block mt-3 text-2xl font-bold text-green-600">
                  🏆 Prize Pool: ${activeContest.prize_amount}
                </span>
              )}
              <span className="block mt-2 text-sm text-gray-500">
                ⏰ Contest ends: {new Date(activeContest.end_date).toLocaleDateString()} ({daysLeft} days left)
              </span>
            </>
          ) : (
            'Join the ultimate creative competition platform where artists, designers, and creators showcase their talent, compete for prizes, and build their portfolio.'
          )}
        </p>

        {/* Prize Milestones & Rules */}
        {activeContest && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-12 max-w-5xl mx-auto shadow-lg border border-white/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 Prize Distribution & Rules</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                <div className="text-3xl mb-2">🥇</div>
                <div className="text-lg font-bold text-yellow-800">1st Place</div>
                <div className="text-2xl font-bold text-yellow-600">
                  ${activeContest.prize_amount ? Math.round(activeContest.prize_amount * 0.5) : 'TBD'}
                </div>
                <div className="text-sm text-yellow-700">50% of Prize Pool</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                <div className="text-3xl mb-2">🥈</div>
                <div className="text-lg font-bold text-gray-800">2nd Place</div>
                <div className="text-2xl font-bold text-gray-600">
                  ${activeContest.prize_amount ? Math.round(activeContest.prize_amount * 0.3) : 'TBD'}
                </div>
                <div className="text-sm text-gray-700">30% of Prize Pool</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                <div className="text-3xl mb-2">🥉</div>
                <div className="text-lg font-bold text-amber-800">3rd Place</div>
                <div className="text-2xl font-bold text-amber-600">
                  ${activeContest.prize_amount ? Math.round(activeContest.prize_amount * 0.2) : 'TBD'}
                </div>
                <div className="text-sm text-amber-700">20% of Prize Pool</div>
              </div>
            </div>

            {/* Official Rules */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h4 className="text-lg font-semibold text-blue-900 mb-4">📋 Official Contest Rules</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span><strong>Platform Commission:</strong> 40% of entry fees</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span><strong>Voting System:</strong> 75% Community Votes + 25% AI Judge (transparent)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span><strong>Entry Tiers:</strong> Standard ($5), Featured ($15), Spotlight ($30)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span><strong>Judging:</strong> AI judge votes first, then community voting closes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {activeContest ? (
            <>
              <Link
                href="/submit"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Submit Your Entry
              </Link>
              <Link
                href="/contests"
                className="bg-white text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                View All Contests
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Start Creating Now
              </Link>
              <Link
                href="/contests"
                className="bg-white text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Browse Contests
              </Link>
            </>
          )}
        </div>

        {/* Contest Status & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {activeContest ? (
            <>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">🎯</div>
                <div className="text-gray-600 font-semibold">Contest Active</div>
                <div className="text-sm text-gray-500">Join Now!</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {activeContest.prize_amount ? `$${activeContest.prize_amount}` : 'TBD'}
                </div>
                <div className="text-gray-600 font-semibold">Total Prize Pool</div>
                <div className="text-sm text-gray-500">Up for grabs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {daysLeft}
                </div>
                <div className="text-gray-600 font-semibold">Days Left</div>
                <div className="text-sm text-gray-500">Hurry up!</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">⚡</div>
                <div className="text-gray-600 font-semibold">Live Voting</div>
                <div className="text-sm text-gray-500">75% Community + 25% AI Judge</div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-gray-600 font-semibold">Active Contests</div>
                <div className="text-sm text-gray-500">Year-round</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">$25K+</div>
                <div className="text-gray-600 font-semibold">Total Prizes</div>
                <div className="text-sm text-gray-500">Awarded</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">2.5K+</div>
                <div className="text-gray-600 font-semibold">Creators</div>
                <div className="text-sm text-gray-500">Participating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">🤖</div>
                <div className="text-gray-600 font-semibold">AI Judging</div>
                <div className="text-sm text-gray-500">Fair & unbiased</div>
              </div>
            </>
          )}
        </div>

        {/* Additional Info for Active Contests */}
        {activeContest && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <span>💡</span>
              <span>Entry fees help fund the prize pool and platform development</span>
            </div>
          </div>
        )}

        {/* Setup Info for New Installations */}
        {!activeContest && (
          <div className="mt-12 text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h4 className="text-lg font-semibold text-yellow-800 mb-3">🚀 Getting Started</h4>
              <p className="text-yellow-700 mb-4">
                This is a new installation. To get started, you&apos;ll need to:
              </p>
              <div className="text-left text-sm text-yellow-700 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
                  <span>Set up your Supabase database with the required tables</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
                  <span>Create your first contest</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
                  <span>Start accepting submissions</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
