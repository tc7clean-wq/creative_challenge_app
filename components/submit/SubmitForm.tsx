'use client'

import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import PaymentMethodSelector from '../payments/PaymentMethodSelector'

interface Package {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  popular?: boolean
  tier: string
}

const packages: Package[] = [
  {
    id: 'standard',
    name: 'Standard Entry',
    price: 5,
    description: 'Perfect for getting started with your creative journey',
    features: [
      'Basic submission to contest',
      'Standard visibility in gallery',
      'Eligible for community voting',
      'Basic analytics dashboard'
    ],
    tier: 'standard'
  },
  {
    id: 'featured',
    name: 'Featured Entry',
    price: 15,
    description: 'Enhanced visibility and better chances of winning',
    features: [
      'Featured placement in gallery',
      'Priority in contest listings',
      'Enhanced analytics dashboard',
      'Social media promotion',
      'Judge attention boost'
    ],
    popular: true,
    tier: 'featured'
  },
  {
    id: 'spotlight',
    name: 'Spotlight Entry',
    price: 30,
    description: 'Maximum exposure and premium contest experience',
    features: [
      'Top placement in gallery',
      'Premium contest positioning',
      'Full analytics suite',
      'Social media campaign',
      'Direct judge review',
      'Winner interview opportunity'
    ],
    tier: 'spotlight'
  }
]

export default function SubmitForm() {
  const [selectedPackage, setSelectedPackage] = useState<string>('featured')
  const [error, setError] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  const handlePaymentSuccess = (txHash?: string) => {
    if (txHash) {
      // Crypto payment success
      setError("🎉 Crypto payment successful! Your submission is now active.");
    } else {
      // Stripe payment success
      setError("🎉 Payment successful! Your submission is now active.");
    }
    setShowPayment(false);
  };

  const handlePaymentError = (error: string) => {
    setError(`❌ Payment failed: ${error}`);
    setShowPayment(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Left Column - Prize Focus */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-8 text-center text-white shadow-xl">
          <div className="text-6xl font-bold mb-4">🏆</div>
          <h2 className="text-3xl font-bold mb-4">Grand Prize</h2>
          <div className="text-5xl font-bold mb-2">$10,000</div>
          <p className="text-xl opacity-90">Jackpot Awaits!</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Why Submit Today?
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-gray-700">
                <span className="font-semibold">Exclusive Opportunity:</span> Limited time contest with amazing rewards
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-gray-700">
                <span className="font-semibold">Professional Exposure:</span> Get noticed by industry leaders and potential clients
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-gray-700">
                <span className="font-semibold">Portfolio Building:</span> Add this achievement to your creative resume
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-gray-700">
                <span className="font-semibold">Community Recognition:</span> Join a network of talented creators
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">
            🚀 Ready to Shine?
          </h3>
          <p className="text-blue-800 text-center">
            Your creativity deserves to be seen. Choose your package below and take the first step toward winning the grand prize!
          </p>
        </div>
      </div>

      {/* Right Column - Action Area */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Choose Your Submission Package
          </h3>
          
          <div className="space-y-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                  selectedPackage === pkg.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{pkg.name}</h4>
                    <p className="text-gray-600 text-sm">{pkg.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">${pkg.price}</div>
                    <div className="text-sm text-gray-500">one-time</div>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="package"
                      value={pkg.id}
                      checked={selectedPackage === pkg.id}
                      onChange={() => setSelectedPackage(pkg.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Select Package</span>
                  </div>
                  
                  {selectedPackage === pkg.id && (
                    <div className="text-green-600 font-semibold">
                      ✓ Selected
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            {!showPayment ? (
              <div className="text-center">
                <button 
                  onClick={() => setShowPayment(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Continue to Payment - ${packages.find(pkg => pkg.id === selectedPackage)?.price}
                </button>
                
                <p className="text-sm text-gray-500 mt-3">
                  Choose between credit card or crypto payment
                </p>
              </div>
            ) : (
              <PaymentMethodSelector
                amount={packages.find(pkg => pkg.id === selectedPackage)?.price || 0}
                packageName={packages.find(pkg => pkg.id === selectedPackage)?.name || ''}
                tier={packages.find(pkg => pkg.id === selectedPackage)?.tier || ''}
                onStripeSuccess={() => handlePaymentSuccess()}
                onCryptoSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">What Happens Next?</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>1. Choose your package (you can change this later)</p>
            <p>2. Upload your creative work and provide details</p>
            <p>3. Review and confirm your submission</p>
            <p>4. Get featured in our contest gallery</p>
            <p>5. Receive votes and feedback from the community</p>
          </div>
        </div>
      </div>
    </div>
  )
}
