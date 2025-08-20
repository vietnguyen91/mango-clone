<template>
  <div class="rating-system bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-gray-900 flex items-center">
        <span class="mr-2">⭐</span>
        Đánh giá truyện
      </h3>
      
      <!-- Overall Rating Display -->
      <div class="text-right">
        <div class="flex items-center space-x-2">
          <div class="flex items-center">
            <svg 
              v-for="i in 5" 
              :key="i"
              :class="[
                'w-5 h-5',
                i <= Math.floor(overallRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
              ]"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <span class="text-2xl font-bold text-gray-900">{{ overallRating.toFixed(1) }}</span>
          <span class="text-sm text-gray-500">({{ totalRatings }} đánh giá)</span>
        </div>
      </div>
    </div>

    <!-- Rating Breakdown -->
    <div class="mb-8">
      <h4 class="font-semibold text-gray-900 mb-4">Phân tích đánh giá</h4>
      <div class="space-y-3">
        <div 
          v-for="(count, rating) in ratingBreakdown" 
          :key="rating"
          class="flex items-center space-x-3"
        >
          <span class="text-sm font-medium text-gray-700 w-8">{{ rating }}⭐</span>
          <div class="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              class="bg-yellow-400 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${getRatingPercentage(rating)}%` }"
            ></div>
          </div>
          <span class="text-sm text-gray-600 w-12 text-right">{{ count }}</span>
        </div>
      </div>
    </div>

    <!-- User Rating Form -->
    <div v-if="user && !userRating" class="mb-8 p-4 bg-gray-50 rounded-lg">
      <h4 class="font-semibold text-gray-900 mb-4">Đánh giá của bạn</h4>
      
      <!-- Star Rating Input -->
      <div class="flex items-center space-x-2 mb-4">
        <span class="text-sm text-gray-700">Chọn số sao:</span>
        <div class="flex items-center space-x-1">
          <button
            v-for="i in 5"
            :key="i"
            @click="setUserRating(i)"
            @mouseover="hoverRating = i"
            @mouseleave="hoverRating = 0"
            class="transition-colors duration-150"
          >
            <svg 
              :class="[
                'w-8 h-8',
                (hoverRating >= i || selectedRating >= i) 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300 hover:text-yellow-300'
              ]"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </button>
        </div>
        <span v-if="selectedRating > 0" class="text-sm font-medium text-gray-700">
          {{ getRatingText(selectedRating) }}
        </span>
      </div>

      <!-- Rating Categories (Vietnamese specific) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div v-for="category in ratingCategories" :key="category.key" class="text-center">
          <label class="block text-xs font-medium text-gray-700 mb-2">{{ category.label }}</label>
          <div class="flex justify-center space-x-1">
            <button
              v-for="i in 5"
              :key="i"
              @click="setCategoryRating(category.key, i)"
              class="transition-colors duration-150"
            >
              <svg 
                :class="[
                  'w-4 h-4',
                  (categoryRatings[category.key] >= i) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300 hover:text-yellow-300'
                ]"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Review Text -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Nhận xét (tùy chọn)
        </label>
        <textarea
          v-model="reviewText"
          placeholder="Chia sẻ cảm nhận của bạn về bộ truyện này..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          rows="3"
          maxlength="500"
        ></textarea>
        <div class="text-right text-xs text-gray-500 mt-1">
          {{ reviewText.length }}/500
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <button
          @click="submitRating"
          :disabled="selectedRating === 0 || submitting"
          class="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ submitting ? 'Đang gửi...' : 'Gửi đánh giá' }}
        </button>
      </div>
    </div>

    <!-- User's Existing Rating -->
    <div v-else-if="user && userRating" class="mb-8 p-4 bg-primary-50 rounded-lg border border-primary-200">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="font-semibold text-primary-900 mb-2">Đánh giá của bạn</h4>
          <div class="flex items-center space-x-2">
            <div class="flex items-center">
              <svg 
                v-for="i in 5" 
                :key="i"
                :class="[
                  'w-5 h-5',
                  i <= userRating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                ]"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <span class="font-medium text-primary-900">{{ userRating.rating }}/5</span>
          </div>
          <p v-if="userRating.review" class="text-sm text-primary-800 mt-2">
            "{{ userRating.review }}"
          </p>
        </div>
        
        <button
          @click="editRating"
          class="px-4 py-2 bg-white text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium"
        >
          Chỉnh sửa
        </button>
      </div>
    </div>

    <!-- Login Prompt -->
    <div v-else class="mb-8 p-4 bg-gray-50 rounded-lg text-center">
      <p class="text-gray-600 mb-3">Đăng nhập để đánh giá truyện</p>
      <button
        @click="$emit('show-login')"
        class="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
      >
        Đăng nhập
      </button>
    </div>

    <!-- Recent Reviews -->
    <div v-if="recentReviews.length > 0">
      <h4 class="font-semibold text-gray-900 mb-4 flex items-center">
        <span class="mr-2">📝</span>
        Nhận xét gần đây
      </h4>
      <div class="space-y-4">
        <div 
          v-for="review in recentReviews.slice(0, 3)" 
          :key="review._id"
          class="p-4 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-3">
              <img
                :src="review.user?.avatar || '/default-avatar.svg'"
                :alt="review.user?.name"
                class="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <h5 class="font-medium text-gray-900 text-sm">{{ review.user?.name }}</h5>
                <div class="flex items-center space-x-1">
                  <div class="flex items-center">
                    <svg 
                      v-for="i in 5" 
                      :key="i"
                      :class="[
                        'w-3 h-3',
                        i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      ]"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <span class="text-xs text-gray-500">{{ formatTimeAgo(review.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <p v-if="review.review" class="text-sm text-gray-700 leading-relaxed">
            {{ review.review }}
          </p>
        </div>
      </div>
      
      <div v-if="totalReviews > 3" class="mt-4 text-center">
        <button
          @click="$emit('show-all-reviews')"
          class="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          Xem tất cả {{ totalReviews }} nhận xét
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'

const props = defineProps({
  mangaId: {
    type: String,
    required: true
  },
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['show-login', 'show-all-reviews', 'rating-updated'])

// State
const ratings = ref([])
const userRating = ref(null)
const selectedRating = ref(0)
const hoverRating = ref(0)
const reviewText = ref('')
const submitting = ref(false)
const loading = ref(false)

// Category ratings for Vietnamese users
const categoryRatings = reactive({
  story: 0,      // Cốt truyện
  art: 0,        // Hình ảnh
  character: 0,  // Nhân vật
  translation: 0 // Bản dịch
})

const ratingCategories = [
  { key: 'story', label: 'Cốt truyện' },
  { key: 'art', label: 'Hình ảnh' },
  { key: 'character', label: 'Nhân vật' },
  { key: 'translation', label: 'Bản dịch' }
]

// Computed
const overallRating = computed(() => {
  if (ratings.value.length === 0) return 0
  const sum = ratings.value.reduce((acc, rating) => acc + rating.rating, 0)
  return sum / ratings.value.length
})

const totalRatings = computed(() => ratings.value.length)

const ratingBreakdown = computed(() => {
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  ratings.value.forEach(rating => {
    breakdown[rating.rating] = (breakdown[rating.rating] || 0) + 1
  })
  return breakdown
})

const recentReviews = computed(() => {
  return ratings.value
    .filter(rating => rating.review && rating.review.trim())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const totalReviews = computed(() => recentReviews.value.length)

// Methods
const getRatingPercentage = (rating) => {
  if (totalRatings.value === 0) return 0
  return (ratingBreakdown.value[rating] / totalRatings.value) * 100
}

const getRatingText = (rating) => {
  const texts = {
    1: 'Rất tệ',
    2: 'Tệ',
    3: 'Bình thường',
    4: 'Hay',
    5: 'Xuất sắc'
  }
  return texts[rating] || ''
}

const setUserRating = (rating) => {
  selectedRating.value = rating
}

const setCategoryRating = (category, rating) => {
  categoryRatings[category] = rating
}

const submitRating = async () => {
  if (selectedRating.value === 0 || submitting.value) return

  submitting.value = true
  
  try {
    const response = await $fetch('/api/ratings', {
      method: 'POST',
      body: {
        mangaId: props.mangaId,
        rating: selectedRating.value,
        categoryRatings: categoryRatings,
        review: reviewText.value.trim() || null
      }
    })

    if (response.success) {
      // Add new rating to list
      ratings.value.push(response.data)
      userRating.value = response.data
      
      // Reset form
      selectedRating.value = 0
      reviewText.value = ''
      Object.keys(categoryRatings).forEach(key => {
        categoryRatings[key] = 0
      })
      
      emit('rating-updated', response.data)
      showToast('Cảm ơn bạn đã đánh giá!', 'success')
    }

  } catch (err) {
    console.error('Error submitting rating:', err)
    showToast('Không thể gửi đánh giá, vui lòng thử lại', 'error')
  } finally {
    submitting.value = false
  }
}

const editRating = () => {
  if (userRating.value) {
    selectedRating.value = userRating.value.rating
    reviewText.value = userRating.value.review || ''
    
    if (userRating.value.categoryRatings) {
      Object.assign(categoryRatings, userRating.value.categoryRatings)
    }
    
    userRating.value = null
  }
}

const fetchRatings = async () => {
  loading.value = true
  
  try {
    const response = await $fetch(`/api/ratings/${props.mangaId}`)
    
    if (response.success) {
      ratings.value = response.data.ratings || []
      userRating.value = response.data.userRating || null
    }

  } catch (err) {
    console.error('Error fetching ratings:', err)
  } finally {
    loading.value = false
  }
}

const formatTimeAgo = (date) => {
  const now = new Date()
  const ratingDate = new Date(date)
  const diffTime = Math.abs(now - ratingDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Hôm qua'
  if (diffDays < 7) return `${diffDays} ngày trước`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`
  
  return ratingDate.toLocaleDateString('vi-VN')
}

const showToast = (message, type = 'info') => {
  // Toast implementation (same as in CommentSystem)
  const toast = document.createElement('div')
  toast.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white text-sm font-medium transition-all duration-300 ${
    type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500'
  }`
  toast.textContent = message
  
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.style.transform = 'translateX(0)'
    toast.style.opacity = '1'
  }, 100)
  
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)'
    toast.style.opacity = '0'
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 300)
  }, 3000)
}

// Lifecycle
onMounted(() => {
  fetchRatings()
})
</script>

<style scoped>
.rating-system {
  @apply relative;
}

/* Star hover effects */
button svg {
  @apply transition-all duration-150;
}

button:hover svg {
  @apply transform scale-110;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .grid-cols-4 {
    @apply grid-cols-2;
  }
  
  .w-8.h-8 {
    @apply w-6 h-6;
  }
}

/* Accessibility */
button:focus {
  @apply outline-none ring-2 ring-primary-500 ring-offset-2 rounded;
}
</style>
