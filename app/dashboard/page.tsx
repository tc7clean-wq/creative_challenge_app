import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/auth/LogoutButton'
import JackpotStats from '@/components/jackpot/JackpotStats'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome to your Dashboard
                </h1>
                <LogoutButton />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Jackpot Stats Card */}
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-6 rounded-lg text-white">
                  <JackpotStats userId={user.id} showHistoryLink={true} />
                </div>

                {/* User Profile Card */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Profile Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Email
                      </label>
                      <p className="text-sm text-gray-900">{user.email}</p>
                    </div>
                    {profile?.username && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Username
                        </label>
                        <p className="text-sm text-gray-900">{profile.username}</p>
                      </div>
                    )}
                    {profile?.full_name && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Full Name
                        </label>
                        <p className="text-sm text-gray-900">{profile.full_name}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Create Contest
                    </button>
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                      View Contests
                    </button>
                    <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                      My Submissions
                    </button>
                  </div>
                </div>

                {/* Stats Card */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-green-900 mb-4">
                    Your Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Contests Created</span>
                      <span className="text-sm font-medium text-green-900">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Submissions</span>
                      <span className="text-sm font-medium text-green-900">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Total Votes</span>
                      <span className="text-sm font-medium text-green-900">0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
