import { motion } from 'framer-motion'
import { Radio, Music, PlayCircle } from 'lucide-react'
import ContentRow from '../components/ContentRow'
import RadioPlayer from '../components/RadioPlayer'

const musicContent = [
  { id: 1, title: 'Rise (Original Mix)', duration: '4:30', views: '1.2M', category: 'Music', thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80', video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
  { id: 2, title: 'Midnight Session', duration: '3:45', views: '890K', category: 'Music', thumbnail: 'https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=800&q=80', video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
  { id: 3, title: 'Finnish Dreams', duration: '5:15', views: '756K', category: 'Music', thumbnail: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80', video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { id: 4, title: 'The Therman Anthem', duration: '3:20', views: '645K', category: 'Music', thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
]

export default function MusicRadioSection({ onVideoSelect }) {
  return (
    <section id="music" className="py-20 bg-obsidian-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-pink-500/20 text-pink-500 text-sm font-semibold mb-4">
            <Radio className="w-4 h-4 mr-2" />
            MUSIC / RADIO
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Stefu Radio 24/7
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Stream original music and exclusive content 24 hours a day, 7 days a week.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <RadioPlayer />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-obsidian-200/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <Music className="w-5 h-5 text-pink-500" />
              </div>
              <h3 className="text-lg font-bold text-white">Ai Musiikkia</h3>
            </div>
            <p className="text-white/60 text-sm mb-4">
              Curated playlists and original tracks from Stefu. Experience the soundtrack of the legend's world.
            </p>
            <div className="space-y-2">
              {['Original Tracks', 'Radio Shows', 'Live Sessions', 'Remixes'].map((item, i) => (
                <div key={item} className="flex items-center space-x-2 text-sm text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-8">
          <ContentRow
            title="Original Tracks"
            icon={<PlayCircle className="w-6 h-6 text-pink-500" />}
            contents={musicContent}
            onVideoSelect={onVideoSelect}
          />
        </div>
      </div>
    </section>
  )
}