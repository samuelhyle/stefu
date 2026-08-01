import { useState, useEffect, useCallback, useRef } from 'react'
import { isSupabaseConfigured } from '../lib/supabase'
import { fetchVideos, fetchFeaturedVideos, fetchVideoById, incrementVideoViews } from '../services/videoService'
import { featuredContent, categoriesContent } from '../data/content'
import type { ContentItem, Video } from '../types'

interface UseVideosOptions {
  category?: string
  type?: string
  limit?: number
}

export function useVideos({ category, type, limit = 20 }: UseVideosOptions = {}) {
  const [videos, setVideos] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  const fetch = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error } = await fetchVideos({ category, type, limit, offset: page * limit })

    if (error) {
      setError(String(error))
      setLoading(false)
      return
    }

    if (data && data.length < limit) {
      setHasMore(false)
    }

    setVideos(prev => page === 0 ? ((data || []) as unknown as ContentItem[]) : [...prev, ...(data || []) as unknown as ContentItem[]])
    setLoading(false)
  }, [category, type, limit, page])

  useEffect(() => {
    fetch()
  }, [fetch])

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  const refresh = () => {
    setPage(0)
    setVideos([])
    setHasMore(true)
    fetch()
  }

  return { videos, loading, error, hasMore, loadMore, refresh }
}

export function useFeaturedContent() {
  const [content, setContent] = useState<ContentItem[]>(featuredContent)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }

      const { data, error } = await fetchFeaturedVideos(5)
      if (error) {
        setError(String(error))
        setLoading(false)
        return
      }

      if (data && data.length > 0) {
        setContent(data as unknown as ContentItem[])
      }
      setLoading(false)
    }

    fetchContent()
  }, [])

  return { content, loading, error }
}

export function useCategoriesContent() {
  const [categories, setCategories] = useState<Record<string, ContentItem[]>>(categoriesContent)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }

      const categoriesToFetch = ['trending', 'exclusive', 'lifestyle', 'talks']
      const results: Record<string, ContentItem[]> = {}

      for (const cat of categoriesToFetch) {
        const { data, error } = await fetchVideos({ category: cat, limit: 10 })
        if (!error && data) {
          const label = cat === 'trending' ? 'Trending Now' : cat === 'exclusive' ? 'Exclusive Talks' : cat.charAt(0).toUpperCase() + cat.slice(1)
          results[label] = data as unknown as ContentItem[]
        }
      }

      if (Object.keys(results).length > 0) {
        setCategories(results)
      }
      setLoading(false)
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

export function useVideo(id: string | undefined) {
  const [video, setVideo] = useState<ContentItem | Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      if (!isSupabaseConfigured) {
        const fallback = Object.values(categoriesContent).flat().find(v => v.id === parseInt(id))
        setVideo(fallback || null)
        setLoading(false)
        return
      }

      const { data, error } = await fetchVideoById(id)
      if (error) {
        setError(String(error))
        setLoading(false)
        return
      }

      setVideo(data)
      setLoading(false)

      if (data) {
        incrementVideoViews(id)
      }
    }

    fetchVideo()
  }, [id])

  return { video, loading, error }
}

export function useIntersectionObserver(options: IntersectionObserverInit = {}) {
  const [ref, setRef] = useState<Element | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.1, ...options })

    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, options])

  return [setRef, isVisible] as const
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}
