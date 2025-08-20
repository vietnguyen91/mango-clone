<template>
  <div class="mobile-reader bg-black min-h-screen relative" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
    <!-- Mobile Header -->
    <div 
      v-show="showUI" 
      class="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md text-white transition-all duration-300"
      :class="{ 'translate-y-0': showUI, '-translate-y-full': !showUI }"
    >
      <div class="flex items-center justify-between px-4 py-3">
        <!-- Back Button -->
        <button @click="goBack" class="flex items-center space-x-2 text-gray-300 hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span class="text-sm">Quay lại</span>
        </button>
        
        <!-- Chapter Info -->
        <div class="text-center flex-1 mx-4">
          <div class="text-sm font-medium truncate">{{ mangaTitle }}</div>
          <div class="text-xs text-gray-400">Chương {{ chapterNumber }}</div>
        </div>
        
        <!-- Settings Button -->
        <button @click="toggleSettings" class="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </button>
      </div>
      
      <!-- Progress Bar -->
      <div class="px-4 pb-3">
        <div class="flex items-center space-x-3">
          <span class="text-xs text-gray-400">{{ currentPage }}</span>
          <div class="flex-1 bg-gray-700 rounded-full h-1">
            <div 
              class="bg-primary-500 h-1 rounded-full transition-all duration-300"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
          <span class="text-xs text-gray-400">{{ totalPages }}</span>
        </div>
      </div>
    </div>

    <!-- Reading Area -->
    <div class="reading-area" :class="{ 'pt-20': showUI }">
      <div 
        v-for="(image, index) in images" 
        :key="image._id || index"
        class="page-container"
        :data-page="index + 1"
      >
        <div class="relative">
          <!-- Loading State -->
          <div 
            v-if="!loadedImages.has(index)" 
            class="flex items-center justify-center h-screen bg-gray-900"
          >
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <div class="text-gray-400 text-sm">Đang tải trang {{ index + 1 }}...</div>
            </div>
          </div>
          
          <!-- Image -->
          <img
            :src="getImageUrl(image)"
            :alt="`Trang ${index + 1}`"
            class="w-full h-auto block"
            :class="{ 'opacity-0': !loadedImages.has(index) }"
            @load="onImageLoad(index)"
            @error="onImageError(index)"
            loading="lazy"
          />
          
          <!-- Touch Zones -->
          <div class="absolute inset-0 flex">
            <!-- Previous Page Zone -->
            <div 
              class="w-1/3 h-full flex items-center justify-start pl-4"
              @click="previousPage"
            >
              <div v-if="showTouchHints" class="touch-hint bg-black/50 rounded-full p-3">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </div>
            </div>
            
            <!-- Menu Zone -->
            <div 
              class="w-1/3 h-full flex items-center justify-center"
              @click="toggleUI"
            >
              <div v-if="showTouchHints" class="touch-hint bg-black/50 rounded-full p-3">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </div>
            </div>
            
            <!-- Next Page Zone -->
            <div 
              class="w-1/3 h-full flex items-center justify-end pr-4"
              @click="nextPage"
            >
              <div v-if="showTouchHints" class="touch-hint bg-black/50 rounded-full p-3">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div 
      v-show="showUI" 
      class="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md text-white transition-all duration-300"
      :class="{ 'translate-y-0': showUI, 'translate-y-full': !showUI }"
    >
      <div class="flex items-center justify-between px-4 py-3">
        <!-- Previous Chapter -->
        <button 
          v-if="navigation?.previous"
          @click="goToPreviousChapter"
          class="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span class="text-sm">Ch.{{ navigation.previous.chapterNumber }}</span>
        </button>
        
        <!-- Chapter List -->
        <button 
          @click="showChapterList = true"
          class="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
          </svg>
          <span class="text-sm">Danh sách</span>
        </button>
        
        <!-- Next Chapter -->
        <button 
          v-if="navigation?.next"
          @click="goToNextChapter"
          class="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          <span class="text-sm">Ch.{{ navigation.next.chapterNumber }}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Settings Panel -->
    <MobileReaderSettings 
      v-if="showSettings"
      :reading-mode="readingMode"
      :image-fit="imageFit"
      :brightness="brightness"
      @update-settings="updateSettings"
      @close="showSettings = false"
    />

    <!-- Chapter List Modal -->
    <MobileChapterList
      v-if="showChapterList"
      :chapters="chapters"
      :current-chapter="chapterNumber"
      @select-chapter="selectChapter"
      @close="showChapterList = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: Array,
  mangaTitle: String,
  chapterNumber: [String, Number],
  navigation: Object,
  chapters: Array
})

