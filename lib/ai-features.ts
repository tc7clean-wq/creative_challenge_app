// Advanced AI Features for AI ArtVerse
interface AIGenerationRequest {
  prompt: string
  negativePrompt?: string
  model: 'dalle-3' | 'midjourney' | 'stable-diffusion' | 'custom'
  style?: string
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4'
  quality?: 'standard' | 'hd'
  seed?: number
  steps?: number
  cfgScale?: number
}

interface AIGenerationResult {
  id: string
  imageUrl: string
  prompt: string
  model: string
  metadata: {
    seed: number
    steps: number
    cfgScale: number
    generationTime: number
  }
  cost: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

interface AIAnalysisResult {
  tags: string[]
  style: string
  mood: string
  colors: string[]
  composition: string
  technicalQuality: number
  artisticScore: number
  nsfw: boolean
  violence: boolean
  hate: boolean
  confidence: number
}

class AIFeatureManager {
  private apiKey: string | undefined
  private baseUrl = 'https://api.openai.com/v1'

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY
  }

  // Generate AI artwork
  async generateArtwork(request: AIGenerationRequest): Promise<AIGenerationResult> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const startTime = Date.now()
    
    try {
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: request.prompt,
          n: 1,
          size: this.getImageSize(request.aspectRatio),
          quality: request.quality || 'standard',
          style: request.style || 'vivid'
        })
      })

      if (!response.ok) {
        throw new Error(`AI generation failed: ${response.statusText}`)
      }

      const data = await response.json()
      const generationTime = Date.now() - startTime

      return {
        id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        imageUrl: data.data[0].url,
        prompt: request.prompt,
        model: request.model,
        metadata: {
          seed: request.seed || Math.floor(Math.random() * 1000000),
          steps: request.steps || 50,
          cfgScale: request.cfgScale || 7.5,
          generationTime
        },
        cost: this.calculateCost(request.model, request.quality),
        status: 'completed'
      }
    } catch (error) {
      console.error('AI generation error:', error)
      throw error
    }
  }

  // Analyze artwork with AI
  async analyzeArtwork(imageUrl: string): Promise<AIAnalysisResult> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this artwork and provide: 1) 5-10 descriptive tags, 2) artistic style, 3) mood/emotion, 4) dominant colors (hex codes), 5) composition description, 6) technical quality (1-10), 7) artistic score (1-10), 8) NSFW content (true/false), 9) violence content (true/false), 10) hate content (true/false). Return as JSON.'
                },
                {
                  type: 'image_url',
                  image_url: { url: imageUrl }
                }
              ]
            }
          ],
          max_tokens: 500
        })
      })

      if (!response.ok) {
        throw new Error(`AI analysis failed: ${response.statusText}`)
      }

      const data = await response.json()
      const analysis = JSON.parse(data.choices[0].message.content)

      return {
        tags: analysis.tags || [],
        style: analysis.style || 'unknown',
        mood: analysis.mood || 'neutral',
        colors: analysis.colors || [],
        composition: analysis.composition || 'unknown',
        technicalQuality: analysis.technicalQuality || 5,
        artisticScore: analysis.artisticScore || 5,
        nsfw: analysis.nsfw || false,
        violence: analysis.violence || false,
        hate: analysis.hate || false,
        confidence: 0.85
      }
    } catch (error) {
      console.error('AI analysis error:', error)
      // Return default analysis on error
      return {
        tags: ['artwork', 'digital'],
        style: 'unknown',
        mood: 'neutral',
        colors: ['#000000'],
        composition: 'unknown',
        technicalQuality: 5,
        artisticScore: 5,
        nsfw: false,
        violence: false,
        hate: false,
        confidence: 0.1
      }
    }
  }

  // Generate prompt suggestions
  async generatePromptSuggestions(theme: string, style?: string): Promise<string[]> {
    if (!this.apiKey) {
      return this.getDefaultPrompts(theme)
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `Generate 5 creative AI art prompts for the theme "${theme}"${style ? ` in ${style} style` : ''}. Each prompt should be detailed, creative, and optimized for AI image generation. Return as a JSON array of strings.`
            }
          ],
          max_tokens: 300
        })
      })

      if (!response.ok) {
        throw new Error(`Prompt generation failed: ${response.statusText}`)
      }

      const data = await response.json()
      return JSON.parse(data.choices[0].message.content)
    } catch (error) {
      console.error('Prompt generation error:', error)
      return this.getDefaultPrompts(theme)
    }
  }

  // Style transfer
  async applyStyleTransfer(imageUrl: string, style: string): Promise<string> {
    // This would integrate with a style transfer API
    // For now, return the original image
    return imageUrl
  }

  // Upscale image
  async upscaleImage(imageUrl: string, scale: 2 | 4 = 2): Promise<string> {
    // This would integrate with an upscaling API like Real-ESRGAN
    // For now, return the original image
    return imageUrl
  }

  // Generate variations
  async generateVariations(imageUrl: string, count: number = 3): Promise<string[]> {
    // This would generate variations of the original image
    // For now, return array with original image
    return Array(count).fill(imageUrl)
  }

  private getImageSize(aspectRatio?: string): string {
    const sizes = {
      '1:1': '1024x1024',
      '16:9': '1792x1024',
      '9:16': '1024x1792',
      '4:3': '1024x1024',
      '3:4': '1024x1024'
    }
    return sizes[aspectRatio as keyof typeof sizes] || '1024x1024'
  }

  private calculateCost(model: string, quality?: string): number {
    const costs = {
      'dalle-3': quality === 'hd' ? 0.08 : 0.04,
      'midjourney': 0.05,
      'stable-diffusion': 0.01,
      'custom': 0.02
    }
    return costs[model as keyof typeof costs] || 0.01
  }

  private getDefaultPrompts(theme: string): string[] {
    const prompts = {
      'cyberpunk': [
        'Futuristic cyberpunk cityscape with neon lights and flying cars',
        'Cyberpunk character with glowing implants and holographic interface',
        'Neon-soaked alleyway with rain reflections and digital graffiti'
      ],
      'fantasy': [
        'Magical forest with glowing mushrooms and floating crystals',
        'Fantasy castle floating in the clouds with dragon flying overhead',
        'Mystical wizard with flowing robes and glowing staff'
      ],
      'space': [
        'Alien planet with multiple moons and strange vegetation',
        'Space station interior with advanced technology and cosmic views',
        'Astronaut exploring an ancient alien ruin on a distant world'
      ]
    }
    return prompts[theme as keyof typeof prompts] || [
      `Beautiful artwork featuring ${theme}`,
      `Creative interpretation of ${theme}`,
      `Artistic representation of ${theme}`
    ]
  }
}

// Global AI feature manager
export const aiFeatures = new AIFeatureManager()

// React hook for AI features
export function useAIFeatures() {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)

  const generateArtwork = async (request: AIGenerationRequest) => {
    setIsGenerating(true)
    try {
      return await aiFeatures.generateArtwork(request)
    } finally {
      setIsGenerating(false)
    }
  }

  const analyzeArtwork = async (imageUrl: string) => {
    setIsAnalyzing(true)
    try {
      return await aiFeatures.analyzeArtwork(imageUrl)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generatePrompts = async (theme: string, style?: string) => {
    return await aiFeatures.generatePromptSuggestions(theme, style)
  }

  return {
    generateArtwork,
    analyzeArtwork,
    generatePrompts,
    isGenerating,
    isAnalyzing
  }
}

export type { AIGenerationRequest, AIGenerationResult, AIAnalysisResult }
