'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import type { SupabaseClient } from '@/types/supabase'

interface UserMenuProps {
  className?: string
}

export default function UserMenu({ className = '' }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [isAdmin, setIsAdmin] = useState<{
    canCreateContests: boolean;
    canManagePayouts: boolean;
    canManagePlatform: boolean;
  }>({
    canCreateContests: false,
    canManagePayouts: false,
    canManagePlatform: false
  })
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const router = useRouter()

  const fetchUser = useCallback(async () => {
    if (!supabase) return
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      
              // Controlled admin access - only for contest creation and transparency
      const canCreateContests = true // Anyone can suggest/create contests
      const canManagePayouts = profile?.is_admin || (user.email && user.email.endsWith('@creativechallenge.app'))
      const canManagePlatform = profile?.is_admin || (user.email && user.email.endsWith('@creativechallenge.app'))
      
      setIsAdmin({
        canCreateContests,
        canManagePayouts,
        canManagePlatform
      })
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    // Initialize Supabase client
    const client = createClient()
    setSupabase(client)
  }, [])

  useEffect(() => {
    if (supabase) {
      fetchUser()
    }
  }, [supabase, fetchUser])

  const handleLogout = async () => {
    if (!supabase) return
    try {
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const menuItems = [
    {
      label: '🏠 Home',
      href: '/',
      description: 'Back to main page'
    },
    {
      label: '🎨 Contest Gallery',
      href: '/authenticated-home',
      description: 'View active contests'
    },
    {
      label: '❤️ My Favorites',
      href: '/favorites',
      description: 'Saved artwork & collections'
    },
    {
      label: '👥 Discover Artists',
      href: '/artists',
      description: 'Explore talented creators'
    },
    {
      label: '💰 My Payouts',
      href: '/payouts',
      description: 'Track your winnings'
    },
    {
      label: '👤 My Profile',
      href: '/profile',
      description: 'Manage your account'
    },
    ...(isAdmin.canCreateContests ? [{
      label: '🏆 Create Contest',
      href: '/admin/create-contest',
      description: 'Suggest or create new contests'
    }] : []),
    ...(isAdmin.canCreateContests ? [{
      label: '📊 Revenue Transparency',
      href: '/revenue-dashboard',
      description: 'View platform revenue & fairness'
    }] : []),
    ...(isAdmin.canManagePayouts ? [{
      label: '💸 Payout Management',
      href: '/admin/payouts',
      description: 'Process contest payouts'
    }] : []),
    ...(isAdmin.canManagePlatform ? [{
      label: '⚙️ Platform Management',
      href: '/admin/dashboard',
      description: 'Full platform administration'
    }] : [])
  ]

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => router.push('/auth')}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
        >
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20 hover:bg-white/20 transition-all duration-300"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {user.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-white text-sm font-medium">
            {user.email?.split('@')[0] || 'User'}
          </div>
          {(isAdmin.canCreateContests || isAdmin.canManagePayouts || isAdmin.canManagePlatform) && (
            <div className="text-xs text-yellow-400">
              {isAdmin.canManagePlatform ? 'Admin' : 
               isAdmin.canManagePayouts ? 'Payout Manager' : 'Contest Creator'}
            </div>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl z-50 overflow-hidden">
            {/* User Info Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="text-white font-semibold">
                    {user.email?.split('@')[0] || 'User'}
                  </div>
                  <div className="text-white/60 text-sm">
                    {user.email}
                  </div>
                  {(isAdmin.canCreateContests || isAdmin.canManagePayouts || isAdmin.canManagePlatform) && (
                    <div className="text-xs text-yellow-400 font-medium">
                      ⚡ {isAdmin.canManagePlatform ? 'Administrator' : 
                          isAdmin.canManagePayouts ? 'Payout Manager' : 'Contest Creator'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    router.push(item.href)
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 group"
                >
                  <div className="text-lg">{item.label.split(' ')[0]}</div>
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {item.label.split(' ').slice(1).join(' ')}
                    </div>
                    <div className="text-white/60 text-xs">
                      {item.description}
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Logout Button */}
            <div className="p-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-500/20 transition-colors duration-200 group rounded-lg"
              >
                <div className="text-lg">🚪</div>
                <div className="flex-1">
                  <div className="text-red-400 font-medium group-hover:text-red-300">
                    Sign Out
                  </div>
                  <div className="text-white/60 text-xs">
                    End your session
                  </div>
                </div>
                <svg
                  className="w-4 h-4 text-red-400/60 group-hover:text-red-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
