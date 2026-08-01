import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Play, CheckCircle, Lock, Clock, Award, ChevronRight } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  modules: { title: string; duration: string; completed: boolean }[]
  progress: number
  category: string
  enrolled: number
}

const COURSES: Course[] = [
  {
    id: 'content-101',
    title: 'Content Creation 101',
    description: 'Learn how Stefan creates viral content. From ideation to production.',
    modules: [
      { title: 'Finding Your Niche', duration: '15 min', completed: true },
      { title: 'Camera Setup & Lighting', duration: '20 min', completed: true },
      { title: 'Editing Like a Pro', duration: '30 min', completed: false },
      { title: 'Building a Content Calendar', duration: '15 min', completed: false },
      { title: 'Going Live: Tips & Tricks', duration: '25 min', completed: false },
    ],
    progress: 40,
    category: 'Content',
    enrolled: 1284,
  },
  {
    id: 'mindset-101',
    title: 'Creator Mindset',
    description: 'The mental framework behind consistent content creation and growth.',
    modules: [
      { title: 'Overcoming Creative Block', duration: '20 min', completed: false },
      { title: 'Dealing with Criticism', duration: '15 min', completed: false },
      { title: 'Staying Consistent', duration: '25 min', completed: false },
    ],
    progress: 0,
    category: 'Mindset',
    enrolled: 856,
  },
  {
    id: 'community-101',
    title: 'Building a Community',
    description: 'Turn followers into a loyal community. The Inner Circle playbook.',
    modules: [
      { title: 'Engagement Strategies', duration: '20 min', completed: false },
      { title: 'Exclusive Content Models', duration: '25 min', completed: false },
      { title: 'Monetization Without Selling Out', duration: '30 min', completed: false },
    ],
    progress: 0,
    category: 'Community',
    enrolled: 621,
  },
]

export default function StefuAcademy() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const course = COURSES.find(c => c.id === selectedCourse)

  return (
    <div className="py-20 bg-gradient-to-b from-obsidian-400 to-obsidian-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-gold-500/20 text-gold-500 text-sm font-semibold mb-4">
            <BookOpen className="w-4 h-4 mr-2" />
            STEFU ACADEMY
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Learn from Stefan
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Exclusive courses on content creation, mindset, and community building
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!selectedCourse ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {COURSES.map((course, index) => (
                <motion.button
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-left bg-obsidian-200/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-gold-500/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center mb-4 group-hover:bg-gold-500/30 transition-colors">
                    <BookOpen className="w-6 h-6 text-gold-500" />
                  </div>
                  <span className="text-xs text-gold-500 font-medium mb-2 block">{course.category}</span>
                  <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-white/50 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-white/40">
                    <span>{course.modules.length} modules</span>
                    <span>{course.enrolled.toLocaleString()} enrolled</span>
                  </div>
                  {course.progress > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-white/50 mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="h-1 bg-obsidian-400 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          className="h-full bg-gradient-to-r from-gold-500 to-pink-500 rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          ) : course ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-white/50 hover:text-white mb-6 flex items-center space-x-2 transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>Back to courses</span>
              </button>

              <div className="bg-obsidian-200/50 backdrop-blur-sm rounded-2xl border border-white/5 p-6 md:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-xs text-gold-500 font-medium mb-2 block">{course.category}</span>
                    <h2 className="text-3xl font-bold text-white mb-2">{course.title}</h2>
                    <p className="text-white/60">{course.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-white/40 text-sm">
                    <UsersIcon />
                    <span>{course.enrolled.toLocaleString()} enrolled</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {course.modules.map((module, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center justify-between p-4 rounded-xl ${
                        module.completed ? 'bg-green-500/10 border border-green-500/20' : 'bg-obsidian-400/50 border border-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {module.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <Play className="w-5 h-5 text-white/30" />
                        )}
                        <div>
                          <p className={`text-sm font-medium ${module.completed ? 'text-green-300' : 'text-white'}`}>
                            {module.title}
                          </p>
                          <p className="text-xs text-white/40 flex items-center mt-0.5">
                            <Clock className="w-3 h-3 mr-1" />
                            {module.duration}
                          </p>
                        </div>
                      </div>
                      {!module.completed && (
                        <Lock className="w-4 h-4 text-white/20" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

function UsersIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
