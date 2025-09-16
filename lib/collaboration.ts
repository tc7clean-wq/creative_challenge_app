// Real-time Collaboration System
interface CollaborationSession {
  id: string
  name: string
  type: 'artwork' | 'contest' | 'discussion' | 'workshop'
  participants: Array<{
    id: string
    name: string
    avatar?: string
    role: 'owner' | 'editor' | 'viewer'
    status: 'online' | 'away' | 'offline'
    lastSeen: number
  }>
  content: {
    artwork?: {
      id: string
      title: string
      imageUrl: string
      layers: CollaborationLayer[]
    }
    contest?: {
      id: string
      title: string
      description: string
      submissions: CollaborationSubmission[]
    }
    discussion?: {
      messages: CollaborationMessage[]
      topics: string[]
    }
  }
  settings: {
    allowAnonymous: boolean
    requireApproval: boolean
    maxParticipants: number
    sessionTimeout: number
  }
  createdAt: number
  updatedAt: number
}

interface CollaborationLayer {
  id: string
  name: string
  type: 'image' | 'text' | 'shape' | 'brush'
  data: any
  position: { x: number; y: number }
  size: { width: number; height: number }
  opacity: number
  visible: boolean
  locked: boolean
  createdBy: string
  createdAt: number
  updatedAt: number
}

interface CollaborationSubmission {
  id: string
  title: string
  description: string
  imageUrl: string
  submittedBy: string
  submittedAt: number
  votes: Array<{
    userId: string
    rating: number
    comment?: string
    timestamp: number
  }>
  comments: CollaborationMessage[]
  status: 'pending' | 'approved' | 'rejected'
}

interface CollaborationMessage {
  id: string
  content: string
  type: 'text' | 'image' | 'file' | 'system'
  senderId: string
  senderName: string
  timestamp: number
  edited?: boolean
  reactions: Array<{
    emoji: string
    userId: string
    timestamp: number
  }>
  replies?: CollaborationMessage[]
  mentions?: string[]
}

interface CollaborationCursor {
  userId: string
  userName: string
  position: { x: number; y: number }
  color: string
  lastSeen: number
}

class CollaborationManager {
  private supabase: any
  private sessions = new Map<string, CollaborationSession>()
  private cursors = new Map<string, CollaborationCursor>()
  private channels = new Map<string, any>()
  private eventHandlers = new Map<string, Function[]>()

  constructor(supabase: any) {
    this.supabase = supabase
    this.setupRealtimeSubscriptions()
  }

