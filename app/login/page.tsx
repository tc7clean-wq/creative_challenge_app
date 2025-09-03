import AuthForm from '@/components/auth/AuthForm'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; details?: string }>
}) {
  const { error, details } = await searchParams
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        {error === 'auth_failed' && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800 font-medium">
                  Authentication failed
                </p>
                {details && (
                  <p className="text-sm text-red-700 mt-1">
                    {details}
                  </p>
                )}
                <p className="text-sm text-red-600 mt-2">
                  Please try signing in again or contact support if the problem persists.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Suspense fallback={
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        }>
          <AuthForm view="sign_in" />
        </Suspense>
        
        <div className="text-center">
          <Link
            href="/"
            className="font-medium text-gray-600 hover:text-gray-500"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
