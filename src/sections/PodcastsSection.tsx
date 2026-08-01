import { motion } from 'framer-motion'
import { Radio, PlayCircle, Clock } from 'lucide-react'
import ContentRow from '../components/ContentRow'

const podcastsContent = [
  { id: 1, title: 'The Mindset Podcast', duration: '45:00', views: '125K', category: 'Podcast', thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80', video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
  { id: 2, title: 'Business Unplugged', duration: '52:00', views: '98K', category: 'Podcast', thumbnail: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80', video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
  { id: 3, title: 'Late Night Thoughts', duration: '38:00', views: '76K', category: 'Podcast', thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80', video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { id: 4, title: 'The Success Formula', duration: '41:00', views: '112K', category: 'Podcast', thumbnail: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80', video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
]

interface PodcastsSectionProps { onVideoSelect?: (content: any) => void }

export default function PodcastsSection({ onVideoSelect }: PodcastsSectionProps) {
  return (
    <section id="podcasts" className="py-20 bg-obsidian-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 text-purple-500 text-sm font-semibold mb-4">
            <Radio className="w-4 h-4 mr-2" />
            PODCASTS
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Stefan&apos;s Podcasts
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Deep conversations, unfiltered insights, and life lessons
            from Stefan Therman — no scripts, no filters.
          </p>
        </motion.div>

        <div className="space-y-8">
          <ContentRow
            title="Popular Podcasts"
            icon={<PlayCircle className="w-6 h-6 text-purple-500" />}
            contents={podcastsContent}
            onVideoSelect={onVideoSelect}
          />
        </div>
      </div>
    </section>
  )
}