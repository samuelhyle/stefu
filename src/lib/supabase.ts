import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const configured = Boolean(supabaseUrl && supabaseAnonKey)

function createMockClient(): SupabaseClient {
  const handler: ProxyHandler<SupabaseClient> = {
    get(_target, prop) {
      if (prop === 'then') return undefined
      return () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
    },
  }
  return new Proxy({} as SupabaseClient, handler)
}

export const supabase: SupabaseClient = configured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient()

export const isSupabaseConfigured = configured
export type { User }
