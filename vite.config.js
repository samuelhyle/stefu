import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          'motion': ['framer-motion'],
          'swiper': ['swiper', 'swiper/react'],
          'mux': ['@mux/mux-player', 'react-player'],
          'socket': ['socket.io-client'],
          'supabase': ['@supabase/supabase-js'],
          'stripe': ['@stripe/stripe-js'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: false,
  },
})
