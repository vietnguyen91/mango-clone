import { connectToDatabase } from '../../utils/mongodb.js'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { userId, preferences = {} } = body

    const { db } = await connectToDatabase()

    // Vietnamese market preferences
    const vietnameseGenres = [
      'Hành Động', 'Lãng Mạn', 'Huyền Huyễn', 'Hài Hước', 
      'Trường Học', 'Thể Thao', 'Kinh Dị', 'Trinh Thám'
    ]

    let recommendations = []
    let trending = []

    if (userId) {
      // Get user's reading history and preferences
      const userBookmarks = await db.collection('bookmarks')
        .find({ userId: new ObjectId(userId) })
        .toArray()

      const userHistory = await db.collection('readingHistory')
        .find({ userId: new ObjectId(userId) })
        .sort({ lastReadAt: -1 })
        .limit(50)
        .toArray()

      // Analyze user preferences
      const userGenres = new Set()
      const userAuthors = new Set()
      const readMangaIds = new Set()

      const allUserData = userBookmarks.concat(userHistory)
      allUserData.forEach(item => {
        if (item.mangaId) readMangaIds.add(item.mangaId.toString())
      })

      // Get manga details for analysis
      const userManga = await db.collection('manga')
        .find({ 
          _id: { $in: Array.from(readMangaIds).map(id => new ObjectId(id)) }
        })
        .toArray()

      userManga.forEach(manga => {
        manga.genres?.forEach(genre => userGenres.add(genre))
        if (manga.author) userAuthors.add(manga.author)
      })

      // Build recommendation query
      const recommendationQuery = {
        _id: { $nin: Array.from(readMangaIds).map(id => new ObjectId(id)) },
        $or: []
      }

      // Add genre-based recommendations
      if (userGenres.size > 0) {
        recommendationQuery.$or.push({
          genres: { $in: Array.from(userGenres) }
        })
      }

      // Add author-based recommendations
      if (userAuthors.size > 0) {
        recommendationQuery.$or.push({
          author: { $in: Array.from(userAuthors) }
        })
      }

      // Add time-based preferences
      if (preferences.timeBasedGenres?.length > 0) {
        recommendationQuery.$or.push({
          genres: { $in: preferences.timeBasedGenres }
        })
      }

      // Fallback to Vietnamese popular genres
      if (recommendationQuery.$or.length === 0) {
        recommendationQuery.$or.push({
          genres: { $in: vietnameseGenres }
        })
      }

      // Fetch personalized recommendations
      recommendations = await db.collection('manga')
        .find(recommendationQuery)
        .sort({ 
          rating: -1, 
          viewCount: -1, 
          updatedAt: -1 
        })
        .limit(20)
        .toArray()

    } else {
      // New user recommendations
      const timeBasedGenres = preferences.timeBasedGenres || vietnameseGenres.slice(0, 4)
      
      recommendations = await db.collection('manga')
        .find({
          genres: { $in: timeBasedGenres },
          status: { $in: ['ongoing', 'completed'] },
          rating: { $gte: 4.0 }
        })
        .sort({ 
          viewCount: -1, 
          rating: -1,
          updatedAt: -1 
        })
        .limit(20)
        .toArray()
    }

    // Get trending manga for Vietnamese market
    const now = new Date()
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    trending = await db.collection('manga')
      .find({
        genres: { $in: vietnameseGenres },
        updatedAt: { $gte: lastWeek }
      })
      .sort({ 
        weeklyViews: -1,
        viewCount: -1,
        rating: -1
      })
      .limit(12)
      .toArray()

    // Add recommendation scores and reasons
    const enhancedRecommendations = recommendations.map(manga => ({
      ...manga,
      recommendationScore: calculateRecommendationScore(manga, preferences),
      recommendationReason: getRecommendationReason(manga, preferences)
    }))

    const enhancedTrending = trending.map(manga => ({
      ...manga,
      trendingScore: manga.weeklyViews || manga.viewCount || 0,
      trendingReason: 'Đang hot trong tuần'
    }))

    return {
      success: true,
      data: {
        recommendations: enhancedRecommendations,
        trending: enhancedTrending,
        metadata: {
          totalRecommendations: recommendations.length,
          totalTrending: trending.length,
          generatedAt: new Date().toISOString(),
          preferences: preferences
        }
      }
    }

  } catch (error) {
    console.error('Personalized recommendations error:', error)
    return {
      success: false,
      error: 'Failed to generate recommendations',
      data: {
        recommendations: [],
        trending: []
      }
    }
  }
})

// Helper function to calculate recommendation score
function calculateRecommendationScore(manga, preferences) {
  let score = 0.5 // Base score

  // Rating boost
  if (manga.rating) {
    score += (manga.rating / 10) * 0.3
  }

  // View count boost (normalized)
  if (manga.viewCount) {
    score += Math.min(manga.viewCount / 100000, 0.2)
  }

  // Time-based genre boost
  if (preferences.timeBasedGenres?.length > 0) {
    const matchingGenres = manga.genres?.filter(g => 
      preferences.timeBasedGenres.includes(g)
    ).length || 0
    score += (matchingGenres / preferences.timeBasedGenres.length) * 0.2
  }

  // Vietnamese market boost
  const vietnamesePopularGenres = ['Hành Động', 'Lãng Mạn', 'Huyền Huyễn', 'Hài Hước']
  const vietnameseGenreMatch = manga.genres?.filter(g => 
    vietnamesePopularGenres.includes(g)
  ).length || 0
  score += (vietnameseGenreMatch / vietnamesePopularGenres.length) * 0.15

  // Recent update boost
  const daysSinceUpdate = (new Date() - new Date(manga.updatedAt)) / (1000 * 60 * 60 * 24)
  if (daysSinceUpdate < 7) {
    score += 0.1
  }

  return Math.min(score, 1.0)
}

// Helper function to get recommendation reason
function getRecommendationReason(manga, preferences) {
  const reasons = []

  if (manga.rating >= 4.5) {
    reasons.push('Đánh giá cao')
  }

  if (preferences.timeBasedGenres?.some(g => manga.genres?.includes(g))) {
    reasons.push('Phù hợp thời gian')
  }

  const vietnamesePopularGenres = ['Hành Động', 'Lãng Mạn', 'Huyền Huyễn']
  if (manga.genres?.some(g => vietnamesePopularGenres.includes(g))) {
    reasons.push('Phổ biến tại VN')
  }

  const daysSinceUpdate = (new Date() - new Date(manga.updatedAt)) / (1000 * 60 * 60 * 24)
  if (daysSinceUpdate < 3) {
    reasons.push('Mới cập nhật')
  }

  return reasons.length > 0 ? reasons.join(' • ') : 'Gợi ý cho bạn'
}
