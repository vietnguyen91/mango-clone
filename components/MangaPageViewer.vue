<template>
  <div 
    :id="`page-${index + 1}`"
    class="manga-page-container relative"
    :class="{
      'mb-2': readingMode === 'vertical',
      'inline-block': readingMode === 'horizontal'
    }"
  >
    <!-- Page Number Indicator -->
    <div class="page-indicator text-center py-3">
      <div class="inline-flex items-center space-x-2 px-3 py-1 bg-gray-800/60 backdrop-blur-sm rounded-full text-xs text-gray-300">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2H5v-2h10z" clip-rule="evenodd"/>
        </svg>
        <span>{{ index + 1 }} / {{ total }}</span>
      </div>
    </div>

    <!-- Image Container -->
    <div class="manga-image-container relative">
      <!-- Loading Skeleton -->
      <div
        v-if="!imageLoaded && !imageError"
        class="loading-skeleton bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-shimmer flex items-center justify-center"
        :class="getImageContainerClass()"
      >
        <div class="text-center text-gray-400">
          <div class="relative">
            <svg class="w-12 h-12 mx-auto mb-2 opacity-50 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"/>
            </svg>
            <!-- Loading dots -->
            <div class="flex justify-center space-x-1 mt-1">
              <div class="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
              <div class="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
              <div class="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
            </div>
          </div>
          <div class="text-xs mt-2">Đang tải trang {{ index + 1 }}...</div>
        </div>
      </div>

      <!-- Error State -->
      <div 
        v-else-if="imageError"
        class="error-container bg-gray-800 border border-gray-700 flex items-center justify-center"
        :class="getImageContainerClass()"
      >
        <div class="text-center text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div class="text-sm mb-2">Không thể tải ảnh</div>
          <button 
            @click="retryLoad"
            class="text-xs px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>

      <!-- Actual Image -->
      <div v-else class="relative">
        <img
          ref="imageRef"
          :src="getImageUrl(image.s3Url, image.originalUrl)"
          :alt="`${mangaTitle} - Chapter ${chapterNumber} - Page ${index + 1}`"
          :class="getImageClass()"
          @load="onImageLoad"
          @error="onImageError"
          @click="toggleZoom"
        />
        
        <!-- Zoom Indicator -->
        <div 
          v-if="canZoom"
          class="zoom-indicator absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
          </svg>
        </div>

        <!-- Image Actions -->
        <div class="image-actions absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            @click="downloadImage"
            class="action-btn bg-black/60 backdrop-blur-sm rounded-lg p-2 text-white hover:bg-black/80 transition-colors"
            title="Tải xuống"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Zoom Modal -->
    <div
      v-if="isZoomed"
      class="zoom-modal fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      @click="closeZoom"
    >
      <img
        :src="getImageUrl(image.s3Url, image.originalUrl)"
        :alt="`${mangaTitle} - Chapter ${chapterNumber} - Page ${index + 1}`"
        class="max-w-full max-h-full object-contain cursor-zoom-out"
        @click="closeZoom"
      />
      <button
        @click="closeZoom"
        class="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-2 text-white hover:bg-black/80 transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  image: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  mangaTitle: {
    type: String,
    default: ''
  },
  chapterNumber: {
    type: [String, Number],
    default: ''
  },
  readingMode: {
    type: String,
    default: 'vertical'
  },
  imageFit: {
    type: String,
    default: 'width'
  }
});

const emit = defineEmits(['image-loaded', 'image-error', 'image-viewed']);

// Refs
const imageRef = ref(null);
const imageLoaded = ref(false);
const imageError = ref(false);
const isZoomed = ref(false);
const canZoom = ref(false);

const config = useRuntimeConfig();

// Methods
const getImageUrl = (s3Path, fallback) => {
  if (s3Path && s3Path.startsWith('/')) {
    return config.public.staticUrl + s3Path;
  }
  return s3Path || fallback || '/placeholder-page.jpg';
};

