<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
    <!-- Mobile-Optimized Page Header -->
    <div class="mb-6 md:mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Tìm kiếm truyện tranh</h1>

      <!-- Mobile-First Search Form -->
      <div class="bg-white rounded-lg p-4 md:p-6 shadow-sm">
        <form @submit.prevent="performSearch" class="space-y-4">
          <!-- Mobile-optimized search input -->
          <div class="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div class="flex-1">
              <label for="search-input" class="block text-sm font-medium text-gray-700 mb-2">
                Từ khóa tìm kiếm
              </label>
              <input
                id="search-input"
                v-model="searchQuery"
                type="text"
                placeholder="Nhập tên truyện, tác giả hoặc từ khóa..."
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base search-input-mobile"
                @keyup.enter="performSearch"
              />
            </div>
            <div class="flex items-end">
              <button
                type="submit"
                :disabled="!searchQuery.trim() || searching"
                class="w-full sm:w-auto bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
              >
                <svg v-if="searching" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span class="hidden sm:inline">{{ searching ? 'Đang tìm...' : 'Tìm kiếm' }}</span>
                <span class="sm:hidden">{{ searching ? 'Tìm...' : 'Tìm' }}</span>
              </button>
            </div>
          </div>

          <!-- Basic Filters -->
          <div class="pt-4 border-t border-gray-200">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <!-- Genre Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Thể loại</label>
                <select
                  v-model="filters.genre"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                >
                  <option value="">Tất cả thể loại</option>
                  <option
                    v-for="genre in availableGenres"
                    :key="genre"
                    :value="genre"
                  >
                    {{ genre }}
                  </option>
                </select>
              </div>

              <!-- Status Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select
                  v-model="filters.status"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="ongoing">Đang tiến hành</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="hiatus">Tạm dừng</option>
                </select>
              </div>

              <!-- Sort Options -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Sắp xếp</label>
                <select
                  v-model="filters.sort"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                >
                  <option value="relevance">Liên quan nhất</option>
                  <option value="latest">Mới cập nhật</option>
                  <option value="popular">Phổ biến</option>
                  <option value="rating">Đánh giá cao</option>
                  <option value="title_asc">Tên A-Z</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Advanced Filters Toggle -->
          <div class="pt-4 border-t border-gray-200">
            <button
              @click="showAdvancedFilters = !showAdvancedFilters"
              class="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <svg
                :class="{ 'rotate-180': showAdvancedFilters }"
                class="w-4 h-4 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              {{ showAdvancedFilters ? 'Ẩn bộ lọc nâng cao' : 'Hiển thị bộ lọc nâng cao' }}
            </button>
          </div>

          <!-- Advanced Filters -->
          <div v-show="showAdvancedFilters" class="pt-4 space-y-4">
            <!-- Rating and Year Filters -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Rating Range -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Đánh giá</label>
                <div class="flex items-center gap-3">
                  <select
                    v-model="filters.minRating"
                    class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  >
                    <option value="">Từ</option>
                    <option v-for="rating in ratingOptions" :key="rating" :value="rating">
                      {{ rating }}+ ⭐
                    </option>
                  </select>
                  <span class="text-gray-500">đến</span>
                  <select
                    v-model="filters.maxRating"
                    class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  >
                    <option value="">Đến</option>
                    <option v-for="rating in ratingOptions" :key="rating" :value="rating">
                      {{ rating }} ⭐
                    </option>
                  </select>
                </div>
              </div>

              <!-- Year Range -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Năm xuất bản</label>
                <div class="flex items-center gap-3">
                  <select
                    v-model="filters.minYear"
                    class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  >
                    <option value="">Từ năm</option>
                    <option v-for="year in yearOptions" :key="year" :value="year">
                      {{ year }}
                    </option>
                  </select>
                  <span class="text-gray-500">đến</span>
                  <select
                    v-model="filters.maxYear"
                    class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  >
                    <option value="">Đến năm</option>
                    <option v-for="year in yearOptions" :key="year" :value="year">
                      {{ year }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Author and Chapter Count -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Author Search -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tác giả</label>
                <input
                  v-model="filters.author"
                  type="text"
                  placeholder="Tên tác giả..."
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                />
              </div>

              <!-- Chapter Count Range -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Số chương</label>
                <div class="flex items-center gap-3">
                  <input
                    v-model.number="filters.minChapters"
                    type="number"
                    placeholder="Từ"
                    min="0"
                    class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  />
                  <span class="text-gray-500">đến</span>
                  <input
                    v-model.number="filters.maxChapters"
                    type="number"
                    placeholder="Đến"
                    min="0"
                    class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  />
                </div>
              </div>
            </div>

            <!-- Multiple Genre Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Thể loại (chọn nhiều)</label>
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                <label
                  v-for="genre in availableGenres"
                  :key="genre"
                  class="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  :class="{ 'bg-primary-50 border-primary-300': filters.genres.includes(genre) }"
                >
                  <input
                    type="checkbox"
                    :value="genre"
                    v-model="filters.genres"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="text-sm">{{ genre }}</span>
                </label>
              </div>
            </div>

            <!-- Clear Advanced Filters -->
            <div class="flex justify-end">
              <button
                @click="clearAdvancedFilters"
                class="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
              >
                Xóa bộ lọc nâng cao
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Active Filters Display - Temporarily Disabled -->
    <!-- <FilterChips /> -->

    <!-- Search Results -->
    <div v-if="hasSearched">
      <!-- Results Header -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              Kết quả tìm kiếm
              <span v-if="searchResults?.data?.total" class="text-gray-600 font-normal">
                ({{ searchResults.data.total }} kết quả)
              </span>
            </h2>
            <p v-if="currentSearchQuery" class="text-gray-600 mt-1">
              Tìm kiếm cho: "<span class="font-medium">{{ currentSearchQuery }}</span>"
            </p>
          </div>

          <button
            v-if="hasSearched"
            @click="clearSearch"
            class="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Xóa tìm kiếm
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="searching" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Mobile-Optimized Results Grid -->
      <div v-else-if="searchResults?.data?.manga?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-3 md:gap-4">
        <MangaCard
          v-for="manga in searchResults.data.manga"
          :key="manga._id"
          :manga="manga"
        />
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Không tìm thấy kết quả</h3>
        <p class="text-gray-600 mb-4">
          Không tìm thấy truyện tranh nào phù hợp với từ khóa "{{ currentSearchQuery }}".
        </p>
        <div class="text-sm text-gray-500">
          <p>Gợi ý:</p>
          <ul class="mt-2 space-y-1">
            <li>• Kiểm tra lại chính tả</li>
            <li>• Thử sử dụng từ khóa khác</li>
            <li>• Sử dụng từ khóa ngắn gọn hơn</li>
          </ul>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="searchResults?.data?.totalPages > 1" class="mt-8">
        <div class="flex justify-center">
          <nav class="flex items-center space-x-2">
            <button
              v-if="currentPage > 1"
              @click="goToPage(currentPage - 1)"
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Trước
            </button>
            
            <template v-for="page in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-md',
                  page === currentPage
                    ? 'text-white bg-primary-600 border border-primary-600'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              <span v-else class="px-3 py-2 text-sm font-medium text-gray-500">...</span>
            </template>
            
            <button
              v-if="currentPage < searchResults.data.totalPages"
              @click="goToPage(currentPage + 1)"
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Tiếp
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Initial State -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Tìm kiếm truyện tranh</h3>
      <p class="text-gray-600">Nhập từ khóa để tìm kiếm truyện tranh yêu thích của bạn.</p>
    </div>
  </div>
</template>

<script setup>
// Import components - temporarily disabled for debugging
// import FilterDropdown from '~/components/FilterDropdown.vue'
// import SortOptions from '~/components/SortOptions.vue'
// import FilterChips from '~/components/FilterChips.vue'

// Page metadata
useHead({
  title: 'Tìm kiếm truyện tranh - Mango',
  meta: [
    { name: 'description', content: 'Tìm kiếm truyện tranh manga theo tên, tác giả, thể loại. Khám phá hàng ngàn bộ manga với công cụ tìm kiếm mạnh mẽ.' },
    { name: 'keywords', content: 'tìm kiếm manga, search manga, truyện tranh, tìm truyện' }
  ]
})

// Reactive data
const searchQuery = ref('')
const currentSearchQuery = ref('')
const searching = ref(false)
const hasSearched = ref(false)
const searchResults = ref(null)
const currentPage = ref(1)
// Mobile detection - simplified
// const showFilters = ref(false)
// const isDesktop = ref(false)

const filters = reactive({
  genre: '',
  status: '',
  sort: 'relevance',
  // Advanced filters
  minRating: '',
  maxRating: '',
  minYear: '',
  maxYear: '',
  author: '',
  minChapters: '',
  maxChapters: '',
  genres: [] // Multiple genre selection
})

// Advanced filters toggle
const showAdvancedFilters = ref(false)

// Get URL query parameters
const route = useRoute()
const router = useRouter()

// Initialize search from URL query
onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q
    currentSearchQuery.value = route.query.q
    if (route.query.genre) filters.genre = route.query.genre
    if (route.query.status) filters.status = route.query.status
    if (route.query.sort) filters.sort = route.query.sort
    if (route.query.page) currentPage.value = parseInt(route.query.page)
    performSearch()
  }
})

