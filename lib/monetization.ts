// Advanced Monetization and Revenue System
interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'monthly' | 'yearly' | 'lifetime'
  features: string[]
  limits: {
    artworks: number
    storage: number // in GB
    contests: number
    collaborations: number
    aiGenerations: number
    prioritySupport: boolean
  }
  popular?: boolean
  color?: string
  icon?: string
}

interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'crypto' | 'bank_transfer'
  details: {
    last4?: string
    brand?: string
    expiry?: string
    name?: string
  }
  isDefault: boolean
  createdAt: number
}

interface Transaction {
  id: string
  userId: string
  type: 'subscription' | 'purchase' | 'sale' | 'withdrawal' | 'refund'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  description: string
  metadata: {
    planId?: string
    artworkId?: string
    contestId?: string
    paymentMethodId?: string
    stripePaymentIntentId?: string
    paypalOrderId?: string
    cryptoTransactionHash?: string
  }
  createdAt: number
  completedAt?: number
}

interface RevenueShare {
  id: string
  userId: string
  type: 'contest_prize' | 'artwork_sale' | 'referral' | 'affiliate'
  amount: number
  currency: string
  percentage: number
  sourceId: string
  status: 'pending' | 'paid' | 'cancelled'
  createdAt: number
  paidAt?: number
}

interface CreatorEarnings {
  userId: string
  totalEarnings: number
  thisMonth: number
  lastMonth: number
  breakdown: {
    artworkSales: number
    contestPrizes: number
    referrals: number
    subscriptions: number
    tips: number
  }
  pendingPayout: number
  nextPayoutDate: number
  payoutMethod: 'bank' | 'paypal' | 'crypto'
}

interface PricingTier {
  id: string
  name: string
  price: number
  currency: string
  features: string[]
  popular?: boolean
  color?: string
}

class MonetizationManager {
  private subscriptions = new Map<string, SubscriptionPlan>()
  private transactions = new Map<string, Transaction>()
  private revenueShares = new Map<string, RevenueShare>()
  private creatorEarnings = new Map<string, CreatorEarnings>()
  private paymentMethods = new Map<string, PaymentMethod>()

  constructor() {
    this.initializeDefaultPlans()
  }

  // Subscription Management
  async createSubscription(userId: string, planId: string, paymentMethodId: string): Promise<Transaction> {
    const plan = this.subscriptions.get(planId)
    if (!plan) {
      throw new Error('Subscription plan not found')
    }

    const transaction: Transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'subscription',
      amount: plan.price,
      currency: plan.currency,
      status: 'pending',
      description: `Subscription to ${plan.name}`,
      metadata: {
        planId,
        paymentMethodId
      },
      createdAt: Date.now()
    }

    // Process payment
    const paymentResult = await this.processPayment(transaction, paymentMethodId)
    
    if (paymentResult.success) {
      transaction.status = 'completed'
      transaction.completedAt = Date.now()
      await this.activateSubscription(userId, planId)
    } else {
      transaction.status = 'failed'
    }

