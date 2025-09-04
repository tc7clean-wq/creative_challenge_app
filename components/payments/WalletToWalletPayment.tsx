'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface WalletToWalletPaymentProps {
  amount: number;
  packageName: string;
  tier: string;
  onSuccess: (txHash: string) => void;
  onError: (error: string) => void;
}

export default function WalletToWalletPayment({
  amount,
  packageName,
  tier,
  onSuccess,
  onError
}: WalletToWalletPaymentProps) {
  const [fromWallet, setFromWallet] = useState('');
  const [toWallet, setToWallet] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [currency, setCurrency] = useState('ETH');
  const [txHash, setTxHash] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);

  const supabase = createClient();

  const supportedCurrencies = [
    { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000' },
    { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86a33E6441b8c4C8C0C0C0C0C0C0C0C0C0C0' },
    { symbol: 'USDT', name: 'Tether', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
    { symbol: 'MATIC', name: 'Polygon', address: '0x0000000000000000000000000000000000001010' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromWallet || !toWallet || !cryptoAmount || !txHash) {
      onError('Please fill in all fields');
      return;
    }

    if (!fromWallet.startsWith('0x') || fromWallet.length !== 42) {
      onError('Invalid sender wallet address');
      return;
    }

    if (!toWallet.startsWith('0x') || toWallet.length !== 42) {
      onError('Invalid recipient wallet address');
      return;
    }

    setIsProcessing(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Record the crypto payment
      const { error: cryptoError } = await supabase
        .from('crypto_payments')
        .insert({
          user_id: user.id,
          tx_hash: txHash,
          amount_crypto: parseFloat(cryptoAmount),
          currency: currency,
          amount_usd: amount,
          package_name: packageName,
          tier: tier,
          wallet_address: fromWallet,
          status: 'completed'
        });

      if (cryptoError) throw cryptoError;

      // Record revenue transaction
      const { error: revenueError } = await supabase
        .from('revenue_transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'submission_payment',
          amount_paid: amount,
          platform_cut: amount * 0.15, // 15% platform fee
          prize_pool_contribution: amount * 0.85, // 85% to prize pool
          payment_method: 'crypto',
          crypto_tx_hash: txHash,
          crypto_currency: currency
        });

      if (revenueError) throw revenueError;

      onSuccess(txHash);
      setStep(3); // Success step
      
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Payment error:', error);
      }
      onError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  if (step === 1) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">
          💰 Wallet-to-Wallet Crypto Payment
        </h3>
        
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-white mb-2">Payment Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Package:</span>
                <span className="text-white ml-2">{packageName}</span>
              </div>
              <div>
                <span className="text-gray-400">Tier:</span>
                <span className="text-white ml-2">{tier}</span>
              </div>
              <div>
                <span className="text-gray-400">Amount:</span>
                <span className="text-white ml-2">${amount}</span>
              </div>
              <div>
                <span className="text-gray-400">Currency:</span>
                <span className="text-white ml-2">{currency}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-white mb-2">Platform Wallet Address</h4>
            <p className="text-gray-400 text-sm mb-2">
              Send your payment to this address:
            </p>
            <div className="flex items-center space-x-2">
              <code className="bg-gray-700 px-3 py-2 rounded text-green-400 text-sm flex-1">
                {toWallet || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'}
              </code>
              <button
                onClick={() => handleCopyAddress(toWallet || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
              >
                Copy
              </button>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
          >
            I&apos;ve Sent the Payment
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">
          📝 Confirm Payment Details
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Wallet Address (Sender)
            </label>
            <input
              type="text"
              value={fromWallet}
              onChange={(e) => setFromWallet(e.target.value)}
              placeholder="0x..."
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Platform Wallet Address (Recipient)
            </label>
            <input
              type="text"
              value={toWallet}
              onChange={(e) => setToWallet(e.target.value)}
              placeholder="0x..."
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Crypto Amount Sent
            </label>
            <input
              type="number"
              step="0.000001"
              value={cryptoAmount}
              onChange={(e) => setCryptoAmount(e.target.value)}
              placeholder="0.0"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cryptocurrency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {supportedCurrencies.map((curr) => (
                <option key={curr.symbol} value={curr.symbol}>
                  {curr.name} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Transaction Hash
            </label>
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="0x..."
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Find this in your wallet or blockchain explorer
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-white mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-400 mb-4">
          Your crypto payment has been recorded and your submission is now active.
        </p>
        <div className="bg-gray-800 p-4 rounded-lg text-left">
          <div className="text-sm text-gray-400">Transaction Hash:</div>
          <div className="text-green-400 font-mono text-sm break-all">{txHash}</div>
        </div>
      </div>
    );
  }

  return null;
}
