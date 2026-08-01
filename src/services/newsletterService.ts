import { supabase, isSupabaseConfigured } from '../lib/supabase'

const MAILCHIMP_API_KEY = import.meta.env.VITE_MAILCHIMP_API_KEY
const MAILCHIMP_SERVER_PREFIX = import.meta.env.VITE_MAILCHIMP_SERVER_PREFIX
const MAILCHIMP_LIST_ID = import.meta.env.VITE_MAILCHIMP_LIST_ID

interface NewsletterResult {
  success: boolean
  error?: string
}

export async function subscribeToNewsletter(email: string, name?: string): Promise<NewsletterResult> {
  if (isSupabaseConfigured && MAILCHIMP_API_KEY) {
    const response = await fetch(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
      {
        method: 'POST',
        headers: {
          'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          merge_fields: name ? { FNAME: name } : undefined,
        }),
      }
    )

    if (!response.ok) {
      const data = await response.json()
      if (data.title === 'Member Exists') {
        return { success: false, error: 'Already subscribed' }
      }
      return { success: false, error: data.detail || 'Subscription failed' }
    }

    return { success: true }
  }

  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email, name: name || null, subscribed_at: new Date().toISOString(), status: 'active' }])

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'Already subscribed' }
      }
      return { success: false, error: error.message }
    }
  }

  return { success: true }
}

export async function sendNewsletterCampaign(subject: string, htmlContent: string): Promise<NewsletterResult> {
  if (!MAILCHIMP_API_KEY) {
    return { success: false, error: 'Mailchimp not configured' }
  }

  const response = await fetch(
    `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/campaigns`,
    {
      method: 'POST',
      headers: {
        'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'regular',
        recipients: { list_id: MAILCHIMP_LIST_ID },
        settings: {
          subject_line: subject,
          from_name: 'Stefan',
          reply_to: 'noreply@stefu.com',
          html: htmlContent,
        },
      }),
    }
  )

  if (!response.ok) {
    const data = await response.json()
    return { success: false, error: data.detail || 'Campaign creation failed' }
  }

  const campaign = await response.json()

  await fetch(
    `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/campaigns/${campaign.id}/actions/send`,
    { method: 'POST', headers: { 'Authorization': `apikey ${MAILCHIMP_API_KEY}` } }
  )

  return { success: true }
}
