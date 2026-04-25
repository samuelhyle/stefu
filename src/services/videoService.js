import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getMuxPlaybackUrl, getMuxThumbnailUrl } from '../lib/mux'

export async function fetchVideos({ category, type, limit = 20, offset = 0 } = {}) {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' }
  }

  let query = supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }
  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query.range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching videos:', error)
    return { data: null, error }
  }

  const processedData = data.map(video => ({
    ...video,
    streamUrl: video.url.startsWith('http') ? video.url : getMuxPlaybackUrl(video.url),
    thumbnail: video.thumbnail || (video.url.startsWith('http') ? null : getMuxThumbnailUrl(video.url)),
  }))

  return { data: processedData, error: null }
}

export async function fetchVideoById(id) {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' }
  }

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching video:', error)
    return { data: null, error }
  }

  const processedData = {
    ...data,
    streamUrl: data.url.startsWith('http') ? data.url : getMuxPlaybackUrl(data.url),
    thumbnail: data.thumbnail || (data.url.startsWith('http') ? null : getMuxThumbnailUrl(data.url)),
  }

  return { data: processedData, error: null }
}

export async function fetchTimeline() {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' }
  }

  const { data, error } = await supabase
    .from('timeline')
    .select(`
      *,
      video:videos(*)
    `)
    .eq('is_active', true)
    .order('start_time', { ascending: true })

  if (error) {
    console.error('Error fetching timeline:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function fetchFeaturedVideos(limit = 5) {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase not configured' }
  }

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('views', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured videos:', error)
    return { data: null, error }
  }

  const processedData = data.map(video => ({
    ...video,
    streamUrl: video.url.startsWith('http') ? video.url : getMuxPlaybackUrl(video.url),
    thumbnail: video.thumbnail || (video.url.startsWith('http') ? null : getMuxThumbnailUrl(video.url)),
  }))

  return { data: processedData, error: null }
}

export async function incrementVideoViews(id) {
  if (!isSupabaseConfigured) return { error: null }

  const { error } = await supabase.rpc('increment_views', { video_id: id })
  if (error) {
    console.warn('Could not increment views:', error)
  }
}

export async function incrementVideoLikes(id) {
  if (!isSupabaseConfigured) return { error: null }

  const { error } = await supabase.rpc('increment_likes', { video_id: id })
  if (error) {
    console.warn('Could not increment likes:', error)
  }
}