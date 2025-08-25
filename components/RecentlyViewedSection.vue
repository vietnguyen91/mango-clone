<template>
  <section v-if="hasRecentManga" class="recently-viewed-section mb-8 md:mb-12">
    <!-- Section Header -->
    <div class="flex items-center justify-between mb-4 md:mb-6">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl md:text-2xl font-bold text-gray-900">Đọc gần đây</h2>
          <p class="text-sm text-gray-600">Tiếp tục đọc từ nơi bạn đã dừng lại</p>
        </div>
      </div>
      
      <!-- View All & Clear Actions -->
      <div class="flex items-center space-x-2">
        <button
          v-if="recentManga.length > 6"
          @click="showAll = !showAll"
          class="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          {{ showAll ? 'Thu gọn' : `Xem tất cả (${recentManga.length})` }}
        </button>
        <button
          @click="showClearConfirm = true"
          class="text-sm text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
          title="Xóa tất cả lịch sử"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Recently Viewed Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
      <RecentMangaCard
        v-for="manga in displayedManga"
        :key="manga.mangaId"
        :manga="manga"
        @remove="handleRemove"
      />
    </div>

    <!-- Clear Confirmation Modal -->
    <div
      v-if="showClearConfirm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click="showClearConfirm = false"
    >
      <div
        class="bg-white rounded-xl p-6 max-w-sm w-full"
        @click.stop
      >
        <div class="text-center">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Xóa tất cả lịch sử?</h3>
          <p class="text-gray-600 mb-6">Bạn sẽ mất tất cả lịch sử đọc truyện. Hành động này không thể hoàn tác.</p>
          <div class="flex space-x-3">
            <button
              @click="showClearConfirm = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              @click="handleClearAll"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Xóa tất cả
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRecentlyViewedStore } from '~/stores/recentlyViewed'

const recentlyViewedStore = useRecentlyViewedStore()

// Reactive state
const showAll = ref(false)
const showClearConfirm = ref(false)

// Computed
const recentManga = computed(() => recentlyViewedStore.getRecentManga)
const hasRecentManga = computed(() => recentlyViewedStore.hasRecentManga)

const displayedManga = computed(() => {
  if (showAll.value) {
    return recentManga.value
  }
  return recentManga.value.slice(0, 6) // Show 6 items by default
})

// Methods
const handleRemove = (mangaId: string) => {
  recentlyViewedStore.removeFromRecent(mangaId)
}

const handleClearAll = () => {
  recentlyViewedStore.clearAll()
  showClearConfirm.value = false
  showAll.value = false
}

// Load data on mount
onMounted(() => {
  if (!recentlyViewedStore.isLoaded) {
    recentlyViewedStore.loadFromStorage()
  }
})
</script>

<style scoped>
.recently-viewed-section {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Smooth transitions for grid changes */
.grid {
  transition: all 0.3s ease-in-out;
}
</style>
