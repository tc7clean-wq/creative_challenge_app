import { NextResponse } from 'next/server'

export async function middleware() {
  // Skip middleware for all routes to test
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Disable middleware completely
  ],
}