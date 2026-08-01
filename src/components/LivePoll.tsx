import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface PollOption {
  id: string
  text: string
  votes: number
}

interface LivePollProps {
  pollId?: string
}

export default function LivePoll({ pollId }: LivePollProps) {
  const [options, setOptions] = useState<PollOption[]>([])
  const [voted, setVoted] = useState(false)
  const [totalVotes, setTotalVotes] = useState(0)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    const loadPoll = async () => {
      const { data } = await supabase
        .from('polls')
        .select('*')
        .eq('id', pollId || 'current')
        .single()

      if (data?.options) {
        setOptions(data.options)
        setTotalVotes(data.options.reduce((sum: number, o: PollOption) => sum + o.votes, 0))
      }
    }

    loadPoll()

    const channel = supabase.channel('poll-updates')
    channel.on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'polls', filter: `id=eq.${pollId || 'current'}` },
      () => loadPoll()
    )
    channel.subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [pollId])

  const handleVote = async (optionId: string) => {
    if (voted || !isSupabaseConfigured) return

    const updatedOptions = options.map(o =>
      o.id === optionId ? { ...o, votes: o.votes + 1 } : o
    )

    const { error } = await supabase
      .from('polls')
      .update({ options: updatedOptions })
      .eq('id', pollId || 'current')

    if (!error) {
      setOptions(updatedOptions)
      setTotalVotes(prev => prev + 1)
      setVoted(true)
    }
  }

  if (options.length === 0) return null

  const maxVotes = Math.max(...options.map(o => o.votes), 1)

  return (
    <div className="bg-obsidian-300/50 rounded-xl p-4 border border-white/5">
      <h4 className="text-white font-semibold mb-3">Live Poll</h4>
      <div className="space-y-2">
        {options.map(option => {
          const percentage = Math.round((option.votes / totalVotes) * 100) || 0
          const barWidth = (option.votes / maxVotes) * 100

          return (
            <motion.button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={voted}
              whileHover={!voted ? { scale: 1.02 } : undefined}
              className="w-full relative overflow-hidden rounded-lg bg-obsidian-400/50 p-3 text-left disabled:opacity-80 transition-opacity"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute inset-y-0 left-0 bg-pink-500/20 rounded-lg"
              />
              <div className="relative flex justify-between items-center">
                <span className="text-white text-sm">{option.text}</span>
                <span className="text-white/50 text-xs">{voted ? `${percentage}%` : ''}</span>
              </div>
            </motion.button>
          )
        })}
      </div>
      <p className="text-white/30 text-xs mt-2">{totalVotes} total votes</p>
    </div>
  )
}
