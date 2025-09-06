'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/utils/supabase/client'

export default function AdminNavbar() {
  const { user, loading } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showAdminMenu, setShowAdminMenu] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  return (
    <nav className="cyber-card sticky top-0 z-50 cyber-glow-yellow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/gallery" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center cyber-glow-yellow">
              <span className="text-black font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold cyber-text">ADMIN PANEL</span>
          </Link>

          {/* Admin Quick Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/admin/submissions" 
              className="bg-red-500/20 text-red-300 hover:bg-red-500/30 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
            >
              📝 Review Submissions
            </Link>
            <Link 
              href="/admin/contests" 
              className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
            >
              🏆 Manage Contests
            </Link>
            <Link 
              href="/admin/jackpot" 
              className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
            >
              🎰 Jackpot Control
            </Link>
            <Link 
              href="/admin/users" 
              className="bg-green-500/20 text-green-300 hover:bg-green-500/30 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
            >
              👥 User Management
            </Link>
          </div>

          {/* Admin Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowAdminMenu(!showAdminMenu)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-colors"
            >
              <span className="text-white text-sm font-medium">Admin Tools</span>
              <span className="text-white">▼</span>
            </button>

            {showAdminMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 py-2 z-50">
                <div className="px-4 py-2 border-b border-white/20">
                  <h3 className="text-white font-semibold text-sm">Platform Control</h3>
                </div>
                
                <Link
                  href="/admin/submissions"
                  className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                >
                  📝 Review Submissions ({/* TODO: Add pending count */})
                </Link>
                <Link
                  href="/admin/contests"
                  className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                >
                  🏆 Manage Contests
                </Link>
                <Link
                  href="/admin/jackpot"
                  className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                >
                  🎰 Jackpot Control
                </Link>
                <Link
                  href="/admin/users"
                  className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                >
                  👥 User Management
                </Link>
                
                <div className="border-t border-white/20 my-1"></div>
                
                <Link
                  href="/admin/analytics"
                  className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                >
                  📊 Analytics Dashboard
                </Link>
                <Link
                  href="/admin/settings"
                  className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                >
                  ⚙️ Platform Settings
                </Link>
                <Link
                  href="/admin/logs"
                  className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                >
                  📋 System Logs
                </Link>
              </div>
            )}
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
                      {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <span className="text-white text-sm font-medium hidden sm:block">
                    {user.user_metadata?.full_name || 'Admin'}
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
                      href="/gallery"
                      className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                    >
                      🏠 View Gallery
                    </Link>
                    <Link
                      href="/submit"
                      className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
                    >
                      ✨ Submit Art
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
              <Link
                href="/auth"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Admin Menu */}
      <div className="md:hidden border-t border-white/20">
        <div className="px-4 py-3 space-y-2">
          <Link 
            href="/admin/submissions" 
            className="block text-white hover:text-red-300 transition-colors font-medium py-2"
          >
            📝 Review Submissions
          </Link>
          <Link 
            href="/admin/contests" 
            className="block text-white hover:text-blue-300 transition-colors font-medium py-2"
          >
            🏆 Manage Contests
          </Link>
          <Link 
            href="/admin/jackpot" 
            className="block text-white hover:text-yellow-300 transition-colors font-medium py-2"
          >
            🎰 Jackpot Control
          </Link>
          <Link 
            href="/admin/users" 
            className="block text-white hover:text-green-300 transition-colors font-medium py-2"
          >
            👥 User Management
          </Link>
        </div>
      </div>
    </nav>
  )
}
