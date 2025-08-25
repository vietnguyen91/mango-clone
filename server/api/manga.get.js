import connectDB from '~/server/utils/db';
import Manga from '~/server/models/Manga';
import { convertS3UrlsInObject } from '~/server/utils/urlTransform';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();

    const query = getQuery(event);
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;

    // Extract query parameters
    const genre = query.genre;
    const genres = query.genres ? query.genres.split(',') : null;
    const search = query.search;
    const status = query.status;
    const sort = query.sort || 'createdAt';
    const author = query.author;

    // Advanced filter parameters (support both old and new parameter names)
    const yearFrom = query.yearFrom || query.minYear ? parseInt(query.yearFrom || query.minYear) : null;
    const yearTo = query.yearTo || query.maxYear ? parseInt(query.yearTo || query.maxYear) : null;
    const chapterMin = query.chapterMin || query.minChapters ? parseInt(query.chapterMin || query.minChapters) : null;
    const chapterMax = query.chapterMax || query.maxChapters ? parseInt(query.chapterMax || query.maxChapters) : null;
    const ratingMin = query.ratingMin || query.minRating ? parseFloat(query.ratingMin || query.minRating) : null;
    const ratingMax = query.ratingMax || query.maxRating ? parseFloat(query.ratingMax || query.maxRating) : null;
    const timeRange = query.timeRange;

    // Build filter
    const filter = {};

    // Genre filtering (support both single genre and multiple genres)
    if (genres && genres.length > 0) {
      filter.genres = { $in: genres };
    } else if (genre) {
      filter.genres = { $in: [genre] };
    }

    // Search filtering
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Author filtering (separate from search)
    if (author && !search) {
      filter.author = { $regex: author, $options: 'i' };
    }

    // Status filtering
    if (status) {
      filter.status = status;
    }

    // Year range filtering
    if (yearFrom || yearTo) {
      filter.publishedYear = {};
      if (yearFrom) filter.publishedYear.$gte = yearFrom;
      if (yearTo) filter.publishedYear.$lte = yearTo;
    }

    // Chapter count filtering
    if (chapterMin || chapterMax) {
      filter.chapterCount = {};
      if (chapterMin) filter.chapterCount.$gte = chapterMin;
      if (chapterMax) filter.chapterCount.$lte = chapterMax;
    }

    // Rating filtering
    if (ratingMin || ratingMax) {
      filter.rating = {};
      if (ratingMin) filter.rating.$gte = ratingMin;
      if (ratingMax) filter.rating.$lte = ratingMax;
    }

    // Time range filtering (for recent updates)
    if (timeRange) {
      const now = new Date();
      let timeFilter;

      switch (timeRange) {
        case 'today':
          timeFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          timeFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          timeFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
          timeFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          timeFilter = new Date(now.getFullYear(), 0, 1);
          break;
      }

      if (timeFilter) {
        filter.lastScraped = { $gte: timeFilter };
      }
    }

    // Build sort
    let sortObj = {};
    switch (sort) {
      case 'relevance':
        // For search queries, sort by relevance score
        if (search) {
          sortObj = { score: { $meta: 'textScore' } };
        } else {
          sortObj = { viewCount: -1, createdAt: -1 };
        }
        break;
      case 'latest':
        sortObj = { lastScraped: -1, createdAt: -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'popular':
        sortObj = { viewCount: -1, rating: -1 };
        break;
      case 'trending':
        // Simple trending based on recent activity and views
        sortObj = { weeklyViews: -1, viewCount: -1, lastScraped: -1 };
        break;
      case 'most_viewed':
        sortObj = { viewCount: -1 };
        break;
      case 'rating':
        sortObj = { rating: -1, viewCount: -1 };
        break;
      case 'most_chapters':
        sortObj = { chapterCount: -1, createdAt: -1 };
        break;
      case 'title_asc':
        sortObj = { title: 1 };
        break;
      case 'title_desc':
        sortObj = { title: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    // Build query with text search scoring if needed
    let mongoQuery = Manga.find(filter);

    // Add text search scoring for relevance sorting
    if (search && sort === 'relevance') {
      mongoQuery = mongoQuery.select({
        score: { $meta: 'textScore' },
        title: 1,
        slug: 1,
        contentId: 1,
        coverImage: 1,
        s3CoverUrl: 1,
        genres: 1,
        tags: 1,
        status: 1,
        viewCount: 1,
        likeCount: 1,
        rating: 1,
        chapterCount: 1,
        publishedYear: 1,
        lastScraped: 1
      });
    } else {
      mongoQuery = mongoQuery.select('title slug contentId coverImage s3CoverUrl genres tags status viewCount likeCount rating chapterCount publishedYear lastScraped');
    }

    const [manga, total] = await Promise.all([
      mongoQuery
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Manga.countDocuments(filter)
    ]);

    const transformedManga = manga.map(item => convertS3UrlsInObject(item));

    return {
      success: true,
      data: {
        manga: transformedManga,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
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