const getImageContainerClass = () => {
  return [
    'mx-auto rounded-lg overflow-hidden',
    {
      'min-h-[400px]': true,
      'max-w-full': props.imageFit === 'width',
      'max-h-screen': props.imageFit === 'height',
      'w-auto': props.imageFit === 'original'
    }
  ];
};

const getImageClass = () => {
  return [
    'manga-page-image block mx-auto transition-all duration-300 cursor-pointer group',
    {
      'max-w-full h-auto': props.imageFit === 'width',
      'w-auto max-h-screen': props.imageFit === 'height',
      'w-auto h-auto': props.imageFit === 'original'
    }
  ];
};

const onImageLoad = () => {
  imageLoaded.value = true;
  imageError.value = false;
  
  // Check if image can be zoomed
  nextTick(() => {
    if (imageRef.value) {
      const img = imageRef.value;
      canZoom.value = img.naturalWidth > img.clientWidth || img.naturalHeight > img.clientHeight;
    }
  });
  
  emit('image-loaded', props.index);
  
  // Trigger viewed event when image comes into viewport
  nextTick(() => {
    observeImageView();
  });
};

const onImageError = () => {
  imageError.value = true;
  imageLoaded.value = false;
  emit('image-error', props.index);
};

const retryLoad = () => {
  imageError.value = false;
  imageLoaded.value = false;
  
  // Force reload by changing src
  nextTick(() => {
    if (imageRef.value) {
      const currentSrc = imageRef.value.src;
      imageRef.value.src = '';
      setTimeout(() => {
        imageRef.value.src = currentSrc;
      }, 100);
    }
  });
};

const toggleZoom = () => {
  if (canZoom.value) {
    isZoomed.value = !isZoomed.value;
  }
};

const closeZoom = () => {
  isZoomed.value = false;
};

const downloadImage = async () => {
  try {
    const imageUrl = getImageUrl(props.image.s3Url, props.image.originalUrl);
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${props.mangaTitle}_Chapter_${props.chapterNumber}_Page_${props.index + 1}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download image:', error);
  }
};

// Intersection Observer for lazy loading and view tracking
const observeImageView = () => {
  if (typeof window === 'undefined') return;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          emit('image-viewed', props.index);
        }
      });
    },
    {
      threshold: 0.5
    }
  );

  const element = document.getElementById(`page-${props.index + 1}`);
  if (element) {
    observer.observe(element);
  }
};

// Load image when component comes into viewport
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !imageLoaded.value && !imageError.value) {
          // Start loading the image
          const img = new Image();
          img.onload = onImageLoad;
          img.onerror = onImageError;
          img.src = getImageUrl(props.image.s3Url, props.image.originalUrl);
        }
      });
    },
    {
      rootMargin: '300px' // Load images 300px before they enter viewport for better UX
    }
  );

  const element = document.getElementById(`page-${props.index + 1}`);
  if (element) {
    observer.observe(element);
  }

  // Preload first 3 images immediately for better initial experience
  if (props.index < 3) {
    const img = new Image();
    img.onload = onImageLoad;
    img.onerror = onImageError;
    img.src = getImageUrl(props.image.s3Url, props.image.originalUrl);
  }
});
</script>

<style scoped>
.manga-page-container {
  scroll-margin-top: 100px;
}

.manga-page-image {
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}

.manga-page-image:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
}

.loading-skeleton {
  aspect-ratio: 2/3;
}

/* Shimmer animation for loading skeleton */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite linear;
}

.error-container {
  aspect-ratio: 2/3;
}

.zoom-modal {
  backdrop-filter: blur(4px);
}

.action-btn {
  backdrop-filter: blur(8px);
}

.page-indicator {
  position: sticky;
  top: 60px;
  z-index: 10;
}

@media (max-width: 768px) {
  .page-indicator {
    top: 50px;
  }
}
</style>