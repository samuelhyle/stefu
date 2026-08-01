import { motion } from 'framer-motion'
import { Zap, PlayCircle, Crown } from 'lucide-react'
import { premiumFeatures } from '../data/content'

const iconMap = {
  'zap': Zap,
  'play-circle': PlayCircle,
  'crown': Crown,
}

interface PremiumSectionProps { onJoinCircle?: () => void }

export default function PremiumSection({ onJoinCircle }: PremiumSectionProps) {
  return (
    <section id="premium" className="py-20 bg-gradient-to-b from-obsidian-400 to-obsidian-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&q=80"
              alt="Premium"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian-400 via-obsidian-400/90 to-obsidian-400/70" />
          </div>

          <div className="relative z-10 py-16 px-8 md:px-16">
            <div className="max-w-2xl">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gold-500/20 text-gold-500 text-sm font-semibold mb-6">
                <Crown className="w-4 h-4 mr-2" />
                INNER CIRCLE EXCLUSIVE
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                Join Stefan&apos;s Inner Circle
              </h2>
              <p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed">
                Private streams, behind-the-scenes access, and direct interaction
                with Stefan. Membership is limited — the inner circle stays exclusive.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  onClick={onJoinCircle}
                  className="btn-gold text-base md:text-lg px-10 py-4 shadow-xl shadow-gold-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join Inner Circle
                </motion.button>
                <motion.button
                  className="btn-outline text-base md:text-lg px-10 py-4 border-white/30 text-white hover:bg-white/10 hover:border-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {premiumFeatures.map((feature, index) => {
            const IconComponent = (iconMap as Record<string, any>)[feature.icon] || Zap
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-obsidian-200/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-gold-500/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold-500/20 flex items-center justify-center text-gold-500 mb-5 group-hover:bg-gold-500 group-hover:text-obsidian-400 transition-colors">
                  <IconComponent className="w-7 h-7" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed text-sm md:text-base">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}