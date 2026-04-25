import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(isActive) {
  const containerRef = useRef(null)
  const previousFocus = useRef(null)

  useEffect(() => {
    if (!isActive) return

    previousFocus.current = document.activeElement
    const container = containerRef.current
    if (!container) return

    const focusables = container.querySelectorAll(FOCUSABLE)
    const first = focusables[0]
    const last = focusables[focusables.length - 1]

    first?.focus()

    const handleKey = (e) => {
      if (e.key !== 'Tab' || focusables.length === 0) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', handleKey)
    return () => {
      container.removeEventListener('keydown', handleKey)
      previousFocus.current?.focus?.()
    }
  }, [isActive])

  return containerRef
}
