import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import SEO from '../components/SEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import VideoPlayer from '../components/VideoPlayer'
import { useVideo } from '../hooks/useContent'
import { getMuxThumbnailUrl } from '../lib/mux'

export default function WatchPage() {
  const { videoId } = useParams<{ videoId: string }>()
  const navigate = useNavigate()
  const { video, loading } = useVideo(videoId)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [videoId])

  const rawVideo = video as Record<string, any> | null
  const ogImage =
    video?.thumbnail ||
    (rawVideo?.url && !rawVideo.url.startsWith('http') ? getMuxThumbnailUrl(rawVideo.url) : undefined)

  return (
    <>
      <SEO
        title={video?.title || 'Watch'}
        description={video?.description || undefined}
        image={ogImage || undefined}
        path={`/watch/${videoId}`}
        type="video.other"
      />

      <div className="bg-obsidian-400 min-h-screen">
        <Navbar activeSection="" setActiveSection={() => {}} allContent={[]} />

        <main className="pt-24 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-white/60 hover:text-gold-500 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {loading ? (
            <div className="aspect-video rounded-2xl bg-obsidian-300 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
            </div>
          ) : !video ? (
            <div className="aspect-video rounded-2xl bg-obsidian-300 flex flex-col items-center justify-center text-center p-8">
              <h1 className="text-2xl font-bold text-white mb-2">Video not found</h1>
              <p className="text-white/60 mb-6">This content may have been removed or the link is broken.</p>
              <button onClick={() => navigate('/')} className="btn-gold">
                Back to home
              </button>
            </div>
          ) : (
            <>
              <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                <VideoPlayer
                  src={video.streamUrl || video.video}
                  poster={video.thumbnail || undefined}
                  autoPlay
                  showControls
                />
              </div>

              <div className="mt-6">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
                  {video.title}
                </h1>
                {video.description && (
                  <p className="text-white/70 leading-relaxed max-w-3xl">{video.description}</p>
                )}
              </div>
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  )
}
