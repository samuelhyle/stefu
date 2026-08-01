import { useState } from 'react'
import { motion } from 'framer-motion'
import { Vote, ThumbsUp, ThumbsDown, BarChart3, Shield } from 'lucide-react'

interface Proposal {
  id: string
  title: string
  description: string
  status: 'active' | 'passed' | 'rejected'
  votesFor: number
  votesAgainst: number
  deadline: string
}

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: '1',
    title: 'Monthly Bonus Stream',
    description: 'Add a monthly bonus stream for Inner Circle members',
    status: 'active',
    votesFor: 42,
    votesAgainst: 3,
    deadline: '2026-08-15',
  },
  {
    id: '2',
    title: 'Community Playlist',
    description: 'Let Inner Circle members vote on the radio playlist',
    status: 'active',
    votesFor: 38,
    votesAgainst: 8,
    deadline: '2026-08-20',
  },
  {
    id: '3',
    title: 'Behind the Scenes Access',
    description: 'Weekly behind-the-scenes content for token holders',
    status: 'passed',
    votesFor: 89,
    votesAgainst: 2,
    deadline: '2026-07-01',
  },
]

export default function DaoGovernance() {
  const [proposals] = useState(MOCK_PROPOSALS)
  const [voted, setVoted] = useState<Set<string>>(new Set())

  const handleVote = (proposalId: string, vote: 'for' | 'against') => {
    if (voted.has(proposalId)) return
    setVoted(prev => new Set(prev).add(proposalId))
  }

  return (
    <div className="bg-obsidian-300/50 rounded-2xl border border-white/5 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
          <Shield className="w-6 h-6 text-gold-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Stefu DAO</h3>
          <p className="text-white/50 text-sm">Token holders govern the community</p>
        </div>
      </div>

      <div className="space-y-4">
        {proposals.map(proposal => (
          <motion.div
            key={proposal.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-obsidian-400/50 rounded-xl p-4 border border-white/5"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-white font-semibold">{proposal.title}</h4>
                <p className="text-white/50 text-sm">{proposal.description}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                proposal.status === 'active' ? 'bg-green-500/20 text-green-400' :
                proposal.status === 'passed' ? 'bg-blue-500/20 text-blue-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {proposal.status.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-white/50 mb-3">
              <span className="flex items-center">
                <ThumbsUp className="w-4 h-4 mr-1 text-green-400" />
                {proposal.votesFor}
              </span>
              <span className="flex items-center">
                <ThumbsDown className="w-4 h-4 mr-1 text-red-400" />
                {proposal.votesAgainst}
              </span>
              <span className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-1" />
                {Math.round((proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100)}%
              </span>
            </div>

            {proposal.status === 'active' && (
              <div className="flex space-x-2">
                <motion.button
                  onClick={() => handleVote(proposal.id, 'for')}
                  disabled={voted.has(proposal.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-400 font-medium text-sm hover:bg-green-500/30 transition-colors disabled:opacity-30"
                >
                  Vote For
                </motion.button>
                <motion.button
                  onClick={() => handleVote(proposal.id, 'against')}
                  disabled={voted.has(proposal.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 font-medium text-sm hover:bg-red-500/30 transition-colors disabled:opacity-30"
                >
                  Vote Against
                </motion.button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