    this.transactions.set(transaction.id, transaction)
    return transaction
  }

  async cancelSubscription(userId: string, planId: string): Promise<boolean> {
    // This would integrate with your subscription management system
    console.log(`Cancelling subscription for user ${userId}, plan ${planId}`)
    return true
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return Array.from(this.subscriptions.values())
  }

  async getActiveSubscription(userId: string): Promise<SubscriptionPlan | null> {
    // This would check the user's active subscription
    // For now, return null
    return null
  }

  // Payment Processing
  async processPayment(transaction: Transaction, paymentMethodId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const paymentMethod = this.paymentMethods.get(paymentMethodId)
      if (!paymentMethod) {
        return { success: false, error: 'Payment method not found' }
      }

      switch (paymentMethod.type) {
        case 'card':
          return await this.processCardPayment(transaction, paymentMethod)
        case 'paypal':
          return await this.processPayPalPayment(transaction, paymentMethod)
        case 'crypto':
          return await this.processCryptoPayment(transaction, paymentMethod)
        case 'bank_transfer':
          return await this.processBankTransfer(transaction, paymentMethod)
        default:
          return { success: false, error: 'Unsupported payment method' }
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      return { success: false, error: 'Payment processing failed' }
    }
  }

  private async processCardPayment(transaction: Transaction, paymentMethod: PaymentMethod): Promise<{ success: boolean; error?: string }> {
    try {
      // This would integrate with Stripe or similar payment processor
      const response = await fetch('/api/payments/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: transaction.amount,
          currency: transaction.currency,
          paymentMethodId: paymentMethod.id
        })
      })

      const result = await response.json()
      return { success: result.success, error: result.error }
    } catch (error) {
      return { success: false, error: 'Card payment failed' }
    }
  }

  private async processPayPalPayment(transaction: Transaction, paymentMethod: PaymentMethod): Promise<{ success: boolean; error?: string }> {
    try {
      // This would integrate with PayPal API
      const response = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: transaction.amount,
          currency: transaction.currency
        })
      })

      const result = await response.json()
      return { success: result.success, error: result.error }
    } catch (error) {
      return { success: false, error: 'PayPal payment failed' }
    }
  }

  private async processCryptoPayment(transaction: Transaction, paymentMethod: PaymentMethod): Promise<{ success: boolean; error?: string }> {
    try {
      // This would integrate with crypto payment processors
      const response = await fetch('/api/payments/crypto/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: transaction.amount,
          currency: transaction.currency,
          walletAddress: paymentMethod.details.name
        })
      })

      const result = await response.json()
      return { success: result.success, error: result.error }
    } catch (error) {
      return { success: false, error: 'Crypto payment failed' }
    }
  }

  private async processBankTransfer(transaction: Transaction, paymentMethod: PaymentMethod): Promise<{ success: boolean; error?: string }> {
    // Bank transfers are typically manual
    return { success: true }
  }

  // Artwork Sales
  async sellArtwork(artworkId: string, sellerId: string, buyerId: string, price: number, currency: string = 'USD'): Promise<Transaction> {
    const transaction: Transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: buyerId,
      type: 'purchase',
      amount: price,
      currency,
      status: 'pending',
      description: `Purchase of artwork ${artworkId}`,
      metadata: {
        artworkId,
        sellerId
      },
      createdAt: Date.now()
    }

    // Process payment
    const paymentResult = await this.processPayment(transaction, 'default_payment_method')
    
    if (paymentResult.success) {
      transaction.status = 'completed'
      transaction.completedAt = Date.now()
      
      // Calculate revenue share
      await this.calculateRevenueShare(sellerId, price, 'artwork_sale', artworkId)
    } else {
      transaction.status = 'failed'
    }

    this.transactions.set(transaction.id, transaction)
    return transaction
  }

  // Contest Prizes
  async awardContestPrize(contestId: string, winnerId: string, prizeAmount: number, currency: string = 'USD'): Promise<Transaction> {
    const transaction: Transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: winnerId,
      type: 'sale',
      amount: prizeAmount,
      currency,
      status: 'completed',
      description: `Contest prize for ${contestId}`,
      metadata: {
        contestId
      },
      createdAt: Date.now(),
      completedAt: Date.now()
    }

    this.transactions.set(transaction.id, transaction)
    
    // Add to creator earnings
    await this.addToCreatorEarnings(winnerId, prizeAmount, 'contestPrizes')
    
    return transaction
  }

  // Revenue Sharing
  private async calculateRevenueShare(userId: string, amount: number, type: string, sourceId: string): Promise<void> {
    const platformFee = 0.1 // 10% platform fee
    const creatorShare = amount * (1 - platformFee)
    
    const revenueShare: RevenueShare = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: type as any,
      amount: creatorShare,
      currency: 'USD',
      percentage: (1 - platformFee) * 100,
      sourceId,
      status: 'pending',
      createdAt: Date.now()
    }

    this.revenueShares.set(revenueShare.id, revenueShare)
    await this.addToCreatorEarnings(userId, creatorShare, 'artworkSales')
  }

  private async addToCreatorEarnings(userId: string, amount: number, category: keyof CreatorEarnings['breakdown']): Promise<void> {
    let earnings = this.creatorEarnings.get(userId)
    
    if (!earnings) {
      earnings = {
        userId,
        totalEarnings: 0,
        thisMonth: 0,
        lastMonth: 0,
        breakdown: {
          artworkSales: 0,
          contestPrizes: 0,
          referrals: 0,
          subscriptions: 0,
          tips: 0
        },
        pendingPayout: 0,
        nextPayoutDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
        payoutMethod: 'bank'
      }
    }

    earnings.totalEarnings += amount
    earnings.thisMonth += amount
    earnings.pendingPayout += amount
    earnings.breakdown[category] += amount

    this.creatorEarnings.set(userId, earnings)
  }

  // Creator Earnings
  async getCreatorEarnings(userId: string): Promise<CreatorEarnings | null> {
    return this.creatorEarnings.get(userId) || null
  }

  async requestPayout(userId: string, amount: number, method: 'bank' | 'paypal' | 'crypto'): Promise<boolean> {
    const earnings = this.creatorEarnings.get(userId)
    if (!earnings || earnings.pendingPayout < amount) {
      return false
    }

    // Process payout
    const payoutResult = await this.processPayout(userId, amount, method)
    
    if (payoutResult.success) {
      earnings.pendingPayout -= amount
      this.creatorEarnings.set(userId, earnings)
      return true
    }

    return false
  }

  private async processPayout(userId: string, amount: number, method: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/payouts/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount,
          method
        })
      })

      const result = await response.json()
      return { success: result.success, error: result.error }
    } catch (error) {
      return { success: false, error: 'Payout processing failed' }
    }
  }

  // Referral System
  async createReferralCode(userId: string): Promise<string> {
    const code = `REF_${userId}_${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    return code
  }

  async processReferral(referrerId: string, referredId: string, amount: number): Promise<void> {
    const referralBonus = amount * 0.05 // 5% referral bonus
    
    await this.addToCreatorEarnings(referrerId, referralBonus, 'referrals')
    
    const revenueShare: RevenueShare = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: referrerId,
      type: 'referral',
      amount: referralBonus,
      currency: 'USD',
      percentage: 5,
      sourceId: referredId,
      status: 'pending',
      createdAt: Date.now()
    }

    this.revenueShares.set(revenueShare.id, revenueShare)
  }

  // Analytics
  async getRevenueAnalytics(timeRange: '7d' | '30d' | '90d' | '1y'): Promise<{
    totalRevenue: number
    subscriptionRevenue: number
    artworkSales: number
    contestPrizes: number
    platformFees: number
    creatorPayouts: number
    growth: number
    topEarners: Array<{ userId: string; earnings: number }>
  }> {
    const now = Date.now()
    const timeRanges = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000
    }

    const startTime = now - timeRanges[timeRange]
    const transactions = Array.from(this.transactions.values())
      .filter(t => t.createdAt >= startTime && t.status === 'completed')

    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0)
    const subscriptionRevenue = transactions
      .filter(t => t.type === 'subscription')
      .reduce((sum, t) => sum + t.amount, 0)
    const artworkSales = transactions
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + t.amount, 0)
    const contestPrizes = transactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + t.amount, 0)

    const platformFees = totalRevenue * 0.1
    const creatorPayouts = totalRevenue * 0.9

    // Calculate top earners
    const earningsByUser = new Map<string, number>()
    Array.from(this.creatorEarnings.values()).forEach(earnings => {
      earningsByUser.set(earnings.userId, earnings.totalEarnings)
    })

    const topEarners = Array.from(earningsByUser.entries())
      .map(([userId, earnings]) => ({ userId, earnings }))
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 10)

    return {
      totalRevenue,
      subscriptionRevenue,
      artworkSales,
      contestPrizes,
      platformFees,
      creatorPayouts,
      growth: 0, // Would need historical data
      topEarners
    }
  }

  // Payment Methods
  async addPaymentMethod(userId: string, method: Omit<PaymentMethod, 'id' | 'createdAt'>): Promise<PaymentMethod> {
    const newMethod: PaymentMethod = {
      ...method,
      id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now()
    }

    this.paymentMethods.set(newMethod.id, newMethod)
    return newMethod
  }

  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    // This would filter by userId in a real implementation
    return Array.from(this.paymentMethods.values())
  }

  // Initialize default subscription plans
  private initializeDefaultPlans(): void {
    const plans: SubscriptionPlan[] = [
      {
        id: 'free',
        name: 'Free',
        description: 'Perfect for getting started',
        price: 0,
        currency: 'USD',
        interval: 'monthly',
        features: [
          '5 artworks per month',
          '1GB storage',
          'Basic AI features',
          'Community access'
        ],
        limits: {
          artworks: 5,
          storage: 1,
          contests: 1,
          collaborations: 2,
          aiGenerations: 10,
          prioritySupport: false
        }
      },
      {
        id: 'pro',
        name: 'Pro',
        description: 'For serious creators',
        price: 19.99,
        currency: 'USD',
        interval: 'monthly',
        features: [
          'Unlimited artworks',
          '50GB storage',
          'Advanced AI features',
          'Priority support',
          'Custom themes',
          'Analytics dashboard'
        ],
        limits: {
          artworks: -1, // unlimited
          storage: 50,
          contests: 5,
          collaborations: 10,
          aiGenerations: 100,
          prioritySupport: true
        },
        popular: true,
        color: '#6366f1'
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For teams and organizations',
        price: 99.99,
        currency: 'USD',
        interval: 'monthly',
        features: [
          'Everything in Pro',
          'Unlimited storage',
          'Team collaboration',
          'White-label options',
          'API access',
          'Dedicated support'
        ],
        limits: {
          artworks: -1,
          storage: -1,
          contests: -1,
          collaborations: -1,
          aiGenerations: -1,
          prioritySupport: true
        },
        color: '#059669'
      }
    ]

    plans.forEach(plan => {
      this.subscriptions.set(plan.id, plan)
    })
  }

  private async activateSubscription(userId: string, planId: string): Promise<void> {
    // This would activate the subscription in your user management system
    console.log(`Activating subscription for user ${userId}, plan ${planId}`)
  }
}

// Global monetization manager
export const monetizationManager = new MonetizationManager()

// React hook for monetization
export function useMonetization() {
  const [subscriptionPlans, setSubscriptionPlans] = React.useState<SubscriptionPlan[]>([])
  const [activeSubscription, setActiveSubscription] = React.useState<SubscriptionPlan | null>(null)
  const [creatorEarnings, setCreatorEarnings] = React.useState<CreatorEarnings | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    const loadPlans = async () => {
      const plans = await monetizationManager.getSubscriptionPlans()
      setSubscriptionPlans(plans)
    }
    loadPlans()
  }, [])

  const subscribe = async (userId: string, planId: string, paymentMethodId: string) => {
    setIsLoading(true)
    try {
      const transaction = await monetizationManager.createSubscription(userId, planId, paymentMethodId)
      return transaction
    } finally {
      setIsLoading(false)
    }
  }

  const getEarnings = async (userId: string) => {
    const earnings = await monetizationManager.getCreatorEarnings(userId)
    setCreatorEarnings(earnings)
    return earnings
  }

  const requestPayout = async (userId: string, amount: number, method: 'bank' | 'paypal' | 'crypto') => {
    return await monetizationManager.requestPayout(userId, amount, method)
  }

  const sellArtwork = async (artworkId: string, sellerId: string, buyerId: string, price: number) => {
    return await monetizationManager.sellArtwork(artworkId, sellerId, buyerId, price)
  }

  return {
    subscriptionPlans,
    activeSubscription,
    creatorEarnings,
    isLoading,
    subscribe,
    getEarnings,
    requestPayout,
    sellArtwork
  }
}

export type { SubscriptionPlan, PaymentMethod, Transaction, RevenueShare, CreatorEarnings, PricingTier }
