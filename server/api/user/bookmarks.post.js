import { connectToDatabase } from '../../utils/mongodb.js'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  try {
    // Get user from JWT token
    const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    let userId
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
      userId = decoded.userId
    } catch (jwtError) {
      return {
        success: false,
        error: 'Invalid token'
      }
    }

    const body = await readBody(event)
    const { mangaId } = body

    if (!mangaId) {
      return {
        success: false,
        error: 'Manga ID is required'
      }
    }

    const { db } = await connectToDatabase()
    
    // Check if bookmark already exists
    const existingBookmark = await db.collection('bookmarks').findOne({
      userId: userId,
      mangaId: new ObjectId(mangaId)
    })

    if (existingBookmark) {
      return {
        success: false,
        error: 'Manga already bookmarked'
      }
    }

    // Verify manga exists
    const manga = await db.collection('manga').findOne({ _id: new ObjectId(mangaId) })
    if (!manga) {
      return {
        success: false,
        error: 'Manga not found'
      }
    }

    // Create bookmark
    const bookmark = {
      userId: userId,
      mangaId: new ObjectId(mangaId),
      addedAt: new Date(),
      lastReadAt: null,
      currentChapter: null,
      readingProgress: 0
    }

    const result = await db.collection('bookmarks').insertOne(bookmark)

    // Update user's bookmark count
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $inc: { bookmarkCount: 1 },
        $set: { lastActivity: new Date() }
      }
    )

    return {
      success: true,
      data: {
        bookmarkId: result.insertedId,
        message: 'Đã thêm vào yêu thích'
      }
    }

  } catch (error) {
    console.error('Add bookmark error:', error)
    return {
      success: false,
      error: 'Failed to add bookmark'
    }
  }
})
