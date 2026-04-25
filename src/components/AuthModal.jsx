import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Chrome } from 'lucide-react'
import { signIn, signUp, signInWithGoogle } from '../services/authService'
import { useFocusTrap } from '../hooks/useFocusTrap'

export default function AuthModal({ isOpen, onClose, initialMode = 'signin', onSuccess }) {
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const dialogRef = useFocusTrap(isOpen)

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (mode === 'signup') {
        const { user, error } = await signUp(email, password, name)
        if (error) throw error
        setSuccess('Account created! Check your email to confirm.')
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        onSuccess?.()
        onClose()
      }
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [mode, email, password, name, onClose])

  const handleGoogleSignIn = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await signInWithGoogle()
      if (error) throw error
    } catch (err) {
      setError(err.message || 'Google sign in failed')
    } finally {
      setLoading(false)
    }
  }, [])

  const switchMode = useCallback((newMode) => {
    setMode(newMode)
    setError(null)
    setSuccess(null)
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={mode === 'signin' ? 'Sign in' : 'Sign up'}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md bg-obsidian-300 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-display font-bold text-gradient mb-2">
                  {mode === 'signin' ? 'Welcome Back' : 'Join the Circle'}
                </h2>
                <p className="text-white/60">
                  {mode === 'signin' 
                    ? 'Sign in to access exclusive content'
                    : 'Create your account to start watching'
                  }
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-sm"
                >
                  {success}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-obsidian-200 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-obsidian-200 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-obsidian-200 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gold-500 text-obsidian-400 font-semibold hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
                </motion.button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-obsidian-300 text-white/40">or continue with</span>
                </div>
              </div>

              <motion.button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-white text-obsidian-400 font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center space-x-3"
                whileTap={{ scale: 0.98 }}
              >
                <Chrome className="w-5 h-5" />
                <span>Google</span>
              </motion.button>

              <div className="mt-6 text-center">
                {mode === 'signin' ? (
                  <p className="text-white/60 text-sm">
                    Don't have an account?{' '}
                    <button
                      onClick={() => switchMode('signup')}
                      className="text-gold-500 hover:text-gold-400 font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p className="text-white/60 text-sm">
                    Already have an account?{' '}
                    <button
                      onClick={() => switchMode('signin')}
                      className="text-gold-500 hover:text-gold-400 font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}