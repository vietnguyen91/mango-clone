<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl text-white p-8 mb-12">
      <div class="max-w-3xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          Khám phá thế giới truyện tranh
        </h1>
        <p class="text-xl text-primary-100 mb-6">
          Hàng ngàn bộ truyện tranh hay nhất từ khắp nơi trên thế giới, cập nhật liên tục mỗi ngày
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <NuxtLink 
            to="/manga" 
            class="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-center"
          >
            Khám phá ngay
          </NuxtLink>
          <NuxtLink 
            to="/manga?sort=popular" 
            class="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center"
          >
            Truyện hot nhất
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Latest Manga -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Truyện mới cập nhật</h2>
        <NuxtLink 
          to="/manga?sort=latest" 
          class="text-primary-600 hover:text-primary-700 font-medium flex items-center"
        >
          Xem tất cả
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </NuxtLink>
      </div>
      
      <div v-if="latestManga.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        <MangaCard 
          v-for="manga in latestManga" 
          :key="manga._id" 
          :manga="manga" 
        />
      </div>
      
      <div v-else-if="!loadingLatest" class="text-center py-12">
        <p class="text-gray-500">Chưa có truyện nào được cập nhật</p>
      </div>
      
      <div v-if="loadingLatest" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        <div v-for="i in 6" :key="i" class="manga-card animate-pulse">
          <div class="bg-gray-300 aspect-[3/4] w-full rounded-t-lg"></div>
          <div class="p-4">
            <div class="bg-gray-300 h-4 rounded mb-2"></div>
            <div class="bg-gray-300 h-3 rounded w-3/4 mb-2"></div>
            <div class="bg-gray-300 h-3 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Manga -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Truyện phổ biến</h2>
        <NuxtLink 
          to="/manga?sort=popular" 
          class="text-primary-600 hover:text-primary-700 font-medium flex items-center"
        >
          Xem tất cả
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </NuxtLink>
      </div>
      
      <div v-if="popularManga.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        <MangaCard 
          v-for="manga in popularManga" 
          :key="manga._id" 
          :manga="manga" 
        />
      </div>
      
      <div v-else-if="!loadingPopular" class="text-center py-12">
        <p class="text-gray-500">Chưa có dữ liệu truyện phổ biến</p>
      </div>
      
      <div v-if="loadingPopular" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        <div v-for="i in 6" :key="i" class="manga-card animate-pulse">
          <div class="bg-gray-300 aspect-[3/4] w-full rounded-t-lg"></div>
          <div class="p-4">
            <div class="bg-gray-300 h-4 rounded mb-2"></div>
            <div class="bg-gray-300 h-3 rounded w-3/4 mb-2"></div>
            <div class="bg-gray-300 h-3 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Genre Categories -->
    <section>
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Thể loại phổ biến</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <NuxtLink 
          v-for="genre in genres" 
          :key="genre.slug"
          :to="`/manga?genre=${genre.slug}`"
          class="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow group"
        >
          <div class="w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
            <span class="text-2xl">{{ genre.icon }}</span>
          </div>
          <h3 class="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
            {{ genre.name }}
          </h3>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>

// SEO
useHead({
  title: 'Mango - Đọc Truyện Tranh Online Miễn Phí',
  meta: [
    { 
      name: 'description', 
      content: 'Đọc truyện tranh online miễn phí với hàng ngàn bộ truyện hay nhất. Cập nhật liên tục, chất lượng cao.' 
    },
    { 
      name: 'keywords', 
      content: 'truyện tranh, manga, đọc truyện online, truyện miễn phí, manga online' 
    }
  ]
});

// Reactive data
const latestManga = ref([]);
const popularManga = ref([]);
const loadingLatest = ref(true);
const loadingPopular = ref(true);

// Static genre data (can be moved to API later)
const genres = [
  { slug: 'romance', name: 'Lãng mạn', icon: '💕' },
  { slug: 'action', name: 'Hành động', icon: '⚔️' },
  { slug: 'fantasy', name: 'Huyền huyễn', icon: '🔮' },
  { slug: 'school', name: 'Trường học', icon: '🏫' },
  { slug: 'comedy', name: 'Hài hước', icon: '😄' },
  { slug: 'drama', name: 'Drama', icon: '🎭' }
];

// Fetch data on mount
onMounted(async () => {
  try {
    // Fetch latest manga
    const latestResponse = await $fetch('/api/manga', {
      query: { 
        sort: 'latest',
        limit: 12
      }
    });
    
    if (latestResponse.success) {
      latestManga.value = latestResponse.data;
    }
  } catch (error) {
    console.error('Error fetching latest manga:', error);
  } finally {
    loadingLatest.value = false;
  }

  try {
    // Fetch popular manga
    const popularResponse = await $fetch('/api/manga', {
      query: { 
        sort: 'popular',
        limit: 12
      }
    });
    
    if (popularResponse.success) {
      popularManga.value = popularResponse.data;
    }
  } catch (error) {
    console.error('Error fetching popular manga:', error);
  } finally {
    loadingPopular.value = false;
  }
});
</script>