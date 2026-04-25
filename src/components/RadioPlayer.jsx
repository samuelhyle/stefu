import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Radio, Play, Pause, Volume2, VolumeX, ListMusic, ExternalLink } from 'lucide-react'

const SOUNDCLOUD_URL = 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/dotleanie/sets/stefu-com&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true'

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [trackTitle, setTrackTitle] = useState('Stefu Radio 24/7')
  const [error, setError] = useState(false)
  const iframeRef = useRef(null)
  const widgetRef = useRef(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://w.soundcloud.com/player/api.js'
    script.onload = () => {
      if (iframeRef.current) {
        widgetRef.current = window.SC.Widget(iframeRef.current)
        widgetRef.current.bind(window.SC.Widget.Events.READY, () => {
          setIsLoaded(true)
          widgetRef.current.setVolume(volume * 100)
          widgetRef.current.play()
        })
        widgetRef.current.bind(window.SC.Widget.Events.PLAY, () => {
          setIsPlaying(true)
        })
        widgetRef.current.bind(window.SC.Widget.Events.PAUSE, () => {
          setIsPlaying(false)
        })
        widgetRef.current.bind(window.SC.Widget.Events.FINISH, () => {
          setIsPlaying(false)
        })
        widgetRef.current.bind(window.SC.Widget.Events.ERROR, () => {
          setError(true)
          setIsPlaying(false)
        })
        widgetRef.current.bind(window.SC.Widget.Events.PLAY_PROGRESS, (data) => {
          if (data.currentTrack) {
            setTrackTitle(data.currentTrack.title || 'Stefu Radio')
          }
        })
      }
    }
    document.body.appendChild(script)
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const togglePlay = () => {
    if (widgetRef.current) {
      if (isPlaying) {
        widgetRef.current.pause()
      } else {
        widgetRef.current.play()
      }
    }
  }

  const toggleMute = () => {
    if (widgetRef.current) {
      if (isMuted) {
        widgetRef.current.setVolume(volume * 100)
        setIsMuted(false)
      } else {
        widgetRef.current.setVolume(0)
        setIsMuted(true)
      }
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (widgetRef.current) {
      widgetRef.current.setVolume(newVolume * 100)
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  return (
    <div className="bg-obsidian-200/80 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      <div className="relative p-6">
        <div className="absolute top-0 left-0 right-0 h-1 bg-obsidian-300">
          <motion.div
            animate={{ width: isPlaying ? '100%' : '0%' }}
            transition={{ duration: 180, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-pink-500 to-pink-400"
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPlaying ? 'bg-pink-500 animate-pulse' : 'bg-pink-500/20'}`}>
              <Radio className={`w-6 h-6 ${isPlaying ? 'text-obsidian-400' : 'text-pink-500'}`} />
            </div>
            <div>
              <h4 className="text-white font-semibold">Stefu Radio 24/7</h4>
              <p className="text-white/50 text-sm truncate max-w-[150px]">{trackTitle}</p>
            </div>
          </div>
          
          <motion.button
            onClick={togglePlay}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-full bg-pink-500 flex items-center justify-center hover:bg-pink-400 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-obsidian-400" />
            ) : (
              <Play className="w-6 h-6 text-obsidian-400 ml-1" />
            )}
          </motion.button>
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <button onClick={toggleMute} className="text-white/50 hover:text-white transition-colors">
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500"
          />
        </div>

        {isPlaying && (
          <div className="text-center text-pink-400 text-sm animate-pulse">
            🔴 LIVE
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 text-sm">
            Playlist unavailable. <a href="https://soundcloud.com/dotleanie/sets/stefu-com" target="_blank" rel="noopener noreferrer" className="underline">Open in SoundCloud</a>
          </div>
        )}
      </div>

      <div className="border-t border-white/5">
        <div className="flex items-center justify-between px-4 py-2 bg-obsidian-300/50">
          <div className="flex items-center space-x-2 text-white/40 text-xs">
            <ListMusic className="w-4 h-4" />
            <span>Up Next</span>
          </div>
          <a
            href="https://soundcloud.com/dotleanie/sets/stefu-com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-pink-400 hover:text-pink-300 text-xs transition-colors"
          >
            <span>Open Playlist</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="max-h-48 overflow-y-auto p-4">
          <div className="text-center text-white/40 text-sm py-4">
            <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">SoundCloud</a> playlist plays continuously
          </div>
        </div>
      </div>

      <iframe
        ref={iframeRef}
        src={SOUNDCLOUD_URL}
        className="hidden"
        allow="autoplay"
        title="Stefu Radio SoundCloud"
      />
    </div>
  )
}