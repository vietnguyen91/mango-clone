<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Tìm kiếm truyện tranh</h1>
      
      <!-- Search Form -->
      <div class="bg-white rounded-lg p-6 shadow-sm">
        <form @submit.prevent="performSearch" class="space-y-4">
          <div class="flex gap-4">
            <div class="flex-1">
              <label for="search-input" class="block text-sm font-medium text-gray-700 mb-2">
                Từ khóa tìm kiếm
              </label>
              <input
                id="search-input"
                v-model="searchQuery"
                type="text"
                placeholder="Nhập tên truyện, tác giả hoặc từ khóa..."
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                @keyup.enter="performSearch"
              />
            </div>
            <div class="flex items-end">
              <button
                type="submit"
                :disabled="!searchQuery.trim() || searching"
                class="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <svg v-if="searching" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {{ searching ? 'Đang tìm...' : 'Tìm kiếm' }}
              </button>
            </div>
          </div>
          
          <!-- Advanced Filters -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Thể loại</label>
              <select 
                v-model="filters.genre"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select 
                v-model="filters.status"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="ongoing">Đang tiến hành</option>
                <option value="completed">Hoàn thành</option>
                <option value="hiatus">Tạm dừng</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Sắp xếp</label>
              <select 
                v-model="filters.sort"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="relevance">Liên quan nhất</option>
                <option value="latest">Mới nhất</option>
                <option value="popular">Phổ biến</option>
                <option value="rating">Đánh giá cao</option>
                <option value="title">Tên A-Z</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>

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

      <!-- Results Grid -->
      <div v-else-if="searchResults?.data?.manga?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 3xl:grid-cols-9 4xl:grid-cols-10 gap-3 md:gap-4">
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

const filters = reactive({
  genre: '',
  status: '',
  sort: 'relevance'
})

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

// Fetch available genres
const { data: categoriesData } = await useFetch('/api/categories')
const availableGenres = computed(() => categoriesData.value?.data?.genres || [])

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
    
    if (filters.genre) params.append('genre', filters.genre)
    if (filters.status) params.append('status', filters.status)
    if (filters.sort && filters.sort !== 'relevance') params.append('sort', filters.sort)
    
    // Update URL
    await router.push({ query: { q: searchQuery.value, ...filters, page: currentPage.value } })
    
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
  Object.assign(filters, { genre: '', status: '', sort: 'relevance' })
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
