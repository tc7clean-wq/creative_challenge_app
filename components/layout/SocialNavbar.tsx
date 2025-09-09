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

  if (loading) {
    return (
      <nav className="cyber-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-cyan-300">Loading...</div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="cyber-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold cyber-text" style={{ fontFamily: 'var(--font-header)' }}>
              CREATIVE CHALLENGE
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/gallery" className="text-cyan-300 hover:text-cyan-100 transition-colors">
              Gallery
            </Link>
            <Link href="/submit" className="text-cyan-300 hover:text-cyan-100 transition-colors">
              Submit
            </Link>
            <Link href="/contests" className="text-cyan-300 hover:text-cyan-100 transition-colors">
              Contests
            </Link>
            <Link href="/hall-of-fame" className="text-cyan-300 hover:text-cyan-100 transition-colors">
              Winners
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-cyan-300 hover:text-cyan-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block">{user.email}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 cyber-card py-2 z-50">
                    <Link href="/my-submissions" className="block px-4 py-2 text-cyan-300 hover:bg-white/10">
                      My Submissions
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-cyan-300 hover:bg-white/10">
                      Settings
                    </Link>
                    <Link href="/admin" className="block px-4 py-2 text-cyan-300 hover:bg-white/10">
                      Admin Panel
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-red-400 hover:bg-white/10"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth" className="text-cyan-300 hover:text-cyan-100 transition-colors">
                  Sign In
                </Link>
                <Link href="/auth" className="cyber-btn px-4 py-2">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}