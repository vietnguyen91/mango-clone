<template>
  <div class="vietnamese-social-share">
    <!-- Share Button -->
    <button
      @click="toggleShareMenu"
      :class="[
        'share-trigger flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
        variant === 'primary' 
          ? 'bg-primary-600 text-white hover:bg-primary-700' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      ]"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
      </svg>
      <span>{{ shareText }}</span>
    </button>

    <!-- Share Menu -->
    <div 
      v-if="showShareMenu"
      class="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50 min-w-80"
      :class="{ 'right-0 left-auto': alignRight }"
    >
      <!-- Vietnamese Social Platforms -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <!-- Facebook -->
        <button
          @click="shareToFacebook"
          class="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
        >
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <div class="text-left">
            <div class="font-medium text-gray-900 group-hover:text-blue-600">Facebook</div>
            <div class="text-xs text-gray-500">Chia sẻ lên trang cá nhân</div>
          </div>
        </button>

        <!-- Zalo -->
        <button
          @click="shareToZalo"
          class="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
        >
          <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">Z</span>
          </div>
          <div class="text-left">
            <div class="font-medium text-gray-900 group-hover:text-blue-600">Zalo</div>
            <div class="text-xs text-gray-500">Gửi cho bạn bè</div>
          </div>
        </button>

        <!-- Telegram -->
        <button
          @click="shareToTelegram"
          class="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
        >
          <div class="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </div>
          <div class="text-left">
            <div class="font-medium text-gray-900 group-hover:text-blue-600">Telegram</div>
            <div class="text-xs text-gray-500">Chia sẻ qua Telegram</div>
          </div>
        </button>

        <!-- Copy Link -->
        <button
          @click="copyLink"
          class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
        >
          <div class="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          </div>
          <div class="text-left">
            <div class="font-medium text-gray-900 group-hover:text-gray-600">Sao chép link</div>
            <div class="text-xs text-gray-500">{{ linkCopied ? 'Đã sao chép!' : 'Copy đường dẫn' }}</div>
          </div>
        </button>
      </div>

      <!-- Vietnamese Reading Groups -->
      <div class="border-t border-gray-200 pt-4">
        <h4 class="font-medium text-gray-900 mb-3 flex items-center">
          <span class="mr-2">👥</span>
          Nhóm đọc truyện Việt Nam
        </h4>
        
        <div class="space-y-2">
          <button
            v-for="group in vietnameseGroups"
            :key="group.id"
            @click="shareToGroup(group)"
            class="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <img
              :src="group.avatar"
              :alt="group.name"
              class="w-8 h-8 rounded-full object-cover"
            />
            <div class="flex-1 min-w-0">
              <div class="font-medium text-gray-900 text-sm truncate">{{ group.name }}</div>
              <div class="text-xs text-gray-500">{{ group.memberCount }} thành viên</div>
            </div>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="border-t border-gray-200 pt-4 mt-4">
        <div class="grid grid-cols-2 gap-3">
          <button
            @click="addToReadingList"
            class="flex items-center justify-center space-x-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <span class="text-sm font-medium">Thêm vào danh sách</span>
          </button>

          <button
            @click="recommendToFriends"
            class="flex items-center justify-center space-x-2 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
            </svg>
            <span class="text-sm font-medium">Gợi ý bạn bè</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div 
      v-if="showShareMenu"
      @click="showShareMenu = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  manga: {
    type: Object,
    required: true
  },
  chapter: {
    type: Object,
    default: null
  },
  variant: {
    type: String,
    default: 'default' // 'primary', 'default'
  },
  shareText: {
    type: String,
    default: 'Chia sẻ'
  },
  alignRight: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['shared', 'added-to-list'])

// State
const showShareMenu = ref(false)
const linkCopied = ref(false)

// Vietnamese reading groups (can be fetched from API)
const vietnameseGroups = ref([
  {
    id: 'manga-vn-official',
    name: 'Manga Việt Nam Official',
    avatar: '/groups/manga-vn.jpg',
    memberCount: 15420,
    platform: 'facebook'
  },
  {
    id: 'truyen-tranh-hay',
    name: 'Truyện Tranh Hay Nhất',
    avatar: '/groups/truyen-hay.jpg',
    memberCount: 8930,
    platform: 'facebook'
  },
  {
    id: 'manga-lovers-vn',
    name: 'Manga Lovers Vietnam',
    avatar: '/groups/manga-lovers.jpg',
    memberCount: 12650,
    platform: 'telegram'
  }
])

// Computed
const shareUrl = computed(() => {
  const baseUrl = window.location.origin
  if (props.chapter) {
    return `${baseUrl}/read/${props.chapter.chapterId}`
  }
  return `${baseUrl}/manga/${props.manga.slug}`
})

const shareTitle = computed(() => {
  if (props.chapter) {
    return `${props.manga.title} - Chương ${props.chapter.chapterNumber}`
  }
  return props.manga.title
})

