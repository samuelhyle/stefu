import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Play } from 'lucide-react'
import SEO from '../components/SEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useMoments } from '../hooks/useMoments'

export default function MomentsPage() {
  const navigate = useNavigate()
  const { moments, loading } = useMoments({ limit: 60 })

  return (
    <>
      <SEO title="Moments" path="/moments" description="Quick hits, lifestyle drops and unfiltered moments from Stefan." />

      <div className="bg-obsidian-400 min-h-screen">
        <Navbar activeSection="moments" setActiveSection={() => {}} allContent={[]} />

        <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-white/60 hover:text-gold-500 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">All Moments</h1>
            <p className="text-white/60">Every clip, every drop. Pick one and press play.</p>
          </header>

          {loading ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {moments.map((moment, index) => (
                <motion.button
                  key={moment.id}
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.5) }}
                  onClick={() => navigate(`/watch/${moment.id}`)}
                  className="relative rounded-xl overflow-hidden group aspect-[9/16] bg-obsidian-300 text-left"
                >
                  <img
                    src={moment.thumbnail}
                    alt={moment.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-400 via-obsidian-400/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-gold-500 flex items-center justify-center shadow-xl shadow-gold-500/50">
                      <Play className="w-7 h-7 text-obsidian-400 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      {moment.duration && (
                        <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm text-white/90 text-xs font-medium">
                          {moment.duration}
                        </span>
                      )}
                      {moment.likes && (
                        <span className="flex items-center text-white/70 text-xs">
                          <Heart className="w-3 h-3 mr-1" />
                          {moment.likes}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-white line-clamp-2">
                      {moment.title}
                    </h3>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  )
}
