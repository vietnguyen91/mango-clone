<template>
  <div v-if="manga" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb -->
    <nav class="flex mb-6" aria-label="Breadcrumb">
      <ol class="flex items-center space-x-2">
        <li>
          <NuxtLink to="/" class="text-gray-500 hover:text-primary-600">Trang chủ</NuxtLink>
        </li>
        <li class="flex items-center">
          <svg class="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
          </svg>
          <NuxtLink to="/manga" class="text-gray-500 hover:text-primary-600">Truyện tranh</NuxtLink>
        </li>
        <li class="flex items-center">
          <svg class="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
          </svg>
          <span class="text-gray-900 font-medium">{{ manga.title }}</span>
        </li>
      </ol>
    </nav>

    <!-- Manga Info -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      <div class="md:flex">
        <!-- Cover Image -->
        <div class="md:w-80 md:flex-shrink-0">
          <NuxtImg
            :src="getImageUrl(manga.s3CoverUrl, manga.coverImage)"
            :alt="manga.title"
            class="w-full h-96 md:h-full object-cover"
          />
        </div>

        <!-- Manga Details -->
        <div class="p-6 md:p-8 flex-1">
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ manga.title }}</h1>
            
            <div class="flex items-center space-x-4 mb-4">
              <span 
                :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  manga.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                ]"
              >
                {{ manga.status === 'completed' ? 'Hoàn thành' : 'Đang cập nhật' }}
              </span>
              
              <div v-if="manga.rating" class="flex items-center">
                <svg class="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="text-gray-700 font-medium">{{ manga.rating.toFixed(1) }}/5</span>
              </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600">{{ formatNumber(manga.viewCount) }}</div>
                <div class="text-sm text-gray-500">Lượt xem</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600">{{ formatNumber(manga.likeCount) }}</div>
                <div class="text-sm text-gray-500">Lượt thích</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600">{{ manga.chapterCount || 0 }}</div>
                <div class="text-sm text-gray-500">Chương</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600">{{ manga.author || 'N/A' }}</div>
                <div class="text-sm text-gray-500">Tác giả</div>
              </div>
            </div>

            <!-- Genres -->
            <div v-if="manga.genres && manga.genres.length" class="mb-6">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Thể loại:</h3>
              <div class="flex flex-wrap gap-2">
                <NuxtLink
                  v-for="genre in manga.genres"
                  :key="genre"
                  :to="`/manga?genre=${genre.toLowerCase()}`"
                  class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium hover:bg-primary-200 transition-colors"
                >
                  {{ genre }}
                </NuxtLink>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-3">
              <NuxtLink
                v-if="firstChapter"
                :to="`/read/${firstChapter.chapterId}`"
                class="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center"
              >
                Bắt đầu đọc
              </NuxtLink>
              <NuxtLink
                v-if="latestChapter"
                :to="`/read/${latestChapter.chapterId}`"
                class="flex-1 border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-center"
              >
                Chương mới nhất
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div v-if="manga.description" class="border-t border-gray-200 p-6 md:p-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Nội dung</h2>
        <div class="prose max-w-none text-gray-700">
          <p>{{ manga.description }}</p>
        </div>
      </div>
    </div>

    <!-- Chapter List -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            Danh sách chương ({{ chapters.length }})
          </h2>
          <div class="flex items-center space-x-2">
            <button
              @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
              class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              {{ sortOrder === 'asc' ? '↑ Cũ nhất' : '↓ Mới nhất' }}
            </button>
          </div>
        </div>
      </div>

      <div class="divide-y divide-gray-100">
        <div
          v-for="chapter in sortedChapters"
          :key="chapter._id"
          class="chapter-item group"
        >
          <NuxtLink
            :to="`/read/${chapter.chapterId}`"
            class="block px-6 py-5 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 border-l-4 border-transparent hover:border-primary-500"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-3 mb-2">
                  <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.877 2.172M15 6.306A7.962 7.962 0 0112 5c-2.34 0 4.29-.82 5.877-2.172z"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                      Chapter {{ chapter.chapterNumber }}
                    </h3>
                    <p v-if="getCleanTitle(chapter)" class="text-sm text-gray-600 line-clamp-1">
                      {{ getCleanTitle(chapter) }}
                    </p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-6 text-sm text-gray-500 ml-15">
                  <div v-if="chapter.publishedDate" class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                    </svg>
                    <span>{{ formatDate(chapter.publishedDate) }}</span>
                  </div>
                  <div v-if="chapter.viewCount" class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                    </svg>
                    <span>{{ formatNumber(chapter.viewCount) }}</span>
                  </div>
                  <div v-if="chapter.imageCount" class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2H5v-2h10z" clip-rule="evenodd"/>
                    </svg>
                    <span>{{ chapter.imageCount }} trang</span>
                  </div>
                </div>
              </div>
              
              <div class="flex-shrink-0 ml-4">
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div class="px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-primary-700 hover:shadow-lg transition-all duration-200">
                    <span class="flex items-center space-x-2">
                      <span>Đọc</span>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
        
        <div v-if="chapters.length === 0" class="px-6 py-12 text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.877 2.172M15 6.306A7.962 7.962 0 0112 5c-2.34 0 4.29-.82 5.877-2.172z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có chương nào</h3>
          <p class="text-gray-500">Chương sẽ được cập nhật sớm nhất có thể.</p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Loading State -->
  <div v-else-if="pending" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="animate-pulse">
      <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div class="md:flex">
          <div class="md:w-80 bg-gray-300 h-96"></div>
          <div class="p-8 flex-1">
            <div class="bg-gray-300 h-8 rounded mb-4"></div>
            <div class="bg-gray-300 h-4 rounded mb-4 w-1/2"></div>
            <div class="bg-gray-300 h-20 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center py-12">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h3 class="text-xl font-medium text-gray-900 mb-2">Không tìm thấy truyện</h3>
      <p class="text-gray-500 mb-4">Truyện bạn đang tìm có thể đã bị xóa hoặc không tồn tại.</p>
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
  return s3Path || fallback || '/placeholder-manga.jpg';
};