  // Create collaboration session
  async createSession(
    name: string,
    type: CollaborationSession['type'],
    ownerId: string,
    settings: Partial<CollaborationSession['settings']> = {}
  ): Promise<CollaborationSession> {
    const session: CollaborationSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      participants: [{
        id: ownerId,
        name: 'You',
        role: 'owner',
        status: 'online',
        lastSeen: Date.now()
      }],
      content: {},
      settings: {
        allowAnonymous: false,
        requireApproval: false,
        maxParticipants: 10,
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
        ...settings
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    this.sessions.set(session.id, session)
    await this.setupSessionChannel(session.id)
    
    return session
  }

  // Join collaboration session
  async joinSession(sessionId: string, userId: string, userName: string): Promise<boolean> {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    // Check if user is already in session
    const existingParticipant = session.participants.find(p => p.id === userId)
    if (existingParticipant) {
      existingParticipant.status = 'online'
      existingParticipant.lastSeen = Date.now()
      return true
    }

    // Check participant limit
    if (session.participants.length >= session.settings.maxParticipants) {
      return false
    }

    // Add new participant
    session.participants.push({
      id: userId,
      name: userName,
      role: 'viewer',
      status: 'online',
      lastSeen: Date.now()
    })

    session.updatedAt = Date.now()
    this.emit('participantJoined', { sessionId, userId, userName })
    
    return true
  }

  // Leave collaboration session
  async leaveSession(sessionId: string, userId: string): Promise<void> {
    const session = this.sessions.get(sessionId)
    if (!session) return

    const participantIndex = session.participants.findIndex(p => p.id === userId)
    if (participantIndex === -1) return

    session.participants[participantIndex].status = 'offline'
    session.participants[participantIndex].lastSeen = Date.now()
    
    session.updatedAt = Date.now()
    this.emit('participantLeft', { sessionId, userId })
  }

  // Update cursor position
  updateCursor(sessionId: string, userId: string, position: { x: number; y: number }): void {
    const session = this.sessions.get(sessionId)
    if (!session) return

    const participant = session.participants.find(p => p.id === userId)
    if (!participant) return

    const cursor: CollaborationCursor = {
      userId,
      userName: participant.name,
      position,
      color: this.getUserColor(userId),
      lastSeen: Date.now()
    }

    this.cursors.set(`${sessionId}_${userId}`, cursor)
    this.emit('cursorUpdated', { sessionId, cursor })
  }

  // Add layer to artwork
  async addLayer(
    sessionId: string,
    layer: Omit<CollaborationLayer, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CollaborationLayer> {
    const session = this.sessions.get(sessionId)
    if (!session || session.type !== 'artwork') return null as any

    const newLayer: CollaborationLayer = {
      ...layer,
      id: `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    if (!session.content.artwork) {
      session.content.artwork = {
        id: `artwork_${Date.now()}`,
        title: 'Collaborative Artwork',
        imageUrl: '',
        layers: []
      }
    }

    session.content.artwork.layers.push(newLayer)
    session.updatedAt = Date.now()

    this.emit('layerAdded', { sessionId, layer: newLayer })
    return newLayer
  }

  // Update layer
  async updateLayer(
    sessionId: string,
    layerId: string,
    updates: Partial<CollaborationLayer>
  ): Promise<boolean> {
    const session = this.sessions.get(sessionId)
    if (!session || session.type !== 'artwork') return false

    const layer = session.content.artwork?.layers.find(l => l.id === layerId)
    if (!layer) return false

    Object.assign(layer, updates, { updatedAt: Date.now() })
    session.updatedAt = Date.now()

    this.emit('layerUpdated', { sessionId, layerId, updates })
    return true
  }

  // Send message
  async sendMessage(
    sessionId: string,
    content: string,
    senderId: string,
    senderName: string,
    type: CollaborationMessage['type'] = 'text'
  ): Promise<CollaborationMessage> {
    const session = this.sessions.get(sessionId)
    if (!session) return null as any

    const message: CollaborationMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      type,
      senderId,
      senderName,
      timestamp: Date.now(),
      reactions: []
    }

    if (!session.content.discussion) {
      session.content.discussion = {
        messages: [],
        topics: []
      }
    }

    session.content.discussion.messages.push(message)
    session.updatedAt = Date.now()

    this.emit('messageSent', { sessionId, message })
    return message
  }

  // Add reaction to message
  async addReaction(
    sessionId: string,
    messageId: string,
    emoji: string,
    userId: string
  ): Promise<void> {
    const session = this.sessions.get(sessionId)
    if (!session) return

    const message = session.content.discussion?.messages.find(m => m.id === messageId)
    if (!message) return

    // Remove existing reaction from this user
    message.reactions = message.reactions.filter(r => r.userId !== userId)
    
    // Add new reaction
    message.reactions.push({
      emoji,
      userId,
      timestamp: Date.now()
    })

    session.updatedAt = Date.now()
    this.emit('reactionAdded', { sessionId, messageId, emoji, userId })
  }

  // Submit to contest
  async submitToContest(
    sessionId: string,
    submission: Omit<CollaborationSubmission, 'id' | 'submittedAt' | 'votes' | 'comments' | 'status'>
  ): Promise<CollaborationSubmission> {
    const session = this.sessions.get(sessionId)
    if (!session || session.type !== 'contest') return null as any

    const newSubmission: CollaborationSubmission = {
      ...submission,
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      submittedAt: Date.now(),
      votes: [],
      comments: [],
      status: 'pending'
    }

    if (!session.content.contest) {
      session.content.contest = {
        id: `contest_${Date.now()}`,
        title: 'Collaborative Contest',
        description: '',
        submissions: []
      }
    }

    session.content.contest.submissions.push(newSubmission)
    session.updatedAt = Date.now()

    this.emit('submissionAdded', { sessionId, submission: newSubmission })
    return newSubmission
  }

  // Vote on submission
  async voteOnSubmission(
    sessionId: string,
    submissionId: string,
    userId: string,
    rating: number,
    comment?: string
  ): Promise<void> {
    const session = this.sessions.get(sessionId)
    if (!session || session.type !== 'contest') return

    const submission = session.content.contest?.submissions.find(s => s.id === submissionId)
    if (!submission) return

    // Remove existing vote from this user
    submission.votes = submission.votes.filter(v => v.userId !== userId)
    
    // Add new vote
    submission.votes.push({
      userId,
      rating,
      comment,
      timestamp: Date.now()
    })

    session.updatedAt = Date.now()
    this.emit('voteAdded', { sessionId, submissionId, userId, rating })
  }

  // Get session data
  getSession(sessionId: string): CollaborationSession | undefined {
    return this.sessions.get(sessionId)
  }

  // Get active cursors
  getCursors(sessionId: string): CollaborationCursor[] {
    const cursors: CollaborationCursor[] = []
    for (const [key, cursor] of this.cursors) {
      if (key.startsWith(`${sessionId}_`)) {
        cursors.push(cursor)
      }
    }
    return cursors
  }

  // Event handling
  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, [])
    }
    this.eventHandlers.get(event)!.push(handler)
  }

  off(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.forEach(handler => handler(data))
    }
  }

  private async setupSessionChannel(sessionId: string): Promise<void> {
    const channel = this.supabase.channel(`collaboration_${sessionId}`)
    
    channel
      .on('broadcast', { event: 'cursor_update' }, (payload: any) => {
        this.emit('cursorUpdated', payload)
      })
      .on('broadcast', { event: 'layer_update' }, (payload: any) => {
        this.emit('layerUpdated', payload)
      })
      .on('broadcast', { event: 'message_sent' }, (payload: any) => {
        this.emit('messageSent', payload)
      })
      .subscribe()

    this.channels.set(sessionId, channel)
  }

  private setupRealtimeSubscriptions(): void {
    // Setup global realtime subscriptions
    const globalChannel = this.supabase.channel('collaboration_global')
    
    globalChannel
      .on('broadcast', { event: 'session_created' }, (payload: any) => {
        this.emit('sessionCreated', payload)
      })
      .on('broadcast', { event: 'session_updated' }, (payload: any) => {
        this.emit('sessionUpdated', payload)
      })
      .subscribe()
  }

  private getUserColor(userId: string): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ]
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    return colors[Math.abs(hash) % colors.length]
  }
}

// React hook for collaboration
export function useCollaboration(supabase: any) {
  const [collaborationManager] = React.useState(() => new CollaborationManager(supabase))
  const [currentSession, setCurrentSession] = React.useState<CollaborationSession | null>(null)
  const [cursors, setCursors] = React.useState<CollaborationCursor[]>([])
  const [messages, setMessages] = React.useState<CollaborationMessage[]>([])

  React.useEffect(() => {
    const handleCursorUpdate = (data: any) => {
      if (data.sessionId === currentSession?.id) {
        setCursors(prev => {
          const filtered = prev.filter(c => c.userId !== data.cursor.userId)
          return [...filtered, data.cursor]
        })
      }
    }

    const handleMessageSent = (data: any) => {
      if (data.sessionId === currentSession?.id) {
        setMessages(prev => [...prev, data.message])
      }
    }

    collaborationManager.on('cursorUpdated', handleCursorUpdate)
    collaborationManager.on('messageSent', handleMessageSent)

    return () => {
      collaborationManager.off('cursorUpdated', handleCursorUpdate)
      collaborationManager.off('messageSent', handleMessageSent)
    }
  }, [currentSession, collaborationManager])

  const createSession = async (name: string, type: CollaborationSession['type'], ownerId: string) => {
    const session = await collaborationManager.createSession(name, type, ownerId)
    setCurrentSession(session)
    return session
  }

  const joinSession = async (sessionId: string, userId: string, userName: string) => {
    const success = await collaborationManager.joinSession(sessionId, userId, userName)
    if (success) {
      const session = collaborationManager.getSession(sessionId)
      setCurrentSession(session || null)
    }
    return success
  }

  const leaveSession = async (sessionId: string, userId: string) => {
    await collaborationManager.leaveSession(sessionId, userId)
    setCurrentSession(null)
    setCursors([])
    setMessages([])
  }

  const updateCursor = (position: { x: number; y: number }) => {
    if (currentSession) {
      collaborationManager.updateCursor(currentSession.id, 'current_user', position)
    }
  }

  const sendMessage = async (content: string, senderId: string, senderName: string) => {
    if (currentSession) {
      return await collaborationManager.sendMessage(
        currentSession.id,
        content,
        senderId,
        senderName
      )
    }
  }

  return {
    collaborationManager,
    currentSession,
    cursors,
    messages,
    createSession,
    joinSession,
    leaveSession,
    updateCursor,
    sendMessage
  }
}

export type { CollaborationSession, CollaborationLayer, CollaborationSubmission, CollaborationMessage, CollaborationCursor }
