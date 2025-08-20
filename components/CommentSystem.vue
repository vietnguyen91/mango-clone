<template>
  <div class="comment-system bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-gray-900 flex items-center">
        <span class="mr-2">💬</span>
        Bình luận ({{ totalComments }})
      </h3>
      
      <!-- Sort Options -->
      <select 
        v-model="sortBy"
        class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="newest">Mới nhất</option>
        <option value="oldest">Cũ nhất</option>
        <option value="likes">Nhiều like nhất</option>
        <option value="replies">Nhiều phản hồi</option>
      </select>
    </div>

    <!-- Comment Form -->
    <div v-if="user" class="mb-8">
      <div class="flex space-x-4">
        <img
          :src="user.avatar || '/default-avatar.svg'"
          :alt="user.name"
          class="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div class="flex-1">
          <textarea
            v-model="newComment"
            @keydown="handleKeydown"
            placeholder="Viết bình luận của bạn... (Nhấn Ctrl+Enter để gửi)"
            class="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-colors"
            rows="3"
            maxlength="1000"
          ></textarea>
          
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center space-x-4">
              <!-- Emoji Picker -->
              <button
                @click="showEmojiPicker = !showEmojiPicker"
                class="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span class="text-lg">😊</span>
                <span class="text-sm">Emoji</span>
              </button>
              
              <!-- Character Count -->
              <span class="text-sm text-gray-500">
                {{ newComment.length }}/1000
              </span>
            </div>

            <div class="flex items-center space-x-3">
              <button
                v-if="newComment.trim()"
                @click="clearComment"
                class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Hủy
              </button>
              <button
                @click="submitComment"
                :disabled="!newComment.trim() || submitting"
                class="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ submitting ? 'Đang gửi...' : 'Gửi bình luận' }}
              </button>
            </div>
          </div>

          <!-- Emoji Picker -->
          <div v-if="showEmojiPicker" class="mt-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div class="grid grid-cols-8 gap-2">
              <button
                v-for="emoji in popularEmojis"
                :key="emoji"
                @click="addEmoji(emoji)"
                class="text-xl hover:bg-gray-200 rounded p-1 transition-colors"
              >
                {{ emoji }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Login Prompt -->
    <div v-else class="mb-8 p-4 bg-gray-50 rounded-lg text-center">
      <p class="text-gray-600 mb-3">Đăng nhập để tham gia thảo luận</p>
      <button
        @click="$emit('show-login')"
        class="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
      >
        Đăng nhập
      </button>
    </div>

    <!-- Comments List -->
    <div class="space-y-6">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="flex space-x-4 animate-pulse">
          <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-300 rounded w-1/4"></div>
            <div class="h-4 bg-gray-300 rounded w-full"></div>
            <div class="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>

      <!-- Comments -->
      <div v-else-if="sortedComments.length > 0">
        <CommentItem
          v-for="comment in sortedComments"
          :key="comment._id"
          :comment="comment"
          :current-user="user"
          @reply="handleReply"
          @like="handleLike"
          @report="handleReport"
          @delete="handleDelete"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </div>
        <h4 class="text-lg font-medium text-gray-900 mb-2">Chưa có bình luận nào</h4>
        <p class="text-gray-500">Hãy là người đầu tiên chia sẻ ý kiến về bộ truyện này!</p>
      </div>
    </div>

    <!-- Load More -->
    <div v-if="hasMore && !loading" class="mt-8 text-center">
      <button
        @click="loadMoreComments"
        class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
      >
        Xem thêm bình luận
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  mangaId: {
    type: String,
    required: true
  },
  chapterId: {
    type: String,
    default: null
  },
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['show-login'])

// State
const comments = ref([])
const newComment = ref('')
const loading = ref(false)
const submitting = ref(false)
const sortBy = ref('newest')
const currentPage = ref(1)
const hasMore = ref(true)
const showEmojiPicker = ref(false)

// Popular Vietnamese emojis
const popularEmojis = [
  '😂', '😍', '🥰', '😭', '😱', '🤔', '👍', '👎',
  '❤️', '💔', '🔥', '💯', '👏', '🙏', '😴', '🤯'
]

// Computed
const totalComments = computed(() => comments.value.length)

const sortedComments = computed(() => {
  const sorted = [...comments.value]
  
  switch (sortBy.value) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'likes':
      return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    case 'replies':
      return sorted.sort((a, b) => (b.replies?.length || 0) - (a.replies?.length || 0))
    default:
      return sorted
  }
})

