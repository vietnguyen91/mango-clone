<template>
  <div class="manga-card group">
    <NuxtLink :to="`/manga/${manga.slug}`" class="block">
      <div class="manga-card-image-container relative overflow-hidden">
        <CustomImage
          :src="getImageUrl(manga.s3CoverUrl, manga.coverImage)"
          :alt="manga.title"
          container-class="manga-card-image-container"
          image-class="manga-card-image group-hover:scale-105 transition-transform duration-300"
          :quality="75"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div class="absolute top-2 right-2">
          <span v-if="manga.status === 'completed'" class="status-badge status-completed">
            Hoàn
          </span>
          <span v-else class="status-badge status-ongoing">
            Mới
          </span>
        </div>
        <div class="manga-card-overlay absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
      </div>
    </NuxtLink>
    
    <div class="manga-card-content">
      <NuxtLink :to="`/manga/${manga.slug}`" class="block mb-2">
        <h3 class="manga-card-title hover:text-primary-600 transition-colors" :title="manga.title">
          {{ manga.title }}
        </h3>
      </NuxtLink>

      <div class="manga-card-genres mb-2" v-if="manga.genres && manga.genres.length > 0">
        <span
          v-for="genre in manga.genres?.slice(0, 2)"
          :key="genre"
          class="genre-tag"
        >
          {{ genre }}
        </span>
        <span v-if="manga.genres.length > 2" class="genre-more">
          +{{ manga.genres.length - 2 }}
        </span>
      </div>
      
      <div class="manga-card-stats">
        <div class="stats-row">
          <span class="stat-item" v-if="manga.viewCount">
            <svg class="stat-icon" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
            </svg>
            {{ formatNumber(manga.viewCount) }}
          </span>
          
          <span class="stat-item" v-if="manga.likeCount">
            <svg class="stat-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
            </svg>
            {{ formatNumber(manga.likeCount) }}
          </span>
          
          <span class="stat-item" v-if="manga.chapterCount">
            <svg class="stat-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2H5v-2h10z" clip-rule="evenodd"/>
            </svg>
            {{ manga.chapterCount }}
          </span>
        </div>
        
        <div v-if="manga.rating" class="rating-container">
          <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <span class="text-sm font-medium">{{ manga.rating.toFixed(1) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  manga: {
    type: Object,
    required: true
  }
});

const config = useRuntimeConfig();

const getImageUrl = (s3Path, fallback) => {
  if (s3Path && s3Path.startsWith('/')) {
    return config.public.staticUrl + s3Path;
  }
  return s3Path || fallback || '/placeholder-manga.svg';
};

const formatNumber = (num) => {
  if (!num) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  return num.toString();
};
</script>