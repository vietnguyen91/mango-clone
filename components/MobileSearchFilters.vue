<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-medium text-gray-900">Bộ lọc tìm kiếm</h3>
      <button
        @click="$emit('close')"
        class="text-gray-400 hover:text-gray-600"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div class="space-y-4">
      <!-- Genre Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Thể loại</label>
        <select 
          v-model="filters.genre"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Tất cả thể loại</option>
          <option 
            v-for="genre in availableGenres" 
            :key="genre" 
            :value="genre"
          >
            {{ genre }}
          </option>
        </select>
      </div>

      <!-- Status Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="status in statusOptions"
            :key="status.value"
            @click="filters.status = filters.status === status.value ? '' : status.value"
            :class="[
              'px-3 py-2 text-sm rounded-lg border transition-colors',
              filters.status === status.value
                ? 'bg-primary-50 border-primary-200 text-primary-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ status.label }}
          </button>
        </div>
      </div>

      <!-- Sort Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Sắp xếp</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="sort in sortOptions"
            :key="sort.value"
            @click="filters.sort = sort.value"
            :class="[
              'px-3 py-2 text-sm rounded-lg border transition-colors',
              filters.sort === sort.value
                ? 'bg-primary-50 border-primary-200 text-primary-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ sort.label }}
          </button>
        </div>
      </div>

      <!-- Quick Genre Tags -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Thể loại phổ biến</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="genre in popularGenres"
            :key="genre"
            @click="filters.genre = filters.genre === genre ? '' : genre"
            :class="[
              'px-3 py-1 text-xs rounded-full border transition-colors',
              filters.genre === genre
                ? 'bg-primary-100 border-primary-300 text-primary-700'
                : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ genre }}
          </button>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3 mt-6 pt-4 border-t border-gray-200">
      <button
        @click="clearFilters"
        class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Xóa bộ lọc
      </button>
      <button
        @click="applyFilters"
        class="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
      >
        Áp dụng
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const emit = defineEmits(['apply-filters', 'close'])

// Filter state
const filters = reactive({
  genre: '',
  status: '',
  sort: 'relevance'
})

// Available options
const availableGenres = ref([])
const statusOptions = [
  { value: 'ongoing', label: 'Đang tiến hành' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'hiatus', label: 'Tạm dừng' }
]

const sortOptions = [
  { value: 'relevance', label: 'Liên quan' },
  { value: 'latest', label: 'Mới nhất' },
  { value: 'popular', label: 'Phổ biến' },
  { value: 'rating', label: 'Đánh giá' }
]

const popularGenres = [
  'Hành Động', 'Lãng Mạn', 'Huyền Huyễn', 'Hài Hước', 'Trường Học', 'Thể Thao'
]

// Fetch available genres
onMounted(async () => {
  try {
    const { data } = await $fetch('/api/categories')
    availableGenres.value = data?.genres || []
  } catch (error) {
    console.error('Error fetching genres:', error)
  }
})

// Clear all filters
const clearFilters = () => {
  filters.genre = ''
  filters.status = ''
  filters.sort = 'relevance'
}

// Apply filters
const applyFilters = () => {
  const activeFilters = {}
  
  if (filters.genre) activeFilters.genre = filters.genre
  if (filters.status) activeFilters.status = filters.status
  if (filters.sort && filters.sort !== 'relevance') activeFilters.sort = filters.sort
  
  emit('apply-filters', activeFilters)
}
</script>
