export const muxConfig = {
  tokenId: import.meta.env.VITE_MUX_TOKEN_ID || '',
  tokenSecret: import.meta.env.VITE_MUX_TOKEN_SECRET || '',
  signingKeyId: import.meta.env.VITE_MUX_SIGNING_KEY_ID || '',
  signingKeyPrivate: import.meta.env.VITE_MUX_SIGNING_KEY_PRIVATE || '',
}

export const isMuxConfigured = Boolean(muxConfig.tokenId && muxConfig.tokenSecret)

export function getMuxPlaybackUrl(playbackId) {
  if (!playbackId) return null
  return `https://stream.mux.com/${playbackId}.m3u8`
}

export function getMuxThumbnailUrl(playbackId, time = 0) {
  if (!playbackId) return null
  return `https://image.mux.com/${playbackId}/thumbnail.jpg?time=${time}`
}

export function getMuxAnimatedGifUrl(playbackId) {
  if (!playbackId) return null
  return `https://image.mux.com/${playbackId}/animated.gif`
}