import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Skip middleware for all routes to test
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Disable middleware completely
  ],
}