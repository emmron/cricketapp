import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Dynamically import the PWA plugin to handle potential missing dependency
const plugins = [vue()]

try {
  const { VitePWA } = await import('vite-plugin-pwa')
  plugins.push(
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'OZ Crickets Scorer',
        short_name: 'OZCrickets',
        description: 'Australian Cricket Scoring Application',
        theme_color: '#00843D',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          }
          // Other icons will be loaded from manifest.json
        ]
      }
    })
  )
} catch (e) {
  console.warn('vite-plugin-pwa not found, PWA features will be disabled')
}

// https://vite.dev/config/
export default defineConfig({
  plugins,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 3000,
    host: true
  }
})
