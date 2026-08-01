import { generateRssXml } from '../src/services/rssService'
import { featuredContent, categoriesContent } from '../src/data/content'

export default async () => {
  const allContent = [
    ...featuredContent,
    ...Object.values(categoriesContent).flat(),
  ]

  const siteUrl = process.env.URL || 'https://stefu.com'
  const xml = generateRssXml(allContent, siteUrl)

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

export const config = { path: '/rss.xml' }
