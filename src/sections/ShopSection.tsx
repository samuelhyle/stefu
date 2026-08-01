import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ExternalLink, ShoppingCart, Trash2, X, ShieldCheck, Truck, Sparkles } from 'lucide-react'
import { redirectToCheckout, isStripeConfigured, STRIPE_PRICES } from '../services/stripeClient'

const shopItems = [
  { id: 1, name: 'Sober Life Hoodie', price: 79, priceId: STRIPE_PRICES.merch_basic, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80', description: 'Heavyweight fleece. Engineered for resilience, cut for confidence.' },
  { id: 2, name: 'Sober Life Cap', price: 39, priceId: STRIPE_PRICES.merch_basic, image: '/sober_cap.jpg', description: 'Limited-run 6-panel cap. Made for those who lead, not follow.' },
  { id: 3, name: 'Sober Life Tee', price: 45, priceId: STRIPE_PRICES.merch_basic, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', description: 'Premium 100% cotton. The uniform of the disciplined.' },
  { id: 4, name: 'Sober Life Print', price: 29, priceId: STRIPE_PRICES.merch_basic, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80', description: 'Museum-grade archival print. A daily reminder of the code.' },
]

const storePerks = [
  { icon: ShieldCheck, label: 'Secure Checkout' },
  { icon: Truck, label: 'Worldwide Delivery' },
  { icon: Sparkles, label: 'Limited Drops' },
]

export default function ShopSection() {
  const [cart, setCart] = useState<any[]>([])
  const [showCart, setShowCart] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const addToCart = (item: any) => {
    setCart(prev => [...prev, item])
    setShowCart(true)
  }

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)
  const cartCount = cart.length

  const handleCheckout = async () => {
    if (!isStripeConfigured()) {
      alert('Stripe payments are demo mode. Add VITE_STRIPE_PUBLISHABLE_KEY to .env to enable real payments.')
      return
    }

    if (cart.length === 0) return

    setCheckoutLoading(true)
    try {
      await redirectToCheckout(STRIPE_PRICES.merch_basic)
    } catch (error) {
      console.error('Checkout failed:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <section id="shop" className="py-16 md:py-20 bg-gradient-to-b from-obsidian-300 to-obsidian-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-gold-500/20 text-gold-500 text-sm font-semibold mb-4 tracking-widest">
            <ShoppingBag className="w-4 h-4 mr-2" />
            SOBER LIFE STORE
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Own the <span className="text-gradient">Sober Life</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
            Legendary quality. Limited quantities. Wear the standard
            that separates the disciplined from the rest.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 md:mb-12">
          {storePerks.map((perk) => {
            const Icon = perk.icon
            return (
              <span
                key={perk.label}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-obsidian-200/50 border border-white/10 text-white/70 text-xs md:text-sm"
              >
                <Icon className="w-4 h-4 text-gold-500" />
                <span>{perk.label}</span>
              </span>
            )
          })}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {shopItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-obsidian-200/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 hover:border-gold-500/30 transition-colors"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-400/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gold-500 text-obsidian-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                  Bestseller
                </span>
              </div>
              <div className="p-3 md:p-4">
                <h3 className="text-white font-semibold text-sm md:text-base mb-1">{item.name}</h3>
                <p className="text-white/50 text-[11px] md:text-xs mb-2 leading-relaxed line-clamp-2">{item.description}</p>
                <p className="text-gold-500 font-bold text-base md:text-lg mb-3">€{item.price}</p>
                <motion.button
                  onClick={() => addToCart(item)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-lg bg-gold-500 text-obsidian-400 font-semibold text-xs md:text-sm hover:bg-gold-400 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <motion.button
            onClick={() => setShowCart(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center space-x-3 px-6 py-3 rounded-xl bg-obsidian-200 text-white hover:bg-obsidian-100 transition-colors relative min-h-[44px]"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>View Cart ({cartCount})</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gold-500 text-obsidian-400 text-xs font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </motion.button>
        </div>

        <div className="text-center mt-10">
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 px-8 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors min-h-[44px]"
          >
            <span>View All Products</span>
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </div>
      </div>

      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm md:bg-black/40"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[80] max-h-[85dvh] overflow-y-auto bg-obsidian-300 rounded-t-3xl border-t border-white/10 shadow-2xl md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-h-[80vh] md:w-full md:max-w-md md:rounded-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Shopping cart"
            >
              <div className="sticky top-0 z-10 bg-obsidian-300/95 backdrop-blur-md px-6 pt-3 pb-4 border-b border-white/10 rounded-t-3xl">
                <div className="mx-auto w-10 h-1 rounded-full bg-white/20 mb-3 md:hidden" />
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <ShoppingBag className="w-5 h-5 text-gold-500" />
                    <span>Your Cart</span>
                  </h3>
                  <button
                    onClick={() => setShowCart(false)}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
                    aria-label="Close cart"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-5">
                {cart.length === 0 ? (
                  <p className="text-white/50 text-center py-8">
                    Your cart is empty. The standard is waiting — add something legendary.
                  </p>
                ) : (
                  <>
                    <div className="space-y-3 mb-4">
                      {cart.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-obsidian-200/60 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                            <div>
                              <p className="text-white text-sm font-medium">{item.name}</p>
                              <p className="text-gold-500 text-sm">€{item.price}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-red-400 transition-colors"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <div className="flex justify-between text-white mb-4">
                        <span>Total:</span>
                        <span className="text-gold-500 font-bold text-xl">€{cartTotal}</span>
                      </div>
                      <motion.button
                        onClick={handleCheckout}
                        disabled={checkoutLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full min-h-[48px] py-3 rounded-xl bg-gold-500 text-obsidian-400 font-semibold hover:bg-gold-400 transition-colors disabled:opacity-50"
                      >
                        {checkoutLoading ? 'Processing...' : 'Checkout with Stripe'}
                      </motion.button>
                      <button
                        onClick={clearCart}
                        className="w-full min-h-[44px] mt-2 py-2 text-white/50 hover:text-white text-sm transition-colors"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
