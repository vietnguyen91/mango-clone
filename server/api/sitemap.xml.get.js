import { connectToDatabase } from '../utils/mongodb.js'

export default defineEventHandler(async (event) => {
  try {
    const { db } = await connectToDatabase()
    
    // Set content type
    setHeader(event, 'content-type', 'application/xml')
    setHeader(event, 'cache-control', 'public, max-age=3600') // Cache for 1 hour

    const baseUrl = 'https://mango.vn'
    const currentDate = new Date().toISOString()

    // Static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/manga', priority: '0.9', changefreq: 'daily' },
      { url: '/search', priority: '0.8', changefreq: 'weekly' },
      { url: '/genres', priority: '0.8', changefreq: 'weekly' },
      { url: '/top-rated', priority: '0.7', changefreq: 'daily' },
      { url: '/latest', priority: '0.7', changefreq: 'hourly' },
      { url: '/completed', priority: '0.6', changefreq: 'daily' },
      { url: '/about', priority: '0.3', changefreq: 'monthly' },
      { url: '/contact', priority: '0.3', changefreq: 'monthly' },
      { url: '/privacy', priority: '0.2', changefreq: 'yearly' },
      { url: '/terms', priority: '0.2', changefreq: 'yearly' }
    ]

    // Get manga pages
    const manga = await db.collection('manga')
      .find({}, { projection: { slug: 1, updatedAt: 1, status: 1, rating: 1 } })
      .sort({ updatedAt: -1 })
      .limit(10000) // Limit for performance
      .toArray()

    // Get genre pages
    const genres = await db.collection('manga')
      .distinct('genres')

    // Get popular manga for higher priority
    const popularManga = await db.collection('manga')
      .find({}, { projection: { slug: 1, viewCount: 1 } })
      .sort({ viewCount: -1 })
      .limit(100)
      .toArray()

    const popularSlugs = new Set(popularManga.map(m => m.slug))

    // Build sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`

    // Add static pages
    staticPages.forEach(page => {
      sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
    })

    // Add manga pages
    manga.forEach(mangaItem => {
      const priority = popularSlugs.has(mangaItem.slug) ? '0.9' : '0.7'
      const changefreq = mangaItem.status === 'ongoing' ? 'daily' : 'weekly'
      const lastmod = mangaItem.updatedAt ? new Date(mangaItem.updatedAt).toISOString() : currentDate

      sitemap += `  <url>
    <loc>${baseUrl}/manga/${mangaItem.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`
    })

    // Add genre pages
    genres.forEach(genre => {
      const encodedGenre = encodeURIComponent(genre)
      sitemap += `  <url>
    <loc>${baseUrl}/genre/${encodedGenre}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`
    })

    sitemap += '</urlset>'

    return sitemap

  } catch (error) {
    console.error('Sitemap generation error:', error)
    
    // Return minimal sitemap on error
    const baseUrl = 'https://mango.vn'
    const currentDate = new Date().toISOString()
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
  }
})
