export default defineEventHandler(async (event) => {
  setHeader(event, 'content-type', 'text/plain')
  setHeader(event, 'cache-control', 'public, max-age=86400') // Cache for 24 hours

  const baseUrl = 'https://mango.vn'

  return `# Robots.txt for Mango - Vietnamese Manga Platform

# Allow all crawlers
User-agent: *
Allow: /

# Disallow admin and API endpoints
Disallow: /admin/
Disallow: /api/
Disallow: /auth/
Disallow: /_nuxt/

# Disallow user-specific pages
Disallow: /profile/
Disallow: /settings/
Disallow: /bookmarks/
Disallow: /history/

# Disallow search result pages with parameters
Disallow: /search?*
Disallow: /*?page=*
Disallow: /*?sort=*

# Allow important search pages
Allow: /search$
Allow: /manga$
Allow: /genres$

# Crawl delay for Vietnamese search engines
User-agent: Bingbot
Crawl-delay: 1

User-agent: Googlebot
Crawl-delay: 0

# Vietnamese search engines
User-agent: VietSpider
Crawl-delay: 2

User-agent: Coccoc
Crawl-delay: 1

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Additional sitemaps
Sitemap: ${baseUrl}/sitemap-manga.xml
Sitemap: ${baseUrl}/sitemap-chapters.xml
Sitemap: ${baseUrl}/sitemap-genres.xml`
})
