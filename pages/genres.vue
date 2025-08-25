<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
    <!-- Mobile-Optimized Page Header -->
    <div class="mb-6 md:mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">Thể loại truyện tranh</h1>
      <p class="text-gray-600 text-sm md:text-base">Khám phá truyện tranh theo thể loại yêu thích của bạn</p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Không thể tải thể loại</h3>
      <p class="text-gray-600 mb-4">Đã xảy ra lỗi khi tải danh sách thể loại.</p>
      <button 
        @click="refresh()"
        class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
      >
        Thử lại
      </button>
    </div>

    <!-- Mobile-Optimized Genres Grid -->
    <div v-else-if="data?.data?.genres" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4">
      <NuxtLink
        v-for="genre in data.data.genres"
        :key="genre"
        :to="`/manga?genre=${encodeURIComponent(genre)}`"
        class="group bg-white rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-primary-300 touch-manipulation"
      >
        <div class="text-center">
          <!-- Mobile-optimized Genre Icon -->
          <div class="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg group-hover:scale-110 transition-transform duration-200">
            {{ getGenreIcon(genre) }}
          </div>

          <!-- Genre Name -->
          <h3 class="font-medium text-gray-900 group-hover:text-primary-600 transition-colors text-sm md:text-base line-clamp-2">
            {{ genre }}
          </h3>

          <!-- Manga Count -->
          <p class="text-xs md:text-sm text-gray-500 mt-1">
            {{ getMangaCount(genre) }} truyện
          </p>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có thể loại nào</h3>
      <p class="text-gray-600">Hiện tại chưa có thể loại truyện tranh nào được tải lên.</p>
    </div>
  </div>
</template>

<script setup>
// Page metadata
useHead({
  title: 'Thể loại truyện tranh - Mango',
  meta: [
    { name: 'description', content: 'Khám phá truyện tranh theo thể loại yêu thích của bạn. Tìm hiểu các thể loại manga phổ biến như hành động, lãng mạn, huyền huyễn và nhiều hơn nữa.' },
    { name: 'keywords', content: 'thể loại manga, genres, hành động, lãng mạn, huyền huyễn, truyện tranh' }
  ]
})

// Fetch categories data
const { data, pending, error, refresh } = await useFetch('/api/categories')

// Genre icon mapping
const genreIcons = {
  'Hành Động': '⚔️',
  'Lãng Mạn': '💕',
  'Huyền Huyễn': '🔮',
  'Trường Học': '🎓',
  'Hài Hước': '😄',
  'Kinh Dị': '👻',
  'Phiêu Lưu': '🗺️',
  'Thể Thao': '⚽',
  'Mecha': '🤖',
  'Slice of Life': '🌸',
  'Drama': '🎭',
  'Supernatural': '✨',
  'Shounen': '👦',
  'Shoujo': '👧',
  'Seinen': '👨',
  'Josei': '👩'
}

// Get genre icon
const getGenreIcon = (genre) => {
  return genreIcons[genre] || '📚'
}

// Get manga count for genre (placeholder - would need actual API)
const getMangaCount = (genre) => {
  // This would typically come from an API call
  // For now, return a placeholder
  return Math.floor(Math.random() * 100) + 1
}
</script>

<style scoped>
/* Custom styles for genres page */
.group:hover .genre-icon {
  transform: scale(1.1);
}
</style>
