import { supabase, isSupabaseConfigured } from '../lib/supabase'

export async function submitContactMessage({ name, email, message }) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Contact service is not configured yet.') }
  }

  const payload = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
  }

  const { data, error } = await supabase
    .from('contact_submissions')
    .insert(payload)
    .select()
    .single()

  return { data, error }
}
