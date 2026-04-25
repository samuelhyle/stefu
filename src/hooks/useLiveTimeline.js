import { useState, useEffect, useCallback, useRef } from 'react'
import { timelineContent } from '../data/content'

export function useLiveTimeline() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentContent, setCurrentContent] = useState(null)
  const [nextContent, setNextContent] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [timeOfDay, setTimeOfDay] = useState('')
  const currentContentRef = useRef(null)

  const getTimeOfDay = useCallback((date) => {
    const hour = date.getHours()
    if (hour >= 5 && hour < 12) return 'Morning'
    if (hour >= 12 && hour < 17) return 'Afternoon'
    if (hour >= 17 && hour < 21) return 'Evening'
    return 'Night'
  }, [])

  const findCurrentContent = useCallback((date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const currentTotalMinutes = hours * 60 + minutes
    
    let content = null
    let next = null
    
    for (let i = 0; i < timelineContent.length; i++) {
      const [hour, min] = timelineContent[i].time.split(':').map(Number)
      const slotTotalMinutes = hour * 60 + min
      
      if (currentTotalMinutes >= slotTotalMinutes) {
        content = timelineContent[i]
        next = timelineContent[i + 1] || timelineContent[0]
      }
    }
    
    if (!content) {
      content = timelineContent[timelineContent.length - 1]
      next = timelineContent[0]
    }
    
    return { content, next }
  }, [])

  useEffect(() => {
    const initialize = () => {
      const now = new Date()
      const { content, next } = findCurrentContent(now)
      currentContentRef.current = content
      setCurrentContent(content)
      setNextContent(next)
      setTimeOfDay(getTimeOfDay(now))
      setCurrentTime(now)
    }

    initialize()

    const timer = setInterval(() => {
      const now = new Date()
      const { content, next } = findCurrentContent(now)
      
      if (content !== currentContentRef.current) {
        setIsTransitioning(true)
        currentContentRef.current = content
        setTimeout(() => {
          setCurrentContent(content)
          setNextContent(next)
          setIsTransitioning(false)
        }, 500)
      }
      
      setCurrentTime(now)
      setTimeOfDay(getTimeOfDay(now))
    }, 30000)

    return () => clearInterval(timer)
  }, [findCurrentContent, getTimeOfDay])

  const getTimeUntilNext = useCallback(() => {
    if (!nextContent) return null
    const [nextHour, nextMin] = nextContent.time.split(':').map(Number)
    const nextDate = new Date()
    nextDate.setHours(nextHour, nextMin, 0, 0)
    
    if (nextDate <= currentTime) {
      nextDate.setDate(nextDate.getDate() + 1)
    }
    
    const diff = nextDate - currentTime
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }, [currentTime, nextContent])

  return {
    currentTime,
    currentContent,
    nextContent,
    timeOfDay,
    isTransitioning,
    getTimeUntilNext,
    timeline: timelineContent,
  }
}