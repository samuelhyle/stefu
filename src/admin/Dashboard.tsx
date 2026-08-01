import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, X, Save, Play, Eye, Clock, ChevronRight } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getMuxThumbnailUrl } from '../lib/mux'
import type { Video } from '../types'

const CATEGORIES = ['trending', 'exclusive', 'lifestyle', 'talks'] as const
const TYPES = ['live', 'episode', 'clip'] as const
const TIMELINE_SLOTS = ['morning', 'afternoon', 'evening', 'night'] as const
type Slot = typeof TIMELINE_SLOTS[number] | null

interface FormData {
  title: string
  description: string
  url: string
  thumbnail: string
  category: string
  type: string
  duration: string
  is_premium: boolean
  timeline_slot: string | null
  timeline_time: string | null
}

const initialFormData: FormData = {
  title: '',
  description: '',
  url: '',
  thumbnail: '',
  category: 'trending',
  type: 'episode',
  duration: '',
  is_premium: false,
  timeline_slot: null,
  timeline_time: null,
}

export default function AdminDashboard() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const fetchVideos = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setVideos(data as Video[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured) return

    const videoData: Record<string, unknown> = {
      ...formData,
      duration: formData.duration ? parseInt(formData.duration) : null,
    }

    if (editingVideo) {
      const { error } = await supabase
        .from('videos')
        .update(videoData)
        .eq('id', editingVideo.id)

      if (!error) {
        fetchVideos()
        closeModal()
      }
    } else {
      const { error } = await supabase
        .from('videos')
        .insert([videoData])

      if (!error) {
        fetchVideos()
        closeModal()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!isSupabaseConfigured) return
    if (!confirm('Are you sure you want to delete this video?')) return

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchVideos()
    }
  }

  const openAddModal = () => {
    setEditingVideo(null)
    setFormData(initialFormData)
    setShowModal(true)
  }

  const openEditModal = (video: Video) => {
    setEditingVideo(video)
    setFormData({
      title: video.title || '',
      description: video.description || '',
      url: video.url || '',
      thumbnail: video.thumbnail || '',
      category: video.category || 'trending',
      type: video.type || 'episode',
      duration: video.duration?.toString() || '',
      is_premium: video.is_premium || false,
      timeline_slot: video.timeline_slot || null,
      timeline_time: video.timeline_time || null,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingVideo(null)
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '-'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-obsidian-400 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-white/60 mb-4">
            Supabase is not configured. Please add your environment variables.
          </p>
          <code className="bg-obsidian-200 px-4 py-2 rounded text-gold-500 text-sm">
            VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY
          </code>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-obsidian-400">
      <nav className="bg-obsidian-300 border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-display font-bold text-gradient">STEFU Admin</h1>
            <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-500 text-sm">
              Dashboard
            </span>
          </div>
          <motion.button
            onClick={openAddModal}
            className="btn-gold flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>Add Video</span>
          </motion.button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-obsidian-300 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-obsidian-200 rounded w-1/3 mb-4" />
                <div className="h-4 bg-obsidian-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20">
            <Play className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h2 className="text-xl text-white/60 mb-4">No videos yet</h2>
            <motion.button
              onClick={openAddModal}
              className="btn-gold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Your First Video
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-obsidian-300 rounded-xl p-6 border border-white/5 hover:border-gold-500/20 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-32 aspect-video bg-obsidian-200 rounded-lg overflow-hidden flex-shrink-0">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-white/20" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-gold-500/20 text-gold-500 text-xs font-medium">
                        {video.category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/10 text-white/60 text-xs">
                        {video.type}
                      </span>
                      {video.is_premium && (
                        <span className="px-2 py-0.5 rounded bg-white/10 text-gold-500 text-xs">
                          Premium
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white truncate">{video.title}</h3>
                    <p className="text-white/50 text-sm truncate">{video.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-white/40 text-xs">
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {video.views || 0}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDuration(video.duration)}
                      </span>
                      {video.timeline_slot && (
                        <span className="flex items-center">
                          <ChevronRight className="w-3 h-3 mr-1" />
                          {video.timeline_slot} @ {video.timeline_time}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => openEditModal(video)}
                      className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-gold-500 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(video.id)}
                      className="w-10 h-10 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-white/60 hover:text-red-500 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl bg-obsidian-300 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">
                {editingVideo ? 'Edit Video' : 'Add New Video'}
              </h2>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-white/60 text-sm mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-200 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50"
                  placeholder="Video title"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-200 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50 resize-none"
                  placeholder="Video description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-200 border border-white/10 text-white focus:outline-none focus:border-gold-500/50"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 text-sm mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-200 border border-white/10 text-white focus:outline-none focus:border-gold-500/50"
                  >
                    {TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Video URL (Mux Playback ID or direct URL)</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-200 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50"
                  placeholder="vzxxx or https://..."
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Thumbnail URL</label>
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-200 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Duration (seconds)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-200 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-gold-500/50"
                    placeholder="3600"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_premium}
                      onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                      className="w-5 h-5 rounded bg-obsidian-200 border-white/10 text-gold-500 focus:ring-gold-500"
                    />
                    <span className="text-white">Premium content</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Timeline Slot</label>
                  <select
                    value={formData.timeline_slot || ''}
                    onChange={(e) => setFormData({ ...formData, timeline_slot: e.target.value || null })}
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-200 border border-white/10 text-white focus:outline-none focus:border-gold-500/50"
                  >
                    <option value="">None</option>
                    {TIMELINE_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 text-sm mb-2">Timeline Time (HH:MM)</label>
                  <input
                    type="time"
                    value={formData.timeline_time || ''}
                    onChange={(e) => setFormData({ ...formData, timeline_time: e.target.value || null })}
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-200 border border-white/10 text-white focus:outline-none focus:border-gold-500/50"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <motion.button
                  type="submit"
                  className="flex-1 btn-gold flex items-center justify-center space-x-2 py-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-5 h-5" />
                  <span>{editingVideo ? 'Save Changes' : 'Add Video'}</span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
