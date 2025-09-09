'use client'

import { useState, useRef } from 'react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
// Removed JackpotServiceClient import - service was deleted
import SocialNavbar from '@/components/layout/SocialNavbar'

export default function SubmitPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Upload, 2: Details, 3: Payment
  const [error, setError] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image must be less than 10MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const handleNext = () => {
    if (step === 1 && !imageFile) {
      setError('Please upload an image first')
      return
    }
    if (step === 2 && (!title.trim() || !description.trim())) {
      setError('Please fill in all fields')
      return
    }
    setStep(step + 1)
    setError('')
  }

  const handleSubmit = async () => {
    if (!imageFile || !title.trim() || !description.trim()) {
      setError('Please complete all steps')
      return
    }

    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
        router.push('/auth')
        return
      }

      // Upload image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('artwork-submissions')
        .upload(fileName, imageFile)

      if (uploadError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Upload error:', uploadError)
        }
        setError('Failed to upload image. Please try again.')
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('artwork-submissions')
        .getPublicUrl(fileName)

      // Create submission record
      const { error: submitError } = await supabase
        .from('submissions')
        .insert({
          title: title.trim(),
          description: description.trim(),
          image_url: publicUrl,
          user_id: user.id,
          status: 'approved',
          votes: 0
        })

      if (submitError) {
        console.error('Submit error:', submitError)
        setError(`Failed to submit artwork: ${submitError.message}`)
        return
      }

      // Jackpot service removed - entries are now handled through contest wins
      console.log('Artwork submitted successfully')

      // Redirect to success page
      router.push('/gallery')
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error submitting artwork:', error)
      }
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen cyber-bg">
      <SocialNavbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold cyber-text glitch mb-4" data-text="SUBMIT ARTWORK">
            SUBMIT ARTWORK
          </h1>
          <p className="text-xl text-cyan-300">Present your AI-generated artwork to our professional community</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-yellow-500 text-black' : 'bg-white/20 text-white/60'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-yellow-500' : 'bg-white/20'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-yellow-500 text-black' : 'bg-white/20 text-white/60'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-yellow-500' : 'bg-white/20'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 3 ? 'bg-yellow-500 text-black' : 'bg-white/20 text-white/60'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">📸 Upload Your Artwork</h2>
              
              <div className="text-center">
                {imagePreview ? (
                  <div className="mb-6">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={400}
                      height={400}
                      className="mx-auto rounded-lg border-4 border-white/20"
                    />
                    <button
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview(null)
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ''
                        }
                      }}
                      className="mt-4 text-white/60 hover:text-white transition-colors"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/30 rounded-lg p-12 cursor-pointer hover:border-white/50 transition-colors"
                  >
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-white/80 text-lg">Click to upload your artwork</p>
                    <p className="text-white/60 text-sm mt-2">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">✏️ Artwork Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your artwork a compelling title"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-yellow-500"
                    maxLength={100}
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your artwork, the AI tool used, and your creative process"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-yellow-500 h-32 resize-none"
                    maxLength={500}
                  />
                  <p className="text-white/60 text-sm mt-1">{description.length}/500 characters</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">🎯 Ready to Submit!</h2>
              
              <div className="bg-white/5 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Submission Summary</h3>
                <div className="space-y-2 text-white/80">
                  <p><strong>Title:</strong> {title}</p>
                  <p><strong>Description:</strong> {description}</p>
                  <p><strong>Status:</strong> Contest entry - Win jackpot spots!</p>
                </div>
              </div>
              
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
                <p className="text-green-200 text-sm">
                  🎯 <strong>Contest Entry!</strong> Submit your artwork to win jackpot spots! 
                  Once approved, your artwork will be featured in our gallery and you&apos;ll earn spots for the upcoming cash prize jackpot.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
              >
                ← Back
              </button>
            )}
            
            <div className="ml-auto">
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : '🚀 Submit Artwork'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            Need help? Check out our <Link href="/tutorial" className="text-yellow-400 hover:text-yellow-300">AI Art Tutorial</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
