<template>
  <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end">
    <div class="w-full bg-gray-900 rounded-t-2xl text-white transform transition-transform duration-300 max-h-[80vh]">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-700 sticky top-0 bg-gray-900 rounded-t-2xl">
        <h3 class="text-lg font-semibold">Danh sách chương</h3>
        <button @click="$emit('close')" class="p-2 hover:bg-gray-800 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Search and Sort -->
      <div class="p-4 border-b border-gray-700 space-y-3">
        <!-- Search -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm chương..."
            class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <!-- Sort Options -->
        <div class="flex gap-2">
          <button
            v-for="option in sortOptions"
            :key="option.value"
            @click="sortBy = option.value"
            :class="[
              'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
              sortBy === option.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- Chapter List -->
      <div class="overflow-y-auto">
        <div v-if="filteredChapters.length === 0" class="p-8 text-center">
          <div class="text-gray-400 mb-2">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <p class="text-gray-400">Không tìm thấy chương nào</p>
        </div>

        <div v-else class="divide-y divide-gray-700">
          <button
            v-for="chapter in filteredChapters"
            :key="chapter.chapterId"
            @click="selectChapter(chapter)"
            :class="[
              'w-full p-4 text-left hover:bg-gray-800 transition-colors flex items-center justify-between',
              isCurrentChapter(chapter) ? 'bg-primary-600/20 border-l-4 border-primary-500' : ''
            ]"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-3">
                <!-- Chapter Number -->
                <div 
                  :class="[
                    'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold',
                    isCurrentChapter(chapter) 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  ]"
                >
                  {{ chapter.chapterNumber }}
                </div>

                <!-- Chapter Info -->
                <div class="flex-1 min-w-0">
                  <div 
                    :class="[
                      'font-medium truncate',
                      isCurrentChapter(chapter) ? 'text-primary-300' : 'text-white'
                    ]"
                  >
                    {{ chapter.title || `Chương ${chapter.chapterNumber}` }}
                  </div>
                  
                  <div class="flex items-center space-x-3 mt-1">
                    <!-- Upload Date -->
                    <div class="text-xs text-gray-400">
                      {{ formatDate(chapter.uploadDate) }}
                    </div>
                    
                    <!-- Page Count -->
                    <div v-if="chapter.pageCount" class="text-xs text-gray-400">
                      {{ chapter.pageCount }} trang
                    </div>
                    
                    <!-- Reading Status -->
                    <div v-if="chapter.isRead" class="text-xs text-green-400 flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      Đã đọc
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Current Chapter Indicator -->
            <div v-if="isCurrentChapter(chapter)" class="flex-shrink-0 ml-3">
              <div class="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            </div>
          </button>
        </div>
      </div>

      <!-- Footer with Stats -->
      <div class="p-4 border-t border-gray-700 bg-gray-900">
        <div class="flex items-center justify-between text-sm text-gray-400">
          <div>Tổng: {{ chapters.length }} chương</div>
          <div v-if="readChapters > 0">Đã đọc: {{ readChapters }}/{{ chapters.length }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  chapters: {
    type: Array,
    default: () => []
  },
  currentChapter: [String, Number]
})

const emit = defineEmits(['select-chapter', 'close'])

// Reactive state
const searchQuery = ref('')
const sortBy = ref('asc')

// Sort options
const sortOptions = [
  { value: 'asc', label: 'Cũ → Mới' },
  { value: 'desc', label: 'Mới → Cũ' }
]

// Computed
const filteredChapters = computed(() => {
  let filtered = props.chapters || []

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(chapter => 
      chapter.title?.toLowerCase().includes(query) ||
      chapter.chapterNumber.toString().includes(query)
    )
  }

  // Sort chapters
  filtered = [...filtered].sort((a, b) => {
    const aNum = parseFloat(a.chapterNumber)
    const bNum = parseFloat(b.chapterNumber)
    
    if (sortBy.value === 'desc') {
      return bNum - aNum
    }
    return aNum - bNum
  })

  return filtered
})

const readChapters = computed(() => {
  return props.chapters.filter(chapter => chapter.isRead).length
})

// Methods
const isCurrentChapter = (chapter) => {
  return chapter.chapterNumber.toString() === props.currentChapter.toString()
}

const selectChapter = (chapter) => {
  emit('select-chapter', chapter.chapterId)
}

const formatDate = (date) => {
  if (!date) return ''
  
  const now = new Date()
  const chapterDate = new Date(date)
  const diffTime = Math.abs(now - chapterDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return 'Hôm qua'
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} tuần trước`
  } else {
    return chapterDate.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
}
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #374151;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #6B7280;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9CA3AF;
}
</style>
