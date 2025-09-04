'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import WalletToWalletPayment from './WalletToWalletPayment';

interface PaymentMethodSelectorProps {
  amount: number;
  packageName: string;
  tier: string;
  onStripeSuccess: () => void;
  onCryptoSuccess: (txHash: string) => void;
  onError: (error: string) => void;
}

export default function PaymentMethodSelector({
  amount,
  packageName,
  tier,
  onStripeSuccess,
  onCryptoSuccess,
  onError
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'crypto' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStripePayment = async () => {
    setIsLoading(true);
    try {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          packageName,
          tier,
        }),
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const { sessionId } = await response.json();
      
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw error;
      }

      onStripeSuccess();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Stripe error:', error);
      }
      onError(error instanceof Error ? error.message : 'Stripe payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedMethod === 'stripe') {
    return (
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">💳 Credit Card Payment</h3>
          <p className="text-gray-400 text-sm mb-4">
            Secure payment processed by Stripe
          </p>
          <button
            onClick={handleStripePayment}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Pay with Card'}
          </button>
        </div>
        <button
          onClick={() => setSelectedMethod(null)}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
        >
          ← Choose Different Payment Method
        </button>
      </div>
    );
  }

  if (selectedMethod === 'crypto') {
    return (
      <div className="space-y-4">
        <WalletToWalletPayment
          amount={amount}
          packageName={packageName}
          tier={tier}
          onSuccess={onCryptoSuccess}
          onError={onError}
        />
        <button
          onClick={() => setSelectedMethod(null)}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
        >
          ← Choose Different Payment Method
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white text-center mb-6">
        Choose Payment Method
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setSelectedMethod('stripe')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 px-4 rounded-lg transition-all duration-200 text-center"
        >
          <div className="text-3xl mb-2">💳</div>
          <div className="text-lg">Credit Card</div>
          <div className="text-sm opacity-80">Visa, Mastercard, Amex</div>
        </button>
        
        <button
          onClick={() => setSelectedMethod('crypto')}
          className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-bold py-6 px-4 rounded-lg transition-all duration-200 text-center"
        >
          <div className="text-3xl mb-2">₿</div>
          <div className="text-lg">Cryptocurrency</div>
          <div className="text-sm opacity-80">ETH, USDC, USDT, MATIC</div>
        </button>
      </div>
      
      <div className="text-center text-gray-400 text-sm">
        Both payment methods are secure and processed instantly
      </div>
    </div>
  );
}
