// Advanced Social Features and Community System
interface SocialProfile {
  id: string
  username: string
  displayName: string
  bio: string
  avatar: string
  coverImage?: string
  location?: string
  website?: string
  socialLinks: {
    twitter?: string
    instagram?: string
    behance?: string
    dribbble?: string
    github?: string
  }
  stats: {
    followers: number
    following: number
    artworks: number
    likes: number
    views: number
    collections: number
  }
  preferences: {
    privacy: 'public' | 'private' | 'friends'
    notifications: {
      likes: boolean
      follows: boolean
      comments: boolean
      mentions: boolean
      contests: boolean
    }
    content: {
      showNSFW: boolean
      showMature: boolean
      language: string
    }
  }
  badges: string[]
  verified: boolean
  joinedAt: number
  lastActive: number
}

interface SocialPost {
  id: string
  authorId: string
  content: {
    text?: string
    images?: string[]
    video?: string
    artwork?: {
      id: string
      title: string
      imageUrl: string
    }
  }
  type: 'text' | 'image' | 'video' | 'artwork' | 'contest' | 'collection'
  visibility: 'public' | 'followers' | 'private'
  tags: string[]
  mentions: string[]
  location?: {
    name: string
    coordinates: { lat: number; lng: number }
  }
  stats: {
    likes: number
    comments: number
    shares: number
    views: number
  }
  createdAt: number
  updatedAt: number
}

interface SocialComment {
  id: string
  postId: string
  authorId: string
  content: string
  parentId?: string
  likes: number
  replies: SocialComment[]
  createdAt: number
  updatedAt: number
}

interface SocialFollow {
  id: string
  followerId: string
  followingId: string
  createdAt: number
  status: 'active' | 'blocked' | 'muted'
}

interface SocialNotification {
  id: string
  userId: string
  type: 'like' | 'follow' | 'comment' | 'mention' | 'contest' | 'achievement'
  title: string
  message: string
  data: any
  read: boolean
  createdAt: number
}

interface SocialGroup {
  id: string
  name: string
  description: string
  avatar: string
  coverImage?: string
  members: Array<{
    userId: string
    role: 'admin' | 'moderator' | 'member'
    joinedAt: number
  }>
  settings: {
    privacy: 'public' | 'private' | 'invite_only'
    allowPosts: boolean
    allowComments: boolean
    moderation: 'none' | 'reported' | 'all'
  }
  stats: {
    members: number
    posts: number
    discussions: number
  }
  createdAt: number
  updatedAt: number
}

interface SocialEvent {
  id: string
  title: string
  description: string
  type: 'contest' | 'workshop' | 'exhibition' | 'meetup' | 'webinar'
  hostId: string
  startDate: number
  endDate: number
  location?: {
    name: string
    address: string
    coordinates: { lat: number; lng: number }
  }
  online: boolean
  meetingUrl?: string
  attendees: string[]
  maxAttendees?: number
  price: number
  currency: string
  tags: string[]
  status: 'upcoming' | 'live' | 'ended' | 'cancelled'
  createdAt: number
}

class SocialFeaturesManager {
  private profiles = new Map<string, SocialProfile>()
  private posts = new Map<string, SocialPost>()
  private comments = new Map<string, SocialComment>()
  private follows = new Map<string, SocialFollow>()
  private notifications = new Map<string, SocialNotification>()
  private groups = new Map<string, SocialGroup>()
  private events = new Map<string, SocialEvent>()
  private feedCache = new Map<string, SocialPost[]>()

  constructor() {
    this.setupRealtimeSubscriptions()
  }

  // Profile Management
  async createProfile(profile: Omit<SocialProfile, 'id' | 'stats' | 'badges' | 'verified' | 'joinedAt' | 'lastActive'>): Promise<SocialProfile> {
    const newProfile: SocialProfile = {
      ...profile,
      id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      stats: {
        followers: 0,
        following: 0,
        artworks: 0,
        likes: 0,
        views: 0,
        collections: 0
      },
      badges: [],
      verified: false,
      joinedAt: Date.now(),
      lastActive: Date.now()
    }

    this.profiles.set(newProfile.id, newProfile)
    return newProfile
  }

  async updateProfile(profileId: string, updates: Partial<SocialProfile>): Promise<SocialProfile | null> {
    const profile = this.profiles.get(profileId)
    if (!profile) return null

    Object.assign(profile, updates, { lastActive: Date.now() })
    this.profiles.set(profileId, profile)
    return profile
  }

