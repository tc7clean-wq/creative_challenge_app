// Voice Commands and Audio Features System
interface VoiceCommand {
  command: string
  action: () => void
  description: string
  keywords: string[]
  confidence?: number
}

interface AudioConfig {
  sampleRate: number
  channels: number
  bitDepth: number
  format: 'wav' | 'mp3' | 'ogg' | 'webm'
  quality: 'low' | 'medium' | 'high'
}

interface SpeechRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
  alternatives: Array<{
    transcript: string
    confidence: number
  }>
}

interface TextToSpeechConfig {
  voice: string
  rate: number
  pitch: number
  volume: number
  language: string
}

class VoiceManager {
  private recognition: any
  private synthesis: SpeechSynthesis
  private commands = new Map<string, VoiceCommand>()
  private isListening = false
  private isSpeaking = false
  private audioContext: AudioContext | null = null
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []

  constructor() {
    this.synthesis = window.speechSynthesis
    this.setupSpeechRecognition()
    this.setupAudioContext()
    this.setupDefaultCommands()
  }

  // Setup speech recognition
  private setupSpeechRecognition(): void {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition()
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition()
    } else {
      console.warn('Speech recognition not supported')
      return
    }

    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = 'en-US'

    this.recognition.onresult = (event: any) => {
      this.handleSpeechResult(event)
    }

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
    }

    this.recognition.onend = () => {
      this.isListening = false
    }
  }

  // Setup audio context
  private setupAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (error) {
      console.error('Audio context not supported:', error)
    }
  }

  // Setup default voice commands
  private setupDefaultCommands(): void {
    this.addCommand({
      command: 'navigate',
      action: () => this.speak('Navigation commands available'),
      description: 'Navigate through the application',
      keywords: ['navigate', 'go to', 'open', 'show']
    })

    this.addCommand({
      command: 'search',
      action: () => this.speak('Search functionality activated'),
      description: 'Search for content',
      keywords: ['search', 'find', 'look for']
    })

    this.addCommand({
      command: 'help',
      action: () => this.speak('Voice commands help: Say navigate, search, or help'),
      description: 'Show available voice commands',
      keywords: ['help', 'commands', 'what can you do']
    })

    this.addCommand({
      command: 'stop',
      action: () => this.stopListening(),
      description: 'Stop voice recognition',
      keywords: ['stop', 'quit', 'exit']
    })
  }

  // Add voice command
  addCommand(command: VoiceCommand): void {
    this.commands.set(command.command, command)
  }

  // Remove voice command
  removeCommand(command: string): void {
    this.commands.delete(command)
  }

  // Start voice recognition
  startListening(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'))
        return
      }

      if (this.isListening) {
        resolve()
        return
      }

      try {
        this.recognition.start()
        this.isListening = true
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  // Stop voice recognition
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  // Handle speech recognition result
  private handleSpeechResult(event: any): void {
    const result = event.results[event.results.length - 1]
    const transcript = result.transcript.toLowerCase().trim()
    const confidence = result.confidence || 0.8

    if (result.isFinal) {
      this.processVoiceCommand(transcript, confidence)
    }
  }

  // Process voice command
  private processVoiceCommand(transcript: string, confidence: number): void {
    let bestMatch: VoiceCommand | null = null
    let bestScore = 0

    for (const [commandName, command] of this.commands) {
      const score = this.calculateCommandScore(transcript, command, confidence)
      if (score > bestScore) {
        bestScore = score
        bestMatch = command
      }
    }

    if (bestMatch && bestScore > 0.5) {
      this.speak(`Executing ${bestMatch.description}`)
      bestMatch.action()
    } else {
      this.speak('Command not recognized. Say help for available commands.')
    }
  }

  // Calculate command match score
  private calculateCommandScore(
    transcript: string,
    command: VoiceCommand,
    confidence: number
  ): number {
    let score = 0
    const words = transcript.split(' ')

    for (const keyword of command.keywords) {
      if (transcript.includes(keyword)) {
        score += 1
      }
    }

    // Check for exact command match
    if (transcript.includes(command.command)) {
      score += 2
    }

    // Apply confidence multiplier
    score *= confidence

    return score
  }

  // Text to speech
  speak(
    text: string,
    config: Partial<TextToSpeechConfig> = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isSpeaking) {
        this.synthesis.cancel()
      }

      const utterance = new SpeechSynthesisUtterance(text)
      
      // Apply configuration
      utterance.voice = this.getVoice(config.voice)
      utterance.rate = config.rate || 1
      utterance.pitch = config.pitch || 1
      utterance.volume = config.volume || 1
      utterance.lang = config.language || 'en-US'

      utterance.onstart = () => {
        this.isSpeaking = true
      }

      utterance.onend = () => {
        this.isSpeaking = false
        resolve()
      }

      utterance.onerror = (event) => {
        this.isSpeaking = false
        reject(event)
      }

      this.synthesis.speak(utterance)
    })
  }

  // Get available voices
  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices()
  }

  // Get voice by name or language
  private getVoice(voiceName?: string): SpeechSynthesisVoice | null {
    const voices = this.getVoices()
    
    if (voiceName) {
      return voices.find(voice => voice.name === voiceName) || null
    }
    
    // Return default voice
    return voices.find(voice => voice.default) || voices[0] || null
  }

  // Start audio recording
  async startRecording(config: AudioConfig = {
    sampleRate: 44100,
    channels: 1,
    bitDepth: 16,
    format: 'webm',
    quality: 'high'
  }): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.mediaRecorder = new MediaRecorder(stream)
      this.audioChunks = []

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      this.mediaRecorder.start()
    } catch (error) {
      console.error('Failed to start recording:', error)
      throw error
    }
  }

  // Stop audio recording
  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'))
        return
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' })
        resolve(audioBlob)
      }

      this.mediaRecorder.stop()
      this.mediaRecorder = null
    })
  }

  // Play audio
  async playAudio(audioBlob: Blob): Promise<void> {
    try {
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl)
          resolve()
        }
        
        audio.onerror = reject
        audio.play()
      })
    } catch (error) {
      console.error('Failed to play audio:', error)
      throw error
    }
  }

  // Convert audio to text (using Web Speech API)
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    // This would typically use a cloud service like Google Cloud Speech-to-Text
    // For now, we'll use a placeholder implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Audio transcription not implemented')
      }, 1000)
    })
  }

  // Create audio visualization
  createAudioVisualization(
    canvas: HTMLCanvasElement,
    audioBlob: Blob
  ): void {
    if (!this.audioContext) return

    const fileReader = new FileReader()
    fileReader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer
        const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer)
        
        const canvasCtx = canvas.getContext('2d')
        if (!canvasCtx) return

        const data = audioBuffer.getChannelData(0)
        const barWidth = canvas.width / data.length

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
        canvasCtx.fillStyle = '#3498db'

        for (let i = 0; i < data.length; i++) {
          const barHeight = (data[i] + 1) * canvas.height / 2
          canvasCtx.fillRect(i * barWidth, canvas.height - barHeight, barWidth, barHeight)
        }
      } catch (error) {
        console.error('Failed to create audio visualization:', error)
      }
    }

    fileReader.readAsArrayBuffer(audioBlob)
  }

  // Create audio effects
  createAudioEffect(
    type: 'echo' | 'reverb' | 'distortion' | 'filter',
    audioBlob: Blob
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.audioContext) {
        reject(new Error('Audio context not available'))
        return
      }

      const fileReader = new FileReader()
      fileReader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer
          const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer)
          
          const source = this.audioContext!.createBufferSource()
          const gainNode = this.audioContext!.createGain()
          const destination = this.audioContext!.createMediaStreamDestination()

          source.buffer = audioBuffer
          source.connect(gainNode)
          gainNode.connect(destination)

          // Apply effect based on type
          switch (type) {
            case 'echo':
              this.applyEchoEffect(source, gainNode)
              break
            case 'reverb':
              this.applyReverbEffect(source, gainNode)
              break
            case 'distortion':
              this.applyDistortionEffect(source, gainNode)
              break
            case 'filter':
              this.applyFilterEffect(source, gainNode)
              break
          }

          source.start()
          resolve(audioBlob) // Simplified - would need proper audio processing
        } catch (error) {
          reject(error)
        }
      }

      fileReader.readAsArrayBuffer(audioBlob)
    })
  }

  // Apply echo effect
  private applyEchoEffect(source: AudioBufferSourceNode, gainNode: GainNode): void {
    const delayNode = this.audioContext!.createDelay()
    const feedbackGain = this.audioContext!.createGain()
    
    delayNode.delayTime.value = 0.3
    feedbackGain.gain.value = 0.3
    
    source.connect(delayNode)
    delayNode.connect(feedbackGain)
    feedbackGain.connect(delayNode)
    delayNode.connect(gainNode)
  }

  // Apply reverb effect
  private applyReverbEffect(source: AudioBufferSourceNode, gainNode: GainNode): void {
    const convolver = this.audioContext!.createConvolver()
    // Would need impulse response data for reverb
    source.connect(convolver)
    convolver.connect(gainNode)
  }

  // Apply distortion effect
  private applyDistortionEffect(source: AudioBufferSourceNode, gainNode: GainNode): void {
    const waveShaper = this.audioContext!.createWaveShaper()
    waveShaper.curve = this.makeDistortionCurve(50)
    waveShaper.oversample = '4x'
    
    source.connect(waveShaper)
    waveShaper.connect(gainNode)
  }

  // Apply filter effect
  private applyFilterEffect(source: AudioBufferSourceNode, gainNode: GainNode): void {
    const filter = this.audioContext!.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 1000
    
    source.connect(filter)
    filter.connect(gainNode)
  }

  // Create distortion curve
  private makeDistortionCurve(amount: number): Float32Array {
    const samples = 44100
    const curve = new Float32Array(samples)
    const deg = Math.PI / 180

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x))
    }

    return curve
  }

  // Get listening status
  getListeningStatus(): boolean {
    return this.isListening
  }

  // Get speaking status
  getSpeakingStatus(): boolean {
    return this.isSpeaking
  }

  // Get available commands
  getAvailableCommands(): VoiceCommand[] {
    return Array.from(this.commands.values())
  }
}

