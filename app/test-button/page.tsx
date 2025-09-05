'use client'

export default function TestButtonPage() {
  const handleTestClick = () => {
    console.log('Button clicked!')
    alert('Button works!')
  }

  const handleNavigate = () => {
    console.log('Navigating...')
    window.location.href = '/auth-simple'
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-white mb-8">Button Test Page</h1>
        
        <div className="space-y-4">
          <button
            onClick={handleTestClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Test Alert Button
          </button>
          
          <button
            onClick={handleNavigate}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Navigate to Auth
          </button>
          
          <a
            href="/auth-simple"
            className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Direct Link to Auth
          </a>
        </div>
      </div>
    </div>
  )
}
