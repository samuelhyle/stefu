import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Check, AlertCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function MailingList() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setMessage('')

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('subscribers')
          .insert([{ 
            email, 
            name: name || null,
            subscribed_at: new Date().toISOString(),
            status: 'active'
          }])

        if (error) {
          if (error.code === '23505') {
            setStatus('error')
            setMessage('This email is already subscribed!')
            return
          }
          throw error
        }
        
        setStatus('success')
        setMessage('Welcome to the inner circle! Check your email for free access.')
        setEmail('')
        setName('')
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const stored = JSON.parse(localStorage.getItem('stefu_mailing_list') || '[]')
        if (stored.includes(email)) {
          setStatus('error')
          setMessage('This email is already subscribed!')
          return
        }
        
        stored.push({ email, name, subscribed_at: new Date().toISOString() })
        localStorage.setItem('stefu_mailing_list', JSON.stringify(stored))
        
        setStatus('success')
        setMessage('Welcome to the inner circle! Check your email for free access.')
        setEmail('')
        setName('')
      }
    } catch (err) {
      console.error('Subscription error:', err)
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-gold-500/10 via-obsidian-200/80 to-obsidian-300 rounded-2xl border border-gold-500/30 p-8"
    >
      <div className="flex items-start space-x-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gold-500/20 flex items-center justify-center flex-shrink-0">
          <Mail className="w-7 h-7 text-gold-500" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">Join the Inner Circle</h3>
          <p className="text-white/60">
            Get free basic access. Be the first to know about exclusive content, drops, and events.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
            className="px-4 py-3 rounded-xl bg-obsidian-300/50 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading' || status === 'success'}
            className="px-4 py-3 rounded-xl bg-obsidian-300/50 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
          />
        </div>
        <motion.button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            whileHover={{ scale: status === 'success' ? 1 : 1.02 }}
            whileTap={{ scale: status === 'success' ? 1 : 0.98 }}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 ${
              status === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-gold-500 text-obsidian-400 hover:bg-gold-400'
            }`}
          >
            {status === 'loading' ? 'Joining...' : status === 'success' ? 'Joined!' : 'Get Free Access'}
          </motion.button>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center space-x-2 text-sm ${
              status === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {status === 'success' ? (
              <Check className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{message}</span>
          </motion.div>
        )}
      </form>

      <p className="text-white/30 text-xs mt-4">
        By joining, you agree to receive updates from Stefu. Unsubscribe anytime.
      </p>
    </motion.div>
  )
}