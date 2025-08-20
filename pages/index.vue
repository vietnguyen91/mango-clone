<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile-First Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 opacity-50"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div class="text-center md:text-left max-w-4xl">
          <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Đọc truyện tranh
            <span class="block text-yellow-300">miễn phí tại Việt Nam</span>
          </h1>
          <p class="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl">
            Hàng ngàn bộ manga, manhwa, manhua được cập nhật hàng ngày với chất lượng cao và tốc độ nhanh nhất
          </p>

          <!-- Quick Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 mb-8">
            <NuxtLink
              to="/manga"
              class="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-primary-50 transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🚀 Khám phá ngay
            </NuxtLink>
            <NuxtLink
              to="/manga?sort=popular"
              class="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-primary-600 transition-all duration-200 text-center"
            >
              🔥 Truyện hot nhất
            </NuxtLink>
          </div>

          <!-- Quick Stats -->
          <div class="grid grid-cols-3 gap-4 md:gap-8 max-w-md">
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-yellow-300">{{ formatNumber(stats.totalManga) }}+</div>
              <div class="text-xs md:text-sm text-primary-200">Bộ truyện</div>
            </div>
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-yellow-300">{{ formatNumber(stats.totalChapters) }}+</div>
              <div class="text-xs md:text-sm text-primary-200">Chương</div>
            </div>
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-yellow-300">{{ stats.dailyUpdates }}+</div>
              <div class="text-xs md:text-sm text-primary-200">Cập nhật/ngày</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

      <!-- Trending Today Section -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center">
            <div class="bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-2 mr-3">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div>
              <h2 class="text-2xl md:text-3xl font-bold text-gray-900">
                🔥 Trending Hôm Nay
              </h2>
              <p class="text-gray-600 text-sm mt-1">Những bộ truyện được đọc nhiều nhất trong 24h qua</p>
            </div>
          </div>
          <div class="hidden md:flex items-center space-x-2">
            <button class="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200">
              Xem tất cả
            </button>
          </div>
        </div>

        <!-- Trending Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(manga, index) in popularManga.slice(0, 6)"
            :key="manga._id"
            class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-200"
          >
            <!-- Trending Badge -->
            <div class="absolute top-4 left-4 z-10">
              <div class="flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                <span class="mr-1">#{{ index + 1 }}</span>
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>

            <!-- Image Container -->
            <div class="relative h-48 overflow-hidden">
              <NuxtLink :to="`/manga/${manga.slug}`">
                <CustomImage
                  :src="getImageUrl(manga.s3CoverUrl, manga.coverImage)"
                  :alt="manga.title"
                  container-class="h-full w-full"
                  image-class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  :quality="85"
                />
                <!-- Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </NuxtLink>
            </div>

            <!-- Content -->
            <div class="p-5">
              <NuxtLink :to="`/manga/${manga.slug}`" class="block mb-3">
                <h3 class="font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors duration-200 line-clamp-2" :title="manga.title">
                  {{ manga.title }}
                </h3>
              </NuxtLink>

              <!-- Stats Row -->
              <div class="flex items-center justify-between text-sm text-gray-600 mb-3">
                <div class="flex items-center space-x-4">
                  <div class="flex items-center" v-if="manga.viewCount">
                    <svg class="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                    </svg>
                    <span class="font-medium">{{ formatNumber(manga.viewCount) }}</span>
                  </div>
                  <div class="flex items-center" v-if="manga.chapterCount">
                    <svg class="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2H5v-2h10z" clip-rule="evenodd"/>
                    </svg>
                    <span class="font-medium">{{ manga.chapterCount }} ch</span>
                  </div>
                </div>
                <div class="flex items-center text-yellow-500" v-if="manga.rating">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span class="font-medium">{{ manga.rating.toFixed(1) }}</span>
                </div>
              </div>

              <!-- Genres -->
              <div class="flex flex-wrap gap-2 mb-4" v-if="manga.genres && manga.genres.length > 0">
                <span
                  v-for="genre in manga.genres.slice(0, 2)"
                  :key="genre"
                  class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
                >
                  {{ genre }}
                </span>
                <span v-if="manga.genres.length > 2" class="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                  +{{ manga.genres.length - 2 }}
                </span>
              </div>

              <!-- Action Button -->
              <NuxtLink
                :to="`/manga/${manga.slug}`"
                class="block w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-center py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                Đọc ngay
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Mobile View All Button -->
        <div class="md:hidden mt-6 text-center">
          <button class="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all duration-200">
            Xem tất cả trending
          </button>
        </div>
      </section>

      <!-- Quick Genre Navigation -->
      <section class="mb-12">
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span class="mr-2">📚</span>
          Thể loại phổ biến
        </h2>
        <div class="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          <NuxtLink
            v-for="genre in popularGenres"
            :key="genre.name"
            :to="`/manga?genre=${encodeURIComponent(genre.name)}`"
            class="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all duration-200 group border border-gray-100 hover:border-primary-200"
          >
            <div class="text-2xl md:text-3xl mb-2">{{ genre.icon }}</div>
            <div class="text-xs md:text-sm font-medium text-gray-700 group-hover:text-primary-600">
              {{ genre.name }}
            </div>
            <div class="text-xs text-gray-500 mt-1">{{ genre.count }}+</div>
          </NuxtLink>
        </div>
      </section>

      <!-- Latest Updates -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
            <span class="mr-2">🆕</span>
            Mới cập nhật
          </h2>
          <NuxtLink
            to="/manga?sort=latest"
            class="text-primary-600 hover:text-primary-700 font-medium flex items-center text-sm md:text-base"
          >
            Xem tất cả
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-if="loadingLatest" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 3xl:grid-cols-9 4xl:grid-cols-10 gap-3 md:gap-4">
          <SkeletonLoader v-for="i in 20" :key="i" type="manga-card" />
        </div>

        <!-- Loaded Content -->
        <div v-else-if="latestManga.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 3xl:grid-cols-9 4xl:grid-cols-10 gap-3 md:gap-4">
          <MangaCard
            v-for="manga in latestManga"
            :key="manga._id"
            :manga="manga"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <p class="text-gray-500 text-lg">Chưa có truyện mới cập nhật</p>
          <p class="text-gray-400 text-sm mt-2">Hãy quay lại sau để xem nội dung mới nhất</p>
        </div>
      </section>

      <!-- Popular This Week -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
            <span class="mr-2">🔥</span>
            Hot trong tuần
          </h2>
          <NuxtLink
            to="/manga?sort=popular"
            class="text-primary-600 hover:text-primary-700 font-medium flex items-center text-sm md:text-base"
          >
            Xem tất cả
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
        </div>

        <!-- Mobile: Horizontal Scroll -->
        <div class="md:hidden">
          <div class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            <div
              v-for="manga in popularManga.slice(0, 8)"
              :key="manga._id"
              class="flex-none w-32 snap-start"
            >
              <MangaCard :manga="manga" />
            </div>
          </div>
        </div>

        <!-- Desktop: Grid -->
        <div class="hidden md:grid md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 3xl:grid-cols-9 4xl:grid-cols-10 gap-4">
          <MangaCard
            v-for="manga in popularManga.slice(0, 20)"
            :key="manga._id"
            :manga="manga"
          />
        </div>

        <!-- Loading State -->
        <div v-if="loadingPopular" class="grid grid-cols-4 md:grid-cols-6 gap-4">
          <div v-for="i in 8" :key="i" class="manga-card animate-pulse">
            <div class="bg-gray-300 aspect-[3/4] w-full rounded-t-lg"></div>
            <div class="p-3">
              <div class="bg-gray-300 h-3 rounded mb-2"></div>
              <div class="bg-gray-300 h-2 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Completed Manga -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
            <span class="mr-2">✅</span>
            Truyện hoàn thành
          </h2>
          <NuxtLink
            to="/manga?status=completed"
            class="text-primary-600 hover:text-primary-700 font-medium flex items-center text-sm md:text-base"
          >
            Xem tất cả
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 3xl:grid-cols-9 4xl:grid-cols-10 gap-3 md:gap-4">
          <MangaCard
            v-for="manga in completedManga.slice(0, 20)"
            :key="manga._id"
            :manga="manga"
          />
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>

