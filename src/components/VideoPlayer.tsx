import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize2, X, PictureInPicture2, Loader2, SkipBack, SkipForward, Gauge } from 'lucide-react'
import { useState, useRef, useEffect, useCallback } from 'react'

const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5, 2]

interface VideoPlayerProps {
  src?: string
  poster?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  showControls?: boolean
  className?: string
  aspectRatio?: string
  onPlayPause?: (playing: boolean) => void
  isMiniPlayer?: boolean
  onMiniPlayerExit?: () => void
}

export default function VideoPlayer({ 
  src, 
  poster, 
  autoPlay = false, 
  muted = true, 
  loop = false,
  showControls = true,
  className = '',
  aspectRatio = 'aspect-video',
  onPlayPause,
  isMiniPlayer = false,
  onMiniPlayerExit
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(muted)
  const [volume, setVolume] = useState(1)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [progress, setProgress] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showControlsOverlay, setShowControlsOverlay] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null!)
  const containerRef = useRef<HTMLDivElement>(null!)
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const volumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      setProgress((video.currentTime / video.duration) * 100 || 0)
      if (video.buffered.length > 0) {
        setBuffered((video.buffered.end(video.buffered.length - 1) / video.duration) * 100)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    const handleWaiting = () => setIsBuffering(true)
    const handlePlaying = () => setIsBuffering(false)
    const handleError = () => setError('Failed to load video')

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('playing', handlePlaying)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('playing', handlePlaying)
      video.removeEventListener('error', handleError)
    }
  }, [])

  useEffect(() => {
    setIsPlaying(autoPlay)
  }, [autoPlay])

  useEffect(() => {
    setIsMuted(muted)
    if (videoRef.current) {
      videoRef.current.muted = muted
    }
  }, [muted])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    onPlayPause?.(!isPlaying)
  }, [isPlaying, onPlayPause])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(!isMuted)
  }, [isMuted])

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    const newVolume = parseFloat(e.target.value)
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video) return

    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    video.currentTime = pos * video.duration
  }

  const seek = (seconds: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration))
  }

  const changePlaybackSpeed = (speed: number) => {
    const video = videoRef.current
    if (!video) return
    video.playbackRate = speed
    setPlaybackSpeed(speed)
    setShowSpeedMenu(false)
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !seconds) return '0:00'
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const handleMouseMove = useCallback(() => {
    setShowControlsOverlay(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControlsOverlay(false)
      }
    }, 3000)
  }, [isPlaying])

  const handleMouseEnterVolume = () => {
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current)
    }
    setShowVolumeSlider(true)
  }

  const handleMouseLeaveVolume = () => {
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false)
    }, 300)
  }

  const enterMiniPlayer = useCallback(() => {
    if (videoRef.current && document.pictureInPictureEnabled) {
      videoRef.current.requestPictureInPicture()
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
        case 'j':
          e.preventDefault()
          seek(-10)
          break
        case 'ArrowRight':
        case 'l':
          e.preventDefault()
          seek(10)
          break
        case 'ArrowUp':
          e.preventDefault()
          if (videoRef.current) {
            videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.1)
            setVolume(videoRef.current.volume)
          }
          break
        case 'ArrowDown':
          e.preventDefault()
          if (videoRef.current) {
            videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.1)
            setVolume(videoRef.current.volume)
          }
          break
        case 'm':
          e.preventDefault()
          toggleMute()
          break
        case 'f':
          e.preventDefault()
          toggleFullscreen()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, toggleMute, toggleFullscreen])

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current)
      }
    }
  }, [])

  if (isMiniPlayer) {
    return (
      <div className="fixed bottom-20 right-4 w-80 rounded-xl overflow-hidden shadow-2xl z-50 bg-obsidian-200 border border-white/10">
        <div className="relative">
          <video
            ref={videoRef}
            src={src}
            autoPlay
            muted={isMuted}
            loop={loop}
            className="w-full aspect-video object-cover"
          />
          {onMiniPlayerExit && (
            <button
              onClick={onMiniPlayerExit}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-obsidian-400/80 flex items-center justify-center text-white hover:bg-gold-500 hover:text-obsidian-400 transition-colors"
              aria-label="Exit mini player"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${aspectRatio} bg-black rounded-xl overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControlsOverlay(false)}
      tabIndex={0}
      role="application"
      aria-label="Video player"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={isMuted}
        loop={loop}
        playsInline
        className="w-full h-full object-cover"
        onClick={togglePlay}
      />

      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          >
            <Loader2 className="w-12 h-12 text-gold-500" />
          </motion.div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian-400/90">
          <p className="text-white/80 mb-4">{error}</p>
          <button
            onClick={() => { setError(null); videoRef.current?.load() }}
            className="btn-outline"
          >
            Retry
          </button>
        </div>
      )}

      <AnimatePresence>
        {showControlsOverlay && showControls && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 gradient-overlay flex flex-col justify-end"
          >
            <div
              className="absolute top-0 left-0 right-0 h-2 md:h-3 bg-white/10 cursor-pointer group/progress"
              onClick={handleProgressClick}
              role="slider"
              aria-label="Video progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              tabIndex={0}
            >
              <div
                className="absolute inset-0 bg-white/20"
                style={{ width: `${buffered}%` }}
              />
              <motion.div
                className="absolute top-0 left-0 h-full bg-gold-500"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-gold-500 opacity-0 group-hover/progress:opacity-100 transition-opacity"
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2 md:space-x-3">
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-gold-500/90 hover:bg-gold-500 flex items-center justify-center text-obsidian-400 transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </button>

                <button
                  onClick={() => seek(-10)}
                  className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  aria-label="Rewind 10 seconds"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={() => seek(10)}
                  className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  aria-label="Forward 10 seconds"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <div
                  className="relative flex items-center"
                  onMouseEnter={handleMouseEnterVolume}
                  onMouseLeave={handleMouseLeaveVolume}
                >
                  <button
                    onClick={toggleMute}
                    className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showVolumeSlider && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden ml-2"
                      >
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-20 h-1 accent-gold-500 cursor-pointer"
                          aria-label="Volume"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <span className="text-white/80 text-sm font-mono ml-2">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    aria-label="Playback speed"
                    aria-expanded={showSpeedMenu}
                  >
                    <Gauge className="w-5 h-5" />
                    <span className="text-xs ml-1">{playbackSpeed}x</span>
                  </button>

                  <AnimatePresence>
                    {showSpeedMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute bottom-full right-0 mb-2 bg-obsidian-300 rounded-lg shadow-xl border border-white/10 overflow-hidden"
                      >
                        {PLAYBACK_SPEEDS.map((speed) => (
                          <button
                            key={speed}
                            onClick={() => changePlaybackSpeed(speed)}
                            className={`w-full px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors ${
                              playbackSpeed === speed ? 'text-gold-500 bg-gold-500/10' : 'text-white'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={enterMiniPlayer}
                  className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  aria-label="Picture in picture"
                >
                  <PictureInPicture2 className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isPlaying && !showControlsOverlay && !error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={togglePlay}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-20 h-20 rounded-full bg-gold-500/90 flex items-center justify-center text-obsidian-400 shadow-xl shadow-gold-500/30"
          >
            <Play className="w-10 h-10 ml-2" />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}