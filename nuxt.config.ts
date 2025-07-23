export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@pinia/nuxt'
  ],
  
  css: ['~/assets/css/main.css'],
  
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mango',
    public: {
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
      staticUrl: process.env.STATIC_URL || 'https://usc1.contabostorage.com',
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
    }
  },

  tailwindcss: {
    configPath: '~/tailwind.config.js'
  }
})