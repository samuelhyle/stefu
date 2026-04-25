import { loadStripe } from '@stripe/stripe-js'

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''

let stripePromise = null

export const getStripe = () => {
  if (!stripePromise && STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

export const isStripeConfigured = () => Boolean(STRIPE_PUBLISHABLE_KEY)

export const STRIPE_PRICES = {
  inner_circle_monthly: 'price_inner_circle_monthly_xxxxx',
  inner_circle_yearly: 'price_inner_circle_yearly_xxxxx',
  merch_basic: 'price_merch_basic_xxxxx',
  merch_premium: 'price_merch_premium_xxxxx',
}

export async function redirectToCheckout(priceId) {
  if (!STRIPE_PUBLISHABLE_KEY) {
    alert('Stripe not configured - this is a demo. Add VITE_STRIPE_PUBLISHABLE_KEY to enable payments.')
    return
  }

  const stripe = await getStripe()
  if (!stripe) {
    throw new Error('Stripe failed to load')
  }

  const { error } = await stripe.redirectToCheckout({
    lineItems: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    successUrl: `${window.location.origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${window.location.origin}/?canceled=true`,
  })

  if (error) {
    console.error('Stripe checkout error:', error)
    throw error
  }
}