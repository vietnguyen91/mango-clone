<template>
  <div class="featured-manga-card group">
    <NuxtLink :to="`/manga/${manga.slug}`" class="block">
      <div class="relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
        <!-- Cover Image -->
        <div class="relative h-48 md:h-56 overflow-hidden">
          <NuxtImg
            :src="getImageUrl(manga.s3CoverUrl, manga.coverImage)"
            :alt="manga.title"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          <!-- Status Badge -->
          <div class="absolute top-3 right-3">
            <span 
              :class="[
                'px-3 py-1 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm',
                manga.status === 'completed' 
                  ? 'bg-green-500/90 text-white' 
                  : 'bg-blue-500/90 text-white'
              ]"
            >
              {{ manga.status === 'completed' ? 'Hoàn thành' : 'Đang cập nhật' }}
            </span>
          </div>
          
          <!-- Rating -->
          <div v-if="manga.rating" class="absolute top-3 left-3">
            <div class="flex items-center bg-yellow-500/90 text-white px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              {{ manga.rating.toFixed(1) }}
            </div>
          </div>
          
          <!-- Content Overlay -->
          <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 class="font-bold text-lg md:text-xl mb-2 line-clamp-2 leading-tight">
              {{ manga.title }}
            </h3>
            
            <!-- Genres -->
            <div class="flex flex-wrap gap-1 mb-3">
              <span 
                v-for="genre in manga.genres?.slice(0, 3)" 
                :key="genre"
                class="px-2 py-1 bg-white/20 backdrop-blur-sm text-xs rounded-md font-medium"
              >
                {{ genre }}
              </span>
              <span 
                v-if="manga.genres?.length > 3"
                class="px-2 py-1 bg-white/20 backdrop-blur-sm text-xs rounded-md font-medium"
              >
                +{{ manga.genres.length - 3 }}
              </span>
            </div>
            
            <!-- Stats -->
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  {{ formatNumber(manga.viewCount || 0) }}
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                  {{ manga.totalChapters || 0 }} chương
                </div>
              </div>
              
              <!-- Latest Chapter -->
              <div v-if="manga.latestChapter" class="text-xs bg-primary-500/80 px-2 py-1 rounded-md backdrop-blur-sm">
                Ch.{{ manga.latestChapter }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quick Action Buttons (Mobile) -->
        <div class="md:hidden absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
          <div class="flex gap-3">
            <button class="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium text-sm">
              Đọc ngay
            </button>
            <button class="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium text-sm">
              Theo dõi
            </button>
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
const props = defineProps({
  manga: {
    type: Object,
    required: true
  }
})

const config = useRuntimeConfig()

// Get image URL
const getImageUrl = (s3Path, fallback) => {
  if (s3Path && s3Path.startsWith('/')) {
    return config.public.staticUrl + s3Path
  }
  return s3Path || fallback || '/placeholder-manga.svg'
}

// Format numbers
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
</script>

<style scoped>
.featured-manga-card {
  @apply relative;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom hover effects */
.featured-manga-card:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.featured-manga-card:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .featured-manga-card {
    @apply w-full;
  }
}
</style>