const shareDescription = computed(() => {
  const genres = props.manga.genres?.slice(0, 3).join(', ') || ''
  const rating = props.manga.rating ? ` • ${props.manga.rating}/5⭐` : ''
  
  if (props.chapter) {
    return `Đọc ${shareTitle.value} miễn phí tại Mango${rating}`
  }
  
  return `${genres}${rating} • Đọc miễn phí tại Mango - Nền tảng truyện tranh hàng đầu Việt Nam`
})

// Methods
const toggleShareMenu = () => {
  showShareMenu.value = !showShareMenu.value
}

const shareToFacebook = () => {
  const url = encodeURIComponent(shareUrl.value)
  const title = encodeURIComponent(shareTitle.value)
  const description = encodeURIComponent(shareDescription.value)
  
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title} - ${description}`
  
  window.open(facebookUrl, 'facebook-share', 'width=600,height=400')
  trackShare('facebook')
  showShareMenu.value = false
}

const shareToZalo = () => {
  // Zalo sharing (if Zalo SDK is available)
  if (window.ZaloSocial) {
    window.ZaloSocial.share({
      url: shareUrl.value,
      title: shareTitle.value,
      description: shareDescription.value,
      thumb: props.manga.s3CoverUrl || props.manga.coverImage
    })
  } else {
    // Fallback to copy link with Zalo message
    copyLink()
    showToast('Link đã được sao chép! Bạn có thể dán vào Zalo để chia sẻ.', 'success')
  }
  
  trackShare('zalo')
  showShareMenu.value = false
}

const shareToTelegram = () => {
  const url = encodeURIComponent(shareUrl.value)
  const text = encodeURIComponent(`${shareTitle.value}\n\n${shareDescription.value}`)
  
  const telegramUrl = `https://t.me/share/url?url=${url}&text=${text}`
  
  window.open(telegramUrl, 'telegram-share', 'width=600,height=400')
  trackShare('telegram')
  showShareMenu.value = false
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    linkCopied.value = true
    showToast('Đã sao chép link!', 'success')
    
    setTimeout(() => {
      linkCopied.value = false
    }, 3000)
    
    trackShare('copy-link')
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = shareUrl.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    
    linkCopied.value = true
    showToast('Đã sao chép link!', 'success')
    trackShare('copy-link-fallback')
  }
  
  showShareMenu.value = false
}

const shareToGroup = async (group) => {
  try {
    // Track group sharing
    await $fetch('/api/social/share-to-group', {
      method: 'POST',
      body: {
        mangaId: props.manga._id,
        chapterId: props.chapter?.chapterId,
        groupId: group.id,
        platform: group.platform
      }
    })

    // Open appropriate platform
    if (group.platform === 'facebook') {
      shareToFacebook()
    } else if (group.platform === 'telegram') {
      shareToTelegram()
    }

    trackShare(`group-${group.platform}`)
    
  } catch (err) {
    console.error('Error sharing to group:', err)
    showToast('Không thể chia sẻ đến nhóm', 'error')
  }
  
  showShareMenu.value = false
}

const addToReadingList = async () => {
  try {
    const response = await $fetch('/api/user/reading-list', {
      method: 'POST',
      body: {
        mangaId: props.manga._id,
        chapterId: props.chapter?.chapterId
      }
    })

    if (response.success) {
      showToast('Đã thêm vào danh sách đọc!', 'success')
      emit('added-to-list', props.manga)
    }

  } catch (err) {
    console.error('Error adding to reading list:', err)
    showToast('Không thể thêm vào danh sách', 'error')
  }
  
  showShareMenu.value = false
}

const recommendToFriends = async () => {
  try {
    // Open friend recommendation modal
    const response = await $fetch('/api/social/recommend-to-friends', {
      method: 'POST',
      body: {
        mangaId: props.manga._id,
        chapterId: props.chapter?.chapterId
      }
    })

    if (response.success) {
      showToast('Đã gửi gợi ý đến bạn bè!', 'success')
    }

  } catch (err) {
    console.error('Error recommending to friends:', err)
    showToast('Không thể gửi gợi ý', 'error')
  }
  
  showShareMenu.value = false
}

const trackShare = async (platform) => {
  try {
    await $fetch('/api/analytics/share', {
      method: 'POST',
      body: {
        mangaId: props.manga._id,
        chapterId: props.chapter?.chapterId,
        platform,
        timestamp: new Date().toISOString()
      }
    })
    
    emit('shared', { platform, manga: props.manga, chapter: props.chapter })
    
  } catch (err) {
    console.error('Error tracking share:', err)
  }
}

const showToast = (message, type = 'info') => {
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

// Close menu when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.vietnamese-social-share')) {
    showShareMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.vietnamese-social-share {
  @apply relative inline-block;
}

/* Share menu animation */
.share-menu-enter-active,
.share-menu-leave-active {
  transition: all 0.2s ease;
}

.share-menu-enter-from,
.share-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .min-w-80 {
    @apply min-w-72;
  }
  
  .grid-cols-2 {
    @apply grid-cols-1;
  }
}

/* Hover effects */
.group:hover .w-10 {
  @apply transform scale-110;
}

/* Copy success animation */
@keyframes copySuccess {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.copy-success {
  animation: copySuccess 0.3s ease-in-out;
}
</style>
