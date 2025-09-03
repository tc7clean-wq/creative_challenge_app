import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/authenticated-home'

  if (code) {
    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error && data.session) {
        console.log('OAuth callback successful, redirecting to:', next)
        
        // Create a response with the redirect
        const response = NextResponse.redirect(`${origin}${next}`)
        
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
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${origin}/login?error=auth_failed&details=${encodeURIComponent(error?.message || 'Authentication failed')}`)
      }
    } catch (error) {
      console.error('Auth callback exception:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_failed&details=Unexpected error`)
    }
  }

  // No code provided, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed&details=No authorization code`)
}
