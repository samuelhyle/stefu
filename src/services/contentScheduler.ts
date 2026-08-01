import { supabase, isSupabaseConfigured } from '../lib/supabase'

export interface ScheduledContent {
  id?: string
  title: string
  description?: string
  video_url?: string
  thumbnail?: string
  category?: string
  scheduled_for: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  created_at?: string
}

export async function scheduleContent(content: Omit<ScheduledContent, 'id' | 'created_at' | 'status'>): Promise<{ data?: ScheduledContent; error?: string }> {
  if (!isSupabaseConfigured) {
    return { error: 'Supabase not configured' }
  }

  const { data, error } = await supabase
    .from('scheduled_content')
    .insert([{ ...content, status: 'scheduled' }])
    .select()
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function getScheduledContent(status?: string): Promise<{ data?: ScheduledContent[]; error?: string }> {
  if (!isSupabaseConfigured) {
    return { error: 'Supabase not configured' }
  }

  let query = supabase.from('scheduled_content').select('*').order('scheduled_for', { ascending: true })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) return { error: error.message }
  return { data }
}

export async function publishScheduledContent(): Promise<void> {
  if (!isSupabaseConfigured) return

  const now = new Date().toISOString()
  const { data } = await supabase
    .from('scheduled_content')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_for', now)

  if (!data) return

  for (const item of data) {
    const { error } = await supabase.from('videos').insert([{
      title: item.title,
      description: item.description,
      url: item.video_url,
      thumbnail: item.thumbnail,
      category: item.category || 'general',
      type: 'episode',
      is_premium: false,
    }])

    if (error) {
      await supabase.from('scheduled_content').update({ status: 'failed' }).eq('id', item.id)
    } else {
      await supabase.from('scheduled_content').update({ status: 'published' }).eq('id', item.id)
    }
  }
}
