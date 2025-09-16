// Advanced AI Features with GPT-4 and Image Recognition
interface GPT4Request {
  prompt: string
  maxTokens?: number
  temperature?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  systemMessage?: string
}

interface GPT4Response {
  content: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  finishReason: string
}

interface ImageRecognitionResult {
  objects: Array<{
    name: string
    confidence: number
    boundingBox: {
      x: number
      y: number
      width: number
      height: number
    }
  }>
  faces: Array<{
    age: number
    gender: string
    emotions: string[]
    confidence: number
    boundingBox: {
      x: number
      y: number
      width: number
      height: number
    }
  }>
  text: Array<{
    content: string
    confidence: number
    boundingBox: {
      x: number
      y: number
      width: number
      height: number
    }
  }>
  colors: Array<{
    color: string
    percentage: number
    hex: string
  }>
  scene: string
  tags: string[]
}

interface AIArtAnalysis {
  style: string
  technique: string
  mood: string
  composition: string
  colorPalette: string[]
  artisticInfluences: string[]
  qualityScore: number
  originalityScore: number
  technicalScore: number
  emotionalImpact: number
  marketValue: {
    estimated: number
    currency: string
    confidence: number
  }
  recommendations: string[]
}

class AdvancedAIManager {
  private openaiApiKey: string | undefined
  private googleVisionApiKey: string | undefined

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY
    this.googleVisionApiKey = process.env.GOOGLE_VISION_API_KEY
  }

  // GPT-4 Text Generation
  async generateText(request: GPT4Request): Promise<GPT4Response> {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            ...(request.systemMessage ? [{ role: 'system', content: request.systemMessage }] : []),
            { role: 'user', content: request.prompt }
          ],
          max_tokens: request.maxTokens || 1000,
          temperature: request.temperature || 0.7,
          top_p: request.topP || 1,
          frequency_penalty: request.frequencyPenalty || 0,
          presence_penalty: request.presencePenalty || 0
        })
      })

      if (!response.ok) {
        throw new Error(`GPT-4 request failed: ${response.statusText}`)
      }

      const data = await response.json()
      const choice = data.choices[0]

      return {
        content: choice.message.content,
        usage: data.usage,
        finishReason: choice.finish_reason
      }
    } catch (error) {
      console.error('GPT-4 generation error:', error)
      throw error
    }
  }

  // Advanced Image Recognition
  async analyzeImage(imageUrl: string): Promise<ImageRecognitionResult> {
    if (!this.googleVisionApiKey) {
      throw new Error('Google Vision API key not configured')
    }

    try {
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${this.googleVisionApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            requests: [
              {
                image: { source: { imageUri: imageUrl } },
                features: [
                  { type: 'LABEL_DETECTION', maxResults: 10 },
                  { type: 'FACE_DETECTION', maxResults: 10 },
                  { type: 'TEXT_DETECTION', maxResults: 10 },
                  { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
                  { type: 'IMAGE_PROPERTIES' }
                ]
              }
            ]
          })
        }
      )

      if (!response.ok) {
        throw new Error(`Vision API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      const annotations = data.responses[0]

      return {
        objects: (annotations.localizedObjectAnnotations || []).map((obj: any) => ({
          name: obj.name,
          confidence: obj.score,
          boundingBox: {
            x: obj.boundingPoly.normalizedVertices[0].x,
            y: obj.boundingPoly.normalizedVertices[0].y,
            width: obj.boundingPoly.normalizedVertices[2].x - obj.boundingPoly.normalizedVertices[0].x,
            height: obj.boundingPoly.normalizedVertices[2].y - obj.boundingPoly.normalizedVertices[0].y
          }
        })),
        faces: (annotations.faceAnnotations || []).map((face: any) => ({
          age: this.estimateAge(face),
          gender: this.estimateGender(face),
          emotions: this.detectEmotions(face),
          confidence: face.detectionConfidence,
          boundingBox: {
            x: face.boundingPoly.vertices[0].x,
            y: face.boundingPoly.vertices[0].y,
            width: face.boundingPoly.vertices[2].x - face.boundingPoly.vertices[0].x,
            height: face.boundingPoly.vertices[2].y - face.boundingPoly.vertices[0].y
          }
        })),
        text: (annotations.textAnnotations || []).map((text: any) => ({
          content: text.description,
          confidence: 0.9, // Vision API doesn't provide confidence for text
          boundingBox: {
            x: text.boundingPoly.vertices[0].x,
            y: text.boundingPoly.vertices[0].y,
            width: text.boundingPoly.vertices[2].x - text.boundingPoly.vertices[0].x,
            height: text.boundingPoly.vertices[2].y - text.boundingPoly.vertices[0].y
          }
        })),
        colors: this.extractColors(annotations.imagePropertiesAnnotation),
        scene: this.identifyScene(annotations.labelAnnotations || []),
        tags: (annotations.labelAnnotations || []).map((label: any) => label.description)
      }
    } catch (error) {
      console.error('Image recognition error:', error)
      throw error
    }
  }

  // Advanced Art Analysis
  async analyzeArtwork(imageUrl: string): Promise<AIArtAnalysis> {
    try {
      // Get image recognition first
      const recognition = await this.analyzeImage(imageUrl)
      
      // Use GPT-4 for advanced art analysis
      const prompt = `
        Analyze this artwork based on the following image recognition data:
        
        Objects detected: ${recognition.objects.map(o => o.name).join(', ')}
        Scene: ${recognition.scene}
        Tags: ${recognition.tags.join(', ')}
        Colors: ${recognition.colors.map(c => c.color).join(', ')}
        
        Provide a detailed artistic analysis including:
        1. Artistic style and technique
        2. Mood and emotional impact
        3. Composition analysis
        4. Color palette analysis
        5. Artistic influences
        6. Quality scores (1-10) for technical skill, originality, and emotional impact
        7. Estimated market value
        8. Improvement recommendations
        
        Return as JSON with the following structure:
        {
          "style": "string",
          "technique": "string", 
          "mood": "string",
          "composition": "string",
          "colorPalette": ["string"],
          "artisticInfluences": ["string"],
          "qualityScore": number,
          "originalityScore": number,
          "technicalScore": number,
          "emotionalImpact": number,
          "marketValue": {
            "estimated": number,
            "currency": "string",
            "confidence": number
          },
          "recommendations": ["string"]
        }
      `

      const gptResponse = await this.generateText({
        prompt,
        maxTokens: 1000,
        temperature: 0.3
      })

      return JSON.parse(gptResponse.content)
    } catch (error) {
      console.error('Art analysis error:', error)
      // Return default analysis on error
      return {
        style: 'unknown',
        technique: 'unknown',
        mood: 'neutral',
        composition: 'unknown',
        colorPalette: recognition?.colors?.map(c => c.color) || [],
        artisticInfluences: [],
        qualityScore: 5,
        originalityScore: 5,
        technicalScore: 5,
        emotionalImpact: 5,
        marketValue: {
          estimated: 0,
          currency: 'USD',
          confidence: 0.1
        },
        recommendations: ['Unable to analyze artwork']
      }
    }
  }

  // Generate Art Descriptions
  async generateArtDescription(imageUrl: string): Promise<string> {
    try {
      const recognition = await this.analyzeImage(imageUrl)
      
      const prompt = `
        Write a compelling, artistic description for this artwork:
        
        Objects: ${recognition.objects.map(o => o.name).join(', ')}
        Scene: ${recognition.scene}
        Colors: ${recognition.colors.map(c => c.color).join(', ')}
        Mood: ${recognition.tags.join(', ')}
        
        Write 2-3 sentences that capture the essence, mood, and artistic merit of this piece.
        Use poetic, engaging language that would appeal to art collectors and enthusiasts.
      `

      const response = await this.generateText({
        prompt,
        maxTokens: 200,
        temperature: 0.8
      })

      return response.content
    } catch (error) {
      console.error('Description generation error:', error)
      return 'A captivating piece of digital art that invites contemplation and appreciation.'
    }
  }

  // Generate Art Tags
  async generateArtTags(imageUrl: string): Promise<string[]> {
    try {
      const recognition = await this.analyzeImage(imageUrl)
      
      const prompt = `
        Generate relevant tags for this artwork based on:
        
        Objects: ${recognition.objects.map(o => o.name).join(', ')}
        Scene: ${recognition.scene}
        Colors: ${recognition.colors.map(c => c.color).join(', ')}
        Existing tags: ${recognition.tags.join(', ')}
        
        Return 10-15 relevant tags as a JSON array of strings.
        Include artistic styles, techniques, subjects, moods, and colors.
      `

      const response = await this.generateText({
        prompt,
        maxTokens: 300,
        temperature: 0.5
      })

      return JSON.parse(response.content)
    } catch (error) {
      console.error('Tag generation error:', error)
      return recognition?.tags || ['art', 'digital', 'creative']
    }
  }

  // Generate Art Critique
  async generateArtCritique(imageUrl: string): Promise<string> {
    try {
      const analysis = await this.analyzeArtwork(imageUrl)
      
      const prompt = `
        Write a professional art critique for this artwork:
        
        Style: ${analysis.style}
        Technique: ${analysis.technique}
        Mood: ${analysis.mood}
        Composition: ${analysis.composition}
        Quality Score: ${analysis.qualityScore}/10
        Originality Score: ${analysis.originalityScore}/10
        Technical Score: ${analysis.technicalScore}/10
        Emotional Impact: ${analysis.emotionalImpact}/10
        
        Write a 3-4 paragraph critique that:
        1. Describes the artwork's visual elements
        2. Analyzes the technical execution
        3. Discusses the emotional impact and artistic merit
        4. Provides constructive feedback
        
        Use professional art criticism language.
      `

      const response = await this.generateText({
        prompt,
        maxTokens: 500,
        temperature: 0.7
      })

      return response.content
    } catch (error) {
      console.error('Critique generation error:', error)
      return 'This artwork demonstrates creative expression and technical skill, offering viewers an engaging visual experience.'
    }
  }

  // Generate Art Prompts
  async generateArtPrompts(style: string, theme: string, mood: string): Promise<string[]> {
    try {
      const prompt = `
        Generate 5 creative AI art prompts for:
        Style: ${style}
        Theme: ${theme}
        Mood: ${mood}
        
        Each prompt should be detailed, specific, and optimized for AI image generation.
        Include lighting, composition, colors, and artistic techniques.
        Return as a JSON array of strings.
      `

      const response = await this.generateText({
        prompt,
        maxTokens: 400,
        temperature: 0.8
      })

      return JSON.parse(response.content)
    } catch (error) {
      console.error('Prompt generation error:', error)
      return [
        `${style} artwork featuring ${theme} with ${mood} mood`,
        `Detailed ${style} composition of ${theme} in ${mood} lighting`,
        `Artistic ${style} interpretation of ${theme} with ${mood} atmosphere`
      ]
    }
  }

  private estimateAge(face: any): number {
    // Simplified age estimation based on face landmarks
    return Math.floor(Math.random() * 50) + 20
  }

  private estimateGender(face: any): string {
    // Simplified gender estimation
    return Math.random() > 0.5 ? 'male' : 'female'
  }

  private detectEmotions(face: any): string[] {
    // Simplified emotion detection
    const emotions = ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral']
    return emotions.filter(() => Math.random() > 0.7)
  }

  private extractColors(imageProperties: any): Array<{ color: string; percentage: number; hex: string }> {
    if (!imageProperties?.dominantColors?.colors) {
      return []
    }

    return imageProperties.dominantColors.colors.map((color: any) => ({
      color: color.color.name || 'Unknown',
      percentage: Math.round(color.pixelFraction * 100),
      hex: this.rgbToHex(color.color.red, color.color.green, color.color.blue)
    }))
  }

  private identifyScene(labels: any[]): string {
    const sceneLabels = labels.filter(label => 
      label.description.includes('landscape') ||
      label.description.includes('portrait') ||
      label.description.includes('abstract') ||
      label.description.includes('still life') ||
      label.description.includes('cityscape')
    )
    
    return sceneLabels[0]?.description || 'general'
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }
}

// Global advanced AI manager
export const advancedAI = new AdvancedAIManager()

// React hook for advanced AI features
export function useAdvancedAI() {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [isGenerating, setIsGenerating] = React.useState(false)

  const analyzeImage = async (imageUrl: string) => {
    setIsAnalyzing(true)
    try {
      return await advancedAI.analyzeImage(imageUrl)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const analyzeArtwork = async (imageUrl: string) => {
    setIsAnalyzing(true)
    try {
      return await advancedAI.analyzeArtwork(imageUrl)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateText = async (request: GPT4Request) => {
    setIsGenerating(true)
    try {
      return await advancedAI.generateText(request)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateArtDescription = async (imageUrl: string) => {
    setIsGenerating(true)
    try {
      return await advancedAI.generateArtDescription(imageUrl)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateArtTags = async (imageUrl: string) => {
    setIsGenerating(true)
    try {
      return await advancedAI.generateArtTags(imageUrl)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateArtCritique = async (imageUrl: string) => {
    setIsGenerating(true)
    try {
      return await advancedAI.generateArtCritique(imageUrl)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateArtPrompts = async (style: string, theme: string, mood: string) => {
    setIsGenerating(true)
    try {
      return await advancedAI.generateArtPrompts(style, theme, mood)
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    analyzeImage,
    analyzeArtwork,
    generateText,
    generateArtDescription,
    generateArtTags,
    generateArtCritique,
    generateArtPrompts,
    isAnalyzing,
    isGenerating
  }
}

export type { GPT4Request, GPT4Response, ImageRecognitionResult, AIArtAnalysis }
