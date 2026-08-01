import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Bot, User, X } from 'lucide-react'
import { chatWithAiTwin, type AiTwinMessage } from '../services/aiTwinService'

interface AiTwinChatProps {
  isOpen: boolean
  onClose: () => void
}

const WELCOME_MESSAGE: AiTwinMessage = {
  role: 'assistant',
  content: "Yo, what's good? It's Stefan. Ask me anything - about the content, the grind, or just chat."
}

export default function AiTwinChat({ isOpen, onClose }: AiTwinChatProps) {
  const [messages, setMessages] = useState<AiTwinMessage[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMsg: AiTwinMessage = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const response = await chatWithAiTwin([...messages, userMsg])
    setMessages(prev => [...prev, { role: 'assistant', content: response }])
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-obsidian-300/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">AI Stefan</p>
                <p className="text-white/40 text-xs">Powered by AI</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-pink-500/20' : 'bg-purple-500/20'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-pink-500" /> : <Bot className="w-4 h-4 text-purple-500" />}
                  </div>
                  <div className={`rounded-xl px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-pink-500/20 text-white' : 'bg-obsidian-400/50 text-white/80'}`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex items-center space-x-2 text-white/40 text-sm">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '100ms' }} />
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '200ms' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/5">
            <div className="flex items-center space-x-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Stefan anything..."
                disabled={loading}
                className="flex-1 bg-obsidian-400/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-pink-500/50 transition-colors"
              />
              <motion.button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-lg bg-pink-500 flex items-center justify-center disabled:opacity-30 hover:bg-pink-400 transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
