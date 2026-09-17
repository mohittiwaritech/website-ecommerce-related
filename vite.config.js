import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { execSync } from 'node:child_process'

function sitemapPlugin() {
  return {
    name: 'generate-sitemap',
    buildStart() {
      execSync('node scripts/generate-sitemap.js', { stdio: 'inherit' })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    sitemapPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'BillingZone',
        short_name: 'BillingZone',
        description: 'POS hardware, printers, scanners and billing software from BillingZone.',
        theme_color: '#0088cc',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        lang: 'en',
        categories: ['shopping', 'business'],
        icons: [
          {
            src: '/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/sitemap\.xml$/, /^\/robots\.txt$/],
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|webp|avif|gif)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'product-images',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 14 },
            },
          },
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'firebase-images',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
})
