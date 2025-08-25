import mongoose from 'mongoose';

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mango-clone', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Manga Schema
const mangaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  contentId: { type: String, required: true },
  description: { type: String },
  author: { type: String },
  artist: { type: String },
  status: { type: String, enum: ['ongoing', 'completed', 'hiatus', 'cancelled'], default: 'ongoing' },
  genres: [{ type: String }],
  tags: [{ type: String }],
  coverImage: { type: String },
  s3CoverUrl: { type: String },
  rating: { type: Number, default: 0, min: 0, max: 10 },
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  chapterCount: { type: Number, default: 0 },
  publishedYear: { type: Number },
  lastScraped: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Manga = mongoose.model('Manga', mangaSchema);

// Sample manga data
const sampleManga = [
  {
    title: "Naruto",
    slug: "naruto",
    contentId: "naruto-001",
    description: "Naruto Uzumaki là một ninja trẻ tuổi với ước mơ trở thành Hokage - người lãnh đạo làng Lá.",
    author: "Masashi Kishimoto",
    artist: "Masashi Kishimoto",
    status: "completed",
    genres: ["Action", "Adventure", "Martial Arts", "Shounen"],
    tags: ["ninja", "friendship", "power", "village"],
    coverImage: "/images/naruto-cover.jpg",
    rating: 9.2,
    viewCount: 1250000,
    likeCount: 89000,
    chapterCount: 700,
    publishedYear: 1999
  },
  {
    title: "One Piece",
    slug: "one-piece",
    contentId: "one-piece-001",
    description: "Monkey D. Luffy khởi hành cuộc phiêu lưu để tìm kho báu One Piece và trở thành Vua Hải Tặc.",
    author: "Eiichiro Oda",
    artist: "Eiichiro Oda",
    status: "ongoing",
    genres: ["Action", "Adventure", "Comedy", "Shounen"],
    tags: ["pirates", "adventure", "friendship", "treasure"],
    coverImage: "/images/one-piece-cover.jpg",
    rating: 9.5,
    viewCount: 2100000,
    likeCount: 156000,
    chapterCount: 1100,
    publishedYear: 1997
  },
  {
    title: "Attack on Titan",
    slug: "attack-on-titan",
    contentId: "attack-on-titan-001",
    description: "Nhân loại sống trong nỗi sợ hãi trước những Titan khổng lồ. Eren Yeager quyết tâm tiêu diệt chúng.",
    author: "Hajime Isayama",
    artist: "Hajime Isayama",
    status: "completed",
    genres: ["Action", "Drama", "Fantasy", "Shounen"],
    tags: ["titans", "survival", "military", "dark"],
    coverImage: "/images/attack-on-titan-cover.jpg",
    rating: 9.0,
    viewCount: 1800000,
    likeCount: 134000,
    chapterCount: 139,
    publishedYear: 2009
  },
  {
    title: "My Hero Academia",
    slug: "my-hero-academia",
    contentId: "my-hero-academia-001",
    description: "Trong thế giới mà 80% dân số có siêu năng lực, Izuku Midoriya sinh ra không có quirk nhưng vẫn mơ ước trở thành hero.",
    author: "Kohei Horikoshi",
    artist: "Kohei Horikoshi",
    status: "ongoing",
    genres: ["Action", "School", "Shounen", "Super Power"],
    tags: ["heroes", "school", "superpowers", "friendship"],
    coverImage: "/images/my-hero-academia-cover.jpg",
    rating: 8.8,
    viewCount: 1400000,
    likeCount: 98000,
    chapterCount: 400,
    publishedYear: 2014
  },
  {
    title: "Demon Slayer",
    slug: "demon-slayer",
    contentId: "demon-slayer-001",
    description: "Tanjiro Kamado trở thành thợ săn quỷ để cứu em gái đã bị biến thành quỷ và trả thù cho gia đình.",
    author: "Koyoharu Gotouge",
    artist: "Koyoharu Gotouge",
    status: "completed",
    genres: ["Action", "Historical", "Shounen", "Supernatural"],
    tags: ["demons", "family", "sword", "historical"],
    coverImage: "/images/demon-slayer-cover.jpg",
    rating: 8.9,
    viewCount: 1600000,
    likeCount: 112000,
    chapterCount: 205,
    publishedYear: 2016
  },
  {
    title: "Death Note",
    slug: "death-note",
    contentId: "death-note-001",
    description: "Light Yagami tìm thấy cuốn Death Note và quyết định sử dụng nó để tạo ra một thế giới hoàn hảo.",
    author: "Tsugumi Ohba",
    artist: "Takeshi Obata",
    status: "completed",
    genres: ["Drama", "Psychological", "Shounen", "Supernatural"],
    tags: ["psychological", "death", "justice", "mind games"],
    coverImage: "/images/death-note-cover.jpg",
    rating: 9.1,
    viewCount: 1300000,
    likeCount: 95000,
    chapterCount: 108,
    publishedYear: 2003
  },
  {
    title: "Dragon Ball",
    slug: "dragon-ball",
    contentId: "dragon-ball-001",
    description: "Goku và những người bạn tìm kiếm 7 viên ngọc rồng để thực hiện ước nguyện.",
    author: "Akira Toriyama",
    artist: "Akira Toriyama",
    status: "completed",
    genres: ["Action", "Adventure", "Comedy", "Shounen"],
    tags: ["martial arts", "adventure", "friendship", "power"],
    coverImage: "/images/dragon-ball-cover.jpg",
    rating: 8.7,
    viewCount: 1100000,
    likeCount: 78000,
    chapterCount: 519,
    publishedYear: 1984
  },
  {
    title: "One Punch Man",
    slug: "one-punch-man",
    contentId: "one-punch-man-001",
    description: "Saitama là một hero có thể đánh bại bất kỳ kẻ thù nào chỉ với một cú đấm.",
    author: "ONE",
    artist: "Yusuke Murata",
    status: "ongoing",
    genres: ["Action", "Comedy", "Seinen", "Super Power"],
    tags: ["heroes", "comedy", "overpowered", "parody"],
    coverImage: "/images/one-punch-man-cover.jpg",
    rating: 8.6,
    viewCount: 950000,
    likeCount: 67000,
    chapterCount: 180,
    publishedYear: 2012
  },
  {
    title: "Tokyo Ghoul",
    slug: "tokyo-ghoul",
    contentId: "tokyo-ghoul-001",
    description: "Ken Kaneki trở thành half-ghoul sau một tai nạn và phải học cách sống trong thế giới của ghouls.",
    author: "Sui Ishida",
    artist: "Sui Ishida",
    status: "completed",
    genres: ["Action", "Horror", "Seinen", "Supernatural"],
    tags: ["ghouls", "dark", "transformation", "survival"],
    coverImage: "/images/tokyo-ghoul-cover.jpg",
    rating: 8.4,
    viewCount: 1200000,
    likeCount: 85000,
    chapterCount: 144,
    publishedYear: 2011
  },
  {
    title: "Fullmetal Alchemist",
    slug: "fullmetal-alchemist",
    contentId: "fullmetal-alchemist-001",
    description: "Hai anh em Edward và Alphonse Elric tìm kiếm Philosopher's Stone để khôi phục cơ thể của mình.",
    author: "Hiromu Arakawa",
    artist: "Hiromu Arakawa",
    status: "completed",
    genres: ["Action", "Adventure", "Drama", "Shounen"],
    tags: ["alchemy", "brotherhood", "military", "philosophy"],
    coverImage: "/images/fullmetal-alchemist-cover.jpg",
    rating: 9.3,
    viewCount: 1350000,
    likeCount: 102000,
    chapterCount: 108,
    publishedYear: 2001
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await Manga.deleteMany({});
    console.log('🗑️  Cleared existing manga data');
    
    // Insert sample data
    const insertedManga = await Manga.insertMany(sampleManga);
    console.log(`✅ Inserted ${insertedManga.length} manga records`);
    
    // Display inserted data
    console.log('\n📚 Inserted Manga:');
    insertedManga.forEach((manga, index) => {
      console.log(`${index + 1}. ${manga.title} (${manga.genres.join(', ')}) - Rating: ${manga.rating}`);
    });
    
    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run seeding
const runSeed = async () => {
  await connectDB();
  await seedDatabase();
};

runSeed();