// SEO - Vietnamese optimized
useHead({
  title: 'Mango - Đọc Truyện Tranh Online Miễn Phí Tại Việt Nam',
  meta: [
    {
      name: 'description',
      content: 'Đọc truyện tranh manga, manhwa, manhua online miễn phí tại Việt Nam. Hàng ngàn bộ truyện hay nhất, cập nhật hàng ngày với chất lượng cao và tốc độ nhanh nhất.'
    },
    {
      name: 'keywords',
      content: 'truyện tranh việt nam, manga online, manhwa, manhua, đọc truyện miễn phí, truyện tranh mobile, manga việt nam'
    },
    {
      property: 'og:title',
      content: 'Mango - Đọc Truyện Tranh Online Miễn Phí Tại Việt Nam'
    },
    {
      property: 'og:description',
      content: 'Nền tảng đọc truyện tranh hàng đầu Việt Nam với hàng ngàn bộ manga, manhwa được cập nhật hàng ngày'
    }
  ]
})

// Reactive data
const latestManga = ref([]);
const popularManga = ref([]);
const featuredManga = ref([]);
const completedManga = ref([]);
const loadingLatest = ref(true);
const loadingPopular = ref(true);
const loadingFeatured = ref(true);
const loadingCompleted = ref(true);

// Site statistics
const stats = reactive({
  totalManga: 0,
  totalChapters: 0,
  dailyUpdates: 0
});

