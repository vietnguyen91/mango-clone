import { connectToDatabase } from '../../utils/mongodb.js'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const searchQuery = query.q
    const limit = parseInt(query.limit) || 5

    if (!searchQuery || searchQuery.length < 2) {
      return {
        success: true,
        data: []
      }
    }

    const { db } = await connectToDatabase()
    
    // Create search regex for Vietnamese text
    const searchRegex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    
    // Search for manga with Vietnamese optimization
    const suggestions = await db.collection('manga')
      .find({
        $or: [
          { title: { $regex: searchRegex } },
          { alternativeTitles: { $regex: searchRegex } },
          { author: { $regex: searchRegex } },
          { genres: { $in: [searchRegex] } }
        ]
      })
      .project({
        _id: 1,
        title: 1,
        slug: 1,
        coverImage: 1,
        s3CoverUrl: 1,
        genres: 1,
        author: 1,
        status: 1,
        rating: 1,
        viewCount: 1
      })
      .sort({ 
        viewCount: -1,  // Prioritize popular manga
        rating: -1,
        updatedAt: -1 
      })
      .limit(limit)
      .toArray()

    return {
      success: true,
      data: suggestions
    }

  } catch (error) {
    console.error('Search suggestions error:', error)
    return {
      success: false,
      error: 'Failed to fetch search suggestions',
      data: []
    }
  }
})
