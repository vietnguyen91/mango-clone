export default defineNuxtConfig({
  compatibilityDate: '2025-08-14',
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],
  
  css: ['~/assets/css/main.css'],

  // PWA Configuration for Vietnamese Mobile Users
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|webp)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 1000,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
            }
          }
        },
        {
          urlPattern: /^\/api\/manga\/.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'manga-api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 // 24 hours
            }
          }
        }
      ]
    },
    manifest: {
      name: 'Mango - Truyện Tranh Việt Nam',
      short_name: 'Mango',
      description: 'Nền tảng đọc truyện tranh hàng đầu Việt Nam',
      theme_color: '#3B82F6',
      background_color: '#000000',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      lang: 'vi-VN',
      icons: [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  },

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mango',
    public: {
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
      staticUrl: process.env.STATIC_URL || 'https://usc1.contabostorage.com/03e21ef9131648ccaed06d10d18a770f:manga',
      siteName: 'Mango - Đọc Truyện Online'
    }
  },

  app: {
    head: {
      title: 'Mango - Đọc Truyện Online',
      meta: [
        { name: 'description', content: 'Đọc truyện tranh online miễn phí với chất lượng cao' },
        { name: 'keywords', content: 'truyện tranh, manga, đọc truyện online, truyện miễn phí' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  image: {
    domains: ['localhost', 's3.amazonaws.com', 'usc1.contabostorage.com'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    },
    format: ['webp', 'jpg', 'png', 'svg'],
    quality: 80,
    densities: [1, 2],
    // Note: We handle Contabo image optimization skip in component logic
    // instead of using providers to avoid import resolution issues
    presets: {
      manga: {
        modifiers: {
          format: 'webp',
          quality: 85,
          width: 300,
          height: 400
        }
      },
      page: {
        modifiers: {
          format: 'webp',
          quality: 90,
          width: 800
        }
      }
    }
  },

  tailwindcss: {
    configPath: '~/tailwind.config.js'
  }
})