import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

interface ChatMessage {
  id: string
  username: string
  body: string
  created_at: string
}

export function useRealtimeChat(channelName = 'public-chat') {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      setError('Supabase not configured')
      return
    }

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50)

      if (error) {
        setError(error.message)
      } else {
        setMessages(data || [])
      }
      setLoading(false)
    }

    loadMessages()

    const channel = supabase.channel(channelName)
    channel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload: RealtimePostgresChangesPayload<ChatMessage>) => {
        setMessages(prev => [...prev, payload.new as ChatMessage])
      }
    )
    channel.subscribe()
    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [channelName])

  const sendMessage = useCallback(async (username: string, body: string) => {
    if (!isSupabaseConfigured) return

    const { error } = await supabase
      .from('messages')
      .insert([{ username, body }])

    if (error) {
      setError(error.message)
    }
  }, [])

  return { messages, loading, error, sendMessage }
}
