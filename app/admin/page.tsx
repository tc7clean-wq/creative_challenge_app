'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import SocialNavbar from '@/components/layout/SocialNavbar'
import Link from 'next/link'

interface AdminPermissions {
  canCreateContests: boolean
  canManagePayouts: boolean
  canManagePlatform: boolean
}

export default function AdminPage() {
  const [user, setUser] = useState<unknown>(null)
  const [isAdmin, setIsAdmin] = useState<AdminPermissions>({
    canCreateContests: false,
    canManagePayouts: false,
    canManagePlatform: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return

    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()

        const canCreateContests = profile?.is_admin || false
        const canManagePayouts = profile?.is_admin || false
        const canManagePlatform = profile?.is_admin || false

        setIsAdmin({
          canCreateContests,
          canManagePayouts,
          canManagePlatform
        })
      }
      setLoading(false)
    }

    checkAdmin()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen ai-art-bg flex items-center justify-center">
        <div className="ai-spinner"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen ai-art-bg flex items-center justify-center">
        <div className="cyber-card p-8 text-center max-w-md mx-4">
          <h1 className="text-3xl font-bold cyber-text mb-4 glitch">⚠️ ACCESS DENIED</h1>
          <p className="text-white/70 mb-6">Neural authentication required for admin matrix access.</p>
          <Link href="/auth" className="ai-btn">
            🔐 Initialize Login Sequence
          </Link>
        </div>
      </div>
    )
  }

  if (!isAdmin.canCreateContests && !isAdmin.canManagePayouts && !isAdmin.canManagePlatform) {
    return (
      <div className="min-h-screen ai-art-bg flex items-center justify-center">
        <div className="cyber-card p-8 text-center max-w-md mx-4">
          <h1 className="text-3xl font-bold cyber-text mb-4 glitch">🚫 INSUFFICIENT PRIVILEGES</h1>
          <p className="text-white/70 mb-4">Your neural profile lacks administrative clearance.</p>
          <div className="cyber-card p-4 mb-6 bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-500/30">
            <p className="text-red-300 text-sm mb-2">⚡ SYSTEM OVERRIDE PROTOCOL:</p>
            <code className="text-xs text-green-400 font-mono block">
              {"UPDATE profiles SET is_admin = true WHERE id = 'your-neural-id';"}
            </code>
          </div>
          <Link href="/gallery" className="ai-btn-secondary">
            Return to Gallery Matrix
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ai-art-bg">
      {/* Animated gears background */}
      <div className="gear-bg gear-1">⚙</div>
      <div className="gear-bg gear-2">⚙</div>
      <div className="gear-bg gear-3">⚙</div>
      
      <SocialNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold cyber-text mb-4 glitch">🎛️ ADMIN MATRIX</h1>
            <p className="text-lg text-white/80">Neural control interface for contest management & AI oversight</p>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isAdmin.canCreateContests && (
              <div className="cyber-card p-6 ai-pulse">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🏆</span>
                  <h3 className="text-xl font-bold cyber-text">Contest Engine</h3>
                </div>
                <p className="text-white/70 text-sm mb-6">Initialize creative battle protocols</p>
                <div className="space-y-3">
                  <Link
                    href="/admin/create-contest"
                    className="ai-btn w-full justify-center"
                  >
                    ⚡ Create Contest
                  </Link>
                  <Link
                    href="/admin/contests"
                    className="ai-btn-secondary w-full text-center block py-3"
                  >
                    🔧 Manage Contests
                  </Link>
                </div>
              </div>
            )}

            <div className="cyber-card p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🎨</span>
                <h3 className="text-xl font-bold cyber-text">Art Analyzer</h3>
              </div>
              <p className="text-white/70 text-sm mb-6">Neural network submission evaluation</p>
              <Link
                href="/admin/submissions"
                className="ai-btn w-full justify-center"
              >
                🔍 Scan Submissions
              </Link>
            </div>

            <div className="cyber-card p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">👥</span>
                <h3 className="text-xl font-bold cyber-text">User Matrix</h3>
              </div>
              <p className="text-white/70 text-sm mb-6">Neural profile management system</p>
              <Link
                href="/admin/users"
                className="ai-btn w-full justify-center"
              >
                🤖 Manage Users
              </Link>
            </div>

            {isAdmin.canManagePayouts && (
              <div className="cyber-card p-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">💰</span>
                  <h3 className="text-xl font-bold cyber-text">Payout Core</h3>
                </div>
                <p className="text-white/70 text-sm mb-6">Credits & reward distribution hub</p>
                <Link
                  href="/admin/payouts"
                  className="ai-btn w-full justify-center"
                >
                  💎 Process Payouts
                </Link>
              </div>
            )}

            <div className="cyber-card p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">📊</span>
                <h3 className="text-xl font-bold cyber-text">Analytics Hub</h3>
              </div>
              <p className="text-white/70 text-sm mb-6">Platform performance metrics</p>
              <Link
                href="/admin/dashboard"
                className="ai-btn w-full justify-center"
              >
                📈 View Dashboard
              </Link>
            </div>

            <div className="cyber-card p-6 border-purple-500/30">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🎰</span>
                <h3 className="text-xl font-bold text-purple-300">Prize Matrix</h3>
              </div>
              <p className="text-purple-200 text-sm mb-4">Neural lottery enhancement protocol</p>
              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-4">
                <p className="text-purple-300 text-xs leading-relaxed">
                  ⚡ SYSTEM ENHANCEMENT: Each contest victory = 5 neural entries into future credit distribution algorithm!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 cyber-card p-8">
            <div className="flex items-center mb-6">
              <span className="text-3xl mr-3">🔓</span>
              <h3 className="text-2xl font-bold cyber-text">Admin Access Protocol</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-3">🧬 Grant Neural Access:</h4>
                <div className="bg-black/50 p-4 rounded-lg font-mono text-sm border border-cyan-500/30">
                  <span className="text-green-400">UPDATE</span> <span className="text-blue-400">profiles</span> <br/>
                  <span className="text-green-400">SET</span> <span className="text-yellow-400">is_admin</span> = <span className="text-purple-400">true</span> <br/>
                  <span className="text-green-400">WHERE</span> <span className="text-yellow-400">email</span> = <span className="text-orange-400">{'user@domain.ai'}</span>;
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">🤖 Self-Elevation Protocol:</h4>
                <div className="bg-black/50 p-4 rounded-lg font-mono text-sm border border-cyan-500/30">
                  <span className="text-green-400">UPDATE</span> <span className="text-blue-400">profiles</span> <br/>
                  <span className="text-green-400">SET</span> <span className="text-yellow-400">is_admin</span> = <span className="text-purple-400">true</span> <br/>
                  <span className="text-green-400">WHERE</span> <span className="text-yellow-400">id</span> = <span className="text-orange-400">{'your-neural-id'}</span>;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
