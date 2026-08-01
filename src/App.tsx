import { useState, useEffect, useCallback, Suspense, lazy, useMemo } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, type NavigateFunction } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import type { User } from '@supabase/supabase-js'

import VideoModal from './components/VideoModal'
import AuthModal from './components/AuthModal'
import WelcomePage from './components/WelcomePage'
import SEO from './components/SEO'
import { ToastProvider } from './components/Toast'
import { AppContext } from './context/AppContext'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import { signOut } from './services/authService'
import type { ContentItem, AppContextType } from './types'

import HomePage from './pages/HomePage'
import WatchPage from './pages/WatchPage'
import MomentsPage from './pages/MomentsPage'

import { featuredContent, categoriesContent, momentsContent } from './data/content'

const AdminDashboard = lazy(() => import('./admin/Dashboard'))

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || ''

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-obsidian-400 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60">Loading...</p>
      </div>
    </div>
  )
}

interface AdminRouteProps {
  user: User | null
  loading: boolean
  onAuthSuccess: () => void
}

function AdminRoute({ user, loading, onAuthSuccess }: AdminRouteProps) {
  if (loading) return <LoadingFallback />
  if (!user) {
    return (
      <>
        <SEO title="Admin" path="/admin" />
        <div className="min-h-screen bg-obsidian-400 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/60 mb-6 text-lg">Sign in to access the admin dashboard.</p>
          </div>
        </div>
        <AuthModal
          isOpen={true}
          onClose={() => {
            window.location.href = '/'
          }}
          initialMode="signin"
          onSuccess={onAuthSuccess}
        />
      </>
    )
  }
  if (ADMIN_EMAIL && user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-obsidian-400 flex items-center justify-center">
        <p className="text-white/60">Access denied.</p>
      </div>
    )
  }
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminDashboard />
    </Suspense>
  )
}

function AppInner() {
  const navigate: NavigateFunction = useNavigate()
  const [activeSection, setActiveSection] = useState('live')
  const [selectedVideo, setSelectedVideo] = useState<ContentItem | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authRequiredCallback, setAuthRequiredCallback] = useState<(() => void) | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin')
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() =>
    Boolean(localStorage.getItem('stefu_welcome_seen'))
  )

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  const handleSignOut = useCallback(async () => {
    await signOut()
    setUser(null)
    localStorage.removeItem('stefu_welcome_seen')
    setHasSeenWelcome(false)
  }, [])

  const scrollTo = useCallback((id: string) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleVideoSelect = useCallback((video: ContentItem) => {
    setSelectedVideo(video)
    setIsVideoModalOpen(true)
  }, [])

  const handleVideoClose = useCallback(() => {
    setIsVideoModalOpen(false)
    setSelectedVideo(null)
  }, [])

  const handleAuthRequired = useCallback((callback: () => void) => {
    setAuthRequiredCallback(() => callback)
    setIsAuthModalOpen(true)
  }, [])

  const handleAuthClose = useCallback(() => {
    setIsAuthModalOpen(false)
    setAuthRequiredCallback(null)
  }, [])

  const handleAuthSuccess = useCallback(() => {
    setIsAuthModalOpen(false)
    if (authRequiredCallback) {
      authRequiredCallback()
      setAuthRequiredCallback(null)
    }
  }, [authRequiredCallback])

  const openSignIn = useCallback(() => {
    setAuthModalMode('signin')
    setIsAuthModalOpen(true)
  }, [])

  const openSignUp = useCallback(() => {
    setAuthModalMode('signup')
    setIsAuthModalOpen(true)
  }, [])

  const handleEnterSite = useCallback(() => {
    localStorage.setItem('stefu_welcome_seen', 'true')
    setHasSeenWelcome(true)
  }, [])

  const allContent = useMemo(
    () => [
      ...featuredContent,
      ...Object.values(categoriesContent).flat(),
      ...momentsContent,
    ],
    []
  )

  if (loading) return <LoadingFallback />

  const ctx: AppContextType = {
    user,
    onVideoSelect: handleVideoSelect,
    onAuthRequired: handleAuthRequired,
    openSignIn,
    openSignUp,
    signOut: handleSignOut,
    navigate,
  }

  return (
    <AppContext.Provider value={ctx}>
      <ToastProvider>
        {!hasSeenWelcome && (
          <WelcomePage
            onEnter={handleEnterSite}
            onLogin={() => {
              handleEnterSite()
              openSignIn()
            }}
            onRegister={() => {
              handleEnterSite()
              openSignUp()
            }}
          />
        )}

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                allContent={allContent}
                handleVideoSelect={handleVideoSelect}
                openSignUp={openSignUp}
                scrollTo={scrollTo}
              />
            }
          />
          <Route path="/watch/:videoId" element={<WatchPage />} />
          <Route path="/moments" element={<MomentsPage />} />
          <Route
            path="/admin"
            element={<AdminRoute user={user} loading={loading} onAuthSuccess={handleAuthSuccess} />}
          />
          <Route
            path="*"
            element={
              <HomePage
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                allContent={allContent}
                handleVideoSelect={handleVideoSelect}
                openSignUp={openSignUp}
                scrollTo={scrollTo}
              />
            }
          />
        </Routes>

        <VideoModal
          video={selectedVideo}
          isOpen={isVideoModalOpen}
          onClose={handleVideoClose}
          isPremium={selectedVideo?.is_premium}
          onAuthRequired={() => {
            handleVideoClose()
            openSignIn()
          }}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={handleAuthClose}
          initialMode={authModalMode}
          onSuccess={handleAuthSuccess}
        />
      </ToastProvider>
    </AppContext.Provider>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </HelmetProvider>
  )
}
