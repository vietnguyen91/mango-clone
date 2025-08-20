// Vietnamese test data for comprehensive testing

export const vietnameseTestManga = [
  {
    _id: 'test-manga-1',
    title: 'Thế Giới Huyền Huyễn',
    slug: 'the-gioi-huyen-huyen',
    description: 'Một câu chuyện về thế giới phép thuật đầy màu sắc với những nhân vật độc đáo.',
    author: 'Nguyễn Văn A',
    genres: ['Huyền Huyễn', 'Hành Động', 'Phiêu Lưu'],
    status: 'ongoing',
    rating: 4.5,
    viewCount: 125000,
    coverImage: '/test-covers/huyen-huyen.jpg',
    totalChapters: 45,
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'test-manga-2',
    title: 'Tình Yêu Học Đường',
    slug: 'tinh-yeu-hoc-duong',
    description: 'Câu chuyện tình yêu ngọt ngào giữa hai học sinh trung học.',
    author: 'Trần Thị B',
    genres: ['Lãng Mạn', 'Trường Học', 'Đời Thường'],
    status: 'completed',
    rating: 4.2,
    viewCount: 89000,
    coverImage: '/test-covers/tinh-yeu.jpg',
    totalChapters: 120,
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'test-manga-3',
    title: 'Võ Lâm Truyền Kỳ',
    slug: 'vo-lam-truyen-ky',
    description: 'Hành trình tu luyện của một thiếu niên trong thế giới võ lâm.',
    author: 'Lê Văn C',
    genres: ['Võ Thuật', 'Hành Động', 'Lịch Sử'],
    status: 'ongoing',
    rating: 4.7,
    viewCount: 200000,
    coverImage: '/test-covers/vo-lam.jpg',
    totalChapters: 78,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
]

export const vietnameseTestChapters = [
  {
    chapterId: 'test-chapter-1',
    mangaId: 'test-manga-1',
    chapterNumber: 1,
    title: 'Khởi Đầu Hành Trình',
    images: [
      '/test-pages/chapter-1/page-1.jpg',
      '/test-pages/chapter-1/page-2.jpg',
      '/test-pages/chapter-1/page-3.jpg',
      '/test-pages/chapter-1/page-4.jpg',
      '/test-pages/chapter-1/page-5.jpg'
    ],
    uploadDate: new Date().toISOString(),
    viewCount: 15000
  },
  {
    chapterId: 'test-chapter-2',
    mangaId: 'test-manga-1',
    chapterNumber: 2,
    title: 'Cuộc Gặp Gỡ Định Mệnh',
    images: [
      '/test-pages/chapter-2/page-1.jpg',
      '/test-pages/chapter-2/page-2.jpg',
      '/test-pages/chapter-2/page-3.jpg',
      '/test-pages/chapter-2/page-4.jpg',
      '/test-pages/chapter-2/page-5.jpg',
      '/test-pages/chapter-2/page-6.jpg'
    ],
    uploadDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 12000
  }
]

export const vietnameseTestUsers = [
  {
    _id: 'test-user-1',
    name: 'Nguyễn Văn Nam',
    email: 'nam.nguyen@example.com',
    avatar: '/test-avatars/nam.jpg',
    preferences: {
      favoriteGenres: ['Hành Động', 'Huyền Huyễn'],
      readingMode: 'vertical',
      nightMode: true
    },
    stats: {
      totalReadingTime: 1200, // 20 hours
      totalChaptersRead: 150,
      readingStreak: 5
    }
  },
  {
    _id: 'test-user-2',
    name: 'Trần Thị Lan',
    email: 'lan.tran@example.com',
    avatar: '/test-avatars/lan.jpg',
    preferences: {
      favoriteGenres: ['Lãng Mạn', 'Trường Học'],
      readingMode: 'horizontal',
      nightMode: false
    },
    stats: {
      totalReadingTime: 800, // 13.3 hours
      totalChaptersRead: 95,
      readingStreak: 12
    }
  }
]

export const vietnameseTestComments = [
  {
    _id: 'test-comment-1',
    mangaId: 'test-manga-1',
    userId: 'test-user-1',
    content: 'Truyện này hay quá! Phong cách vẽ rất đẹp và cốt truyện hấp dẫn.',
    createdAt: new Date().toISOString(),
    likes: 15,
    replies: [
      {
        _id: 'test-reply-1',
        userId: 'test-user-2',
        content: 'Mình cũng nghĩ vậy! Đặc biệt là nhân vật chính rất được.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes: 3
      }
    ]
  },
  {
    _id: 'test-comment-2',
    mangaId: 'test-manga-2',
    userId: 'test-user-2',
    content: 'Câu chuyện tình yêu này thật ngọt ngào. Rất phù hợp để đọc buổi tối.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    likes: 8,
    replies: []
  }
]

export const vietnameseSearchQueries = [
  // Common Vietnamese search patterns
  'hành động',
  'hanh dong', // Without diacritics
  'lãng mạn',
  'lang man',
  'truyện hay',
  'truyen hay',
  'manga mới',
  'manga moi',
  'đã hoàn thành',
  'da hoan thanh',
  'kinh dị',
  'kinh di',
  'võ thuật',
  'vo thuat',
  'huyền huyễn',
  'huyen huyen'
]

export const vietnameseGenres = [
  'Hành Động',
  'Lãng Mạn',
  'Huyền Huyễn',
  'Hài Hước',
  'Trường Học',
  'Thể Thao',
  'Kinh Dị',
  'Trinh Thám',
  'Drama',
  'Đời Thường',
  'Tâm Lý',
  'Siêu Nhiên',
  'Lịch Sử',
  'Võ Thuật',
  'Robot',
  'Khoa Học Viễn Tưởng'
]

export const vietnameseErrorMessages = {
  404: 'Không tìm thấy trang',
  500: 'Lỗi máy chủ',
  network: 'Lỗi kết nối mạng',
  offline: 'Không có kết nối internet',
  loading: 'Đang tải...',
  empty: 'Không có dữ liệu',
  unauthorized: 'Bạn cần đăng nhập',
  forbidden: 'Không có quyền truy cập'
}

export const vietnameseUIText = {
  navigation: {
    home: 'Trang chủ',
    manga: 'Truyện tranh',
    genres: 'Thể loại',
    search: 'Tìm kiếm',
    bookmarks: 'Yêu thích',
    history: 'Lịch sử',
    profile: 'Hồ sơ',
    settings: 'Cài đặt'
  },
  actions: {
    read: 'Đọc',
    bookmark: 'Yêu thích',
    share: 'Chia sẻ',
    comment: 'Bình luận',
    rate: 'Đánh giá',
    download: 'Tải xuống',
    continue: 'Tiếp tục',
    start: 'Bắt đầu'
  },
  status: {
    ongoing: 'Đang cập nhật',
    completed: 'Đã hoàn thành',
    hiatus: 'Tạm ngưng',
    cancelled: 'Đã hủy'
  },
  time: {
    justNow: 'Vừa xong',
    minutesAgo: 'phút trước',
    hoursAgo: 'giờ trước',
    daysAgo: 'ngày trước',
    weeksAgo: 'tuần trước',
    monthsAgo: 'tháng trước'
  }
}

// Test utilities
export const createTestMangaData = (overrides = {}) => {
  return {
    ...vietnameseTestManga[0],
    ...overrides,
    _id: `test-manga-${Date.now()}`,
    slug: `test-slug-${Date.now()}`
  }
}

export const createTestChapterData = (mangaId, overrides = {}) => {
  return {
    ...vietnameseTestChapters[0],
    ...overrides,
    chapterId: `test-chapter-${Date.now()}`,
    mangaId
  }
}

export const createTestUserData = (overrides = {}) => {
  return {
    ...vietnameseTestUsers[0],
    ...overrides,
    _id: `test-user-${Date.now()}`,
    email: `test-${Date.now()}@example.com`
  }
}

// Mock API responses
export const mockAPIResponses = {
  manga: {
    success: true,
    data: {
      manga: vietnameseTestManga,
      total: vietnameseTestManga.length,
      page: 1,
      totalPages: 1
    }
  },
  chapter: {
    success: true,
    data: vietnameseTestChapters[0]
  },
  search: {
    success: true,
    data: {
      results: vietnameseTestManga.slice(0, 2),
      total: 2,
      suggestions: ['hành động', 'huyền huyễn', 'lãng mạn']
    }
  },
  comments: {
    success: true,
    data: {
      comments: vietnameseTestComments,
      total: vietnameseTestComments.length,
      hasMore: false
    }
  }
}

// Performance thresholds for Vietnamese mobile
export const performanceThresholds = {
  mobile2G: {
    loadTime: 10000, // 10 seconds
    fcp: 4000, // 4 seconds
    lcp: 6000 // 6 seconds
  },
  mobile3G: {
    loadTime: 5000, // 5 seconds
    fcp: 2500, // 2.5 seconds
    lcp: 4000 // 4 seconds
  },
  mobile4G: {
    loadTime: 3000, // 3 seconds
    fcp: 1500, // 1.5 seconds
    lcp: 2500 // 2.5 seconds
  },
  desktop: {
    loadTime: 2000, // 2 seconds
    fcp: 1000, // 1 second
    lcp: 1500 // 1.5 seconds
  }
}
