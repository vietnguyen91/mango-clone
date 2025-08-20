import { connectToDatabase } from '../utils/mongodb.js'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  try {
    // Get user from JWT token
    const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return {
        success: false,
        error: 'Unauthorized - Please login to comment'
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
    const { mangaId, chapterId, content } = body

    // Validate input
    if (!mangaId || !content || content.trim().length === 0) {
      return {
        success: false,
        error: 'Manga ID and content are required'
      }
    }

    if (content.length > 1000) {
      return {
        success: false,
        error: 'Comment too long (max 1000 characters)'
      }
    }

    const { db } = await connectToDatabase()

    // Get user info
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { name: 1, avatar: 1, badge: 1 } }
    )

    if (!user) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    // Vietnamese content moderation
    const moderatedContent = await moderateVietnameseContent(content)
    if (moderatedContent.blocked) {
      return {
        success: false,
        error: 'Nội dung không phù hợp. Vui lòng tuân thủ quy tắc cộng đồng.'
      }
    }

    // Create comment
    const comment = {
      _id: new ObjectId(),
      mangaId: new ObjectId(mangaId),
      chapterId: chapterId ? new ObjectId(chapterId) : null,
      userId: new ObjectId(userId),
      content: moderatedContent.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      likedBy: [],
      replies: [],
      reported: false,
      reportCount: 0,
      user: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        badge: user.badge
      }
    }

    // Insert comment
    await db.collection('comments').insertOne(comment)

    // Update manga comment count
    await db.collection('manga').updateOne(
      { _id: new ObjectId(mangaId) },
      { 
        $inc: { commentCount: 1 },
        $set: { lastCommentAt: new Date() }
      }
    )

    // Update user activity
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $inc: { commentCount: 1 },
        $set: { lastActivity: new Date() }
      }
    )

    return {
      success: true,
      data: comment
    }

  } catch (error) {
    console.error('Comment creation error:', error)
    return {
      success: false,
      error: 'Failed to create comment'
    }
  }
})

// Vietnamese content moderation function
async function moderateVietnameseContent(content) {
  // Vietnamese inappropriate words list
  const vietnameseBadWords = [
    'đụ', 'địt', 'lồn', 'cặc', 'buồi', 'chó', 'súc vật', 'thằng ngu', 'con điên',
    'đồ khốn', 'thằng khốn', 'con khốn', 'đồ chó', 'thằng chó', 'con chó',
    'đồ ngu', 'thằng ngu', 'con ngu', 'đồ điên', 'thằng điên', 'con điên'
  ]

  // Check for inappropriate content
  const lowerContent = content.toLowerCase()
  const containsBadWords = vietnameseBadWords.some(word => 
    lowerContent.includes(word.toLowerCase())
  )

  if (containsBadWords) {
    return {
      blocked: true,
      content: content,
      reason: 'Contains inappropriate Vietnamese words'
    }
  }

  // Check for spam patterns
  const spamPatterns = [
    /(.)\1{10,}/, // Repeated characters
    /(https?:\/\/[^\s]+)/gi, // URLs
    /(\d{10,})/g, // Long numbers (phone numbers)
    /(telegram|zalo|facebook\.com\/)/gi // Social media promotion
  ]

  const isSpam = spamPatterns.some(pattern => pattern.test(content))
  if (isSpam) {
    return {
      blocked: true,
      content: content,
      reason: 'Detected spam pattern'
    }
  }

  // Clean content (remove excessive whitespace, etc.)
  const cleanedContent = content
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/\n{3,}/g, '\n\n') // Multiple newlines to double newline
    .trim()

  return {
    blocked: false,
    content: cleanedContent
  }
}
