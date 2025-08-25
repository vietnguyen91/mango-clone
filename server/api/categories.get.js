import { connectToDatabase } from '../utils/mongodb.js'

export default defineEventHandler(async (event) => {
  try {
    const { db } = await connectToDatabase()

    // Get unique genres from manga collection
    const genres = await db.collection('mangas').distinct('genres')

    // Get unique statuses from manga collection
    const statuses = await db.collection('mangas').distinct('status')

    // Filter out null/undefined values and sort
    const validGenres = genres
      .filter(genre => genre != null && genre !== '')
      .sort()

    const validStatuses = statuses
      .filter(status => status != null && status !== '')
      .sort()

    return {
      success: true,
      data: {
        genres: validGenres,
        statuses: validStatuses
      }
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return {
      success: false,
      error: error.message,
      data: {
        genres: [],
        statuses: []
      }
    }
  }
})