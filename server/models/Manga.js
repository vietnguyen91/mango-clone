import mongoose from 'mongoose';

const mangaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  contentId: { type: String, required: true, unique: true },
  description: { type: String },
  coverImage: { type: String },
  s3CoverUrl: { type: String },
  author: { type: String },
  genres: [{ type: String }],
  tags: [{ type: String }],
  status: { type: String },
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  chapterCount: { type: Number, default: 0 },
  
  sourceUrl: { type: String },
  lastScraped: { type: Date, default: Date.now },
  scrapingStatus: { type: String, default: 'pending' },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

mangaSchema.index({ genres: 1 });
mangaSchema.index({ status: 1 });

export default mongoose.models.Manga || mongoose.model('Manga', mangaSchema);