import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('*/rest/v1/videos', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'Test Video',
        description: 'A test video for development',
        url: 'https://example.com/video.mp4',
        thumbnail: 'https://example.com/thumb.jpg',
        category: 'trending',
        type: 'episode',
        duration: 120,
        views: 1000,
        likes: 50,
        is_premium: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ])
  }),

  http.post('*/rest/v1/contact_messages', () => {
    return HttpResponse.json({ id: 'abc' }, { status: 201 })
  }),
]
