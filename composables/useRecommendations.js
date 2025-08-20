import { ref, computed } from 'vue'

export const useRecommendations = () => {
  // State
  const recommendations = ref([])
  const trendingManga = ref([])
  const personalizedSuggestions = ref([])
  const loading = ref(false)
  const error = ref('')

  // Vietnamese reading preferences data
  const vietnamesePreferences = {
    popularGenres: [
      'Hành Động', 'Lãng Mạn', 'Huyền Huyễn', 'Hài Hước', 
      'Trường Học', 'Thể Thao', 'Kinh Dị', 'Trinh Thám'
    ],
    preferredStatus: ['ongoing', 'completed'],
    readingTimes: {
      morning: ['Hài Hước', 'Trường Học', 'Thể Thao'],
      afternoon: ['Hành Động', 'Huyền Huyễn', 'Phiêu Lưu'],
      evening: ['Lãng Mạn', 'Drama', 'Slice of Life'],
      night: ['Kinh Dị', 'Trinh Thám', 'Tâm Lý']
    },
    weekendGenres: ['Hành Động', 'Huyền Huyễn', 'Phiêu Lưu'],
    weekdayGenres: ['Trường Học', 'Hài Hước', 'Lãng Mạn']
  }

  // Get time-based recommendations
  const getTimeBasedRecommendations = () => {
    const hour = new Date().getHours()
    const isWeekend = [0, 6].includes(new Date().getDay())
    
    let timeOfDay
    if (hour >= 6 && hour < 12) timeOfDay = 'morning'
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon'
    else if (hour >= 17 && hour < 22) timeOfDay = 'evening'
    else timeOfDay = 'night'

    const timeGenres = vietnamesePreferences.readingTimes[timeOfDay]
    const dayGenres = isWeekend ? vietnamesePreferences.weekendGenres : vietnamesePreferences.weekdayGenres
    
    return [...new Set([...timeGenres, ...dayGenres])]
  }

  // Fetch personalized recommendations
  const fetchPersonalizedRecommendations = async (userId = null) => {
    loading.value = true
    error.value = ''

    try {
      const timeBasedGenres = getTimeBasedRecommendations()
      
      const response = await $fetch('/api/recommendations/personalized', {
        method: 'POST',
        body: {
          userId,
          preferences: {
            timeBasedGenres,
            vietnameseMarket: true,
            mobileOptimized: true
          }
        }
      })

      if (response.success) {
        personalizedSuggestions.value = response.data.recommendations || []
        trendingManga.value = response.data.trending || []
      }

    } catch (err) {
      console.error('Error fetching personalized recommendations:', err)
      error.value = 'Không thể tải gợi ý cá nhân hóa'
      
      // Fallback to genre-based recommendations
      await fetchGenreBasedRecommendations()
    } finally {
      loading.value = false
    }
  }

  // Fallback genre-based recommendations
  const fetchGenreBasedRecommendations = async () => {
    try {
      const timeBasedGenres = getTimeBasedRecommendations()
      
      const response = await $fetch('/api/manga', {
        query: {
          genres: timeBasedGenres.join(','),
          sort: 'popular',
          limit: 20,
          status: 'ongoing'
        }
      })

      if (response.success) {
        personalizedSuggestions.value = response.data.manga || []
      }

    } catch (err) {
      console.error('Error fetching genre-based recommendations:', err)
    }
  }

  // Get recommendations based on reading history
  const getHistoryBasedRecommendations = async (readingHistory) => {
    if (!readingHistory || readingHistory.length === 0) {
      return await fetchGenreBasedRecommendations()
    }

    try {
      // Analyze user's reading patterns
      const genreFrequency = {}
      const authorFrequency = {}
      const statusPreference = {}

      readingHistory.forEach(item => {
        // Count genres
        item.manga?.genres?.forEach(genre => {
          genreFrequency[genre] = (genreFrequency[genre] || 0) + 1
        })

        // Count authors
        if (item.manga?.author) {
          authorFrequency[item.manga.author] = (authorFrequency[item.manga.author] || 0) + 1
        }

        // Count status preferences
        if (item.manga?.status) {
          statusPreference[item.manga.status] = (statusPreference[item.manga.status] || 0) + 1
        }
      })

      // Get top preferences
      const topGenres = Object.entries(genreFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([genre]) => genre)

      const topAuthors = Object.entries(authorFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([author]) => author)

      // Fetch recommendations based on preferences
      const response = await $fetch('/api/recommendations/history-based', {
        method: 'POST',
        body: {
          topGenres,
          topAuthors,
          statusPreference: Object.keys(statusPreference)[0] || 'ongoing',
          excludeMangaIds: readingHistory.map(h => h.mangaId)
        }
      })

      if (response.success) {
        return response.data || []
      }

    } catch (err) {
      console.error('Error getting history-based recommendations:', err)
    }

    return []
  }

  // Get similar manga recommendations
  const getSimilarManga = async (mangaId, limit = 6) => {
    try {
      const response = await $fetch(`/api/recommendations/similar/${mangaId}`, {
        query: { limit }
      })

      if (response.success) {
        return response.data || []
      }

    } catch (err) {
      console.error('Error fetching similar manga:', err)
    }

    return []
  }

  // Get trending manga for Vietnamese users
  const getTrendingForVietnamese = async () => {
    try {
      const response = await $fetch('/api/recommendations/trending-vietnam')
      
      if (response.success) {
        trendingManga.value = response.data || []
      }

    } catch (err) {
      console.error('Error fetching Vietnamese trending:', err)
      
      // Fallback to popular manga
      try {
        const fallbackResponse = await $fetch('/api/manga', {
          query: {
            sort: 'popular',
            limit: 12,
            genres: vietnamesePreferences.popularGenres.slice(0, 3).join(',')
          }
        })
        
        if (fallbackResponse.success) {
          trendingManga.value = fallbackResponse.data.manga || []
        }
      } catch (fallbackErr) {
        console.error('Fallback trending error:', fallbackErr)
      }
    }
  }

  // Get recommendations for new users
  const getNewUserRecommendations = async () => {
    try {
      const timeBasedGenres = getTimeBasedRecommendations()
      
      const response = await $fetch('/api/recommendations/new-user', {
        method: 'POST',
        body: {
          preferredGenres: timeBasedGenres,
          vietnameseMarket: true
        }
      })

      if (response.success) {
        personalizedSuggestions.value = response.data || []
      }

    } catch (err) {
      console.error('Error fetching new user recommendations:', err)
      await fetchGenreBasedRecommendations()
    }
  }

  // Get seasonal recommendations
  const getSeasonalRecommendations = async () => {
    const month = new Date().getMonth() + 1
    let season = 'spring'
    
    if (month >= 6 && month <= 8) season = 'summer'
    else if (month >= 9 && month <= 11) season = 'autumn'
    else if (month >= 12 || month <= 2) season = 'winter'

    const seasonalGenres = {
      spring: ['Lãng Mạn', 'Trường Học', 'Slice of Life'],
      summer: ['Hành Động', 'Phiêu Lưu', 'Thể Thao'],
      autumn: ['Drama', 'Tâm Lý', 'Trinh Thám'],
      winter: ['Huyền Huyễn', 'Kinh Dị', 'Fantasy']
    }

    try {
      const response = await $fetch('/api/manga', {
        query: {
          genres: seasonalGenres[season].join(','),
          sort: 'popular',
          limit: 10
        }
      })

      if (response.success) {
        return response.data.manga || []
      }

    } catch (err) {
      console.error('Error fetching seasonal recommendations:', err)
    }

    return []
  }

  // Generate comprehensive recommendations
  const generateRecommendations = async (userProfile = null) => {
    loading.value = true
    error.value = ''

    try {
      const recommendationSets = await Promise.allSettled([
        getTrendingForVietnamese(),
        userProfile?.readingHistory 
          ? getHistoryBasedRecommendations(userProfile.readingHistory)
          : getNewUserRecommendations(),
        getSeasonalRecommendations()
      ])

      // Combine and deduplicate recommendations
      const allRecommendations = []
      const seenIds = new Set()

      recommendationSets.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          const items = Array.isArray(result.value) ? result.value : []
          items.forEach(manga => {
            if (!seenIds.has(manga._id)) {
              seenIds.add(manga._id)
              allRecommendations.push({
                ...manga,
                recommendationType: ['trending', 'personalized', 'seasonal'][index],
                score: Math.random() * 0.3 + 0.7 // Random score between 0.7-1.0
              })
            }
          })
        }
      })

      // Sort by score and Vietnamese preferences
      recommendations.value = allRecommendations
        .sort((a, b) => {
          // Boost Vietnamese popular genres
          const aBoost = a.genres?.some(g => vietnamesePreferences.popularGenres.includes(g)) ? 0.1 : 0
          const bBoost = b.genres?.some(g => vietnamesePreferences.popularGenres.includes(g)) ? 0.1 : 0
          
          return (b.score + bBoost) - (a.score + aBoost)
        })
        .slice(0, 50)

    } catch (err) {
      console.error('Error generating recommendations:', err)
      error.value = 'Không thể tạo gợi ý cá nhân hóa'
    } finally {
      loading.value = false
    }
  }

  // Get quick recommendations for homepage
  const getQuickRecommendations = async (limit = 6) => {
    try {
      const timeBasedGenres = getTimeBasedRecommendations()
      
      const response = await $fetch('/api/manga', {
        query: {
          genres: timeBasedGenres.slice(0, 3).join(','),
          sort: 'popular',
          limit,
          status: 'ongoing'
        }
      })

      if (response.success) {
        return response.data.manga || []
      }

    } catch (err) {
      console.error('Error fetching quick recommendations:', err)
    }

    return []
  }

  return {
    // State
    recommendations: readonly(recommendations),
    trendingManga: readonly(trendingManga),
    personalizedSuggestions: readonly(personalizedSuggestions),
    loading: readonly(loading),
    error: readonly(error),

    // Methods
    fetchPersonalizedRecommendations,
    getHistoryBasedRecommendations,
    getSimilarManga,
    getTrendingForVietnamese,
    getNewUserRecommendations,
    getSeasonalRecommendations,
    generateRecommendations,
    getQuickRecommendations,
    getTimeBasedRecommendations
  }
}
