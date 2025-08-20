import { ref, computed } from 'vue'

export const useVietnameseCuration = () => {
  // State
  const curatedCollections = ref([])
  const trendingByTime = ref({})
  const vietnameseCategories = ref([])
  const seasonalContent = ref([])
  const loading = ref(false)
  const error = ref('')

  // Vietnamese content categories
  const vietnameseGenreMapping = {
    'Action': 'Hành Động',
    'Romance': 'Lãng Mạn', 
    'Fantasy': 'Huyền Huyễn',
    'Comedy': 'Hài Hước',
    'School': 'Trường Học',
    'Sports': 'Thể Thao',
    'Horror': 'Kinh Dị',
    'Mystery': 'Trinh Thám',
    'Drama': 'Drama',
    'Slice of Life': 'Đời Thường',
    'Psychological': 'Tâm Lý',
    'Supernatural': 'Siêu Nhiên',
    'Historical': 'Lịch Sử',
    'Martial Arts': 'Võ Thuật',
    'Mecha': 'Robot',
    'Sci-Fi': 'Khoa Học Viễn Tưởng'
  }

  // Vietnamese reading time preferences
  const timeBasedCollections = {
    morning: {
      name: 'Buổi sáng tích cực',
      description: 'Truyện nhẹ nhàng để bắt đầu ngày mới',
      genres: ['Hài Hước', 'Trường Học', 'Thể Thao', 'Đời Thường'],
      icon: '🌅'
    },
    afternoon: {
      name: 'Giải trí buổi chiều',
      description: 'Hành động và phiêu lưu cho giờ nghỉ trưa',
      genres: ['Hành Động', 'Huyền Huyễn', 'Phiêu Lưu', 'Võ Thuật'],
      icon: '☀️'
    },
    evening: {
      name: 'Thư giãn buổi tối',
      description: 'Lãng mạn và drama cho buổi tối',
      genres: ['Lãng Mạn', 'Drama', 'Đời Thường', 'Tâm Lý'],
      icon: '🌆'
    },
    night: {
      name: 'Đêm khuya ly kỳ',
      description: 'Kinh dị và bí ẩn cho những ai thức khuya',
      genres: ['Kinh Dị', 'Trinh Thám', 'Tâm Lý', 'Siêu Nhiên'],
      icon: '🌙'
    }
  }

  // Seasonal collections for Vietnam
  const seasonalCollections = {
    spring: {
      name: 'Mùa xuân tươi mới',
      description: 'Câu chuyện tình yêu và khởi đầu mới',
      genres: ['Lãng Mạn', 'Trường Học', 'Đời Thường'],
      months: [3, 4, 5],
      icon: '🌸'
    },
    summer: {
      name: 'Hè sôi động',
      description: 'Hành động và thể thao cho mùa hè',
      genres: ['Hành Động', 'Thể Thao', 'Phiêu Lưu'],
      months: [6, 7, 8],
      icon: '☀️'
    },
    autumn: {
      name: 'Thu hoài niệm',
      description: 'Drama và tâm lý sâu sắc',
      genres: ['Drama', 'Tâm Lý', 'Lịch Sử'],
      months: [9, 10, 11],
      icon: '🍂'
    },
    winter: {
      name: 'Đông huyền bí',
      description: 'Huyền huyễn và kinh dị cho mùa đông',
      genres: ['Huyền Huyễn', 'Kinh Dị', 'Siêu Nhiên'],
      months: [12, 1, 2],
      icon: '❄️'
    }
  }

  // Vietnamese holiday collections
  const holidayCollections = {
    tet: {
      name: 'Tết Nguyên Đán',
      description: 'Truyện gia đình và truyền thống',
      genres: ['Đời Thường', 'Gia Đình', 'Truyền Thống'],
      dates: ['01-01', '02-01'], // Lunar calendar approximation
      icon: '🧧'
    },
    valentine: {
      name: 'Lễ Tình Nhân',
      description: 'Những câu chuyện tình yêu ngọt ngào',
      genres: ['Lãng Mạn', 'Đời Thường'],
      dates: ['02-14'],
      icon: '💕'
    },
    halloween: {
      name: 'Halloween',
      description: 'Kinh dị và bí ẩn',
      genres: ['Kinh Dị', 'Siêu Nhiên', 'Trinh Thám'],
      dates: ['10-31'],
      icon: '🎃'
    }
  }

  // Get current time-based collection
  const getCurrentTimeCollection = () => {
    const hour = new Date().getHours()
    
    if (hour >= 6 && hour < 12) return timeBasedCollections.morning
    if (hour >= 12 && hour < 17) return timeBasedCollections.afternoon
    if (hour >= 17 && hour < 22) return timeBasedCollections.evening
    return timeBasedCollections.night
  }

  // Get current seasonal collection
  const getCurrentSeasonalCollection = () => {
    const month = new Date().getMonth() + 1
    
    for (const [season, data] of Object.entries(seasonalCollections)) {
      if (data.months.includes(month)) {
        return { season, ...data }
      }
    }
    
    return { season: 'spring', ...seasonalCollections.spring }
  }

  // Fetch curated collections
  const fetchCuratedCollections = async () => {
    loading.value = true
    error.value = ''

    try {
      const { db } = await connectToDatabase()
      
      // Get time-based collection
      const timeCollection = getCurrentTimeCollection()
      const timeBasedManga = await db.collection('manga')
        .find({
          genres: { $in: timeCollection.genres },
          status: 'ongoing',
          rating: { $gte: 4.0 }
        })
        .sort({ viewCount: -1, rating: -1 })
        .limit(12)
        .toArray()

      // Get seasonal collection
      const seasonalCollection = getCurrentSeasonalCollection()
      const seasonalManga = await db.collection('manga')
        .find({
          genres: { $in: seasonalCollection.genres },
          rating: { $gte: 4.0 }
        })
        .sort({ rating: -1, viewCount: -1 })
        .limit(12)
        .toArray()

      // Get Vietnamese trending by different time periods
      const now = new Date()
      const periods = {
        today: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      }

      const trendingData = {}
      for (const [period, date] of Object.entries(periods)) {
        trendingData[period] = await db.collection('manga')
          .find({
            updatedAt: { $gte: date },
            genres: { $in: Object.values(vietnameseGenreMapping) }
          })
          .sort({ viewCount: -1, rating: -1 })
          .limit(10)
          .toArray()
      }

      // Get Vietnamese categories with counts
      const categoryStats = await db.collection('manga')
        .aggregate([
          { $unwind: '$genres' },
          { 
            $group: { 
              _id: '$genres', 
              count: { $sum: 1 },
              avgRating: { $avg: '$rating' },
              totalViews: { $sum: '$viewCount' }
            } 
          },
          { $sort: { count: -1 } }
        ])
        .toArray()

      const vietnameseCategories = categoryStats
        .filter(cat => Object.values(vietnameseGenreMapping).includes(cat._id))
        .map(cat => ({
          name: cat._id,
          englishName: Object.keys(vietnameseGenreMapping).find(
            key => vietnameseGenreMapping[key] === cat._id
          ),
          count: cat.count,
          avgRating: cat.avgRating?.toFixed(1) || '0.0',
          totalViews: cat.totalViews || 0,
          icon: getCategoryIcon(cat._id)
        }))

      // Build curated collections
      curatedCollections.value = [
        {
          id: 'time-based',
          name: timeCollection.name,
          description: timeCollection.description,
          icon: timeCollection.icon,
          manga: timeBasedManga,
          type: 'time-based'
        },
        {
          id: 'seasonal',
          name: seasonalCollection.name,
          description: seasonalCollection.description,
          icon: seasonalCollection.icon,
          manga: seasonalManga,
          type: 'seasonal'
        }
      ]

      trendingByTime.value = trendingData
      vietnameseCategories.value = vietnameseCategories

    } catch (err) {
      console.error('Error fetching curated collections:', err)
      error.value = 'Không thể tải nội dung được tuyển chọn'
    } finally {
      loading.value = false
    }
  }

  // Get category icon
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Hành Động': '⚔️',
      'Lãng Mạn': '💕',
      'Huyền Huyễn': '🔮',
      'Hài Hước': '😄',
      'Trường Học': '🎓',
      'Thể Thao': '⚽',
      'Kinh Dị': '👻',
      'Trinh Thám': '🔍',
      'Drama': '🎭',
      'Đời Thường': '🏠',
      'Tâm Lý': '🧠',
      'Siêu Nhiên': '✨',
      'Lịch Sử': '📜',
      'Võ Thuật': '🥋',
      'Robot': '🤖',
      'Khoa Học Viễn Tưởng': '🚀'
    }
    return iconMap[categoryName] || '📚'
  }

  // Get trending manga for specific time period
  const getTrendingByPeriod = (period = 'week') => {
    return trendingByTime.value[period] || []
  }

  // Get recommendations for Vietnamese holidays
  const getHolidayRecommendations = async () => {
    const today = new Date()
    const dateString = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    
    for (const [holiday, data] of Object.entries(holidayCollections)) {
      if (data.dates.includes(dateString)) {
        try {
          const { db } = await connectToDatabase()
          const holidayManga = await db.collection('manga')
            .find({
              genres: { $in: data.genres },
              rating: { $gte: 4.0 }
            })
            .sort({ rating: -1, viewCount: -1 })
            .limit(12)
            .toArray()

          return {
            holiday,
            ...data,
            manga: holidayManga
          }
        } catch (err) {
          console.error('Error fetching holiday recommendations:', err)
        }
      }
    }
    
    return null
  }

  // Get Vietnamese editor's picks
  const getEditorsPicksVietnamese = async () => {
    try {
      const response = await $fetch('/api/curation/editors-picks-vietnam')
      
      if (response.success) {
        return response.data || []
      }

    } catch (err) {
      console.error('Error fetching Vietnamese editor picks:', err)
    }

    return []
  }

  // Get localized trending
  const getLocalizedTrending = async (region = 'vietnam') => {
    try {
      const response = await $fetch(`/api/curation/trending-${region}`)
      
      if (response.success) {
        return response.data || []
      }

    } catch (err) {
      console.error('Error fetching localized trending:', err)
    }

    return []
  }

  // Create themed collections
  const createThemedCollections = async () => {
    const collections = []

    // Weekend collection
    const isWeekend = [0, 6].includes(new Date().getDay())
    if (isWeekend) {
      collections.push({
        id: 'weekend-binge',
        name: 'Cuối tuần cày truyện',
        description: 'Những bộ truyện dài tập để đọc suốt cuối tuần',
        icon: '📚',
        genres: ['Hành Động', 'Huyền Huyễn', 'Phiêu Lưu'],
        criteria: { totalChapters: { $gte: 50 }, status: 'ongoing' }
      })
    }

    // Study break collection
    const isStudyTime = new Date().getMonth() >= 8 && new Date().getMonth() <= 11 // Sep-Dec
    if (isStudyTime) {
      collections.push({
        id: 'study-break',
        name: 'Giải lao học tập',
        description: 'Truyện ngắn để thư giãn giữa giờ học',
        icon: '📖',
        genres: ['Hài Hước', 'Đời Thường', 'Trường Học'],
        criteria: { totalChapters: { $lte: 30 } }
      })
    }

    // Vietnamese culture collection
    collections.push({
      id: 'vietnamese-culture',
      name: 'Văn hóa Việt Nam',
      description: 'Truyện có yếu tố văn hóa Việt Nam',
      icon: '🇻🇳',
      genres: ['Lịch Sử', 'Truyền Thống', 'Đời Thường'],
      criteria: { 
        $or: [
          { tags: { $in: ['vietnam', 'vietnamese', 'việt nam'] } },
          { description: { $regex: /(việt nam|vietnam|vietnamese)/i } }
        ]
      }
    })

    // Fetch manga for each collection
    try {
      const { db } = await connectToDatabase()
      
      for (const collection of collections) {
        const manga = await db.collection('manga')
          .find({
            genres: { $in: collection.genres },
            ...collection.criteria
          })
          .sort({ rating: -1, viewCount: -1 })
          .limit(12)
          .toArray()

        collection.manga = manga
      }

      return collections

    } catch (err) {
      console.error('Error creating themed collections:', err)
      return []
    }
  }

  // Get Vietnamese reading statistics
  const getVietnameseReadingStats = async () => {
    try {
      const response = await $fetch('/api/analytics/vietnamese-reading-stats')
      
      if (response.success) {
        return response.data
      }

    } catch (err) {
      console.error('Error fetching Vietnamese reading stats:', err)
    }

    return {
      mostPopularGenres: Object.values(vietnameseGenreMapping).slice(0, 5),
      peakReadingHours: [20, 21, 22], // 8-10 PM
      averageReadingSession: 45, // minutes
      mobileUsagePercentage: 85
    }
  }

  // Generate content discovery recommendations
  const generateContentDiscovery = async (userPreferences = {}) => {
    loading.value = true
    error.value = ''

    try {
      // Get current time and seasonal collections
      const timeCollection = getCurrentTimeCollection()
      const seasonalCollection = getCurrentSeasonalCollection()
      const themedCollections = await createThemedCollections()
      const holidayCollection = await getHolidayRecommendations()

      // Combine all collections
      const allCollections = [
        {
          id: 'current-time',
          ...timeCollection,
          type: 'time-based'
        },
        {
          id: 'current-season',
          ...seasonalCollection,
          type: 'seasonal'
        },
        ...themedCollections
      ]

      // Add holiday collection if available
      if (holidayCollection) {
        allCollections.unshift({
          id: 'holiday',
          ...holidayCollection,
          type: 'holiday'
        })
      }

      // Fetch manga for each collection
      const { db } = await connectToDatabase()
      
      for (const collection of allCollections) {
        if (!collection.manga) {
          const manga = await db.collection('manga')
            .find({
              genres: { $in: collection.genres },
              rating: { $gte: 3.5 }
            })
            .sort({ 
              viewCount: -1, 
              rating: -1,
              updatedAt: -1 
            })
            .limit(12)
            .toArray()

          collection.manga = manga
        }
      }

      curatedCollections.value = allCollections

    } catch (err) {
      console.error('Error generating content discovery:', err)
      error.value = 'Không thể tạo nội dung khám phá'
    } finally {
      loading.value = false
    }
  }

  // Get Vietnamese genre statistics
  const getGenreStatistics = async () => {
    try {
      const { db } = await connectToDatabase()
      
      const stats = await db.collection('manga')
        .aggregate([
          { $unwind: '$genres' },
          {
            $group: {
              _id: '$genres',
              count: { $sum: 1 },
              avgRating: { $avg: '$rating' },
              totalViews: { $sum: '$viewCount' },
              completedCount: {
                $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
              }
            }
          },
          { $sort: { count: -1 } }
        ])
        .toArray()

      return stats.map(stat => ({
        genre: stat._id,
        vietnameseName: vietnameseGenreMapping[stat._id] || stat._id,
        count: stat.count,
        avgRating: stat.avgRating?.toFixed(1) || '0.0',
        totalViews: stat.totalViews || 0,
        completedCount: stat.completedCount || 0,
        completionRate: stat.count > 0 ? ((stat.completedCount / stat.count) * 100).toFixed(1) : '0.0',
        icon: getCategoryIcon(vietnameseGenreMapping[stat._id] || stat._id)
      }))

    } catch (err) {
      console.error('Error fetching genre statistics:', err)
      return []
    }
  }

  // Search curated content
  const searchCuratedContent = (query) => {
    if (!query) return curatedCollections.value

    const lowerQuery = query.toLowerCase()
    return curatedCollections.value.filter(collection =>
      collection.name.toLowerCase().includes(lowerQuery) ||
      collection.description.toLowerCase().includes(lowerQuery) ||
      collection.genres.some(genre => genre.toLowerCase().includes(lowerQuery))
    )
  }

  // Computed
  const currentTimeCollection = computed(() => getCurrentTimeCollection())
  const currentSeasonalCollection = computed(() => getCurrentSeasonalCollection())
  
  const topVietnameseGenres = computed(() => {
    return vietnameseCategories.value
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, 8)
  })

  return {
    // State
    curatedCollections: readonly(curatedCollections),
    trendingByTime: readonly(trendingByTime),
    vietnameseCategories: readonly(vietnameseCategories),
    seasonalContent: readonly(seasonalContent),
    loading: readonly(loading),
    error: readonly(error),

    // Computed
    currentTimeCollection,
    currentSeasonalCollection,
    topVietnameseGenres,

    // Methods
    fetchCuratedCollections,
    getTrendingByPeriod,
    getHolidayRecommendations,
    getEditorsPicksVietnamese,
    getLocalizedTrending,
    createThemedCollections,
    getVietnameseReadingStats,
    generateContentDiscovery,
    getGenreStatistics,
    searchCuratedContent,
    getCategoryIcon,

    // Data
    vietnameseGenreMapping,
    timeBasedCollections,
    seasonalCollections,
    holidayCollections
  }
}
