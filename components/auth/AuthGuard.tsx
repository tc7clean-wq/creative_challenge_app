'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useSupabaseQuery'
import { createClient } from '@/utils/supabase/client'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  fallback?: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({
  children,
  requireAuth = false,
  requireAdmin = false,
  fallback,
  redirectTo = '/auth'
}: AuthGuardProps) {
  const router = useRouter()
  const { data: user, isLoading, error } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(false)

  // Check admin status if required
  useEffect(() => {
    if (requireAdmin && user) {
      setCheckingAdmin(true)
      const checkAdminStatus = async () => {
        try {
          const supabase = createClient()
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, is_admin')
            .eq('id', user.id)
            .single()

          setIsAdmin(profile?.is_admin === true || profile?.role === 'admin')
        } catch (error) {
          console.error('Error checking admin status:', error)
          setIsAdmin(false)
        } finally {
          setCheckingAdmin(false)
        }
      }

      checkAdminStatus()
    }
  }, [user, requireAdmin])

  // Show loading state
  if (isLoading || (requireAdmin && checkingAdmin)) {
    return (
      <div className="min-h-screen ai-art-bg flex items-center justify-center">
        <div className="cyber-card p-8 text-center">
          <div className="ai-spinner mb-4"></div>
          <p className="text-white/70">Verifying neural access...</p>
        </div>
      </div>
    )
  }

  // Handle authentication errors
  if (error) {
    console.error('Auth error:', error)
    if (requireAuth || requireAdmin) {
      router.push(redirectTo)
      return null
    }
  }

  // Check if authentication is required but user is not logged in
  if (requireAuth && !user) {
    if (fallback) {
      return <>{fallback}</>
    }
    router.push(redirectTo)
    return null
  }

  // Check if admin access is required but user is not admin
  if (requireAdmin && (!user || !isAdmin)) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen ai-art-bg flex items-center justify-center">
        <div className="cyber-card p-8 text-center max-w-md mx-4">
          <h1 className="text-3xl font-bold cyber-text mb-4 glitch">🚫 ACCESS DENIED</h1>
          <p className="text-white/70 mb-6">
            Administrator clearance required to access this neural matrix.
          </p>
          <button
            onClick={() => router.back()}
            className="ai-btn-secondary"
          >
            Return to Previous Matrix
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Convenience wrapper components
export function RequireAuth({ children, ...props }: Omit<AuthGuardProps, 'requireAuth'>) {
  return (
    <AuthGuard requireAuth {...props}>
      {children}
    </AuthGuard>
  )
}

export function RequireAdmin({ children, ...props }: Omit<AuthGuardProps, 'requireAdmin'>) {
  return (
    <AuthGuard requireAuth requireAdmin {...props}>
      {children}
    </AuthGuard>
  )
}