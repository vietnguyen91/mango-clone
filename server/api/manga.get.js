import connectDB from '~/server/utils/db';
import Manga from '~/server/models/Manga';
import { convertS3UrlsInObject } from '~/server/utils/urlTransform';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const query = getQuery(event);
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const genre = query.genre;
    const search = query.search;
    const status = query.status;
    const sort = query.sort || 'createdAt';
    
    // Build filter
    const filter = {};
    
    if (genre) {
      filter.genres = { $in: [genre] };
    }
    
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    
    if (status) {
      filter.status = status;
    }

    // Build sort
    let sortObj = {};
    switch (sort) {
      case 'popular':
        sortObj = { viewCount: -1 };
        break;
      case 'rating':
        sortObj = { rating: -1 };
        break;
      case 'latest':
        sortObj = { lastScraped: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;
    
    const [manga, total] = await Promise.all([
      Manga.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .select('title slug contentId coverImage s3CoverUrl genres tags status viewCount likeCount rating chapterCount')
        .lean(),
      Manga.countDocuments(filter)
    ]);

    const transformedManga = manga.map(item => convertS3UrlsInObject(item));

    return {
      success: true,
      data: transformedManga,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching manga:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    });
  }
});