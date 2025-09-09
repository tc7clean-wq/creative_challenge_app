import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/gallery'

  if (code) {
    try {
      // Check if environment variables are available
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) {
        console.error('Missing Supabase environment variables')
        return NextResponse.redirect(new URL('/login?error=config_error&details=Missing Supabase configuration', origin))
      }
      
      const supabase = await createClient()
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error && data.session) {
        if (process.env.NODE_ENV === 'development') {
          console.log('OAuth callback successful, redirecting to:', next)
        }
        
        // Create a response with the redirect
        const response = NextResponse.redirect(new URL(next, origin))
        
        // Set the session cookies properly
        if (data.session.access_token) {
          response.cookies.set('sb-access-token', data.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
          })
        }
        
        if (data.session.refresh_token) {
          response.cookies.set('sb-refresh-token', data.session.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30 // 30 days
          })
        }
        
        return response
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error('Auth callback error:', error)
        }
        return NextResponse.redirect(new URL(`/login?error=auth_failed&details=${encodeURIComponent(error?.message || 'Authentication failed')}`, origin))
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Auth callback exception:', error)
      }
      return NextResponse.redirect(new URL('/login?error=auth_failed&details=Unexpected error', origin))
    }
  }

  // No code provided, redirect to login with error
  return NextResponse.redirect(new URL('/login?error=auth_failed&details=No authorization code', origin))
}