// Helper methods for filter management
const getSortLabel = (sortValue) => {
  const sortLabels = {
    relevance: 'Liên quan nhất',
    latest: 'Mới cập nhật',
    newest: 'Mới phát hành',
    popular: 'Phổ biến nhất',
    trending: 'Đang thịnh hành',
    most_viewed: 'Xem nhiều nhất',
    rating: 'Đánh giá cao',
    most_chapters: 'Nhiều chapter nhất',
    title_asc: 'Tên A-Z',
    title_desc: 'Tên Z-A',
    oldest: 'Cũ nhất'
  }
  return sortLabels[sortValue] || sortValue
}

// Filter management methods - simplified for basic version
// const removeGenre = (genre) => { ... }
// const removeStatus = () => { ... }
// etc.

const clearAllFilters = () => {
  Object.assign(filters, {
    genre: '',
    status: '',
    sort: 'relevance',
    minRating: '',
    maxRating: '',
    minYear: '',
    maxYear: '',
    author: '',
    minChapters: '',
    maxChapters: '',
    genres: []
  })
}

const clearAdvancedFilters = () => {
  Object.assign(filters, {
    minRating: '',
    maxRating: '',
    minYear: '',
    maxYear: '',
    author: '',
    minChapters: '',
    maxChapters: '',
    genres: []
  })
}