// Global voice manager
export const voiceManager = new VoiceManager()

// React hook for voice features
export function useVoiceFeatures() {
  const [isListening, setIsListening] = React.useState(false)
  const [isSpeaking, setIsSpeaking] = React.useState(false)
  const [availableCommands, setAvailableCommands] = React.useState<VoiceCommand[]>([])

  React.useEffect(() => {
    setAvailableCommands(voiceManager.getAvailableCommands())
  }, [])

  const startListening = async () => {
    try {
      await voiceManager.startListening()
      setIsListening(true)
    } catch (error) {
      console.error('Failed to start listening:', error)
    }
  }

  const stopListening = () => {
    voiceManager.stopListening()
    setIsListening(false)
  }

  const speak = async (text: string, config?: Partial<TextToSpeechConfig>) => {
    try {
      setIsSpeaking(true)
      await voiceManager.speak(text, config)
      setIsSpeaking(false)
    } catch (error) {
      console.error('Failed to speak:', error)
      setIsSpeaking(false)
    }
  }

  const addCommand = (command: VoiceCommand) => {
    voiceManager.addCommand(command)
    setAvailableCommands(voiceManager.getAvailableCommands())
  }

  const removeCommand = (commandName: string) => {
    voiceManager.removeCommand(commandName)
    setAvailableCommands(voiceManager.getAvailableCommands())
  }

  const startRecording = async (config?: AudioConfig) => {
    try {
      await voiceManager.startRecording(config)
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }

  const stopRecording = async () => {
    try {
      return await voiceManager.stopRecording()
    } catch (error) {
      console.error('Failed to stop recording:', error)
      return null
    }
  }

  return {
    isListening,
    isSpeaking,
    availableCommands,
    startListening,
    stopListening,
    speak,
    addCommand,
    removeCommand,
    startRecording,
    stopRecording
  }
}

export type { VoiceCommand, AudioConfig, SpeechRecognitionResult, TextToSpeechConfig }