// Vietnamese popular genres
const popularGenres = [
  { name: 'Hành Động', icon: '⚔️', count: 1200 },
  { name: 'Lãng Mạn', icon: '💕', count: 980 },
  { name: 'Huyền Huyễn', icon: '🔮', count: 850 },
  { name: 'Hài Hước', icon: '😄', count: 720 },
  { name: 'Trường Học', icon: '🎓', count: 650 },
  { name: 'Thể Thao', icon: '⚽', count: 420 }
];

// Format numbers for display
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Fetch data on mount
onMounted(async () => {
  // Fetch featured manga
  try {
    const featuredResponse = await $fetch('/api/manga', {
      query: {
        sort: 'featured',
        limit: 6
      }
    });

    if (featuredResponse.success) {
      featuredManga.value = featuredResponse.data || [];
    }
  } catch (error) {
    console.error('Error fetching featured manga:', error);
    loadingFeatured.value = false;
  }

  // Fetch latest manga
  try {
    const latestResponse = await $fetch('/api/manga', {
      query: {
        sort: 'latest',
        limit: 12
      }
    });

    if (latestResponse.success) {
      latestManga.value = latestResponse.data || [];
    }
  } catch (error) {
    console.error('Error fetching latest manga:', error);
  } finally {
    loadingLatest.value = false;
  }

  // Fetch popular manga
  try {
    const popularResponse = await $fetch('/api/manga', {
      query: {
        sort: 'popular',
        limit: 12
      }
    });

    if (popularResponse.success) {
      popularManga.value = popularResponse.data || [];
    }
  } catch (error) {
    console.error('Error fetching popular manga:', error);
  } finally {
    loadingPopular.value = false;
  }

  // Fetch completed manga
  try {
    const completedResponse = await $fetch('/api/manga', {
      query: {
        status: 'completed',
        limit: 12
      }
    });

    if (completedResponse.success) {
      completedManga.value = completedResponse.data || [];
    }
  } catch (error) {
    console.error('Error fetching completed manga:', error);
  } finally {
    loadingCompleted.value = false;
  }

  // Fetch site statistics
  try {
    const statsResponse = await $fetch('/api/stats');
    if (statsResponse.success) {
      Object.assign(stats, statsResponse.data);
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Set default values if API fails
    stats.totalManga = 5000;
    stats.totalChapters = 150000;
    stats.dailyUpdates = 50;
  }

  // Set loading states to false after all data is loaded
  loadingFeatured.value = false;
});

// Helper function to get image URL
const getImageUrl = (s3Url, fallbackUrl) => {
  return s3Url || fallbackUrl || '/images/placeholder-manga.jpg';
};

</script>

<style scoped>
/* Hide scrollbar for webkit browsers */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Smooth scroll behavior */
.snap-x {
  scroll-behavior: smooth;
}

/* Manga card hover effects */
.manga-card {
  @apply bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200;
}

/* Featured card animations */
.featured-manga-card {
  @apply transform transition-all duration-300;
}

.featured-manga-card:hover {
  @apply -translate-y-2 shadow-xl;
}
</style>
