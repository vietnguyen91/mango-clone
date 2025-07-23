import connectDB from '~/server/utils/db';
import Manga from '~/server/models/Manga';
import Chapter from '~/server/models/Chapter';
import { convertS3UrlsInObject } from '~/server/utils/urlTransform';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const slug = getRouterParam(event, 'slug');
    
    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug parameter is required'
      });
    }

    const manga = await Manga.findOne({ slug }).lean();
    
    if (!manga) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Manga not found'
      });
    }

    // Get chapters for this manga
    const chapters = await Chapter.find({ 
      mangaId: manga.contentId 
    })
    .sort({ chapterNumber: 1 })
    .select('chapterId chapterNumber title publishedDate viewCount imageCount')
    .lean();

    const transformedManga = convertS3UrlsInObject(manga);

    return {
      success: true,
      data: {
        ...transformedManga,
        chapters
      }
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    
    console.error('Error fetching manga details:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});