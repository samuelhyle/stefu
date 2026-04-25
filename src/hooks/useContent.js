import { useState, useEffect, useCallback } from 'react'
import { isSupabaseConfigured } from '../lib/supabase'
import { fetchVideos, fetchFeaturedVideos, fetchVideoById, incrementVideoViews } from '../services/videoService'
import { featuredContent, categoriesContent } from '../data/content'

export function useVideos({ category, type, limit = 20 } = {}) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
      setError(error)
      setLoading(false)
      return
    }

    if (data.length < limit) {
      setHasMore(false)
    }

    setVideos(prev => page === 0 ? data : [...prev, ...data])
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
  const [content, setContent] = useState(featuredContent)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchContent = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }

      const { data, error } = await fetchFeaturedVideos(5)
      if (error) {
        setError(error)
        setLoading(false)
        return
      }

      if (data && data.length > 0) {
        setContent(data)
      }
      setLoading(false)
    }

    fetchContent()
  }, [])

  return { content, loading, error }
}

export function useCategoriesContent() {
  const [categories, setCategories] = useState(categoriesContent)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }

      const categoriesToFetch = ['trending', 'exclusive', 'lifestyle', 'talks']
      const results = {}

      for (const cat of categoriesToFetch) {
        const { data, error } = await fetchVideos({ category: cat, limit: 10 })
        if (!error && data) {
          const label = cat === 'trending' ? 'Trending Now' : cat === 'exclusive' ? 'Exclusive Talks' : cat.charAt(0).toUpperCase() + cat.slice(1)
          results[label] = data
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

export function useVideo(id) {
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        setError(error)
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

export function useIntersectionObserver(options = {}) {
  const [ref, setRef] = useState(null)
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

  return [setRef, isVisible]
}

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value) => {
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