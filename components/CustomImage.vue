<template>
  <div 
    ref="containerRef"
    class="lazy-image-container relative overflow-hidden"
    :class="containerClass"
  >
    <!-- Skeleton/Loading State -->
    <div 
      v-if="!loaded && !error"
      class="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"
      :class="{ 'from-gray-700 via-gray-600 to-gray-700': isDark }"
    >
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <div class="text-xs text-gray-500">Đang tải...</div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div 
      v-if="error"
      class="absolute inset-0 bg-gray-100 flex items-center justify-center"
      :class="{ 'bg-gray-800': isDark }"
    >
      <div class="text-center p-4">
        <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div class="text-xs text-gray-500 mb-2">Lỗi tải ảnh</div>
        <button 
          @click="retry"
          class="text-xs bg-primary-600 text-white px-2 py-1 rounded hover:bg-primary-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    </div>

    <!-- Actual Image -->
    <img
      v-if="shouldLoad"
      ref="imageRef"
      :src="optimizedSrc"
      :alt="alt"
      :class="[
        'transition-opacity duration-300',
        imageClass,
        { 'opacity-0': !loaded, 'opacity-100': loaded }
      ]"
      @load="onLoad"
      @error="onError"
      :loading="eager ? 'eager' : 'lazy'"
    />

    <!-- Progressive Enhancement: WebP with fallback -->
    <picture v-if="shouldLoad && supportsWebP">
      <source :srcset="webpSrc" type="image/webp">
      <img
        ref="imageRef"
        :src="optimizedSrc"
        :alt="alt"
        :class="[
          'transition-opacity duration-300',
          imageClass,
          { 'opacity-0': !loaded, 'opacity-100': loaded }
        ]"
        @load="onLoad"
        @error="onError"
        :loading="eager ? 'eager' : 'lazy'"
      />
    </picture>

    <!-- Loading Progress (for large images) -->
    <div 
      v-if="showProgress && loading && !loaded"
      class="absolute bottom-2 left-2 right-2"
    >
      <div class="bg-black/50 rounded-full p-2 backdrop-blur-sm">
        <div class="flex items-center space-x-2 text-white text-xs">
          <div class="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"></div>
          <span>{{ loadingProgress }}%</span>
        </div>
      </div>
    </div>

    <!-- Vietnamese Network Optimization Indicator -->
    <div 
      v-if="showNetworkInfo && isSlowNetwork"
      class="absolute top-2 right-2 bg-orange-500/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm"
    >
      Mạng chậm
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  eager: {
    type: Boolean,
    default: false
  },
  containerClass: {
    type: String,
    default: ''
  },
  imageClass: {
    type: String,
    default: 'w-full h-full object-cover'
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  showNetworkInfo: {
    type: Boolean,
    default: true
  },
  quality: {
    type: Number,
    default: 80
  },
  sizes: {
    type: String,
    default: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
  }
})

const emit = defineEmits(['load', 'error', 'retry'])

// Refs
const containerRef = ref(null)
const imageRef = ref(null)
const loaded = ref(false)
const error = ref(false)
const loading = ref(false)
const loadingProgress = ref(0)
const shouldLoad = ref(false)
const retryCount = ref(0)
const maxRetries = 3

// Network detection
const isSlowNetwork = ref(false)
const supportsWebP = ref(false)
const isDark = ref(false)

// Intersection Observer for lazy loading
let observer = null

// Computed
const config = useRuntimeConfig()

const optimizedSrc = computed(() => {
  if (!props.src) return ''
  
  // If it's already an optimized URL, return as is
  if (props.src.includes('?')) return props.src
  
  // Add optimization parameters for Vietnamese mobile networks
  const params = new URLSearchParams({
    q: isSlowNetwork.value ? Math.min(props.quality - 20, 60) : props.quality,
    f: 'auto',
    w: getOptimalWidth(),
    ...(isSlowNetwork.value && { blur: '2' }) // Slight blur for faster loading on slow networks
  })
  
  return `${props.src}?${params.toString()}`
})

const webpSrc = computed(() => {
  if (!supportsWebP.value || !props.src) return ''
  
  const params = new URLSearchParams({
    q: isSlowNetwork.value ? Math.min(props.quality - 20, 60) : props.quality,
    f: 'webp',
    w: getOptimalWidth()
  })
  
  return `${props.src}?${params.toString()}`
})

