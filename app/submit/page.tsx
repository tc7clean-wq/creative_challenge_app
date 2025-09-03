import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SubmitForm from '@/components/submit/SubmitForm'

export default async function SubmitPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Share Your Artwork
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your AI-generated artwork and share it with the creative community. 
            Get feedback, votes, and connect with fellow artists.
          </p>
        </div>

        <SubmitForm />
      </div>
    </div>
  )
}
