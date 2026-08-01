#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const siteUrl = (process.env.VITE_SITE_URL || 'https://stefu.com').replace(/\/$/, '')
const publicDir = resolve(__dirname, '..', 'public')

if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true })

const staticRoutes = ['/', '/moments']
const today = new Date().toISOString().slice(0, 10)

async function fetchVideoIds() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    console.warn('[sitemap] Supabase env not set — skipping video URLs')
    return []
  }
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/videos?select=id,updated_at&is_premium=eq.false`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    )
    if (!res.ok) {
      console.warn(`[sitemap] Supabase fetch failed: ${res.status}`)
      return []
    }
    const rows = await res.json()
    return Array.isArray(rows) ? rows : []
  } catch (err) {
    console.warn(`[sitemap] Supabase fetch error: ${err.message}`)
    return []
  }
}

const videos = await fetchVideoIds()

const urls = [
  ...staticRoutes.map((path) => ({ loc: `${siteUrl}${path}`, lastmod: today })),
  ...videos.map((v) => ({
    loc: `${siteUrl}/watch/${v.id}`,
    lastmod: (v.updated_at || '').slice(0, 10) || today,
  })),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>
`

writeFileSync(resolve(publicDir, 'sitemap.xml'), xml)

// Generate RSS feed
const feedItems = urls.map(u => `  <item>
    <link>${u.loc}</link>
    <guid isPermaLink="true">${u.loc}</guid>
    <pubDate>${new Date().toUTCString()}</pubDate>
  </item>`).join('\n')

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>STEFU</title>
    <link>${siteUrl}</link>
    <description>Latest content from Stefan</description>
    <language>en</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${feedItems}
  </channel>
</rss>`

writeFileSync(resolve(publicDir, 'rss.xml'), rss)
console.log('[rss] wrote RSS feed')

const robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${siteUrl}/sitemap.xml
`

writeFileSync(resolve(publicDir, 'robots.txt'), robots)

console.log(`[sitemap] wrote ${urls.length} URLs`)
