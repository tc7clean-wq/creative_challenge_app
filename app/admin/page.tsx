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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/60 mb-4">Please log in to access the admin panel.</p>
          <Link href="/auth" className="text-blue-400 hover:text-blue-300">Go to Login</Link>
        </div>
      </div>
    )
  }

  if (!isAdmin.canCreateContests && !isAdmin.canManagePayouts && !isAdmin.canManagePlatform) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/60 mb-4">You don&apos;t have admin permissions.</p>
          <p className="text-white/40 text-sm mb-4">
            To get admin access, you need to set is_admin = true in your profile in the Supabase database.
          </p>
          <Link href="/gallery" className="text-blue-400 hover:text-blue-300">Return to Gallery</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <SocialNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Admin Panel</h1>
            <p className="text-lg text-white/80">Manage contests, submissions, and platform settings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isAdmin.canCreateContests && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all">
                <h3 className="text-xl font-bold text-white mb-3">Contest Management</h3>
                <p className="text-white/70 text-sm mb-4">Create and manage creative contests</p>
                <div className="space-y-2">
                  <Link
                    href="/admin/create-contest"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all text-center block"
                  >
                    Create Contest
                  </Link>
                  <Link
                    href="/admin/contests"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 transition-all text-center block"
                  >
                    Manage Contests
                  </Link>
                </div>
              </div>
            )}

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all">
              <h3 className="text-xl font-bold text-white mb-3">Submission Review</h3>
              <p className="text-white/70 text-sm mb-4">Review and approve artwork submissions</p>
              <Link
                href="/admin/submissions"
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition-all text-center block"
              >
                Review Submissions
              </Link>
            </div>

            {isAdmin.canManagePayouts && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all">
                <h3 className="text-xl font-bold text-white mb-3">Payout Management</h3>
                <p className="text-white/70 text-sm mb-4">Manage contest payouts and winners</p>
                <Link
                  href="/admin/payouts"
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-700 transition-all text-center block"
                >
                  Manage Payouts
                </Link>
              </div>
            )}

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all">
              <h3 className="text-xl font-bold text-white mb-3">Prize System</h3>
              <p className="text-white/70 text-sm mb-4">New: 5 entries per win for future money draw</p>
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-200 text-xs">
                  Each contest win = 5 entries into our future money draw!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-3">How to Get Admin Access</h3>
            <div className="text-white/70 text-sm space-y-2">
              <p>To grant admin access to a user, run this SQL in your Supabase SQL editor:</p>
              <div className="bg-black/50 p-3 rounded-lg font-mono text-xs">
                <code>
                  UPDATE profiles SET is_admin = true WHERE email = &apos;user@example.com&apos;;
                </code>
              </div>
              <p>Or to make yourself admin:</p>
              <div className="bg-black/50 p-3 rounded-lg font-mono text-xs">
                <code>
                  UPDATE profiles SET is_admin = true WHERE id = &apos;your-user-id&apos;;
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