// Methods
const fetchComments = async () => {
  loading.value = true
  
  try {
    const response = await $fetch('/api/comments', {
      query: {
        mangaId: props.mangaId,
        chapterId: props.chapterId,
        page: currentPage.value,
        sort: sortBy.value
      }
    })

    if (response.success) {
      if (currentPage.value === 1) {
        comments.value = response.data.comments || []
      } else {
        comments.value.push(...(response.data.comments || []))
      }
      
      hasMore.value = response.data.hasMore || false
    }

  } catch (err) {
    console.error('Error fetching comments:', err)
  } finally {
    loading.value = false
  }
}

const submitComment = async () => {
  if (!newComment.value.trim() || submitting.value) return

  submitting.value = true
  
  try {
    const response = await $fetch('/api/comments', {
      method: 'POST',
      body: {
        mangaId: props.mangaId,
        chapterId: props.chapterId,
        content: newComment.value.trim()
      }
    })

    if (response.success) {
      // Add new comment to the beginning
      comments.value.unshift(response.data)
      newComment.value = ''
      showEmojiPicker.value = false
      
      // Show success feedback
      showToast('Bình luận đã được gửi!', 'success')
    }

  } catch (err) {
    console.error('Error submitting comment:', err)
    showToast('Không thể gửi bình luận, vui lòng thử lại', 'error')
  } finally {
    submitting.value = false
  }
}

const handleReply = async (commentId, replyContent) => {
  try {
    const response = await $fetch('/api/comments/reply', {
      method: 'POST',
      body: {
        commentId,
        content: replyContent
      }
    })

    if (response.success) {
      // Update the comment with new reply
      const comment = comments.value.find(c => c._id === commentId)
      if (comment) {
        if (!comment.replies) comment.replies = []
        comment.replies.push(response.data)
      }
      
      showToast('Phản hồi đã được gửi!', 'success')
    }

  } catch (err) {
    console.error('Error submitting reply:', err)
    showToast('Không thể gửi phản hồi', 'error')
  }
}

const handleLike = async (commentId) => {
  try {
    const response = await $fetch(`/api/comments/${commentId}/like`, {
      method: 'POST'
    })

    if (response.success) {
      // Update comment likes
      const comment = comments.value.find(c => c._id === commentId)
      if (comment) {
        comment.likes = response.data.likes
        comment.isLiked = response.data.isLiked
      }
    }

  } catch (err) {
    console.error('Error liking comment:', err)
  }
}

const handleReport = async (commentId, reason) => {
  try {
    const response = await $fetch(`/api/comments/${commentId}/report`, {
      method: 'POST',
      body: { reason }
    })

    if (response.success) {
      showToast('Báo cáo đã được gửi, cảm ơn bạn!', 'success')
    }

  } catch (err) {
    console.error('Error reporting comment:', err)
    showToast('Không thể gửi báo cáo', 'error')
  }
}

const handleDelete = async (commentId) => {
  if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return

  try {
    const response = await $fetch(`/api/comments/${commentId}`, {
      method: 'DELETE'
    })

    if (response.success) {
      comments.value = comments.value.filter(c => c._id !== commentId)
      showToast('Bình luận đã được xóa', 'success')
    }

  } catch (err) {
    console.error('Error deleting comment:', err)
    showToast('Không thể xóa bình luận', 'error')
  }
}

const loadMoreComments = () => {
  currentPage.value++
  fetchComments()
}

const clearComment = () => {
  newComment.value = ''
  showEmojiPicker.value = false
}

const addEmoji = (emoji) => {
  newComment.value += emoji
  showEmojiPicker.value = false
}

const handleKeydown = (event) => {
  if (event.ctrlKey && event.key === 'Enter') {
    event.preventDefault()
    submitComment()
  }
}

const showToast = (message, type = 'info') => {
  // Create toast notification
  const toast = document.createElement('div')
  toast.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white text-sm font-medium transition-all duration-300 ${
    type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500'
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
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 300)
  }, 3000)
}

// Watch for sort changes
watch(sortBy, () => {
  currentPage.value = 1
  fetchComments()
})

// Lifecycle
onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.comment-system {
  @apply relative;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .comment-system {
    @apply p-4;
  }
  
  textarea {
    @apply text-base; /* Prevent zoom on iOS */
  }
}

/* Smooth animations */
.comment-enter-active,
.comment-leave-active {
  transition: all 0.3s ease;
}

.comment-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.comment-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
