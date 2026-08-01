import { motion } from 'framer-motion'
import { Video, PlayCircle } from 'lucide-react'
import ContentRow from '../components/ContentRow'

const vlogContent = [
  { id: 1, title: 'A Day in Helsinki', duration: '18:00', views: '234K', category: 'Vlog', thumbnail: 'https://images.unsplash.com/photo-1512966979548-1f0a67d3e998?w=800&q=80', video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
  { id: 2, title: 'Behind the Scenes', duration: '24:00', views: '189K', category: 'Vlog', thumbnail: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&q=80', video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
  { id: 3, title: 'Weekend Vlog', duration: '32:00', views: '156K', category: 'Vlog', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { id: 4, title: 'Q&A Session', duration: '45:00', views: '201K', category: 'Vlog', thumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80', video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
]

interface VlogSectionProps { onVideoSelect?: (content: any) => void }

export default function VlogSection({ onVideoSelect }: VlogSectionProps) {
  return (
    <section id="vlog" className="py-20 bg-gradient-to-b from-obsidian-400 to-obsidian-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 text-blue-500 text-sm font-semibold mb-4">
            <Video className="w-4 h-4 mr-2" />
            VLOG
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Stefan&apos;s Vlogs
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Personal moments, daily life, and behind-the-scenes access —
            the reality behind the legend.
          </p>
        </motion.div>

        <div className="space-y-8">
          <ContentRow
            title="Recent Vlogs"
            icon={<PlayCircle className="w-6 h-6 text-blue-500" />}
            contents={vlogContent}
            onVideoSelect={onVideoSelect}
          />
        </div>
      </div>
    </section>
  )
}