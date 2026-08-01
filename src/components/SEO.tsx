import { Helmet } from 'react-helmet-async'
import type { Video } from '../types'

const DEFAULT_TITLE = 'STEFU | Live With Stefan'
const DEFAULT_DESCRIPTION =
  "Step inside the world of Stefan Therman: exclusive content, live streams, unfiltered moments, and the Sober Life Store — built for those who demand more."
const DEFAULT_IMAGE = '/og-default.jpg'
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://stefu.com'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  path?: string
  type?: string
  video?: Video | { title?: string; description?: string; duration?: number | null; created_at?: string }
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  path = '/',
  type = 'website',
  video,
}: SEOProps) {
  const fullTitle = title ? `${title} | STEFU` : DEFAULT_TITLE
  const url = `${SITE_URL}${path}`
  const imageUrl = image?.startsWith('http') ? image : `${SITE_URL}${image}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="STEFU" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />

      {video && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: video.title,
            description: video.description || description,
            thumbnailUrl: imageUrl,
            uploadDate: video.created_at,
            contentUrl: url,
            duration: video.duration ? `PT${Math.floor(video.duration / 60)}M${video.duration % 60}S` : undefined,
          })}
        </script>
      )}
    </Helmet>
  )
}
