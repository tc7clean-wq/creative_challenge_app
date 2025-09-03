'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { validateFile, sanitizeText } from '@/lib/validation'

interface ArtworkSubmissionFormProps {
  sessionId: string
  tier: string
  contestId?: string
  contestTitle?: string
}

export default function ArtworkSubmissionForm({ 
  tier, 
  contestId, 
  contestTitle 
}: ArtworkSubmissionFormProps) {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError(null)
    setValidationErrors([])
    
    if (selectedFile) {
      // Comprehensive file validation
      const validation = validateFile(selectedFile)
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors)
        setFile(null)
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }
      
      setFile(selectedFile)
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTitle(value)
    setError(null)
    
    // Real-time title validation
    const validation = sanitizeText(value, 100)
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
    } else {
      setValidationErrors([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Final validation before submission
    const titleValidation = sanitizeText(title, 100)
    if (!titleValidation.isValid) {
      setError('Please fix the title validation errors.')
      return
    }
    
    if (!file) {
      setError('Please select an image file')
      return
    }

    if (!contestId) {
      setError('No active contest found. Please try again later.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setValidationErrors([])

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('User authentication failed')
      }

      // Upload file to Supabase Storage with secure naming
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 15)
      const fileName = `${timestamp}-${randomId}.${fileExt}`
      const filePath = `artwork-submissions/${fileName}`

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('artwork-submissions')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('artwork-submissions')
        .getPublicUrl(filePath)

      // Create submission record in database
      const { error: dbError } = await supabase
        .from('submissions')
        .insert({
          title: titleValidation.sanitizedValue,
          image_url: publicUrl,
          user_id: user.id,
          contest_id: contestId,
          tier: tier,
          status: 'pending_review',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (dbError) {
        // If database insert fails, try to clean up the uploaded file
        try {
          await supabase.storage
            .from('artwork-submissions')
            .remove([filePath])
        } catch (cleanupError) {
          console.error('Failed to cleanup uploaded file:', cleanupError)
        }
        throw new Error(`Database error: ${dbError.message}`)
      }

      setSuccess(true)
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (error) {
      console.error('Submission error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50')
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      const validation = validateFile(droppedFile)
      if (validation.isValid) {
        setFile(droppedFile)
        setError(null)
        setValidationErrors([])
      } else {
        setValidationErrors(validation.errors)
        setFile(null)
      }
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Submission Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            Your artwork &quot;{title}&quot; has been submitted successfully and is now under review.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Submit Your Artwork
        </h2>
        <p className="text-gray-600">
          {contestTitle ? `Contest: ${contestTitle}` : 'Creative Contest Entry'}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Tier: <span className="font-medium capitalize">{tier}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Artwork Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.length > 0 ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter a descriptive title for your artwork"
            maxLength={100}
            required
          />
          {validationErrors.length > 0 && (
            <div className="mt-1 text-sm text-red-600">
              {validationErrors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {title.length}/100 characters
          </p>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Artwork Image *
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-2">
                <CheckCircleIcon className="mx-auto h-8 w-8 text-green-500" />
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF, WebP up to 10MB
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              required
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !file || !title.trim() || validationErrors.length > 0}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting || !file || !title.trim() || validationErrors.length > 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Artwork'
          )}
        </button>
      </form>
    </div>
  )
}
