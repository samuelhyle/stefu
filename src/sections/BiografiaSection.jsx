import { motion } from 'framer-motion'
import { User, Award, Clock, Star } from 'lucide-react'

const milestones = [
  { year: 'Early Days', title: 'The Beginning', description: 'From humble beginnings to becoming a legend in the making', icon: Star },
  { year: 'Rise', title: 'Building the Empire', description: 'Strategic moves and bold decisions that shaped the legend', icon: Award },
  { year: 'Present', title: 'The Legend', description: 'Today, influencing millions and continuing to push boundaries', icon: Clock },
]

const achievements = [
  { label: 'Followers', value: '2.5M+' },
  { label: 'Content Views', value: '500M+' },
  { label: 'Years Active', value: '10+' },
  { label: 'Countries Reached', value: '50+' },
]

export default function BiografiaSection() {
  return (
    <section id="bio" className="py-20 bg-gradient-to-b from-obsidian-300 to-obsidian-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-gold-500/20 text-gold-500 text-sm font-semibold mb-4">
            <User className="w-4 h-4 mr-2" />
            BIOGRAPHY
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Who is Stefu?
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            The legend behind the brand. A story of ambition, power, and relentless pursuit of excellence.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-gold-500/20 to-obsidian-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-9xl font-display font-bold text-gradient mb-4">ST</div>
                <div className="text-white/60 text-xl uppercase tracking-widest">The Legend</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gold-500/20 rounded-full blur-xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-display font-bold text-white">
              The Corleone Legacy meets the Scarface Vision
            </h3>
            <p className="text-white/70 leading-relaxed">
              Like a modern-day Michael Corleone, Stefu has built an empire through strategic thinking,
              unwavering discipline, and an uncompromising vision. The ambition of Tony Montana,
              refined with Finnish precision and elegance.
            </p>
            <p className="text-white/70 leading-relaxed">
              From the streets to the boardroom, from content creation to business ventures,
              every move is calculated, every moment captured, every opportunity maximized.
            </p>
            <p className="text-gold-500 font-semibold text-lg">
              "In this business, you gotta be ruthless, caring, passionate, unforgiving, loving. In this business, you gotta be able to play people."
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {achievements.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-obsidian-200/50 border border-white/5"
            >
              <div className="text-3xl md:text-4xl font-bold text-gold-500 mb-1">{stat.value}</div>
              <div className="text-white/50 text-sm uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-display font-bold text-white text-center">The Journey</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon
              return (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative p-6 rounded-2xl bg-obsidian-200/50 border border-white/5 hover:border-gold-500/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-gold-500" />
                  </div>
                  <div className="text-gold-500 text-sm font-semibold uppercase tracking-wider mb-2">{milestone.year}</div>
                  <h4 className="text-xl font-bold text-white mb-2">{milestone.title}</h4>
                  <p className="text-white/60 text-sm">{milestone.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}