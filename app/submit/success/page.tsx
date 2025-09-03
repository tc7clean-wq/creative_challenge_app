import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ArtworkSubmissionForm from '@/components/submit/ArtworkSubmissionForm'

export default async function SubmitSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; tier?: string }>
}) {
  const supabase = await createClient()
  const { session_id, tier } = await searchParams

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  if (!session_id) {
    redirect('/submit')
  }

  // Fetch active contest for submission
  const now = new Date().toISOString()
  const { data: activeContest } = await supabase
    .from('contests')
    .select('id, title')
    .lte('start_date', now)
    .gte('end_date', now)
    .eq('is_active', true)
    .single()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Now let&apos;s get your creative work submitted! Upload your artwork and provide the details below.
          </p>
        </div>

        <ArtworkSubmissionForm 
          sessionId={session_id}
          tier={tier || 'standard'}
          contestId={activeContest?.id}
          contestTitle={activeContest?.title}
        />
      </div>
    </div>
  )
}
