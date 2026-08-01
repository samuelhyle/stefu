import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, X } from 'lucide-react'
import { getActiveItems } from '../data/shopItems'
import { redirectToCheckout, isStripeConfigured } from '../services/stripeClient'

interface LiveShoppingOverlayProps {
  currentTime: number
  isPlaying: boolean
}

export default function LiveShoppingOverlay({ currentTime, isPlaying }: LiveShoppingOverlayProps) {
  const [activeItems, setActiveItems] = useState<ReturnType<typeof getActiveItems>>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!isPlaying) return
    const items = getActiveItems(currentTime).filter(i => !dismissed.has(i.id))
    setActiveItems(items)
  }, [currentTime, isPlaying, dismissed])

  const handleBuy = async (item: ReturnType<typeof getActiveItems>[0]) => {
    setCheckoutLoading(item.id)
    try {
      if (!isStripeConfigured()) {
        alert('Stripe is in demo mode. Add VITE_STRIPE_PUBLISHABLE_KEY to enable real payments.')
        return
      }
      await redirectToCheckout(item.priceId)
    } catch {
      alert('Checkout failed. Please try again.')
    } finally {
      setCheckoutLoading(null)
    }
  }

  const dismiss = (id: string) => {
    setDismissed(prev => new Set(prev).add(id))
    setActiveItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="absolute bottom-20 right-4 z-30 space-y-2 max-w-[calc(100vw-2rem)]">
      <AnimatePresence>
        {activeItems.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="bg-obsidian-400/95 backdrop-blur-md rounded-xl border border-gold-500/30 p-3 w-64 max-w-full shadow-2xl"
          >
            <div className="flex items-start space-x-3">
              <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                    <p className="text-gold-500 text-sm font-bold">€{item.price}</p>
                  </div>
                  <button onClick={() => dismiss(item.id)} className="text-white/40 hover:text-white ml-1 p-1" aria-label={`Dismiss ${item.name}`}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <motion.button
                  onClick={() => handleBuy(item)}
                  disabled={checkoutLoading === item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-2 w-full min-h-[36px] py-1.5 px-3 rounded-lg bg-gold-500 text-obsidian-400 text-xs font-semibold hover:bg-gold-400 transition-colors flex items-center justify-center space-x-1 disabled:opacity-50"
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>{checkoutLoading === item.id ? 'Loading...' : 'Buy Now'}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