// Methods
const getOptimalWidth = () => {
  if (typeof window === 'undefined') return 800
  
  const screenWidth = window.innerWidth
  const devicePixelRatio = window.devicePixelRatio || 1
  
  // Optimize for Vietnamese mobile devices (common screen sizes)
  if (screenWidth <= 375) return Math.round(375 * devicePixelRatio) // iPhone SE, small Android
  if (screenWidth <= 414) return Math.round(414 * devicePixelRatio) // iPhone 6/7/8 Plus
  if (screenWidth <= 768) return Math.round(768 * devicePixelRatio) // Tablets
  
  return Math.round(Math.min(screenWidth * devicePixelRatio, 1920))
}

const detectNetworkSpeed = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection
    const slowTypes = ['slow-2g', '2g', '3g']
    isSlowNetwork.value = slowTypes.includes(connection.effectiveType) || connection.downlink < 1.5
  }
}

const detectWebPSupport = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  supportsWebP.value = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

const detectDarkMode = () => {
  isDark.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

const setupIntersectionObserver = () => {
  if (!containerRef.value || props.eager) {
    shouldLoad.value = true
    return
  }

  const options = {
    root: null,
    rootMargin: '50px', // Start loading 50px before entering viewport
    threshold: 0.1
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        shouldLoad.value = true
        observer?.unobserve(entry.target)
      }
    })
  }, options)

  observer.observe(containerRef.value)
}

const onLoad = () => {
  loaded.value = true
  loading.value = false
  error.value = false
  loadingProgress.value = 100
  emit('load')
}

const onError = () => {
  loading.value = false
  
  if (retryCount.value < maxRetries) {
    // Auto-retry with exponential backoff
    setTimeout(() => {
      retry()
    }, Math.pow(2, retryCount.value) * 1000)
  } else {
    error.value = true
    emit('error')
  }
}

const retry = () => {
  if (retryCount.value >= maxRetries) return
  
  retryCount.value++
  error.value = false
  loaded.value = false
  loading.value = true
  loadingProgress.value = 0
  
  // Force reload by changing src slightly
  if (imageRef.value) {
    const currentSrc = imageRef.value.src
    imageRef.value.src = ''
    setTimeout(() => {
      imageRef.value.src = currentSrc + (currentSrc.includes('?') ? '&' : '?') + 'retry=' + retryCount.value
    }, 100)
  }
  
  emit('retry', retryCount.value)
}

// Simulate loading progress for better UX
const simulateProgress = () => {
  if (!loading.value) return
  
  const interval = setInterval(() => {
    if (loaded.value || error.value) {
      clearInterval(interval)
      return
    }
    
    loadingProgress.value = Math.min(loadingProgress.value + Math.random() * 15, 90)
  }, 200)
}

// Watch for src changes
watch(() => props.src, () => {
  loaded.value = false
  error.value = false
  retryCount.value = 0
  
  if (shouldLoad.value) {
    loading.value = true
    loadingProgress.value = 0
    simulateProgress()
  }
})

// Lifecycle
onMounted(() => {
  detectNetworkSpeed()
  detectWebPSupport()
  detectDarkMode()
  setupIntersectionObserver()
  
  if (props.eager) {
    loading.value = true
    simulateProgress()
  }
  
  // Listen for network changes
  if ('connection' in navigator) {
    navigator.connection.addEventListener('change', detectNetworkSpeed)
  }
  
  // Listen for dark mode changes
  if (window.matchMedia) {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    darkModeQuery.addEventListener('change', detectDarkMode)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
  
  if ('connection' in navigator) {
    navigator.connection.removeEventListener('change', detectNetworkSpeed)
  }
})
</script>

<style scoped>
.lazy-image-container {
  @apply relative overflow-hidden;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}

/* Optimize for Vietnamese mobile networks */
@media (max-width: 640px) and (max-resolution: 2dppx) {
  .lazy-image-container img {
    image-rendering: optimizeQuality;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .animate-shimmer {
    animation: none;
  }
  
  .transition-opacity {
    transition: none;
  }
}
</style>
