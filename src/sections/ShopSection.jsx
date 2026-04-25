import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, ExternalLink, Check, ShoppingCart, Trash2 } from 'lucide-react'
import { redirectToCheckout, isStripeConfigured, STRIPE_PRICES } from '../services/stripeClient'

const shopItems = [
  { id: 1, name: 'Stefu Merch Hoodie', price: 79, priceId: STRIPE_PRICES.merch_basic, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80', description: 'Premium quality hoodie with Stefu branding' },
  { id: 2, name: 'Limited Edition Cap', price: 39, priceId: STRIPE_PRICES.merch_basic, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80', description: 'Exclusive limited run cap' },
  { id: 3, name: 'Stefu T-Shirt', price: 45, priceId: STRIPE_PRICES.merch_basic, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', description: 'Classic fit t-shirt' },
  { id: 4, name: 'Premium Poster', price: 29, priceId: STRIPE_PRICES.merch_basic, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80', description: 'High quality print' },
]

export default function ShopSection() {
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const addToCart = (item) => {
    setCart(prev => [...prev, item])
  }

  const removeFromCart = (index) => {
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
    <section id="shop" className="py-20 bg-gradient-to-b from-obsidian-300 to-obsidian-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-gold-500/20 text-gold-500 text-sm font-semibold mb-4">
            <ShoppingBag className="w-4 h-4 mr-2" />
            SHOP
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Official Stefu Merch
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Get your exclusive Stefu merchandise. Limited editions available.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-400/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-1">{item.name}</h3>
                <p className="text-white/50 text-xs mb-2">{item.description}</p>
                <p className="text-gold-500 font-bold text-lg mb-3">€{item.price}</p>
                <motion.button
                  onClick={() => addToCart(item)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 px-4 rounded-lg bg-gold-500 text-obsidian-400 font-semibold text-sm hover:bg-gold-400 transition-colors flex items-center justify-center space-x-2"
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
            onClick={() => setShowCart(!showCart)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center space-x-3 px-6 py-3 rounded-xl bg-obsidian-200 text-white hover:bg-obsidian-100 transition-colors relative"
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

        {showCart && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 max-w-md mx-auto bg-obsidian-200/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-gold-500" />
              <span>Your Cart</span>
            </h3>

            {cart.length === 0 ? (
              <p className="text-white/50 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-obsidian-300/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <p className="text-white text-sm font-medium">{item.name}</p>
                          <p className="text-gold-500 text-sm">€{item.price}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-white/40 hover:text-red-400 transition-colors"
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
                    className="w-full py-3 rounded-xl bg-gold-500 text-obsidian-400 font-semibold hover:bg-gold-400 transition-colors disabled:opacity-50"
                  >
                    {checkoutLoading ? 'Processing...' : 'Checkout with Stripe'}
                  </motion.button>
                  <button
                    onClick={clearCart}
                    className="w-full mt-2 py-2 text-white/50 hover:text-white text-sm transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        <div className="text-center mt-10">
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 px-8 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <span>View All Products</span>
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </div>
      </div>
    </section>
  )
}