import type { ContentItem } from '../types'

export function generateRssXml(items: ContentItem[], siteUrl: string): string {
  const feedItems = items.map(item => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${siteUrl}/watch/${item.id}</link>
      <description>${escapeXml(item.description || '')}</description>
      <category>${escapeXml(item.category || 'general')}</category>
      ${item.thumbnail ? `<enclosure url="${escapeXml(item.thumbnail)}" type="image/jpeg"/>` : ''}
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid isPermaLink="true">${siteUrl}/watch/${item.id}</guid>
    </item>
  `).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
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
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
