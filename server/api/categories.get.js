import connectDB from '~/server/utils/db';
import Manga from '~/server/models/Manga';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    // Get all unique genres from manga collection
    const genres = await Manga.distinct('genres');
    
    // Filter out null/undefined values and sort
    const validGenres = genres
      .filter(genre => genre != null && genre !== '')
      .sort();
    
    // Get all unique statuses
    const statuses = await Manga.distinct('status');
    const validStatuses = statuses
      .filter(status => status != null && status !== '')
      .sort();

    return {
      success: true,
      data: {
        genres: validGenres,
        statuses: validStatuses
      }
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});