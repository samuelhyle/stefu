import { motion } from 'framer-motion'
import { Lightbulb, TrendingUp, Target, Award, Zap, Shield } from 'lucide-react'

const tips = [
  {
    icon: TrendingUp,
    title: 'Business & Entrepreneurship',
    tips: [
      { text: 'Always think 10 steps ahead', category: 'Strategy' },
      { text: 'Build assets, not expenses', category: 'Finance' },
      { text: 'Your network is your net worth', category: 'Networking' },
    ],
    color: 'from-blue-500/20 to-blue-600/10',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-400',
  },
  {
    icon: Target,
    title: 'Personal Development',
    tips: [
      { text: 'Discipline equals freedom', category: 'Mindset' },
      { text: 'Wake up before the world expects you to', category: 'Habits' },
      { text: 'Read 30 minutes daily - no excuses', category: 'Learning' },
    ],
    color: 'from-purple-500/20 to-purple-600/10',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-400',
  },
  {
    icon: Lightbulb,
    title: 'Life Wisdom',
    tips: [
      { text: 'Money is a tool, not a goal', category: 'Philosophy' },
      { text: 'Protect your energy at all costs', category: 'Wellness' },
      { text: 'Make decisions based on decades, not days', category: 'Strategy' },
    ],
    color: 'from-yellow-500/20 to-yellow-600/10',
    borderColor: 'border-yellow-500/30',
    iconColor: 'text-yellow-400',
  },
  {
    icon: Shield,
    title: 'Risk & Protection',
    tips: [
      { text: 'Never show all your cards', category: 'Strategy' },
      { text: 'Trust is earned, not given', category: 'Relationships' },
      { text: 'Have an exit strategy before entering', category: 'Business' },
    ],
    color: 'from-red-500/20 to-red-600/10',
    borderColor: 'border-red-500/30',
    iconColor: 'text-red-400',
  },
]

export default function TipsSection() {
  return (
    <section id="tips" className="py-20 bg-gradient-to-b from-obsidian-400 to-obsidian-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-500 text-sm font-semibold mb-4">
            <Lightbulb className="w-4 h-4 mr-2" />
            TIPS
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Stefu&apos;s Tips & Wisdom
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Hard-won lessons from the legend. Apply these principles to level up your life.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {tips.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${category.color} border ${category.borderColor}`}
              >
                <div className="flex items-center space-x-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${category.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{category.title}</h3>
                </div>
                <div className="space-y-3">
                  {category.tips.map((tip, tipIndex) => (
                    <div
                      key={tipIndex}
                      className="flex items-start space-x-3 p-3 rounded-xl bg-obsidian-300/50"
                    >
                      <Zap className={`w-4 h-4 ${category.iconColor} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{tip.text}</p>
                        <span className="text-white/40 text-xs uppercase tracking-wider">{tip.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-gold-500/10 to-obsidian-200/50 border border-gold-500/30 text-center"
        >
          <Award className="w-12 h-12 text-gold-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Want More?</h3>
          <p className="text-white/60 mb-6 max-w-lg mx-auto">
            Inner Circle members get access to exclusive tips, personal coaching sessions,
            and direct insights from Stefu.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl bg-gold-500 text-obsidian-400 font-semibold hover:bg-gold-400 transition-colors"
          >
            Unlock Premium Tips
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}