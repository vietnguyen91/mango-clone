import { computed } from 'vue'

export const useVietnameseSEO = () => {
  // Vietnamese SEO keywords and phrases
  const vietnameseKeywords = {
    manga: [
      'truyện tranh', 'manga', 'manhwa', 'manhua', 'comic',
      'truyện tranh online', 'đọc truyện miễn phí', 'truyện tranh việt nam',
      'manga việt nam', 'truyện tranh hay', 'truyện tranh mới nhất'
    ],
    genres: {
      'Action': ['hành động', 'đánh nhau', 'chiến đấu', 'võ thuật'],
      'Romance': ['lãng mạn', 'tình yêu', 'yêu đương', 'ngôn tình'],
      'Fantasy': ['huyền huyễn', 'phép thuật', 'ma pháp', 'thần thoại'],
      'Comedy': ['hài hước', 'vui nhộn', 'hài', 'comedy'],
      'School': ['trường học', 'học đường', 'sinh viên', 'học sinh'],
      'Horror': ['kinh dị', 'ma quỷ', 'đáng sợ', 'horror'],
      'Sports': ['thể thao', 'bóng đá', 'bóng rổ', 'tennis'],
      'Mystery': ['trinh thám', 'bí ẩn', 'thám tử', 'mystery']
    },
    status: {
      'ongoing': ['đang cập nhật', 'chưa hoàn thành', 'ongoing'],
      'completed': ['đã hoàn thành', 'full', 'completed', 'end'],
      'hiatus': ['tạm ngưng', 'hiatus', 'nghỉ']
    }
  }

  // Generate SEO meta for manga page
  const generateMangaSEO = (manga) => {
    const title = `${manga.title} - Đọc truyện tranh online miễn phí | Mango`
    
    const genres = manga.genres?.map(genre => 
      vietnameseKeywords.genres[genre]?.[0] || genre
    ).join(', ') || ''

    const status = vietnameseKeywords.status[manga.status]?.[0] || manga.status

    const description = `Đọc ${manga.title} ${genres ? `- ${genres}` : ''} ${status} miễn phí tại Mango. ${manga.description ? manga.description.substring(0, 100) + '...' : 'Cập nhật nhanh nhất, chất lượng cao.'}`

    const keywords = [
      manga.title,
      ...vietnameseKeywords.manga,
      ...(manga.genres?.flatMap(genre => vietnameseKeywords.genres[genre] || []) || []),
      manga.author,
      status
    ].filter(Boolean).join(', ')

    return {
      title,
      meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: manga.s3CoverUrl || manga.coverImage },
        { property: 'og:type', content: 'book' },
        { property: 'og:locale', content: 'vi_VN' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: manga.s3CoverUrl || manga.coverImage },
        { name: 'author', content: manga.author },
        { name: 'robots', content: 'index, follow' }
      ],
      link: [
        { rel: 'canonical', href: `https://mango.vn/manga/${manga.slug}` }
      ],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Book',
            'name': manga.title,
            'author': {
              '@type': 'Person',
              'name': manga.author
            },
            'genre': manga.genres,
            'inLanguage': 'vi-VN',
            'description': manga.description,
            'image': manga.s3CoverUrl || manga.coverImage,
            'url': `https://mango.vn/manga/${manga.slug}`,
            'publisher': {
              '@type': 'Organization',
              'name': 'Mango',
              'url': 'https://mango.vn'
            },
            'aggregateRating': manga.rating ? {
              '@type': 'AggregateRating',
              'ratingValue': manga.rating,
              'ratingCount': manga.ratingCount || 1,
              'bestRating': 5,
              'worstRating': 1
            } : undefined
          })
        }
      ]
    }
  }

  // Generate SEO meta for chapter page
  const generateChapterSEO = (manga, chapter) => {
    const title = `${manga.title} Chương ${chapter.chapterNumber}${chapter.title ? ` - ${chapter.title}` : ''} | Mango`
    
    const description = `Đọc ${manga.title} Chương ${chapter.chapterNumber} miễn phí tại Mango. Cập nhật nhanh nhất, chất lượng cao, không quảng cáo.`

    const keywords = [
      `${manga.title} chương ${chapter.chapterNumber}`,
      `${manga.title} chapter ${chapter.chapterNumber}`,
      ...vietnameseKeywords.manga,
      manga.author,
      'đọc online',
      'miễn phí'
    ].filter(Boolean).join(', ')

    return {
      title,
      meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: chapter.images?.[0] || manga.s3CoverUrl || manga.coverImage },
        { property: 'og:type', content: 'article' },
        { property: 'og:locale', content: 'vi_VN' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'robots', content: 'index, follow' }
      ],
      link: [
        { rel: 'canonical', href: `https://mango.vn/read/${chapter.chapterId}` },
        { rel: 'prev', href: chapter.prevChapter ? `https://mango.vn/read/${chapter.prevChapter}` : undefined },
        { rel: 'next', href: chapter.nextChapter ? `https://mango.vn/read/${chapter.nextChapter}` : undefined }
      ].filter(link => link.href),
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            'headline': title,
            'description': description,
            'image': chapter.images?.[0] || manga.s3CoverUrl || manga.coverImage,
            'author': {
              '@type': 'Person',
              'name': manga.author
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'Mango',
              'url': 'https://mango.vn',
              'logo': {
                '@type': 'ImageObject',
                'url': 'https://mango.vn/logo.png'
              }
            },
            'datePublished': chapter.uploadDate,
            'dateModified': chapter.updatedAt || chapter.uploadDate,
            'inLanguage': 'vi-VN',
            'isPartOf': {
              '@type': 'Book',
              'name': manga.title,
              'url': `https://mango.vn/manga/${manga.slug}`
            }
          })
        }
      ]
    }
  }

  // Generate SEO meta for homepage
  const generateHomepageSEO = () => {
    const title = 'Mango - Đọc truyện tranh online miễn phí | Manga, Manhwa, Manhua Việt Nam'
    const description = 'Nền tảng đọc truyện tranh hàng đầu Việt Nam với hàng nghìn bộ manga, manhwa, manhua miễn phí. Cập nhật nhanh nhất, chất lượng cao, giao diện thân thiện.'
    
    const keywords = [
      ...vietnameseKeywords.manga,
      'nền tảng truyện tranh việt nam',
      'đọc truyện online',
      'manga việt nam',
      'manhwa việt nam',
      'manhua việt nam',
      'truyện tranh miễn phí',
      'mango vietnam'
    ].join(', ')

    return {
      title,
      meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: 'https://mango.vn/og-image.jpg' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'vi_VN' },
        { property: 'og:site_name', content: 'Mango' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'robots', content: 'index, follow' },
        { name: 'google-site-verification', content: process.env.GOOGLE_SITE_VERIFICATION }
      ].filter(meta => meta.content),
      link: [
        { rel: 'canonical', href: 'https://mango.vn' }
      ],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': 'Mango',
            'alternateName': 'Mango Vietnam',
            'url': 'https://mango.vn',
            'description': description,
            'inLanguage': 'vi-VN',
            'potentialAction': {
              '@type': 'SearchAction',
              'target': 'https://mango.vn/search?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'Mango',
              'url': 'https://mango.vn'
            }
          })
        }
      ]
    }
  }

  // Generate sitemap data
  const generateSitemapData = async () => {
    try {
      const response = await $fetch('/api/sitemap/generate')
      return response.data || []
    } catch (error) {
      console.error('Error generating sitemap data:', error)
      return []
    }
  }

  // Generate breadcrumb schema
  const generateBreadcrumbSchema = (breadcrumbs) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': crumb.url
      }))
    }
  }

  // Vietnamese search optimization
  const optimizeForVietnameseSearch = (content) => {
    // Common Vietnamese search patterns
    const optimizations = {
      // Add Vietnamese diacritics variations
      'truyen': ['truyện', 'truyen'],
      'doc': ['đọc', 'doc'],
      'mien phi': ['miễn phí', 'mien phi'],
      'cap nhat': ['cập nhật', 'cap nhat'],
      'hay nhat': ['hay nhất', 'hay nhat']
    }

    let optimizedContent = content
    
    Object.entries(optimizations).forEach(([base, variations]) => {
      variations.forEach(variation => {
        if (!optimizedContent.includes(variation)) {
          optimizedContent += ` ${variation}`
        }
      })
    })

    return optimizedContent
  }

  return {
    // Methods
    generateMangaSEO,
    generateChapterSEO,
    generateHomepageSEO,
    generateSitemapData,
    generateBreadcrumbSchema,
    optimizeForVietnameseSearch,

    // Data
    vietnameseKeywords
  }
}