  async getProfile(profileId: string): Promise<SocialProfile | null> {
    return this.profiles.get(profileId) || null
  }

  async getProfileByUsername(username: string): Promise<SocialProfile | null> {
    for (const profile of this.profiles.values()) {
      if (profile.username === username) {
        return profile
      }
    }
    return null
  }

  // Post Management
  async createPost(post: Omit<SocialPost, 'id' | 'stats' | 'createdAt' | 'updatedAt'>): Promise<SocialPost> {
    const newPost: SocialPost = {
      ...post,
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      stats: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    this.posts.set(newPost.id, newPost)
    this.updateFeedCache(newPost)
    this.notifyMentions(newPost)
    
    return newPost
  }

  async getPost(postId: string): Promise<SocialPost | null> {
    return this.posts.get(postId) || null
  }

  async updatePost(postId: string, updates: Partial<SocialPost>): Promise<SocialPost | null> {
    const post = this.posts.get(postId)
    if (!post) return null

    Object.assign(post, updates, { updatedAt: Date.now() })
    this.posts.set(postId, post)
    return post
  }

  async deletePost(postId: string): Promise<boolean> {
    return this.posts.delete(postId)
  }

  // Feed Management
  async getFeed(userId: string, limit: number = 20, offset: number = 0): Promise<SocialPost[]> {
    const cacheKey = `${userId}_${limit}_${offset}`
    
    if (this.feedCache.has(cacheKey)) {
      return this.feedCache.get(cacheKey)!
    }

    const following = await this.getFollowing(userId)
    const followingIds = following.map(f => f.followingId)
    
    const allPosts = Array.from(this.posts.values())
      .filter(post => 
        followingIds.includes(post.authorId) || post.authorId === userId
      )
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(offset, offset + limit)

    this.feedCache.set(cacheKey, allPosts)
    return allPosts
  }

  async getProfileFeed(profileId: string, limit: number = 20, offset: number = 0): Promise<SocialPost[]> {
    return Array.from(this.posts.values())
      .filter(post => post.authorId === profileId)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(offset, offset + limit)
  }

  // Follow Management
  async followUser(followerId: string, followingId: string): Promise<SocialFollow> {
    const follow: SocialFollow = {
      id: `follow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      followerId,
      followingId,
      createdAt: Date.now(),
      status: 'active'
    }

    this.follows.set(follow.id, follow)
    
    // Update follower counts
    const follower = this.profiles.get(followerId)
    const following = this.profiles.get(followingId)
    
    if (follower) {
      follower.stats.following++
      this.profiles.set(followerId, follower)
    }
    
    if (following) {
      following.stats.followers++
      this.profiles.set(followingId, following)
    }

    // Create notification
    await this.createNotification({
      userId: followingId,
      type: 'follow',
      title: 'New Follower',
      message: `${follower?.displayName || 'Someone'} started following you`,
      data: { followerId }
    })

    return follow
  }

  async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    const follow = Array.from(this.follows.values())
      .find(f => f.followerId === followerId && f.followingId === followingId)
    
    if (!follow) return false

    this.follows.delete(follow.id)
    
    // Update follower counts
    const follower = this.profiles.get(followerId)
    const following = this.profiles.get(followingId)
    
    if (follower) {
      follower.stats.following--
      this.profiles.set(followerId, follower)
    }
    
    if (following) {
      following.stats.followers--
      this.profiles.set(followingId, following)
    }

    return true
  }

  async getFollowing(userId: string): Promise<SocialFollow[]> {
    return Array.from(this.follows.values())
      .filter(f => f.followerId === userId && f.status === 'active')
  }

  async getFollowers(userId: string): Promise<SocialFollow[]> {
    return Array.from(this.follows.values())
      .filter(f => f.followingId === userId && f.status === 'active')
  }

  // Like Management
  async likePost(postId: string, userId: string): Promise<boolean> {
    const post = this.posts.get(postId)
    if (!post) return false

    post.stats.likes++
    this.posts.set(postId, post)

    // Create notification
    await this.createNotification({
      userId: post.authorId,
      type: 'like',
      title: 'Post Liked',
      message: 'Someone liked your post',
      data: { postId, likerId: userId }
    })

    return true
  }

  async unlikePost(postId: string, userId: string): Promise<boolean> {
    const post = this.posts.get(postId)
    if (!post) return false

    post.stats.likes = Math.max(0, post.stats.likes - 1)
    this.posts.set(postId, post)
    return true
  }

  // Comment Management
  async createComment(comment: Omit<SocialComment, 'id' | 'likes' | 'replies' | 'createdAt' | 'updatedAt'>): Promise<SocialComment> {
    const newComment: SocialComment = {
      ...comment,
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      likes: 0,
      replies: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    this.comments.set(newComment.id, newComment)
    
    // Update post comment count
    const post = this.posts.get(comment.postId)
    if (post) {
      post.stats.comments++
      this.posts.set(comment.postId, post)
    }

    // Create notification
    await this.createNotification({
      userId: post?.authorId || '',
      type: 'comment',
      title: 'New Comment',
      message: 'Someone commented on your post',
      data: { postId: comment.postId, commentId: newComment.id }
    })

    return newComment
  }

  async getComments(postId: string): Promise<SocialComment[]> {
    return Array.from(this.comments.values())
      .filter(c => c.postId === postId && !c.parentId)
      .sort((a, b) => a.createdAt - b.createdAt)
  }

  // Group Management
  async createGroup(group: Omit<SocialGroup, 'id' | 'members' | 'stats' | 'createdAt' | 'updatedAt'>): Promise<SocialGroup> {
    const newGroup: SocialGroup = {
      ...group,
      id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      members: [],
      stats: {
        members: 0,
        posts: 0,
        discussions: 0
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    this.groups.set(newGroup.id, newGroup)
    return newGroup
  }

  async joinGroup(groupId: string, userId: string): Promise<boolean> {
    const group = this.groups.get(groupId)
    if (!group) return false

    const existingMember = group.members.find(m => m.userId === userId)
    if (existingMember) return false

    group.members.push({
      userId,
      role: 'member',
      joinedAt: Date.now()
    })
    group.stats.members++
    this.groups.set(groupId, group)

    return true
  }

  async leaveGroup(groupId: string, userId: string): Promise<boolean> {
    const group = this.groups.get(groupId)
    if (!group) return false

    const memberIndex = group.members.findIndex(m => m.userId === userId)
    if (memberIndex === -1) return false

    group.members.splice(memberIndex, 1)
    group.stats.members--
    this.groups.set(groupId, group)

    return true
  }

  // Event Management
  async createEvent(event: Omit<SocialEvent, 'id' | 'attendees' | 'createdAt'>): Promise<SocialEvent> {
    const newEvent: SocialEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      attendees: [],
      createdAt: Date.now()
    }

    this.events.set(newEvent.id, newEvent)
    return newEvent
  }

  async joinEvent(eventId: string, userId: string): Promise<boolean> {
    const event = this.events.get(eventId)
    if (!event) return false

    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return false
    }

    if (event.attendees.includes(userId)) {
      return false
    }

    event.attendees.push(userId)
    this.events.set(eventId, event)

    return true
  }

  async leaveEvent(eventId: string, userId: string): Promise<boolean> {
    const event = this.events.get(eventId)
    if (!event) return false

    const attendeeIndex = event.attendees.indexOf(userId)
    if (attendeeIndex === -1) return false

    event.attendees.splice(attendeeIndex, 1)
    this.events.set(eventId, event)

    return true
  }

  // Notification Management
  async createNotification(notification: Omit<SocialNotification, 'id' | 'read' | 'createdAt'>): Promise<SocialNotification> {
    const newNotification: SocialNotification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      createdAt: Date.now()
    }

    this.notifications.set(newNotification.id, newNotification)
    return newNotification
  }

  async getNotifications(userId: string, limit: number = 20): Promise<SocialNotification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit)
  }

  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    const notification = this.notifications.get(notificationId)
    if (!notification) return false

    notification.read = true
    this.notifications.set(notificationId, notification)
    return true
  }

  // Search and Discovery
  async searchUsers(query: string, limit: number = 20): Promise<SocialProfile[]> {
    const searchTerm = query.toLowerCase()
    return Array.from(this.profiles.values())
      .filter(profile => 
        profile.username.toLowerCase().includes(searchTerm) ||
        profile.displayName.toLowerCase().includes(searchTerm) ||
        profile.bio.toLowerCase().includes(searchTerm)
      )
      .slice(0, limit)
  }

  async searchPosts(query: string, limit: number = 20): Promise<SocialPost[]> {
    const searchTerm = query.toLowerCase()
    return Array.from(this.posts.values())
      .filter(post => 
        post.content.text?.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit)
  }

  async getTrendingHashtags(limit: number = 10): Promise<Array<{ tag: string; count: number }>> {
    const tagCounts = new Map<string, number>()
    
    Array.from(this.posts.values()).forEach(post => {
      post.tags.forEach(tag => {
        const count = tagCounts.get(tag) || 0
        tagCounts.set(tag, count + 1)
      })
    })

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  // Analytics
  async getProfileAnalytics(profileId: string): Promise<{
    followers: number
    following: number
    posts: number
    likes: number
    views: number
    engagement: number
    topPosts: SocialPost[]
    followerGrowth: Array<{ date: string; count: number }>
  }> {
    const profile = this.profiles.get(profileId)
    if (!profile) {
      throw new Error('Profile not found')
    }

    const posts = Array.from(this.posts.values())
      .filter(post => post.authorId === profileId)
      .sort((a, b) => b.stats.likes - a.stats.likes)

    const totalLikes = posts.reduce((sum, post) => sum + post.stats.likes, 0)
    const totalViews = posts.reduce((sum, post) => sum + post.stats.views, 0)
    const engagement = profile.stats.followers > 0 ? (totalLikes / profile.stats.followers) * 100 : 0

    return {
      followers: profile.stats.followers,
      following: profile.stats.following,
      posts: profile.stats.artworks,
      likes: totalLikes,
      views: totalViews,
      engagement,
      topPosts: posts.slice(0, 5),
      followerGrowth: [] // Would need historical data
    }
  }

  // Helper methods
  private updateFeedCache(post: SocialPost): void {
    // Clear feed cache for all users who follow this author
    const followers = Array.from(this.follows.values())
      .filter(f => f.followingId === post.authorId)
      .map(f => f.followerId)

    followers.forEach(followerId => {
      const cacheKeys = Array.from(this.feedCache.keys())
        .filter(key => key.startsWith(`${followerId}_`))
      
      cacheKeys.forEach(key => this.feedCache.delete(key))
    })
  }

  private async notifyMentions(post: SocialPost): Promise<void> {
    if (!post.mentions || post.mentions.length === 0) return

    for (const mention of post.mentions) {
      await this.createNotification({
        userId: mention,
        type: 'mention',
        title: 'You were mentioned',
        message: `You were mentioned in a post`,
        data: { postId: post.id, authorId: post.authorId }
      })
    }
  }

  private setupRealtimeSubscriptions(): void {
    // This would setup real-time subscriptions for live updates
    console.log('Social features real-time subscriptions initialized')
  }
}

// Global social features manager
export const socialManager = new SocialFeaturesManager()

// React hook for social features
export function useSocialFeatures() {
  const [profile, setProfile] = React.useState<SocialProfile | null>(null)
  const [feed, setFeed] = React.useState<SocialPost[]>([])
  const [notifications, setNotifications] = React.useState<SocialNotification[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const createPost = async (postData: Omit<SocialPost, 'id' | 'stats' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true)
    try {
      const newPost = await socialManager.createPost(postData)
      setFeed(prev => [newPost, ...prev])
      return newPost
    } finally {
      setIsLoading(false)
    }
  }

  const likePost = async (postId: string, userId: string) => {
    const success = await socialManager.likePost(postId, userId)
    if (success) {
      setFeed(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, stats: { ...post.stats, likes: post.stats.likes + 1 } }
          : post
      ))
    }
    return success
  }

  const followUser = async (followerId: string, followingId: string) => {
    const follow = await socialManager.followUser(followerId, followingId)
    return follow
  }

  const getFeed = async (userId: string, limit: number = 20) => {
    setIsLoading(true)
    try {
      const feedData = await socialManager.getFeed(userId, limit)
      setFeed(feedData)
    } finally {
      setIsLoading(false)
    }
  }

  const getNotifications = async (userId: string) => {
    const notifs = await socialManager.getNotifications(userId)
    setNotifications(notifs)
  }

  return {
    profile,
    feed,
    notifications,
    isLoading,
    createPost,
    likePost,
    followUser,
    getFeed,
    getNotifications,
    setProfile
  }
}

export type { SocialProfile, SocialPost, SocialComment, SocialFollow, SocialNotification, SocialGroup, SocialEvent }
