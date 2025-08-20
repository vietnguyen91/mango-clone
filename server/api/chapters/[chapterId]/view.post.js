import Chapter from '~/server/models/Chapter.js'
import { connectDB } from '~/server/utils/db.js'

export default defineEventHandler(async (event) => {
  try {
    // Connect to database
    await connectDB()

    // Get chapter ID from route params
    const chapterId = getRouterParam(event, 'chapterId')

    if (!chapterId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Chapter ID is required'
      })
    }

    // Get client info for basic analytics (optional)
    const userAgent = getHeader(event, 'user-agent') || 'unknown'
    const timestamp = new Date()

    // For now, we'll just increment the view count
    // In production, you might want to implement more sophisticated duplicate prevention
    
    const chapter = await Chapter.findOneAndUpdate(
      { chapterId: chapterId },
      {
        $inc: { views: 1 },
        $set: {
          lastViewed: timestamp
        }
      },
      {
        new: true,
        select: 'chapterId views lastViewed'
      }
    )
    
    if (!chapter) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Chapter not found'
      })
    }
    
    // Return updated view count
    return {
      success: true,
      data: {
        chapterId: chapter.chapterId,
        views: chapter.views,
        lastViewed: chapter.lastViewed
      },
      message: 'View count updated successfully'
    }
    
  } catch (error) {
    console.error('Error updating view count:', error)
    
    // Don't throw error for view counting - it's not critical
    // Just log it and return success to avoid breaking the reading experience
    return {
      success: false,
      error: error.message || 'Failed to update view count',
      data: {
        chapterId: getRouterParam(event, 'chapterId'),
        views: 0
      }
    }
  }
})
