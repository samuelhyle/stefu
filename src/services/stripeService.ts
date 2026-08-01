const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''

export async function createCheckoutSession(
  priceId: string,
  successUrl = window.location.origin + '?success=true',
  cancelUrl = window.location.origin + '?canceled=true'
) {
  if (!STRIPE_PUBLISHABLE_KEY) {
    console.warn('Stripe not configured - using demo mode')
    return { sessionId: 'demo_session', url: null }
  }

  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId, successUrl, cancelUrl }),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const { sessionId, url } = await response.json()
    return { sessionId, url }
  } catch (error) {
    console.error('Checkout error:', error)
    throw error
  }
}

export async function redirectToCheckout(priceId: string) {
  const { url } = await createCheckoutSession(priceId)
  if (url) {
    window.location.href = url
  }
}

export function isStripeConfigured() {
  return Boolean(STRIPE_PUBLISHABLE_KEY)
}
