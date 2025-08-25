import { connectToDatabase } from '../utils/mongodb.js'

export default defineEventHandler(async (event) => {
  try {
    const { db } = await connectToDatabase()
    const query = getQuery(event)
    
    // Get recommendation type (featured, popular, recent, similar)
    const type = query.type || 'featured'
    const limit = parseInt(query.limit) || 10
    const mangaId = query.mangaId // For similar recommendations
    
    let recommendations = []
    
    switch (type) {
      case 'featured':
        // Featured manga - highest rated with good view count
        recommendations = await db.collection('mangas')
          .find({
            rating: { $gte: 8.5 },
            viewCount: { $gte: 500000 }
          })
          .sort({ rating: -1, viewCount: -1 })
          .limit(limit)
          .toArray()
        break
        
      case 'popular':
        // Most popular by view count
        recommendations = await db.collection('mangas')
          .find({})
          .sort({ viewCount: -1, likeCount: -1 })
          .limit(limit)
          .toArray()
        break
        
      case 'recent':
        // Recently updated (simulate with createdAt for now)
        recommendations = await db.collection('mangas')
          .find({})
          .sort({ updatedAt: -1, createdAt: -1 })
          .limit(limit)
          .toArray()
        break
        
      case 'trending':
        // Trending - combination of recent popularity and rating
        recommendations = await db.collection('mangas')
          .find({
            rating: { $gte: 7.0 },
            viewCount: { $gte: 100000 }
          })
          .sort({ 
            viewCount: -1, 
            rating: -1,
            likeCount: -1 
          })
          .limit(limit)
          .toArray()
        break
        
      case 'similar':
        if (!mangaId) {
          return {
            success: false,
            error: 'mangaId is required for similar recommendations'
          }
        }
        
        // Get the reference manga
        const referenceManga = await db.collection('mangas')
          .findOne({ _id: new ObjectId(mangaId) })
        
        if (!referenceManga) {
          return {
            success: false,
            error: 'Reference manga not found'
          }
        }
        
        // Find similar manga based on genres
        recommendations = await db.collection('mangas')
          .find({
            _id: { $ne: new ObjectId(mangaId) },
            genres: { $in: referenceManga.genres }
          })
          .sort({ rating: -1, viewCount: -1 })
          .limit(limit)
          .toArray()
        break
        
      case 'top-rated':
        // Highest rated manga
        recommendations = await db.collection('mangas')
          .find({
            rating: { $gte: 8.0 }
          })
          .sort({ rating: -1, likeCount: -1 })
          .limit(limit)
          .toArray()
        break
        
      case 'completed':
        // Completed manga with high ratings
        recommendations = await db.collection('mangas')
          .find({
            status: 'completed',
            rating: { $gte: 8.0 }
          })
          .sort({ rating: -1, viewCount: -1 })
          .limit(limit)
          .toArray()
        break
        
      case 'ongoing':
        // Ongoing manga with recent activity
        recommendations = await db.collection('mangas')
          .find({
            status: 'ongoing'
          })
          .sort({ viewCount: -1, rating: -1 })
          .limit(limit)
          .toArray()
        break
        
      default:
        // Default to featured
        recommendations = await db.collection('mangas')
          .find({})
          .sort({ rating: -1, viewCount: -1 })
          .limit(limit)
          .toArray()
    }
    
    // Transform data for frontend
    const transformedRecommendations = recommendations.map(manga => ({
      id: manga._id,
      title: manga.title,
      slug: manga.slug,
      description: manga.description,
      author: manga.author,
      artist: manga.artist,
      status: manga.status,
      genres: manga.genres,
      coverImage: manga.coverImage,
      rating: manga.rating,
      viewCount: manga.viewCount,
      likeCount: manga.likeCount,
      chapterCount: manga.chapterCount,
      publishedYear: manga.publishedYear,
      updatedAt: manga.updatedAt
    }))
    
    return {
      success: true,
      data: {
        type,
        recommendations: transformedRecommendations,
        total: transformedRecommendations.length,
        limit
      }
    }
    
  } catch (error) {
    console.error('Recommendations API error:', error)
    return {
      success: false,
      error: error.message,
      data: {
        type: query.type || 'featured',
        recommendations: [],
        total: 0,
        limit: parseInt(query.limit) || 10
      }
    }
  }
})
