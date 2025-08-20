<template>
  <button
    @click="toggleBookmark"
    :disabled="loading"
    :class="[
      'bookmark-button group relative overflow-hidden transition-all duration-300',
      size === 'small' ? 'p-2' : 'px-4 py-2',
      variant === 'floating' 
        ? 'fixed bottom-20 right-4 z-40 rounded-full shadow-lg backdrop-blur-md' 
        : 'rounded-lg',
      isBookmarked 
        ? 'bg-red-500 hover:bg-red-600 text-white' 
        : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
      loading && 'opacity-50 cursor-not-allowed'
    ]"
  >
    <!-- Background Animation -->
    <div 
      v-if="isBookmarked"
      class="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
    ></div>

    <!-- Icon and Text -->
    <div class="relative flex items-center space-x-2">
      <!-- Heart Icon -->
      <div class="relative">
        <svg 
          :class="[
            'transition-all duration-300',
            size === 'small' ? 'w-5 h-5' : 'w-6 h-6',
            isBookmarked ? 'text-white scale-110' : 'text-gray-600 group-hover:text-red-500'
          ]"
          :fill="isBookmarked ? 'currentColor' : 'none'"
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>

        <!-- Loading Spinner -->
        <div 
          v-if="loading"
          class="absolute inset-0 flex items-center justify-center"
        >
          <div class="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
        </div>

        <!-- Success Animation -->
        <div 
          v-if="showSuccessAnimation"
          class="absolute inset-0 flex items-center justify-center"
        >
          <div class="animate-ping rounded-full h-6 w-6 bg-red-400 opacity-75"></div>
        </div>
      </div>

      <!-- Text (if not small) -->
      <span 
        v-if="size !== 'small'" 
        :class="[
          'font-medium transition-colors duration-300',
          size === 'large' ? 'text-base' : 'text-sm'
        ]"
      >
        {{ isBookmarked ? 'Đã yêu thích' : 'Yêu thích' }}
      </span>

      <!-- Count (if showing count) -->
      <span 
        v-if="showCount && bookmarkCount > 0"
        :class="[
          'px-2 py-1 rounded-full text-xs font-bold',
          isBookmarked 
            ? 'bg-white/20 text-white' 
            : 'bg-gray-100 text-gray-600'
        ]"
      >
        {{ formatCount(bookmarkCount) }}
      </span>
    </div>

    <!-- Tooltip -->
    <div 
      v-if="showTooltip"
      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
    >
      {{ isBookmarked ? 'Bỏ yêu thích' : 'Thêm vào yêu thích' }}
      <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  </button>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  manga: {
    type: Object,
    required: true
  },
  size: {
    type: String,
    default: 'medium', // 'small', 'medium', 'large'
    validator: value => ['small', 'medium', 'large'].includes(value)
  },
  variant: {
    type: String,
    default: 'default', // 'default', 'floating'
    validator: value => ['default', 'floating'].includes(value)
  },
  showCount: {
    type: Boolean,
    default: false
  },
  showTooltip: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['bookmarked', 'unbookmarked'])

// Use bookmarks composable
const { 
  bookmarks, 
  addBookmark, 
  removeBookmark, 
  isBookmarked: checkIsBookmarked,
  bookmarkCount 
} = useBookmarks()

// Local state
const loading = ref(false)
const showSuccessAnimation = ref(false)

// Computed
const isBookmarked = computed(() => checkIsBookmarked(props.manga._id))

// Methods
const toggleBookmark = async () => {
  if (loading.value) return

  loading.value = true
  
  try {
    if (isBookmarked.value) {
      await removeBookmark(props.manga._id)
      emit('unbookmarked', props.manga)
      
      // Show feedback
      showFeedback('Đã xóa khỏi yêu thích')
    } else {
      await addBookmark(props.manga)
      emit('bookmarked', props.manga)
      
      // Show success animation
      showSuccessAnimation.value = true
      setTimeout(() => {
        showSuccessAnimation.value = false
      }, 600)
      
      // Show feedback
      showFeedback('Đã thêm vào yêu thích')
    }
  } catch (error) {
    console.error('Bookmark toggle error:', error)
    showFeedback('Có lỗi xảy ra, vui lòng thử lại', 'error')
  } finally {
    loading.value = false
  }
}

const formatCount = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M'
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count.toString()
}

const showFeedback = (message, type = 'success') => {
  // Create toast notification
  const toast = document.createElement('div')
  toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-300 ${
    type === 'error' ? 'bg-red-500' : 'bg-green-500'
  }`
  toast.textContent = message
  
  document.body.appendChild(toast)
  
  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)'
    toast.style.opacity = '1'
  }, 100)
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)'
    toast.style.opacity = '0'
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}

// Watch for changes
watch(isBookmarked, (newValue) => {
  if (newValue) {
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }
})
</script>

<style scoped>
.bookmark-button {
  @apply relative;
}

/* Floating variant specific styles */
.bookmark-button.fixed {
  @apply bg-white/90 border border-gray-200;
  backdrop-filter: blur(10px);
}

.bookmark-button.fixed.bg-red-500 {
  @apply bg-red-500/90;
}

/* Hover effects */
.bookmark-button:hover {
  @apply transform scale-105;
}

.bookmark-button:active {
  @apply transform scale-95;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .bookmark-button.fixed {
    @apply bottom-24 right-4;
  }
}

/* Accessibility */
.bookmark-button:focus {
  @apply outline-none ring-2 ring-primary-500 ring-offset-2;
}

/* Animation for heart fill */
@keyframes heartFill {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.bookmark-button.bg-red-500 svg {
  animation: heartFill 0.3s ease-in-out;
}
</style>
