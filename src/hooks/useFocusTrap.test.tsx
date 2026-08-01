import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { useFocusTrap } from './useFocusTrap'

function Dialog({ active }: { active: boolean }) {
  const ref = useFocusTrap(active)
  return (
    <div ref={ref} data-testid="dialog">
      <button>First</button>
      <button>Second</button>
      <button>Last</button>
    </div>
  )
}

describe('useFocusTrap', () => {
  it('focuses the first focusable element when active', () => {
    render(<Dialog active={true} />)
    expect(screen.getByText('First')).toHaveFocus()
  })

  it('does not move focus when inactive', () => {
    const previouslyFocused = document.createElement('button')
    document.body.appendChild(previouslyFocused)
    previouslyFocused.focus()
    render(<Dialog active={false} />)
    expect(previouslyFocused).toHaveFocus()
    document.body.removeChild(previouslyFocused)
  })
})
