import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export async function signUp(email: string, password: string, fullName = '') {
  if (!isSupabaseConfigured) {
    return { user: null, error: 'Supabase not configured' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  })

  return { user: data?.user, error }
}

export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured) {
    return { user: null, error: 'Supabase not configured' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { user: data?.user, error }
}

export async function signInWithGoogle() {
  if (!isSupabaseConfigured) {
    return { user: null, error: 'Supabase not configured' }
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  })

  return { user: (data as any)?.user || null, error }
}

export async function signOut() {
  if (!isSupabaseConfigured) {
    return { error: 'Supabase not configured' }
  }

  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured) {
    return { user: null, error: 'Supabase not configured' }
  }

  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export async function getUserProfile(userId: string) {
  if (!isSupabaseConfigured) {
    return { profile: null, error: 'Supabase not configured' }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { profile: data, error }
}

export async function updateUserProfile(userId: string, updates: Record<string, unknown>) {
  if (!isSupabaseConfigured) {
    return { profile: null, error: 'Supabase not configured' }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  return { profile: data, error }
}

export async function checkPremiumAccess(userId: string | null) {
  if (!isSupabaseConfigured) {
    return { hasAccess: false, error: 'Supabase not configured' }
  }

  if (!userId) {
    return { hasAccess: false, error: null }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_expires_at')
    .eq('id', userId)
    .single()

  if (error) {
    return { hasAccess: false, error }
  }

  const isActive = data?.subscription_expires_at 
    ? new Date(data.subscription_expires_at) > new Date()
    : true

  const hasAccess = data?.subscription_status === 'inner_circle' || 
    (data?.subscription_status === 'premium' && isActive)

  return { hasAccess, error: null }
}
