<template>
  <div class="skeleton-loader">
    <!-- Manga Card Skeleton -->
    <div v-if="type === 'manga-card'" class="manga-card-skeleton">
      <div class="skeleton-image aspect-[3/4] w-full rounded-t-xl"></div>
      <div class="p-4 space-y-3">
        <div class="skeleton-text h-4 w-full rounded"></div>
        <div class="skeleton-text h-3 w-3/4 rounded"></div>
        <div class="flex gap-2">
          <div class="skeleton-text h-6 w-16 rounded-full"></div>
          <div class="skeleton-text h-6 w-20 rounded-full"></div>
        </div>
        <div class="flex justify-between items-center">
          <div class="skeleton-text h-3 w-12 rounded"></div>
          <div class="skeleton-text h-3 w-16 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Featured Manga Card Skeleton -->
    <div v-else-if="type === 'featured-card'" class="featured-card-skeleton">
      <div class="skeleton-image h-48 md:h-56 w-full rounded-xl"></div>
    </div>

    <!-- Trending Card Skeleton -->
    <div v-else-if="type === 'trending-card'" class="trending-card-skeleton">
      <!-- Badge skeleton -->
      <div class="absolute top-2 md:top-4 left-2 md:left-4 z-10">
        <div class="skeleton-text bg-gray-300 rounded-full px-2 md:px-3 py-1 w-8 md:w-10 h-5 md:h-6"></div>
      </div>

      <!-- Image skeleton -->
      <div class="skeleton-image h-40 md:h-48 w-full"></div>

      <!-- Content skeleton -->
      <div class="p-2.5 md:p-4 space-y-2">
        <div class="skeleton-text h-3 md:h-4 w-4/5 rounded"></div>
        <div class="skeleton-text h-2 md:h-3 w-3/5 rounded"></div>
        <div class="flex justify-between items-center">
          <div class="skeleton-text h-2 md:h-3 w-8 rounded"></div>
          <div class="skeleton-text h-2 md:h-3 w-12 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Search Suggestion Skeleton -->
    <div v-else-if="type === 'search-suggestion'" class="search-suggestion-skeleton">
      <div class="flex items-center p-3 space-x-3">
        <div class="skeleton-image w-8 h-10 rounded"></div>
        <div class="flex-1 space-y-2">
          <div class="skeleton-text h-4 w-3/4 rounded"></div>
          <div class="skeleton-text h-3 w-1/2 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Chapter List Skeleton -->
    <div v-else-if="type === 'chapter-list'" class="chapter-list-skeleton">
      <div v-for="i in count" :key="i" class="flex items-center p-4 space-x-4">
        <div class="skeleton-image w-12 h-16 rounded"></div>
        <div class="flex-1 space-y-2">
          <div class="skeleton-text h-4 w-3/4 rounded"></div>
          <div class="skeleton-text h-3 w-1/2 rounded"></div>
          <div class="flex gap-3">
            <div class="skeleton-text h-3 w-16 rounded"></div>
            <div class="skeleton-text h-3 w-20 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reading Page Skeleton -->
    <div v-else-if="type === 'reading-page'" class="reading-page-skeleton">
      <div class="space-y-1">
        <div v-for="i in count" :key="i" class="skeleton-image w-full h-screen rounded"></div>
      </div>
    </div>

    <!-- Homepage Hero Skeleton -->
    <div v-else-if="type === 'hero'" class="hero-skeleton">
      <div class="bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl p-8 animate-pulse">
        <div class="max-w-4xl space-y-4">
          <div class="skeleton-text h-8 w-3/4 rounded"></div>
          <div class="skeleton-text h-6 w-full rounded"></div>
          <div class="skeleton-text h-6 w-2/3 rounded"></div>
          <div class="flex gap-4 mt-8">
            <div class="skeleton-text h-12 w-32 rounded-xl"></div>
            <div class="skeleton-text h-12 w-32 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Genre Grid Skeleton -->
    <div v-else-if="type === 'genre-grid'" class="genre-grid-skeleton">
      <div class="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
        <div v-for="i in 6" :key="i" class="genre-skeleton">
          <div class="bg-white rounded-xl p-4 text-center animate-pulse">
            <div class="skeleton-text w-8 h-8 mx-auto mb-2 rounded-full"></div>
            <div class="skeleton-text h-4 w-full rounded"></div>
            <div class="skeleton-text h-3 w-2/3 mx-auto mt-1 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Reader Skeleton -->
    <div v-else-if="type === 'mobile-reader'" class="mobile-reader-skeleton">
      <div class="bg-black min-h-screen">
        <!-- Header Skeleton -->
        <div class="fixed top-0 left-0 right-0 z-50 bg-black/90 p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="skeleton-text w-6 h-6 rounded bg-gray-700"></div>
              <div class="skeleton-text w-20 h-4 rounded bg-gray-700"></div>
            </div>
            <div class="skeleton-text w-24 h-4 rounded bg-gray-700"></div>
            <div class="skeleton-text w-6 h-6 rounded bg-gray-700"></div>
          </div>
          <div class="mt-3 flex items-center space-x-3">
            <div class="skeleton-text w-8 h-3 rounded bg-gray-700"></div>
            <div class="flex-1 skeleton-text h-1 rounded bg-gray-700"></div>
            <div class="skeleton-text w-8 h-3 rounded bg-gray-700"></div>
          </div>
        </div>

        <!-- Content Skeleton -->
        <div class="pt-20">
          <div class="skeleton-image w-full h-screen bg-gray-800"></div>
        </div>

        <!-- Bottom Navigation Skeleton -->
        <div class="fixed bottom-0 left-0 right-0 z-50 bg-black/90 p-4">
          <div class="flex items-center justify-between">
            <div class="skeleton-text w-16 h-8 rounded bg-gray-700"></div>
            <div class="skeleton-text w-20 h-8 rounded bg-gray-700"></div>
            <div class="skeleton-text w-16 h-8 rounded bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Default Text Skeleton -->
    <div v-else class="default-skeleton">
      <div v-for="i in count" :key="i" class="skeleton-text h-4 w-full rounded mb-2"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default'
  },
  count: {
    type: Number,
    default: 3
  }
})
</script>

