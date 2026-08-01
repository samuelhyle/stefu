import { useState, useEffect, useRef, Suspense, type ReactNode } from 'react'
import ErrorBoundary from './ErrorBoundary'

function SectionSkeleton({ minHeight = 400 }: { minHeight?: number }) {
  return (
    <div
      aria-hidden="true"
      className="w-full flex items-center justify-center"
      style={{ minHeight }}
    >
      <div className="w-10 h-10 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
    </div>
  )
}

interface LazySectionProps {
  children: ReactNode
  rootMargin?: string
  minHeight?: number
}

export default function LazySection({ children, rootMargin = '400px', minHeight = 400 }: LazySectionProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (visible || !ref.current) return
    const el = ref.current
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [visible, rootMargin])

  return (
    <div ref={ref}>
      {visible ? (
        <ErrorBoundary>
          <Suspense fallback={<SectionSkeleton minHeight={minHeight} />}>{children}</Suspense>
        </ErrorBoundary>
      ) : (
        <SectionSkeleton minHeight={minHeight} />
      )}
    </div>
  )
}
