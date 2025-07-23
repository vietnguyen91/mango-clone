<template>
  <div v-if="chapterData" class="bg-black min-h-screen">
    <!-- Chapter Navigation Header -->
    <div class="chapter-navigation bg-black/95 backdrop-blur-md text-white shadow-xl border-b border-gray-800/50">
      <div class="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <div class="flex items-center space-x-4">
          <NuxtLink 
            :to="`/manga/${chapterData.manga?.slug}`"
            class="flex items-center text-gray-300 hover:text-white transition-all duration-200 group"
          >
            <div class="p-2 rounded-lg bg-gray-800/50 group-hover:bg-gray-700 transition-colors mr-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </div>
            <div>
              <div class="font-semibold text-white truncate max-w-xs">
                {{ chapterData.manga?.title }}
              </div>
              <div class="text-xs text-gray-400">
                Chapter {{ chapterData.chapter.chapterNumber }}
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="flex items-center space-x-3">
          <!-- Chapter Selector -->
          <select 
            v-model="currentChapterId"
            @change="navigateToChapter"
            class="bg-gray-800/80 backdrop-blur-sm text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          >
            <option :value="chapterData.chapter.chapterId">
              Chapter {{ chapterData.chapter.chapterNumber }}
            </option>
          </select>

          <!-- Navigation Buttons -->
          <NuxtLink
            v-if="chapterData.navigation?.previous"
            :to="`/read/${chapterData.navigation.previous.chapterId}`"
            class="nav-btn nav-btn-secondary flex items-center space-x-2"
            title="Chapter trước"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            <span class="hidden sm:inline">Trước</span>
          </NuxtLink>
          
          <NuxtLink
            v-if="chapterData.navigation?.next"
            :to="`/read/${chapterData.navigation.next.chapterId}`"
            class="nav-btn nav-btn-primary flex items-center space-x-2"
            title="Chapter tiếp theo"
          >
            <span class="hidden sm:inline">Tiếp</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Reading Container -->
    <div class="reading-container mx-auto bg-black">
      <!-- Chapter Info -->
      <div class="chapter-header text-center py-8 border-b border-gray-800/50">
        <h1 class="text-3xl font-bold text-white mb-3 leading-tight">
          {{ chapterData.manga?.title }}
        </h1>
        <h2 class="text-xl text-gray-300 font-medium mb-2">
          Chapter {{ chapterData.chapter.chapterNumber }}
          <span v-if="getCleanChapterTitle(chapterData.chapter)" class="text-gray-400 font-normal"> - {{ getCleanChapterTitle(chapterData.chapter) }}</span>
        </h2>
        <div class="flex items-center justify-center space-x-6 text-sm text-gray-400 mt-4">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2H5v-2h10z" clip-rule="evenodd"/>
            </svg>
            <span>{{ chapterData.chapter.images?.length || 0 }} trang</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
            </svg>
            <span>{{ formatNumber(chapterData.chapter.viewCount || 0) }} lượt xem</span>
          </div>
          <div v-if="chapterData.chapter.publishedAt" class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
            </svg>
            <span>{{ formatDate(chapterData.chapter.publishedAt) }}</span>
          </div>
        </div>
        
        <!-- Reading Progress Info -->
        <div class="mt-4 text-xs text-gray-500">
          Trang {{ currentPage }} / {{ totalPages }}
        </div>
      </div>

      <!-- Reading Area -->
      <div class="relative">
        <!-- Images -->
        <div v-if="chapterData.chapter.images && chapterData.chapter.images.length > 0" class="manga-reader">
          <MangaPageViewer
            v-for="(image, index) in chapterData.chapter.images"
            :key="image._id || index"
            :image="image"
            :index="index"
            :total="chapterData.chapter.images.length"
            :manga-title="chapterData.manga?.title"
            :chapter-number="chapterData.chapter.chapterNumber"
            :reading-mode="readingMode"
            :image-fit="imageFit"
            @image-loaded="onImageLoaded"
            @image-error="handleImageError"
            @image-viewed="updateReadingProgress"
          />
        </div>

        <!-- No Images State -->
        <div v-else class="text-center py-20">
          <div class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 class="text-xl font-medium text-white mb-2">Chương chưa có ảnh</h3>
          <p class="text-gray-400">Ảnh sẽ được cập nhật sớm nhất có thể.</p>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="py-8 border-t border-gray-800">
        <div class="max-w-lg mx-auto flex justify-center space-x-3">
          <NuxtLink
            v-if="chapterData.navigation?.previous"
            :to="`/read/${chapterData.navigation.previous.chapterId}`"
            class="flex-1 nav-btn nav-btn-secondary text-center py-3 px-4"
          >
            <span class="flex items-center justify-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              <span>Chapter {{ chapterData.navigation.previous.chapterNumber }}</span>
            </span>
          </NuxtLink>
          
          <NuxtLink
            :to="`/manga/${chapterData.manga?.slug}`"
            class="nav-btn nav-btn-outline px-6 py-3"
          >
            <span class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
              <span>Danh sách</span>
            </span>
          </NuxtLink>
          
          <NuxtLink
            v-if="chapterData.navigation?.next"
            :to="`/read/${chapterData.navigation.next.chapterId}`"
            class="flex-1 nav-btn nav-btn-primary text-center py-3 px-4"
          >
            <span class="flex items-center justify-center space-x-2">
              <span>Chapter {{ chapterData.navigation.next.chapterNumber }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </span>
          </NuxtLink>
        </div>

        <!-- Back to Manga -->
        <div class="text-center mt-6">
          <NuxtLink
            :to="`/manga/${chapterData.manga?.slug}`"
            class="text-gray-400 hover:text-white transition-colors"
          >
            ← Quay lại {{ chapterData.manga?.title }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Reading Progress Indicator -->
    <div class="reading-progress-container fixed top-0 left-0 w-full h-2 bg-gray-900/80 backdrop-blur-sm z-50">
      <div 
        class="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-200 ease-out shadow-sm"
        :style="{ width: `${readingProgress}%` }"
      ></div>
      
      <!-- Page indicator -->
      <div class="absolute top-full left-0 right-0 bg-gray-900/90 backdrop-blur-sm text-white text-xs px-4 py-1 flex justify-between items-center">
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <span>{{ Math.round(readingProgress) }}%</span>
      </div>
    </div>

    <!-- Floating Action Button -->
    <div class="fixed bottom-6 right-6 flex flex-col space-y-3">
      <!-- Go to Top -->
      <button
        @click="scrollToTop"
        class="floating-btn"
        title="Lên đầu trang"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
        </svg>
      </button>
      
      <!-- Page Navigator -->
      <button
        @click="showPageNavigator = !showPageNavigator"
        class="floating-btn"
        title="Điều hướng trang"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </button>
      
      <!-- Settings Toggle -->
      <button
        @click="showSettings = !showSettings"
        class="floating-btn"
        title="Cài đặt đọc"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </button>
    </div>

    <!-- Settings Panel -->
    <div 
      v-if="showSettings"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="showSettings = false"
    >
      <div 
        class="settings-panel text-white rounded-xl p-6 max-w-sm w-full mx-4"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Cài đặt đọc truyện</h3>
          <button @click="showSettings = false" class="text-gray-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- Reading Mode -->
          <div>
            <label class="block text-sm font-medium mb-2">Chế độ đọc</label>
            <select 
              v-model="readingMode"
              class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
            >
              <option value="vertical">Dọc (mặc định)</option>
              <option value="horizontal">Ngang</option>
            </select>
          </div>

          <!-- Image Fit -->
          <div>
            <label class="block text-sm font-medium mb-2">Khớp ảnh</label>
            <select 
              v-model="imageFit"
              class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
            >
              <option value="width">Khớp chiều rộng</option>
              <option value="height">Khớp chiều cao</option>
              <option value="original">Kích thước gốc</option>
            </select>
          </div>
        </div>

        <div class="flex space-x-3 mt-6">
          <button
            @click="resetSettings"
            class="flex-1 nav-btn nav-btn-outline py-2"
          >
            Reset
          </button>
          <button
            @click="showSettings = false"
            class="flex-1 nav-btn nav-btn-primary py-2"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Loading State -->
  <div v-else-if="pending" class="bg-black min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <div class="text-white">Đang tải chương...</div>
    </div>
  </div>

  <!-- Error State -->
  <div v-else class="bg-black min-h-screen flex items-center justify-center">
    <div class="text-center max-w-md mx-auto px-4">
      <div class="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h3 class="text-xl font-medium text-white mb-2">Không tìm thấy chương</h3>
      <p class="text-gray-400 mb-4">Chương bạn đang tìm có thể đã bị xóa hoặc không tồn tại.</p>
      <NuxtLink 
        to="/manga" 
        class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
      >
        Quay lại danh sách
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const { $fetch } = useNuxtApp();
const config = useRuntimeConfig();

const getImageUrl = (s3Path, fallback) => {
  if (s3Path && s3Path.startsWith('/')) {
    return config.public.staticUrl + s3Path;
  }
  return s3Path || fallback || '/placeholder-page.jpg';
};

// Fetch chapter data
const { data, pending, error } = await useLazyFetch(`/api/chapters/${route.params.chapterId}`);

const chapterData = computed(() => data.value?.data || null);
const currentChapterId = ref(route.params.chapterId);

// Reading settings
const showSettings = ref(false);
const showPageNavigator = ref(false);
const readingMode = ref('vertical');
const imageFit = ref('width');

// Reading progress
const readingProgress = ref(0);

// SEO
useHead(() => ({
  title: chapterData.value 
    ? `${chapterData.value.manga?.title} - Chapter ${chapterData.value.chapter.chapterNumber} - Mango`
    : 'Đang tải...',
  meta: [
    { 
      name: 'description', 
      content: chapterData.value 
        ? `Đọc ${chapterData.value.manga?.title} Chapter ${chapterData.value.chapter.chapterNumber} online miễn phí tại Mango`
        : ''
    }
  ]
}));

// Page loading state
const loadedPages = ref(new Set());
const totalPages = computed(() => chapterData.value?.chapter.images?.length || 0);

// Methods
const navigateToChapter = () => {
  if (currentChapterId.value !== route.params.chapterId) {
    navigateTo(`/read/${currentChapterId.value}`);
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const scrollToPage = (pageNumber) => {
  const pageElement = document.getElementById(`page-${pageNumber}`);
  if (pageElement) {
    pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const handleImageError = (event) => {
  console.error('Failed to load image:', event.target.src);
  event.target.src = '/placeholder-page.jpg';
};

const onImageLoaded = (pageIndex) => {
  loadedPages.value.add(pageIndex);
};

// Update reading progress on scroll
const updateReadingProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.min(Math.max((scrollTop / docHeight) * 100, 0), 100);
  readingProgress.value = progress;
  
  // Update current page based on scroll position
  updateCurrentPage();
};

const updateCurrentPage = () => {
  const pages = document.querySelectorAll('[id^="page-"]');
  const viewportMiddle = window.scrollY + window.innerHeight / 2;
  
  pages.forEach((page, index) => {
    const pageTop = page.offsetTop;
    const pageBottom = pageTop + page.offsetHeight;
    
    if (viewportMiddle >= pageTop && viewportMiddle <= pageBottom) {
      currentPage.value = index + 1;
    }
  });
};

// Current page tracking
const currentPage = ref(1);

// Keyboard navigation
const handleKeyPress = (event) => {
  if (showSettings.value) return;
  
  switch (event.key) {
    case 'ArrowLeft':
      if (chapterData.value?.navigation?.previous) {
        navigateTo(`/read/${chapterData.value.navigation.previous.chapterId}`);
      }
      break;
    case 'ArrowRight':
      if (chapterData.value?.navigation?.next) {
        navigateTo(`/read/${chapterData.value.navigation.next.chapterId}`);
      }
      break;
    case 'Escape':
      if (chapterData.value?.manga?.slug) {
        navigateTo(`/manga/${chapterData.value.manga.slug}`);
      }
      break;
  }
};

// Lifecycle
onMounted(() => {
  // Add scroll listener with throttling
  let ticking = false;
  const scrollListener = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateReadingProgress();
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', scrollListener, { passive: true });
  
  // Add keyboard listener
  window.addEventListener('keydown', handleKeyPress);
  
  // Update initial progress
  updateReadingProgress();
  
  // Preload next few images
  preloadImages();
});

// Preload next few images for better UX
const preloadImages = () => {
  if (!chapterData.value?.chapter.images) return;
  
  const imagesToPreload = chapterData.value.chapter.images.slice(0, 5);
  imagesToPreload.forEach(image => {
    const img = new Image();
    img.src = getImageUrl(image.s3Url, image.originalUrl);
  });
};

// Format utilities
const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

const resetSettings = () => {
  readingMode.value = 'vertical';
  imageFit.value = 'width';
};

const getCleanChapterTitle = (chapter) => {
  if (!chapter.title) return '';
  
  const title = chapter.title.trim();
  const chapterNum = chapter.chapterNumber;
  
  // Remove duplicate patterns
  const patterns = [
    `${chapterNum} Chapter ${chapterNum}`,
    `Chapter ${chapterNum}`,
    `${chapterNum} Chapter`,
    `Chapter ${chapterNum} -`,
    `${chapterNum} -`
  ];
  
  let cleanTitle = title;
  patterns.forEach(pattern => {
    cleanTitle = cleanTitle.replace(new RegExp(pattern, 'gi'), '').trim();
  });
  
  // Remove leading/trailing dashes and spaces
  cleanTitle = cleanTitle.replace(/^[-\s]+|[-\s]+$/g, '');
  
  // If title is just numbers or very short, don't show
  if (cleanTitle.length < 3 || /^\d+$/.test(cleanTitle)) return '';
  
  return cleanTitle;
};

onUnmounted(() => {
  window.removeEventListener('scroll', updateReadingProgress);
  window.removeEventListener('keydown', handleKeyPress);
});

// Handle 404
if (error.value?.statusCode === 404) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Chapter not found'
  });
}
</script>

<style scoped>
/* Custom scrollbar for dark theme */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>