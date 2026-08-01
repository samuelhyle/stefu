import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, Users, Zap, Trophy, Skull } from 'lucide-react'
import { fetchTopScores } from '../services/gameService'
import type { Socket } from 'socket.io-client'

const GAME_SERVER_URL =
  import.meta.env.VITE_GAME_SERVER_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? window.location.origin
    : 'http://localhost:3000')

export default function GameSection() {
  const [playerCount, setPlayerCount] = useState(0)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [combo, setCombo] = useState(0)
  const [comboMultiplier, setComboMultiplier] = useState(1)
  const [activePowerups, setActivePowerups] = useState({ shield: false, double: false, slow: false })
  const [leaderboard, setLeaderboard] = useState<{ score: number; achieved_at: string }[]>([])
  const lastHighScore = useRef(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [sectionVisible, setSectionVisible] = useState(false)

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!sectionVisible) return
    fetchTopScores(10).then(({ scores }) => setLeaderboard(scores))
  }, [sectionVisible])

  useEffect(() => {
    // Forward iframe errors to console for debugging
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'gameError') {
        console.warn('[Game iframe error]', event.data.message)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  useEffect(() => {
    if (!sectionVisible) return

    let socket: { on: (event: string, fn: (data: any) => void) => void; disconnect: () => void } | undefined
    let cancelled = false
    ;(async () => {
      const { io } = await import('socket.io-client')
      if (cancelled) return
      socket = io(GAME_SERVER_URL, {
        transports: ['websocket', 'polling'],
      })

      socket.on('state', (state) => {
      setScore(state.score || 0)
      setHighScore(state.highScore || 0)
      setPlayerCount(state.playerCount || 0)
      setLives(state.lives !== undefined ? state.lives : 3)
      setCombo(state.combo || 0)
      setComboMultiplier(state.comboMultiplier || 1)
      setActivePowerups({
        shield: state.activePowerups?.shield || false,
        double: state.activePowerups?.double || false,
        slow: state.activePowerups?.slow || false,
      })

      if ((state.highScore || 0) > lastHighScore.current) {
        lastHighScore.current = state.highScore || 0
        fetchTopScores(10).then(({ scores }) => setLeaderboard(scores))
      }
      })
    })()

    return () => {
      cancelled = true
      socket?.disconnect()
    }
  }, [sectionVisible])

  return (
    <section ref={sectionRef} id="game" className="py-20 bg-gradient-to-b from-obsidian-300 to-obsidian-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-gold-500/20 text-gold-500 text-sm font-semibold mb-4">
            <Gamepad2 className="w-4 h-4 mr-2" />
            GAME
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Crowd Control Hugo
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Everyone steers Hugo together — the MVP gets 3× control. Dodge the obstacles. How long can you survive?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden border-2 border-gold-500/30 shadow-2xl shadow-gold-500/10">
            {sectionVisible ? (
              <iframe
                id="game-frame"
                src="/game/index.html"
                width="400"
                height="400"
                loading="lazy"
                title="Hugo Game"
                className="w-full max-w-[400px] block mx-auto"
                style={{ border: 'none', display: 'block' }}
              />
            ) : (
              <div className="w-full max-w-[400px] mx-auto aspect-square bg-obsidian-300 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Live status bar — lives, active powerups, combo */}
          <div className="mt-4 flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1">
              {[0, 1, 2].map(i => (
                <span key={i} className={`text-base transition-colors ${i < lives ? 'text-red-500' : 'text-white/15'}`}>♥</span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {activePowerups.shield && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">S</span>
              )}
              {activePowerups.double && (
                <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">×2</span>
              )}
              {activePowerups.slow && (
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">❄</span>
              )}
            </div>
            {combo >= 1 && (
              <div className="text-yellow-400 text-xs font-bold">
                {combo} COMBO ×{comboMultiplier}
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <Trophy className="w-6 h-6 text-gold-500 mx-auto mb-2" />
              <p className="text-white/60 text-sm">Score</p>
              <p className="text-white font-bold text-xl">{score}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <Skull className="w-6 h-6 text-gold-500 mx-auto mb-2" />
              <p className="text-white/60 text-sm">Best</p>
              <p className="text-white font-bold text-xl">{highScore}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <Users className="w-6 h-6 text-gold-500 mx-auto mb-2" />
              <p className="text-white/60 text-sm">Playing</p>
              <p className="text-white font-bold text-xl">{playerCount}</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-6 p-4 rounded-xl bg-gold-500/10 border border-gold-500/20 text-center"
          >
            <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center text-white/80">
                <span className="inline-block w-3 h-3 rounded bg-gold-500 mr-2" />
                <span>Hugo</span>
              </div>
              <div className="flex items-center text-white/80">
                <Zap className="w-3 h-3 text-gold-400 mr-1" />
                <span>MVP = 3× power</span>
              </div>
              <div className="flex items-center text-white/80">
                <span className="inline-block w-3 h-3 rounded bg-red-500 mr-2" />
                <span>Avoid</span>
              </div>
              <div className="flex items-center gap-1 text-white/60">
                <span className="text-blue-400 text-xs font-bold">S</span>
                <span className="text-yellow-400 text-xs font-bold">×2</span>
                <span className="text-purple-400 text-xs font-bold">❄</span>
                <span className="ml-1">powerups</span>
              </div>
            </div>
            <p className="text-white/50 text-sm mt-3">
              Open on multiple devices to play together in real-time!
            </p>
          </motion.div>

          {leaderboard.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-6 rounded-xl bg-white/5 border border-white/10 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-white/10 flex items-center">
                <Trophy className="w-4 h-4 text-gold-500 mr-2" />
                <span className="text-white/80 text-sm font-semibold">Top Scores</span>
              </div>
              <ul>
                {leaderboard.map((entry, i) => (
                  <li
                    key={entry.achieved_at}
                    className="flex items-center justify-between px-4 py-2 border-b border-white/5 last:border-0"
                  >
                    <span className="text-white/40 text-xs w-5">{i + 1}</span>
                    <span className="text-white font-bold">{entry.score}</span>
                    <span className="text-white/30 text-xs">
                      {new Date(entry.achieved_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}