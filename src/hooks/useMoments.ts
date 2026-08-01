import { useEffect, useState } from 'react'
import { isSupabaseConfigured } from '../lib/supabase'
import { fetchVideos } from '../services/videoService'
import { momentsContent } from '../data/content'
import type { ContentItem } from '../types'

interface MomentItem extends ContentItem {
  video?: string
}

export function useMoments({ limit = 20 } = {}) {
  const [moments, setMoments] = useState<MomentItem[]>(momentsContent as MomentItem[])
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let cancelled = false
    ;(async () => {
      const { data, error } = await fetchVideos({ type: 'clip', limit })
      if (cancelled) return
      if (error || !data || data.length === 0) {
        if (error) setError(String(error))
        setLoading(false)
        return
      }
      setMoments(
        (data as unknown as ContentItem[]).map((v) => ({
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

function formatDuration(seconds: number | string | undefined): string {
  if (!seconds) return ''
  const s = typeof seconds === 'string' ? parseInt(seconds) : seconds
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function formatCount(n: number | string | undefined): string {
  if (!n) return '0'
  const num = typeof n === 'string' ? parseInt(n) : n
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return String(num)
}
