import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  chapterId: { type: String, required: true, unique: true },
  mangaId: { type: String, required: true },
  chapterNumber: { type: Number, required: true },
  title: { type: String },
  publishedDate: { type: Date },
  viewCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  imageCount: { type: Number, default: 0 },
  
  images: [{
    filename: String,
    originalUrl: String,
    localPath: String,
    s3Url: String,
    pageNumber: Number
  }],
  
  sourceUrl: { type: String },
  lastScraped: { type: Date, default: Date.now },
  scrapingStatus: { type: String, default: 'pending' },
  imageDownloadStatus: { type: String, default: 'pending' },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

chapterSchema.index({ mangaId: 1 });
chapterSchema.index({ chapterNumber: 1 });
chapterSchema.index({ mangaId: 1, chapterNumber: 1 });

export default mongoose.models.Chapter || mongoose.model('Chapter', chapterSchema);