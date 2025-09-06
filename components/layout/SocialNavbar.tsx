'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/utils/supabase/client'

export default function SocialNavbar() {
  const { user, loading } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  return (
    <nav className="cyber-card sticky top-0 z-50 cyber-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/gallery" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-lg flex items-center justify-center cyber-glow">
              <span className="text-black font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold cyber-text">CREATIVE CHALLENGE</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/gallery" 
              className="text-cyan-300 hover:text-cyan-100 transition-colors font-medium cyber-focus"
            >
              🏠 FEED
            </Link>
            <Link 
              href="/submit" 
              className="text-cyan-300 hover:text-cyan-100 transition-colors font-medium cyber-focus"
            >
              ✨ SUBMIT
            </Link>
            <Link 
              href="/contests" 
              className="text-cyan-300 hover:text-cyan-100 transition-colors font-medium cyber-focus"
            >
              🏆 CONTESTS
            </Link>
            <Link 
              href="/leaderboard" 
              className="text-cyan-300 hover:text-cyan-100 transition-colors font-medium cyber-focus"
            >
              📊 LEADERBOARD
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-white text-sm font-medium hidden sm:block">
                    {user.user_metadata?.full_name || 'User'}
                  </span>
                  <span className="text-white">▼</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 py-2 z-50">
                    <Link
                      href={`/profile/${user.user_metadata?.username || 'user'}`}
                      className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                    >
                      👤 My Profile
                    </Link>
                    <Link
                      href="/favorites"
                      className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                    >
                      ❤️ Favorites
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                    >
                      ⚙️ Settings
                    </Link>
                    <div className="border-t border-white/20 my-1"></div>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-red-300 hover:bg-red-500/20 transition-colors"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth"
                  className="text-white hover:text-purple-300 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden border-t border-white/20">
        <div className="px-4 py-3 space-y-2">
          <Link 
            href="/gallery" 
            className="block text-white hover:text-purple-300 transition-colors font-medium py-2"
          >
            🏠 Feed
          </Link>
          <Link 
            href="/submit" 
            className="block text-white hover:text-purple-300 transition-colors font-medium py-2"
          >
            ✨ Submit
          </Link>
          <Link 
            href="/contests" 
            className="block text-white hover:text-purple-300 transition-colors font-medium py-2"
          >
            🏆 Contests
          </Link>
          <Link 
            href="/leaderboard" 
            className="block text-white hover:text-purple-300 transition-colors font-medium py-2"
          >
            📊 Leaderboard
          </Link>
        </div>
      </div>
    </nav>
  )
}
