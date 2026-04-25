import { supabase, isSupabaseConfigured } from '../lib/supabase'

export async function fetchTopScores(limit = 10) {
  if (!isSupabaseConfigured || !supabase) {
    return { scores: [], error: 'Supabase not configured' }
  }

  const { data, error } = await supabase
    .from('game_scores')
    .select('score, achieved_at')
    .order('score', { ascending: false })
    .limit(limit)

  return { scores: data || [], error }
}