// Mock available genres for testing (replace with real API call later)
const availableGenres = ref([
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
  'Horror', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports',
  'Martial Arts', 'Shounen', 'Seinen', 'Josei', 'Shoujo',
  'Psychological', 'Historical', 'School', 'Super Power', 'Supernatural'
])

// Filter options for advanced filters
const ratingOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const currentYear = new Date().getFullYear()
const yearOptions = computed(() => {
  const years = []
  for (let year = currentYear; year >= 1950; year--) {
    years.push(year)
  }
  return years
})

// Perform search
const performSearch = async () => {
  if (!searchQuery.value.trim()) return

  searching.value = true
  currentSearchQuery.value = searchQuery.value
  hasSearched.value = true

  try {
    const params = new URLSearchParams({
      search: searchQuery.value,
      page: currentPage.value.toString(),
      limit: '20'
    })

    // Add basic filter parameters
    if (filters.genre) params.append('genre', filters.genre)
    if (filters.status) params.append('status', filters.status)
    if (filters.sort && filters.sort !== 'relevance') params.append('sort', filters.sort)

    // Add advanced filter parameters
    if (filters.minRating) params.append('minRating', filters.minRating)
    if (filters.maxRating) params.append('maxRating', filters.maxRating)
    if (filters.minYear) params.append('minYear', filters.minYear)
    if (filters.maxYear) params.append('maxYear', filters.maxYear)
    if (filters.author) params.append('author', filters.author)
    if (filters.minChapters) params.append('minChapters', filters.minChapters)
    if (filters.maxChapters) params.append('maxChapters', filters.maxChapters)
    if (filters.genres.length > 0) params.append('genres', filters.genres.join(','))

    // Prepare query object for URL
    const queryObj = { q: searchQuery.value, page: currentPage.value }
    if (filters.genre) queryObj.genre = filters.genre
    if (filters.status) queryObj.status = filters.status
    if (filters.sort !== 'relevance') queryObj.sort = filters.sort
    if (filters.minRating) queryObj.minRating = filters.minRating
    if (filters.maxRating) queryObj.maxRating = filters.maxRating
    if (filters.minYear) queryObj.minYear = filters.minYear
    if (filters.maxYear) queryObj.maxYear = filters.maxYear
    if (filters.author) queryObj.author = filters.author
    if (filters.minChapters) queryObj.minChapters = filters.minChapters
    if (filters.maxChapters) queryObj.maxChapters = filters.maxChapters
    if (filters.genres.length > 0) queryObj.genres = filters.genres.join(',')

    // Update URL
    await router.push({ query: queryObj })

    // Fetch results
    const { data } = await $fetch(`/api/manga?${params.toString()}`)
    searchResults.value = { data }

  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = { data: { manga: [], total: 0, totalPages: 0 } }
  } finally {
    searching.value = false
  }
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  currentSearchQuery.value = ''
  hasSearched.value = false
  searchResults.value = null
  currentPage.value = 1
  clearAllFilters()
  router.push({ query: {} })
}

// Pagination
const goToPage = (page) => {
  currentPage.value = page
  performSearch()
}

const visiblePages = computed(() => {
  if (!searchResults.value?.data?.totalPages) return []
  
  const total = searchResults.value.data.totalPages
  const current = currentPage.value
  const pages = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// Watch filters for auto-search
watch(filters, () => {
  if (hasSearched.value) {
    currentPage.value = 1
    performSearch()
  }
})
</script>
