const CACHE_NAME = 'stefu-v2'
const STATIC_ASSETS = ['/', '/manifest.json', '/favicon.svg']
const IMAGE_CACHE = 'stefu-images-v2'
const IMAGE_CACHE_MAX = 60

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== IMAGE_CACHE)
          .map((name) => caches.delete(name))
      )
    )
  )
  self.clients.claim()
})

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  if (keys.length > maxEntries) {
    await cache.delete(keys[0])
    await trimCache(cacheName, maxEntries)
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET') return

  // Never cache HLS video streams — always go to Mux CDN
  if (url.origin === 'https://stream.mux.com') return

  // Mux thumbnails: cache-first with LRU
  if (url.origin === 'https://image.mux.com') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(request)
        if (cached) return cached
        const response = await fetch(request)
        if (response.ok) {
          cache.put(request, response.clone()).then(() => trimCache(IMAGE_CACHE, IMAGE_CACHE_MAX))
        }
        return response
      })
    )
    return
  }

  // HTML documents: network-first so deploys ship instantly
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {})
          return response
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('/')))
    )
    return
  }

  // Same-origin static assets: cache-first
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then(
        (response) =>
          response ||
          fetch(request).then((networkResponse) => {
            if (networkResponse.ok) {
              const copy = networkResponse.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
            }
            return networkResponse
          })
      )
    )
    return
  }

  // Everything else: network with graceful offline fallback
  event.respondWith(fetch(request).catch(() => caches.match('/')))
})

self.addEventListener('push', (event) => {
  if (!event.data) return
  const data = event.data.json()
  const options = {
    body: data.body || 'New content available!',
    icon: '/icon-192.svg',
    badge: '/icon-192.svg',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
  }
  event.waitUntil(self.registration.showNotification(data.title || 'STEFU', options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data.url))
})
