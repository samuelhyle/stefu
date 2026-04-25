import { describe, it, expect, vi, beforeEach } from 'vitest'

const insertMock = vi.fn()
const selectMock = vi.fn()
const singleMock = vi.fn()

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: () => ({
      insert: (...args) => {
        insertMock(...args)
        return { select: () => ({ single: singleMock }) }
      },
    }),
  },
  isSupabaseConfigured: true,
}))

import { submitContactMessage } from './contactService'

describe('submitContactMessage', () => {
  beforeEach(() => {
    insertMock.mockClear()
    selectMock.mockClear()
    singleMock.mockReset()
  })

  it('trims inputs before inserting', async () => {
    singleMock.mockResolvedValue({ data: { id: 'abc' }, error: null })
    const result = await submitContactMessage({
      name: '  Stefan  ',
      email: '  stefan@stefu.com  ',
      message: '  hi there  ',
    })
    expect(result.error).toBeNull()
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Stefan',
        email: 'stefan@stefu.com',
        message: 'hi there',
      })
    )
  })
})
