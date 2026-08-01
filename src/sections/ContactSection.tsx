import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageCircle, Send, MapPin, Check } from 'lucide-react'
import MailingList from '../components/MailingList'
import { submitContactMessage } from '../services/contactService'
import { useToast } from '../components/Toast'

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    const { error } = await submitContactMessage(formData)
    setSubmitting(false)
    if (error) {
      toast.error(error.message || 'Could not send message. Please try again.')
      return
    }
    setSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="py-20 bg-obsidian-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-500 text-sm font-semibold mb-4">
            <Mail className="w-4 h-4 mr-2" />
            CONTACT
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Have questions? Want to collaborate? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="mb-12">
          <MailingList />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Message Sent!</h4>
                <p className="text-white/60">We&apos;ll get back to you soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-300/50 border border-white/10 text-white text-base placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-300/50 border border-white/10 text-white text-base placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors"
                  />
                </div>
                <div>
                  <textarea
                    rows={4}
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-300/50 border border-white/10 text-white text-base placeholder-white/40 focus:outline-none focus:border-gold-500/50 transition-colors resize-none"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.02 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                  className="w-full py-3 rounded-xl bg-gold-500 text-obsidian-400 font-semibold hover:bg-gold-400 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                </motion.button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Other Ways to Connect</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-obsidian-300/50 border border-white/5">
                <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <p className="text-white/40 text-sm">Email</p>
                  <p className="text-white font-semibold">contact@stefu.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl bg-obsidian-300/50 border border-white/5">
                <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <p className="text-white/40 text-sm">Social Media</p>
                  <p className="text-white font-semibold">@stefantherman</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl bg-obsidian-300/50 border border-white/5">
                <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <p className="text-white/40 text-sm">Location</p>
                  <p className="text-white font-semibold">Helsinki, Finland</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}