const emit = defineEmits(['go-back', 'change-chapter', 'update-progress'])

// Reactive state
const showUI = ref(true)
const showSettings = ref(false)
const showChapterList = ref(false)
const showTouchHints = ref(true)
const currentPage = ref(1)
const loadedImages = ref(new Set())
const readingMode = ref('vertical')
const imageFit = ref('width')
const brightness = ref(100)

// Touch handling
const touchStartY = ref(0)
const touchStartTime = ref(0)

// Computed
const totalPages = computed(() => props.images?.length || 0)
const progressPercentage = computed(() => {
  if (totalPages.value === 0) return 0
  return (currentPage.value / totalPages.value) * 100
})

// Methods
const config = useRuntimeConfig()

const getImageUrl = (image) => {
  if (image.s3Path && image.s3Path.startsWith('/')) {
    return config.public.staticUrl + image.s3Path
  }
  return image.s3Path || image.url || '/placeholder-page.svg'
}

const onImageLoad = (index) => {
  loadedImages.value.add(index)
}

const onImageError = (index) => {
  console.error(`Failed to load image at index ${index}`)
}

const toggleUI = () => {
  showUI.value = !showUI.value
}

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    updateProgress()
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    updateProgress()
  }
}

const updateProgress = () => {
  emit('update-progress', {
    page: currentPage.value,
    total: totalPages.value,
    percentage: progressPercentage.value
  })
}

const goBack = () => {
  emit('go-back')
}

const goToPreviousChapter = () => {
  if (props.navigation?.previous) {
    emit('change-chapter', props.navigation.previous.chapterId)
  }
}

const goToNextChapter = () => {
  if (props.navigation?.next) {
    emit('change-chapter', props.navigation.next.chapterId)
  }
}

const selectChapter = (chapterId) => {
  showChapterList.value = false
  emit('change-chapter', chapterId)
}

const updateSettings = (settings) => {
  readingMode.value = settings.readingMode
  imageFit.value = settings.imageFit
  brightness.value = settings.brightness
}

// Touch handling
const handleTouchStart = (e) => {
  touchStartY.value = e.touches[0].clientY
  touchStartTime.value = Date.now()
}

const handleTouchEnd = (e) => {
  const touchEndY = e.changedTouches[0].clientY
  const touchDuration = Date.now() - touchStartTime.value
  const touchDistance = Math.abs(touchEndY - touchStartY.value)
  
  // Hide touch hints after first interaction
  if (showTouchHints.value) {
    showTouchHints.value = false
  }
  
  // Swipe gestures
  if (touchDuration < 300 && touchDistance > 50) {
    if (touchStartY.value > touchEndY + 50) {
      // Swipe up - show UI
      showUI.value = true
    } else if (touchStartY.value < touchEndY - 50) {
      // Swipe down - hide UI
      showUI.value = false
    }
  }
}

// Auto-hide UI after 3 seconds
let uiTimeout
const resetUITimeout = () => {
  clearTimeout(uiTimeout)
  uiTimeout = setTimeout(() => {
    showUI.value = false
  }, 3000)
}

// Lifecycle
onMounted(() => {
  // Hide touch hints after 5 seconds
  setTimeout(() => {
    showTouchHints.value = false
  }, 5000)
  
  resetUITimeout()
})

onUnmounted(() => {
  clearTimeout(uiTimeout)
})
</script>

<style scoped>
.mobile-reader {
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.touch-hint {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.page-container {
  scroll-snap-align: start;
}

/* Prevent image dragging */
img {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}
</style>
