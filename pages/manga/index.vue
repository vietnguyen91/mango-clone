<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Tất cả truyện tranh</h1>
      
      <!-- Filters -->
      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Genre Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Thể loại</label>
            <select 
              v-model="filters.genre" 
              @change="applyFilters"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Tất cả</option>
              <option value="romance">Lãng mạn</option>
              <option value="action">Hành động</option>
              <option value="fantasy">Huyền huyễn</option>
              <option value="school">Trường học</option>
              <option value="comedy">Hài hước</option>
              <option value="drama">Drama</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select 
              v-model="filters.status" 
              @change="applyFilters"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Tất cả</option>
              <option value="ongoing">Đang cập nhật</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>

          <!-- Sort Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sắp xếp</label>
            <select 
              v-model="filters.sort" 
              @change="applyFilters"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="latest">Mới nhất</option>
              <option value="popular">Phổ biến</option>
              <option value="rating">Đánh giá cao</option>
              <option value="createdAt">Ngày tạo</option>
            </select>
          </div>

          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <input
              v-model="filters.search"
              @keyup.enter="applyFilters"
              type="text"
              placeholder="Tên truyện..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-if="manga.length > 0" class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <p class="text-gray-600">
          Hiển thị {{ ((currentPage - 1) * pageSize) + 1 }} - {{ Math.min(currentPage * pageSize, totalManga) }} 
          trong {{ totalManga }} kết quả
        </p>
        
        <!-- View Toggle -->
        <div class="flex items-center space-x-2">
          <button 
            @click="viewMode = 'grid'"
            :class="['p-2 rounded', viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600']"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </button>
          <button 
            @click="viewMode = 'list'"
            :class="['p-2 rounded', viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600']"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Manga Grid -->
      <div 
        :class="[
          'grid gap-6',
          viewMode === 'grid' 
            ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        ]"
      >
        <MangaCard 
          v-for="item in manga" 
          :key="item._id" 
          :manga="item" 
        />
      </div>

      <!-- Pagination -->
      <div class="mt-12 flex items-center justify-center">
        <nav class="flex items-center space-x-2">
          <!-- Previous -->
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage <= 1"
            :class="[
              'px-3 py-2 rounded-lg font-medium transition-colors',
              currentPage <= 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-primary-600 hover:bg-primary-50'
            ]"
          >
            Trước
          </button>

          <!-- Page Numbers -->
          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="page !== '...'"
              @click="changePage(page)"
              :class="[
                'px-3 py-2 rounded-lg font-medium transition-colors',
                page === currentPage 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 hover:bg-primary-50'
              ]"
            >
              {{ page }}
            </button>
            <span v-else class="px-3 py-2 text-gray-400">...</span>
          </template>

          <!-- Next -->
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            :class="[
              'px-3 py-2 rounded-lg font-medium transition-colors',
              currentPage >= totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-primary-600 hover:bg-primary-50'
            ]"
          >
            Tiếp
          </button>
        </nav>
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="!loading" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.877 2.172M15 6.306A7.962 7.962 0 0112 5c-2.34 0-4.29.82-5.877 2.172A7.962 7.962 0 0112 9c2.34 0 4.29-.82 5.877-2.172z"/>
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-900 mb-2">Không tìm thấy truyện nào</h3>
        <p class="text-gray-500 mb-4">
          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem kết quả khác
        </p>
        <button 
          @click="resetFilters" 
          class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Đặt lại bộ lọc
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      <div v-for="i in 12" :key="i" class="manga-card animate-pulse">
        <div class="bg-gray-300 h-64 w-full rounded-t-lg"></div>
        <div class="p-4">
          <div class="bg-gray-300 h-4 rounded mb-2"></div>
          <div class="bg-gray-300 h-3 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const { $fetch } = useNuxtApp();

// SEO
useHead({
  title: 'Danh sách truyện tranh - Mango',
  meta: [
    { 
      name: 'description', 
      content: 'Khám phá hàng ngàn bộ truyện tranh hay nhất với nhiều thể loại đa dạng. Tìm kiếm và lọc truyện theo sở thích.' 
    }
  ]
});

// Reactive data
const manga = ref([]);
const loading = ref(true);
const viewMode = ref('grid');
const currentPage = ref(1);
const pageSize = 20;
const totalManga = ref(0);
const totalPages = ref(1);

const filters = reactive({
  genre: '',
  status: '',
  sort: 'latest',
  search: ''
});

// Initialize filters from URL
onMounted(() => {
  // Set initial filters from URL query parameters
  filters.genre = route.query.genre || '';
  filters.status = route.query.status || '';
  filters.sort = route.query.sort || 'latest';
  filters.search = route.query.search || '';
  currentPage.value = parseInt(route.query.page) || 1;
  
  fetchManga();
});

// Watch for route changes
watch(() => route.query, () => {
  filters.genre = route.query.genre || '';
  filters.status = route.query.status || '';
  filters.sort = route.query.sort || 'latest';
  filters.search = route.query.search || '';
  currentPage.value = parseInt(route.query.page) || 1;
  
  fetchManga();
});

const fetchManga = async () => {
  loading.value = true;
  
  try {
    const response = await $fetch('/api/manga', {
      query: {
        page: currentPage.value,
        limit: pageSize,
        genre: filters.genre || undefined,
        status: filters.status || undefined,
        sort: filters.sort,
        search: filters.search || undefined
      }
    });
    
    if (response.success) {
      manga.value = response.data;
      totalManga.value = response.pagination.total;
      totalPages.value = response.pagination.pages;
    }
  } catch (error) {
    console.error('Error fetching manga:', error);
    manga.value = [];
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  currentPage.value = 1;
  updateURL();
  fetchManga();
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    updateURL();
    fetchManga();
  }
};

const updateURL = () => {
  const query = {};
  
  if (filters.genre) query.genre = filters.genre;
  if (filters.status) query.status = filters.status;
  if (filters.sort !== 'latest') query.sort = filters.sort;
  if (filters.search) query.search = filters.search;
  if (currentPage.value > 1) query.page = currentPage.value;
  
  router.push({ query });
};

const resetFilters = () => {
  filters.genre = '';
  filters.status = '';
  filters.sort = 'latest';
  filters.search = '';
  currentPage.value = 1;
  
  router.push({ query: {} });
  fetchManga();
};

// Pagination helper
const visiblePages = computed(() => {
  const pages = [];
  const current = currentPage.value;
  const total = totalPages.value;
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    
    if (current <= 4) {
      for (let i = 2; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push('...');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    }
  }
  
  return pages;
});
</script>