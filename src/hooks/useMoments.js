import { useEffect, useState } from 'react'
import { isSupabaseConfigured } from '../lib/supabase'
import { fetchVideos } from '../services/videoService'
import { momentsContent } from '../data/content'

export function useMoments({ limit = 20 } = {}) {
  const [moments, setMoments] = useState(momentsContent)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let cancelled = false
    ;(async () => {
      const { data, error } = await fetchVideos({ type: 'clip', limit })
      if (cancelled) return
      if (error || !data || data.length === 0) {
        if (error) setError(error)
        setLoading(false)
        return
      }
      setMoments(
        data.map((v) => ({
          id: v.id,
          title: v.title,
          description: v.description || '',
          duration: v.duration ? formatDuration(v.duration) : '',
          likes: formatCount(v.likes),
          thumbnail: v.thumbnail,
          video: v.streamUrl,
        }))
      )
      setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [limit])

  return { moments, loading, error }
}

function formatDuration(seconds) {
  if (!seconds) return ''
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatCount(n) {
  if (!n) return '0'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}
