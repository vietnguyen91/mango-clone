import { connectToDatabase } from '../../utils/mongodb.js'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    // Get user from JWT token
    const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return {
        success: false,
        error: 'Unauthorized',
        data: []
      }
    }

    let userId
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
      userId = decoded.userId
    } catch (jwtError) {
      return {
        success: false,
        error: 'Invalid token',
        data: []
      }
    }

    const { db } = await connectToDatabase()
    
    // Fetch user's bookmarks with manga details
    const bookmarks = await db.collection('bookmarks')
      .aggregate([
        { $match: { userId: userId } },
        {
          $lookup: {
            from: 'manga',
            localField: 'mangaId',
            foreignField: '_id',
            as: 'manga'
          }
        },
        { $unwind: '$manga' },
        {
          $project: {
            _id: 1,
            mangaId: 1,
            addedAt: 1,
            lastReadAt: 1,
            currentChapter: 1,
            readingProgress: 1,
            manga: {
              _id: '$manga._id',
              title: '$manga.title',
              slug: '$manga.slug',
              coverImage: '$manga.coverImage',
              s3CoverUrl: '$manga.s3CoverUrl',
              genres: '$manga.genres',
              status: '$manga.status',
              author: '$manga.author',
              rating: '$manga.rating',
              totalChapters: '$manga.totalChapters'
            }
          }
        },
        { $sort: { addedAt: -1 } }
      ])
      .toArray()

    return {
      success: true,
      data: bookmarks
    }

  } catch (error) {
    console.error('Bookmarks fetch error:', error)
    return {
      success: false,
      error: 'Failed to fetch bookmarks',
      data: []
    }
  }
})
