import connectDB from '~/server/utils/db';
import Chapter from '~/server/models/Chapter';
import Manga from '~/server/models/Manga';
import { convertS3UrlsInObject } from '~/server/utils/urlTransform';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const chapterId = getRouterParam(event, 'chapterId');
    
    if (!chapterId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Chapter ID parameter is required'
      });
    }

    const chapter = await Chapter.findOne({ chapterId }).lean();
    
    if (!chapter) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Chapter not found'
      });
    }

    // Get manga info
    const manga = await Manga.findOne({ 
      contentId: chapter.mangaId 
    })
    .select('title slug contentId')
    .lean();

    // Get next and previous chapters
    const [nextChapter, prevChapter] = await Promise.all([
      Chapter.findOne({ 
        mangaId: chapter.mangaId,
        chapterNumber: { $gt: chapter.chapterNumber }
      })
      .sort({ chapterNumber: 1 })
      .select('chapterId chapterNumber title')
      .lean(),
      
      Chapter.findOne({ 
        mangaId: chapter.mangaId,
        chapterNumber: { $lt: chapter.chapterNumber }
      })
      .sort({ chapterNumber: -1 })
      .select('chapterId chapterNumber title')
      .lean()
    ]);

    const transformedChapter = convertS3UrlsInObject(chapter);

    return {
      success: true,
      data: {
        chapter: transformedChapter,
        manga,
        navigation: {
          next: nextChapter,
          previous: prevChapter
        }
      }
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    
    console.error('Error fetching chapter:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});