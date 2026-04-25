import { describe, it, expect } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import SEO from './SEO'

function renderSEO(props) {
  return render(
    <HelmetProvider>
      <SEO {...props} />
    </HelmetProvider>
  )
}

describe('SEO', () => {
  it('sets the default title when no title is provided', async () => {
    renderSEO({})
    await waitFor(() => {
      expect(document.title).toContain('STEFU')
    })
  })

  it('appends the title with the site name', async () => {
    renderSEO({ title: 'Moments' })
    await waitFor(() => {
      expect(document.title).toBe('Moments | STEFU')
    })
  })

  it('writes a canonical link', async () => {
    renderSEO({ title: 'Test', path: '/test' })
    await waitFor(() => {
      const canonical = document.querySelector('link[rel="canonical"]')
      expect(canonical).toBeTruthy()
      expect(canonical.getAttribute('href')).toMatch(/\/test$/)
    })
  })
})
