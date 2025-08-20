<template>
  <div class="comment-item">
    <div class="flex space-x-4">
      <!-- Avatar -->
      <img
        :src="comment.user?.avatar || '/default-avatar.svg'"
        :alt="comment.user?.name || 'Người dùng'"
        class="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />

      <div class="flex-1 min-w-0">
        <!-- Comment Header -->
        <div class="flex items-center space-x-2 mb-2">
          <h4 class="font-semibold text-gray-900 truncate">
            {{ comment.user?.name || 'Người dùng ẩn danh' }}
          </h4>
          
          <!-- User Badge -->
          <span 
            v-if="comment.user?.badge"
            :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              getBadgeClass(comment.user.badge)
            ]"
          >
            {{ getBadgeText(comment.user.badge) }}
          </span>

          <!-- Timestamp -->
          <span class="text-sm text-gray-500">
            {{ formatTimeAgo(comment.createdAt) }}
          </span>

          <!-- Edited indicator -->
          <span v-if="comment.editedAt" class="text-xs text-gray-400">
            (đã chỉnh sửa)
          </span>
        </div>

        <!-- Comment Content -->
        <div class="prose prose-sm max-w-none mb-3">
          <p 
            class="text-gray-800 whitespace-pre-wrap break-words"
            v-html="formatCommentContent(comment.content)"
          ></p>
        </div>

        <!-- Comment Actions -->
        <div class="flex items-center space-x-4 text-sm">
          <!-- Like Button -->
          <button
            @click="$emit('like', comment._id)"
            :class="[
              'flex items-center space-x-1 transition-colors',
              comment.isLiked 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-500 hover:text-red-500'
            ]"
          >
            <svg 
              :class="['w-4 h-4', comment.isLiked ? 'fill-current' : '']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span>{{ comment.likes || 0 }}</span>
          </button>

          <!-- Reply Button -->
          <button
            @click="showReplyForm = !showReplyForm"
            class="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
            <span>Phản hồi</span>
          </button>

          <!-- Report Button -->
          <button
            v-if="currentUser && currentUser._id !== comment.user?._id"
            @click="showReportModal = true"
            class="flex items-center space-x-1 text-gray-500 hover:text-orange-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span>Báo cáo</span>
          </button>

          <!-- Delete Button (own comments) -->
          <button
            v-if="currentUser && currentUser._id === comment.user?._id"
            @click="$emit('delete', comment._id)"
            class="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            <span>Xóa</span>
          </button>
        </div>

        <!-- Reply Form -->
        <div v-if="showReplyForm" class="mt-4 ml-4 border-l-2 border-gray-200 pl-4">
          <div class="flex space-x-3">
            <img
              :src="currentUser?.avatar || '/default-avatar.svg'"
              :alt="currentUser?.name || 'You'"
              class="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div class="flex-1">
              <textarea
                v-model="replyContent"
                placeholder="Viết phản hồi..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-sm"
                rows="2"
                maxlength="500"
              ></textarea>
              
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs text-gray-500">{{ replyContent.length }}/500</span>
                <div class="flex space-x-2">
                  <button
                    @click="cancelReply"
                    class="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    @click="submitReply"
                    :disabled="!replyContent.trim() || submittingReply"
                    class="px-4 py-1 bg-primary-600 text-white rounded text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {{ submittingReply ? 'Đang gửi...' : 'Gửi' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Replies -->
        <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 ml-4 border-l-2 border-gray-100 pl-4 space-y-4">
          <div
            v-for="reply in comment.replies"
            :key="reply._id"
            class="flex space-x-3"
          >
            <img
              :src="reply.user?.avatar || '/default-avatar.svg'"
              :alt="reply.user?.name || 'Người dùng'"
              class="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-1">
                <h5 class="font-medium text-gray-900 text-sm">
                  {{ reply.user?.name || 'Người dùng ẩn danh' }}
                </h5>
                <span class="text-xs text-gray-500">
                  {{ formatTimeAgo(reply.createdAt) }}
                </span>
              </div>
              <p class="text-gray-800 text-sm whitespace-pre-wrap break-words">
                {{ reply.content }}
              </p>
              
              <!-- Reply Actions -->
              <div class="flex items-center space-x-3 mt-2">
                <button
                  @click="likeReply(reply._id)"
                  :class="[
                    'flex items-center space-x-1 text-xs transition-colors',
                    reply.isLiked 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-gray-500 hover:text-red-500'
                  ]"
                >
                  <svg class="w-3 h-3" :class="reply.isLiked ? 'fill-current' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                  <span>{{ reply.likes || 0 }}</span>
                </button>

                <button
                  v-if="currentUser && currentUser._id === reply.user?._id"
                  @click="deleteReply(comment._id, reply._id)"
                  class="text-xs text-gray-500 hover:text-red-600 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Modal -->
    <ReportModal
      v-if="showReportModal"
      :comment-id="comment._id"
      @close="showReportModal = false"
      @submit="handleReportSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
  currentUser: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['reply', 'like', 'report', 'delete'])

