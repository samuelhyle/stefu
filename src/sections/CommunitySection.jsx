import { motion } from 'framer-motion'
import { MessageCircle, Users, Eye, Sparkles, Lock, Zap } from 'lucide-react'

const chatMessages = [
  { user: 'Stefan_Fan_01', message: 'Just watched the latest episode! 🔥', time: '2m ago' },
  { user: 'InnerCircle_Mike', message: 'The behind-the-scenes content is insane', time: '5m ago' },
  { user: 'Stefu_Legend', message: 'Been following since day one. The growth is real.', time: '8m ago' },
  { user: 'Premium_User', message: 'Anyone catch the Easter egg in the vlog?', time: '12m ago' },
]

const communityFeatures = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Real-time discussions about content, events, and Stefu\'s latest moves.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
  },
  {
    icon: Eye,
    title: 'Behind the Scenes',
    description: 'Exclusive glimpses into what happens "behind the window" - the making of content.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
  },
  {
    icon: Users,
    title: 'Inner Circle',
    description: 'Direct access to Stefu and the community of serious followers.',
    color: 'text-gold-400',
    bgColor: 'bg-gold-500/20',
  },
  {
    icon: Sparkles,
    title: 'First Access',
    description: 'Be the first to know about new releases, drops, and announcements.',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20',
  },
]

export default function CommunitySection() {
  return (
    <section id="community" className="py-20 bg-obsidian-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-500 text-sm font-semibold mb-4">
            <Users className="w-4 h-4 mr-2" />
            COMMUNITY
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Join the Inner Circle
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            What happens behind the window? Find out. Connect with fellow followers and get exclusive access.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-obsidian-300/50 rounded-2xl border border-white/5 overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white font-semibold">Live Chat</span>
                <span className="text-white/40 text-sm">127 online</span>
              </div>
              <div className="flex items-center space-x-2 text-white/40 text-sm">
                <Lock className="w-4 h-4" />
                <span>Inner Circle Only</span>
              </div>
            </div>
            <div className="p-4 h-80 overflow-y-auto space-y-4">
              {chatMessages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-gold-500 text-xs font-bold">{msg.user[0]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-gold-500 text-sm font-semibold">{msg.user}</span>
                      <span className="text-white/30 text-xs">{msg.time}</span>
                    </div>
                    <p className="text-white/70 text-sm">{msg.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-xl bg-obsidian-200/50 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-gold-500/50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-xl bg-gold-500 text-obsidian-400 font-semibold text-sm"
                >
                  Send
                </motion.button>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            {communityFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-obsidian-300/50 border border-white/5 hover:border-gold-500/30 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{feature.title}</h3>
                      <p className="text-white/60 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-gradient-to-r from-gold-500/20 to-obsidian-200/50 border border-gold-500/30"
            >
              <div className="flex items-center space-x-4 mb-3">
                <Zap className="w-6 h-6 text-gold-500" />
                <span className="text-gold-500 font-semibold">Premium Access</span>
              </div>
              <p className="text-white/70 text-sm mb-4">
                Unlock the full community experience with Inner Circle membership.
                Direct access, exclusive events, and more.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gold-500 text-obsidian-400 font-semibold hover:bg-gold-400 transition-colors"
              >
                Join Inner Circle
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}