// Fetch manga data
const { data, pending, error } = await useLazyFetch(`/api/manga/${route.params.slug}`);

const manga = computed(() => data.value?.data || null);
const chapters = computed(() => manga.value?.chapters || []);

// Sort chapters
const sortOrder = ref('desc');
const sortedChapters = computed(() => {
  const sorted = [...chapters.value];
  return sorted.sort((a, b) => {
    if (sortOrder.value === 'asc') {
      return a.chapterNumber - b.chapterNumber;
    } else {
      return b.chapterNumber - a.chapterNumber;
    }
  });
});

// Helper computed properties
const firstChapter = computed(() => {
  const sorted = [...chapters.value].sort((a, b) => a.chapterNumber - b.chapterNumber);
  return sorted[0];
});

const latestChapter = computed(() => {
  const sorted = [...chapters.value].sort((a, b) => b.chapterNumber - a.chapterNumber);
  return sorted[0];
});

// SEO
useHead(() => ({
  title: manga.value ? `${manga.value.title} - Mango` : 'Đang tải...',
  meta: [
    { 
      name: 'description', 
      content: manga.value?.description || `Đọc truyện ${manga.value?.title} online miễn phí tại Mango` 
    },
    {
      name: 'keywords',
      content: `${manga.value?.title}, truyện tranh, manga, ${manga.value?.genres?.join(', ') || ''}`
    }
  ]
}));

// Helper functions
const formatNumber = (num) => {
  if (!num) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  return num.toString();
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getCleanTitle = (chapter) => {
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

// Handle 404
if (error.value?.statusCode === 404) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Manga not found'
  });
}
</script>