// State
const showReplyForm = ref(false)
const showReportModal = ref(false)
const replyContent = ref('')
const submittingReply = ref(false)

// Methods
const formatTimeAgo = (date) => {
  const now = new Date()
  const commentDate = new Date(date)
  const diffTime = Math.abs(now - commentDate)
  const diffMinutes = Math.floor(diffTime / (1000 * 60))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) return 'Vừa xong'
  if (diffMinutes < 60) return `${diffMinutes} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  if (diffDays < 7) return `${diffDays} ngày trước`
  
  return commentDate.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatCommentContent = (content) => {
  // Simple formatting for Vietnamese text
  return content
    .replace(/\n/g, '<br>')
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-primary-600 hover:text-primary-700">$1</a>')
    .replace(/@(\w+)/g, '<span class="text-primary-600 font-medium">@$1</span>')
}

const getBadgeClass = (badge) => {
  const badgeClasses = {
    vip: 'bg-yellow-100 text-yellow-800',
    moderator: 'bg-blue-100 text-blue-800',
    translator: 'bg-green-100 text-green-800',
    contributor: 'bg-purple-100 text-purple-800'
  }
  return badgeClasses[badge] || 'bg-gray-100 text-gray-800'
}

const getBadgeText = (badge) => {
  const badgeTexts = {
    vip: 'VIP',
    moderator: 'Quản trị viên',
    translator: 'Dịch giả',
    contributor: 'Cộng tác viên'
  }
  return badgeTexts[badge] || badge
}

const submitReply = async () => {
  if (!replyContent.value.trim() || submittingReply.value) return

  submittingReply.value = true
  
  try {
    await emit('reply', props.comment._id, replyContent.value.trim())
    replyContent.value = ''
    showReplyForm.value = false
  } catch (err) {
    console.error('Error submitting reply:', err)
  } finally {
    submittingReply.value = false
  }
}

const cancelReply = () => {
  replyContent.value = ''
  showReplyForm.value = false
}

const likeReply = async (replyId) => {
  try {
    const response = await $fetch(`/api/comments/replies/${replyId}/like`, {
      method: 'POST'
    })

    if (response.success) {
      // Update reply likes
      const reply = props.comment.replies?.find(r => r._id === replyId)
      if (reply) {
        reply.likes = response.data.likes
        reply.isLiked = response.data.isLiked
      }
    }

  } catch (err) {
    console.error('Error liking reply:', err)
  }
}

const deleteReply = async (commentId, replyId) => {
  if (!confirm('Bạn có chắc muốn xóa phản hồi này?')) return

  try {
    const response = await $fetch(`/api/comments/${commentId}/replies/${replyId}`, {
      method: 'DELETE'
    })

    if (response.success) {
      // Remove reply from comment
      const replyIndex = props.comment.replies?.findIndex(r => r._id === replyId)
      if (replyIndex > -1) {
        props.comment.replies.splice(replyIndex, 1)
      }
    }

  } catch (err) {
    console.error('Error deleting reply:', err)
  }
}

const handleReportSubmit = (reason) => {
  emit('report', props.comment._id, reason)
  showReportModal.value = false
}
</script>

<style scoped>
.comment-item {
  @apply relative;
}

/* Hover effects */
.comment-item:hover {
  @apply bg-gray-50 rounded-lg p-4 -m-4 transition-colors duration-200;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .comment-item {
    @apply text-sm;
  }
  
  .flex.space-x-4 {
    @apply space-x-3;
  }
  
  .w-10.h-10 {
    @apply w-8 h-8;
  }
}

/* Prose styling for Vietnamese text */
.prose p {
  @apply mb-0 leading-relaxed;
}

.prose a {
  @apply text-primary-600 hover:text-primary-700 underline;
}

/* Animation for replies */
.reply-enter-active,
.reply-leave-active {
  transition: all 0.3s ease;
}

.reply-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.reply-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