<style scoped>
.skeleton-loader {
  @apply animate-pulse;
}

.skeleton-image {
  @apply bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%];
  animation: shimmer 1.5s infinite;
}

.skeleton-text {
  @apply bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%];
  animation: shimmer 1.5s infinite;
}

.manga-card-skeleton {
  @apply bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.featured-card-skeleton {
  @apply bg-white rounded-xl shadow-lg overflow-hidden;
}

.trending-card-skeleton {
  @apply relative bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 overflow-hidden;
}

.search-suggestion-skeleton {
  @apply bg-white border-b border-gray-100;
}

.chapter-list-skeleton {
  @apply bg-white;
}

.reading-page-skeleton {
  @apply bg-black;
}

.hero-skeleton {
  @apply mb-12;
}

.genre-grid-skeleton {
  @apply mb-12;
}

.mobile-reader-skeleton {
  @apply relative;
}

.genre-skeleton {
  @apply transform hover:scale-105 transition-transform duration-200;
}

/* Dark theme skeletons */
.dark .skeleton-image {
  @apply bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700;
}

.dark .skeleton-text {
  @apply bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700;
}

/* Shimmer animation */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .manga-card-skeleton {
    min-height: 320px;
  }
  
  .featured-card-skeleton {
    @apply h-40;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .skeleton-loader {
    @apply animate-none;
  }
  
  .skeleton-image,
  .skeleton-text {
    animation: none;
    @apply bg-gray-300;
  }
  
  .dark .skeleton-image,
  .dark .skeleton-text {
    @apply bg-gray-600;
  }
}
</style>
