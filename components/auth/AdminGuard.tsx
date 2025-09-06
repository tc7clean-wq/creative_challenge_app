'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/utils/supabase/client'

interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

// List of admin user IDs - add your user ID here
const ADMIN_USER_IDS: string[] = [
  // Add your Supabase user ID here
  // You can find it in your Supabase dashboard under Authentication > Users
  // Example: '12345678-1234-1234-1234-123456789012'
]

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false)
        setChecking(false)
        return
      }

      try {
        // Check if user ID is in admin list
        const isUserAdmin = ADMIN_USER_IDS.includes(user.id)
        
        if (isUserAdmin) {
          setIsAdmin(true)
        } else {
          // Also check if user has admin role in profiles table
          const supabase = createClient()
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()
          
          setIsAdmin(profile?.is_admin === true)
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      } finally {
        setChecking(false)
      }
    }

    checkAdminStatus()
  }, [user])

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="cyber-spinner h-12 w-12 mx-auto mb-4"></div>
          <div className="text-cyan-400 text-xl">Verifying admin access...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">You must be signed in to access admin areas.</p>
          <a
            href="/auth"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">🚫</div>
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">You don&apos;t have permission to access admin areas.</p>
          <a
            href="/gallery"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all"
          >
            Return to Gallery
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
