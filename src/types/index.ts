export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  subscription_status: 'free' | 'premium' | 'inner_circle'
  subscription_expires_at: string | null
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

export interface Video {
  id: string
  title: string
  description: string | null
  url: string
  thumbnail: string | null
  category: 'trending' | 'exclusive' | 'lifestyle' | 'talks'
  type: 'live' | 'episode' | 'clip'
  duration: number | null
  views: number
  likes: number
  is_premium: boolean
  timeline_slot: 'morning' | 'afternoon' | 'evening' | 'night' | null
  timeline_time: string | null
  streamUrl?: string
  created_at: string
  updated_at: string
  video?: string
}

export interface GameScore {
  score: number
  achieved_at: string
}

export interface Message {
  id: string
  user_id: string | null
  username: string
  body: string
  created_at: string
}

export interface ContentItem {
  id: number | string
  title: string
  duration?: string
  views?: string | number
  likes?: string | number
  description?: string
  category?: string
  thumbnail: string
  video?: string
  is_premium?: boolean
  streamUrl?: string
}

export interface CategoryContent {
  [category: string]: ContentItem[]
}

export interface VideoState {
  title: string
  description: string
  url: string
  thumbnail: string
  category: string
  type: string
  duration: string
  is_premium: boolean
  timeline_slot: string | null
  timeline_time: string | null
}

export interface GameState {
  player: { x: number; y: number; vx: number; alive: boolean; respawnTimer: number }
  obstacles: { x: number; y: number; id: number }[]
  powerups: { x: number; y: number; id: number; type: string }[]
  score: number
  highScore: number
  playerCount: number
  mvpSocketId: string | null
  mvpUntil: number
  voteLeft: number
  voteRight: number
  lives: number
  invincible: boolean
  activePowerups: {
    shield: boolean
    double: boolean
    slow: boolean
    doubleUntil: number
    slowUntil: number
  }
  combo: number
  comboMultiplier: number
}

export interface AppContextType {
  user: import('@supabase/supabase-js').User | null
  onVideoSelect: (video: ContentItem) => void
  onAuthRequired: (callback: () => void) => void
  openSignIn: () => void
  openSignUp: () => void
  signOut: () => Promise<void>
  navigate: (path: string) => void
}
