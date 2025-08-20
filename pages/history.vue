<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Lịch sử đọc truyện</h1>
        <p class="text-gray-600">Theo dõi tiến độ đọc và tiếp tục từ nơi bạn đã dừng lại</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900">{{ historyCount }}</p>
              <p class="text-sm text-gray-600">Truyện đã đọc</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900">{{ completedCount }}</p>
              <p class="text-sm text-gray-600">Đã hoàn thành</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900">{{ continueReadingCount }}</p>
              <p class="text-sm text-gray-600">Đang đọc dở</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900">{{ bookmarkCount }}</p>
              <p class="text-sm text-gray-600">Yêu thích</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Continue Reading Section -->
      <section v-if="continueReading.length > 0" class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 flex items-center">
            <span class="mr-2">📖</span>
            Tiếp tục đọc
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContinueReadingCard
            v-for="item in continueReading"
            :key="`${item.mangaId}-${item.chapterId}`"
            :history-item="item"
            @continue-reading="continueReading"
          />
        </div>
      </section>

      <!-- Filter and Sort -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div class="flex items-center space-x-4">
          <select 
            v-model="filterType"
            class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Tất cả</option>
            <option value="reading">Đang đọc</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="bookmarked">Yêu thích</option>
          </select>

          <select 
            v-model="sortBy"
            class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="recent">Gần đây nhất</option>
            <option value="title">Tên truyện</option>
            <option value="progress">Tiến độ</option>
            <option value="added">Ngày thêm</option>
          </select>
        </div>

        <div class="flex items-center space-x-3">
          <button
            @click="exportHistory"
            class="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>Xuất dữ liệu</span>
          </button>

          <button
            @click="clearHistory"
            class="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            <span>Xóa lịch sử</span>
          </button>
        </div>
      </div>

      <!-- Reading History List -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div v-if="loading" class="p-8">
          <SkeletonLoader type="chapter-list" :count="5" />
        </div>

        <div v-else-if="filteredHistory.length === 0" class="p-12 text-center">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử đọc</h3>
          <p class="text-gray-500 mb-6">Bắt đầu đọc truyện để xem lịch sử tại đây</p>
          <NuxtLink 
            to="/manga"
            class="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Khám phá truyện tranh
          </NuxtLink>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <ReadingHistoryItem
            v-for="item in filteredHistory"
            :key="`${item.mangaId}-${item.chapterId}`"
            :history-item="item"
            @continue-reading="continueReadingFromHistory"
            @remove="removeFromHistory"
          />
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              page === currentPage
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            ]"
          >
            {{ page }}
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// SEO
useHead({
  title: 'Lịch sử đọc truyện - Mango',
  meta: [
    { name: 'description', content: 'Xem lịch sử đọc truyện và tiếp tục từ nơi bạn đã dừng lại' }
  ]
})

// Use bookmarks composable
const { 
  readingHistory, 
  bookmarks,
  bookmarkCount,
  historyCount,
  getContinueReading,
  clearAllData,
  exportData,
  initialize
} = useBookmarks()

// Local state
const loading = ref(true)
const filterType = ref('all')
const sortBy = ref('recent')
const currentPage = ref(1)
const itemsPerPage = 20

// Computed
const continueReading = computed(() => getContinueReading())
const continueReadingCount = computed(() => continueReading.value.length)

const completedCount = computed(() => {
  return readingHistory.value.filter(item => item.readingProgress >= 100).length
})

const filteredHistory = computed(() => {
  let filtered = [...readingHistory.value]

  // Apply filters
  switch (filterType.value) {
    case 'reading':
      filtered = filtered.filter(item => item.readingProgress > 0 && item.readingProgress < 100)
      break
    case 'completed':
      filtered = filtered.filter(item => item.readingProgress >= 100)
      break
    case 'bookmarked':
      const bookmarkedIds = bookmarks.value.map(b => b.mangaId)
      filtered = filtered.filter(item => bookmarkedIds.includes(item.mangaId))
      break
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'recent':
      filtered.sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt))
      break
    case 'title':
      filtered.sort((a, b) => a.manga.title.localeCompare(b.manga.title, 'vi'))
      break
    case 'progress':
      filtered.sort((a, b) => b.readingProgress - a.readingProgress)
      break
    case 'added':
      filtered.sort((a, b) => new Date(b.addedAt || b.lastReadAt) - new Date(a.addedAt || a.lastReadAt))
      break
  }

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  let totalItems = readingHistory.value.length
  
  // Apply filter count
  switch (filterType.value) {
    case 'reading':
      totalItems = readingHistory.value.filter(item => item.readingProgress > 0 && item.readingProgress < 100).length
      break
    case 'completed':
      totalItems = readingHistory.value.filter(item => item.readingProgress >= 100).length
      break
    case 'bookmarked':
      const bookmarkedIds = bookmarks.value.map(b => b.mangaId)
      totalItems = readingHistory.value.filter(item => bookmarkedIds.includes(item.mangaId)).length
      break
  }
  
  return Math.ceil(totalItems / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  // Show up to 7 pages
  let start = Math.max(1, current - 3)
  let end = Math.min(total, start + 6)
  
  if (end - start < 6) {
    start = Math.max(1, end - 6)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const continueReadingFromHistory = (historyItem) => {
  navigateTo(`/read/${historyItem.chapterId}`)
}

const removeFromHistory = async (historyItem) => {
  // Remove from local state
  const index = readingHistory.value.findIndex(
    item => item.mangaId === historyItem.mangaId && item.chapterId === historyItem.chapterId
  )
  
  if (index > -1) {
    readingHistory.value.splice(index, 1)
  }
}

const exportHistory = () => {
  const data = exportData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `mango-reading-history-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

const clearHistory = async () => {
  if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử đọc? Hành động này không thể hoàn tác.')) {
    await clearAllData()
    currentPage.value = 1
  }
}

// Lifecycle
onMounted(async () => {
  await initialize()
  loading.value = false
})

// Watch for filter changes and reset pagination
watch([filterType, sortBy], () => {
  currentPage.value = 1
})
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.reading-history-item {
  animation: fadeIn 0.3s ease-out;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .grid-cols-2 {
    @apply grid-cols-1;
  }
  
  .md\:grid-cols-4 {
    @apply grid-cols-2;
  }
}
</style>
