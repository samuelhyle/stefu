import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'

vi.mock('../lib/supabase', () => ({
  supabase: null,
  isSupabaseConfigured: false,
}))

vi.mock('../services/videoService', () => ({
  fetchVideos: vi.fn(),
}))

import { useMoments } from './useMoments'
import { momentsContent } from '../data/content'

describe('useMoments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('falls back to momentsContent fixtures when Supabase is not configured', async () => {
    const { result } = renderHook(() => useMoments())
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.moments).toEqual(momentsContent)
  })
})
