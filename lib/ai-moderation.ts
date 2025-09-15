// AI Content Moderation System
interface TextAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral'
  toxicity: number
  readabilityScore: number
  aiGenerated: boolean
  confidence: number
}

interface ImageAnalysis {
  nsfw: boolean
  violence: boolean
  hate: boolean
  confidence: number
}

interface ModerationResult {
  approved: boolean
  reason?: string
  confidence: number
  flags: string[]
  suggestions?: string[]
}

class AIContentModerator {
  private apiKey: string | undefined

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY
  }

  async moderateText(text: string): Promise<ModerationResult> {
    try {
      const analysis = await this.analyzeText(text)
      
      const flags: string[] = []
      let approved = true
      let reason = ''

      // Check toxicity
      if (analysis.toxicity > 0.7) {
        flags.push('high_toxicity')
        approved = false
        reason = 'Content contains toxic language'
      }

      // Check for AI-generated content (if not allowed)
      if (analysis.aiGenerated && analysis.confidence > 0.8) {
        flags.push('ai_generated')
        // Don't auto-reject, just flag
      }

      // Check sentiment for extreme negativity
      if (analysis.sentiment === 'negative' && analysis.toxicity > 0.5) {
        flags.push('negative_sentiment')
      }

      return {
        approved,
        reason: approved ? undefined : reason,
        confidence: analysis.confidence,
        flags,
        suggestions: this.generateSuggestions(flags)
      }
    } catch (error) {
      console.error('Text moderation failed:', error)
      return {
        approved: true, // Fail open for now
        confidence: 0,
        flags: ['moderation_error']
      }
    }
  }

  async moderateImage(imageUrl: string): Promise<ModerationResult> {
    try {
      const analysis = await this.analyzeImage(imageUrl)
      
      const flags: string[] = []
      let approved = true
      let reason = ''

      if (analysis.nsfw) {
        flags.push('nsfw')
        approved = false
        reason = 'Image contains NSFW content'
      }

      if (analysis.violence) {
        flags.push('violence')
        approved = false
        reason = 'Image contains violent content'
      }

      if (analysis.hate) {
        flags.push('hate')
        approved = false
        reason = 'Image contains hateful content'
      }

      return {
        approved,
        reason: approved ? undefined : reason,
        confidence: analysis.confidence,
        flags,
        suggestions: this.generateSuggestions(flags)
      }
    } catch (error) {
      console.error('Image moderation failed:', error)
      return {
        approved: true, // Fail open for now
        confidence: 0,
        flags: ['moderation_error']
      }
    }
  }

  private async analyzeText(text: string): Promise<TextAnalysis> {
    // Simulate AI analysis - replace with actual API calls
    const sentiment = this.analyzeSentiment(text)
    const toxicity = await this.analyzeToxicity(text)
    const aiGenerated = this.detectAIText(text)

    return {
      sentiment: sentiment.sentiment,
      toxicity: sentiment.toxicity,
      readabilityScore: this.calculateReadability(text),
      aiGenerated: aiGenerated.aiGenerated,
      confidence: Math.min(sentiment.confidence, 0.9)
    }
  }

  private async analyzeImage(_imageUrl: string): Promise<ImageAnalysis> {
    // Simulate image analysis - replace with actual API calls
    return {
      nsfw: Math.random() < 0.1, // 10% chance for demo
      violence: Math.random() < 0.05, // 5% chance for demo
      hate: Math.random() < 0.02, // 2% chance for demo
      confidence: 0.8
    }
  }

  private analyzeSentiment(text: string): { sentiment: 'positive' | 'negative' | 'neutral', toxicity: number, confidence: number } {
    // Simple sentiment analysis
    const positiveWords = ['good', 'great', 'awesome', 'amazing', 'love', 'like', 'excellent', 'wonderful']
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'horrible', 'worst', 'stupid']
    
    const words = text.toLowerCase().split(/\s+/)
    const positiveCount = words.filter(word => positiveWords.includes(word)).length
    const negativeCount = words.filter(word => negativeWords.includes(word)).length
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
    if (positiveCount > negativeCount) sentiment = 'positive'
    else if (negativeCount > positiveCount) sentiment = 'negative'
    
    const toxicity = Math.min(negativeCount / words.length * 2, 1)
    const confidence = Math.min((positiveCount + negativeCount) / words.length * 3, 1)
    
    return { sentiment, toxicity, confidence }
  }

  private async analyzeToxicity(text: string): Promise<number> {
    // Simulate toxicity detection
    const toxicWords = ['hate', 'kill', 'die', 'stupid', 'idiot', 'moron']
    const words = text.toLowerCase().split(/\s+/)
    const toxicCount = words.filter(word => toxicWords.includes(word)).length

    return Math.min(toxicCount / words.length * 3, 1)
  }

  private detectAIText(text: string): { aiGenerated: boolean } {
    // Simple AI text detection heuristics
    const aiIndicators = [
      /as an ai/i,
      /i'm an ai/i,
      /i am an ai/i,
      /artificial intelligence/i,
      /machine learning/i
    ]

    const hasAIKeywords = aiIndicators.some(pattern => pattern.test(text))
    const isFormal = text.includes('Furthermore') || text.includes('Moreover') || text.includes('Additionally')
    const hasRepetitiveStructure = (text.match(/\./g) || []).length > 5 && text.length > 200

    return {
      aiGenerated: hasAIKeywords || (isFormal && hasRepetitiveStructure)
    }
  }

  private calculateReadability(text: string): number {
    // Simple readability score (0-100)
    const words = text.split(/\s+/).length
    const sentences = text.split(/[.!?]+/).length
    const syllables = text.split(/\s+/).reduce((acc, word) => acc + this.countSyllables(word), 0)
    
    if (sentences === 0) return 0
    
    const avgWordsPerSentence = words / sentences
    const avgSyllablesPerWord = syllables / words
    
    // Simplified Flesch Reading Ease
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    return Math.max(0, Math.min(100, score))
  }

  private countSyllables(word: string): number {
    // Simple syllable counting
    const vowels = 'aeiouy'
    let count = 0
    let previousWasVowel = false
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i].toLowerCase())
      if (isVowel && !previousWasVowel) {
        count++
      }
      previousWasVowel = isVowel
    }
    
    return Math.max(1, count)
  }

  private generateSuggestions(flags: string[]): string[] {
    const suggestions: string[] = []
    
    if (flags.includes('high_toxicity')) {
      suggestions.push('Consider using more respectful language')
    }
    
    if (flags.includes('ai_generated')) {
      suggestions.push('Please ensure content is original')
    }
    
    if (flags.includes('negative_sentiment')) {
      suggestions.push('Consider a more positive tone')
    }
    
    return suggestions
  }
}

export const aiModerator = new AIContentModerator()
export type { ModerationResult, TextAnalysis, ImageAnalysis }