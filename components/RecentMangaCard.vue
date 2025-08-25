<template>
  <div class="recent-manga-card group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200">
    <!-- Remove Button -->
    <button
      @click.prevent="$emit('remove', manga.mangaId)"
      class="absolute top-2 right-2 z-10 w-6 h-6 bg-black/60 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 touch-manipulation"
      title="Xóa khỏi lịch sử"
    >
      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>

    <!-- Manga Link -->
    <NuxtLink
      :to="`/manga/${manga.slug}`"
      class="block h-full"
    >
      <!-- Cover Image Container -->
      <div class="relative aspect-[3/4] overflow-hidden">
        <NuxtImg
          :src="getImageUrl(manga.coverImage)"
          :alt="manga.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          :placeholder="[40, 53, 75, 10]"
        />
        
        <!-- Reading Progress Overlay -->
        <div v-if="manga.readingProgress > 0" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <div class="w-full bg-gray-300 rounded-full h-1.5 mb-1">
            <div 
              class="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
              :style="{ width: `${manga.readingProgress}%` }"
            ></div>
          </div>
          <div class="text-xs text-white font-medium">
            {{ manga.readingProgress }}% hoàn thành
          </div>
        </div>

        <!-- New Badge -->
        <div v-if="isNewlyAdded" class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
          Mới
        </div>
      </div>

      <!-- Manga Info -->
      <div class="p-3">
        <!-- Title -->
        <h3 class="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
          {{ manga.title }}
        </h3>

        <!-- Last Read Info -->
        <div class="space-y-1">
          <div v-if="manga.lastReadChapter" class="text-xs text-gray-600">
            <span class="font-medium">Chapter {{ manga.lastReadChapter }}</span>
            <span v-if="manga.lastReadChapterTitle" class="block truncate">
              {{ manga.lastReadChapterTitle }}
            </span>
          </div>
          
          <!-- Last Read Time -->
          <div class="text-xs text-gray-500 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ formatTimeAgo(manga.lastReadAt) }}
          </div>
        </div>

        <!-- Continue Reading Button -->
        <div class="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <NuxtLink
            v-if="manga.lastReadChapter"
            :to="getNextChapterUrl()"
            class="inline-flex items-center text-xs text-primary-600 hover:text-primary-700 font-medium"
            @click.stop
          >
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10v18a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h8l4 4z"/>
            </svg>
            Tiếp tục đọc
          </NuxtLink>
          <div v-else class="text-xs text-gray-500">
            Chưa đọc chapter nào
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { RecentManga } from '~/stores/recentlyViewed'

interface Props {
  manga: RecentManga
}

const props = defineProps<Props>()

// Emits
defineEmits<{
  remove: [mangaId: string]
}>()

// Computed
const isNewlyAdded = computed(() => {
  const addedTime = new Date(props.manga.lastReadAt)
  const now = new Date()
  const diffHours = (now.getTime() - addedTime.getTime()) / (1000 * 60 * 60)
  return diffHours < 24 // Consider "new" if added within 24 hours
})

// Methods
const getImageUrl = (coverImage: string) => {
  if (!coverImage) return '/images/placeholder-manga.jpg'
  if (coverImage.startsWith('http')) return coverImage
  return `/images/manga/${coverImage}`
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) {
    return diffMins <= 1 ? 'Vừa xong' : `${diffMins} phút trước`
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`
  } else {
    return date.toLocaleDateString('vi-VN')
  }
}

const getNextChapterUrl = () => {
  if (!props.manga.lastReadChapter) return `/manga/${props.manga.slug}`
  
  // Try to continue from next chapter, or current chapter if it's the last one read
  const nextChapter = props.manga.lastReadChapter + 1
  return `/read/${props.manga.slug}_${props.manga.lastReadChapter}`
}
</script>

<style scoped>
.recent-manga-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.recent-manga-card:hover {
  transform: translateY(-2px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Progress bar animation */
.bg-primary-500 {
  transition: width 0.5s ease-in-out;
}

/* Smooth image loading */
img {
  transition: opacity 0.3s ease-in-out;
}

/* Touch optimization for mobile */
@media (max-width: 768px) {
  .recent-manga-card .opacity-0 {
    opacity: 1; /* Always show continue button on mobile */
  }
  
  .recent-manga-card .group-hover\:opacity-100 {
    opacity: 1;
  }
}
</style>
