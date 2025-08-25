<template>
  <div class="relative" ref="sortRef">
    <!-- Sort Button -->
    <button
      @click="toggleSort"
      :class="[
        'flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg border transition-colors min-w-[120px]',
        isOpen 
          ? 'border-primary-500 bg-primary-50 text-primary-700' 
          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
      ]"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
    >
      <div class="flex items-center space-x-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            :d="currentSort.icon"
          />
        </svg>
        <span>{{ currentSort.label }}</span>
      </div>
      
      <svg
        :class="['w-4 h-4 transition-transform', isOpen ? 'rotate-180' : '']"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>

    <!-- Sort Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 right-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
        role="menu"
      >
        <!-- Sort Categories -->
        <div class="py-1">
          <!-- Relevance & Default -->
          <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
            Mặc định
          </div>
          <button
            v-for="option in defaultSortOptions"
            :key="option.value"
            @click="selectSort(option)"
            :class="[
              'w-full flex items-center px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors',
              modelValue === option.value ? 'bg-primary-50 text-primary-700' : 'text-gray-900'
            ]"
            role="menuitem"
          >
            <svg class="w-4 h-4 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="option.icon"/>
            </svg>
            <div class="flex-1">
              <div class="font-medium">{{ option.label }}</div>
              <div class="text-xs text-gray-500">{{ option.description }}</div>
            </div>
            <svg
              v-if="modelValue === option.value"
              class="w-4 h-4 text-primary-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </button>

          <!-- Time-based Sorting -->
          <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 mt-2">
            Thời gian
          </div>
          <button
            v-for="option in timeSortOptions"
            :key="option.value"
            @click="selectSort(option)"
            :class="[
              'w-full flex items-center px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors',
              modelValue === option.value ? 'bg-primary-50 text-primary-700' : 'text-gray-900'
            ]"
            role="menuitem"
          >
            <svg class="w-4 h-4 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="option.icon"/>
            </svg>
            <div class="flex-1">
              <div class="font-medium">{{ option.label }}</div>
              <div class="text-xs text-gray-500">{{ option.description }}</div>
            </div>
            <svg
              v-if="modelValue === option.value"
              class="w-4 h-4 text-primary-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </button>

          <!-- Popularity & Engagement -->
          <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 mt-2">
            Phổ biến
          </div>
          <button
            v-for="option in popularitySortOptions"
            :key="option.value"
            @click="selectSort(option)"
            :class="[
              'w-full flex items-center px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors',
              modelValue === option.value ? 'bg-primary-50 text-primary-700' : 'text-gray-900'
            ]"
            role="menuitem"
          >
            <svg class="w-4 h-4 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="option.icon"/>
            </svg>
            <div class="flex-1">
              <div class="font-medium">{{ option.label }}</div>
              <div class="text-xs text-gray-500">{{ option.description }}</div>
            </div>
            <svg
              v-if="modelValue === option.value"
              class="w-4 h-4 text-primary-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </button>

          <!-- Alphabetical -->
          <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 mt-2">
            Bảng chữ cái
          </div>
          <button
            v-for="option in alphabeticalSortOptions"
            :key="option.value"
            @click="selectSort(option)"
            :class="[
              'w-full flex items-center px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors',
              modelValue === option.value ? 'bg-primary-50 text-primary-700' : 'text-gray-900'
            ]"
            role="menuitem"
          >
            <svg class="w-4 h-4 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="option.icon"/>
            </svg>
            <div class="flex-1">
              <div class="font-medium">{{ option.label }}</div>
              <div class="text-xs text-gray-500">{{ option.description }}</div>
            </div>
            <svg
              v-if="modelValue === option.value"
              class="w-4 h-4 text-primary-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: 'relevance'
  }
})

const emit = defineEmits(['update:modelValue'])

// Reactive state
const isOpen = ref(false)
const sortRef = ref()

// Sort options
const defaultSortOptions = [
  {
    value: 'relevance',
    label: 'Liên quan nhất',
    description: 'Phù hợp nhất với từ khóa tìm kiếm',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  }
]

const timeSortOptions = [
  {
    value: 'latest',
    label: 'Mới cập nhật',
    description: 'Chapter mới nhất được cập nhật',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    value: 'newest',
    label: 'Mới phát hành',
    description: 'Truyện mới được thêm vào',
    icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'
  },
  {
    value: 'oldest',
    label: 'Cũ nhất',
    description: 'Truyện được thêm từ lâu',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  }
]

const popularitySortOptions = [
  {
    value: 'popular',
    label: 'Phổ biến nhất',
    description: 'Được đọc nhiều nhất',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    value: 'trending',
    label: 'Đang thịnh hành',
    description: 'Tăng lượt đọc nhanh gần đây',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
  },
  {
    value: 'most_viewed',
    label: 'Xem nhiều nhất',
    description: 'Tổng lượt xem cao nhất',
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
  },
  {
    value: 'rating',
    label: 'Đánh giá cao',
    description: 'Rating trung bình cao nhất',
    icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
  },
  {
    value: 'most_chapters',
    label: 'Nhiều chapter nhất',
    description: 'Số lượng chapter cao nhất',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  }
]

const alphabeticalSortOptions = [
  {
    value: 'title_asc',
    label: 'Tên A-Z',
    description: 'Sắp xếp theo bảng chữ cái tăng dần',
    icon: 'M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4'
  },
  {
    value: 'title_desc',
    label: 'Tên Z-A',
    description: 'Sắp xếp theo bảng chữ cái giảm dần',
    icon: 'M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12'
  }
]

// All sort options combined
const allSortOptions = computed(() => [
  ...defaultSortOptions,
  ...timeSortOptions,
  ...popularitySortOptions,
  ...alphabeticalSortOptions
])

// Current sort option
const currentSort = computed(() => {
  return allSortOptions.value.find(option => option.value === props.modelValue) || defaultSortOptions[0]
})

// Methods
const toggleSort = () => {
  isOpen.value = !isOpen.value
}

const closeSort = () => {
  isOpen.value = false
}

const selectSort = (option) => {
  emit('update:modelValue', option.value)
  closeSort()
}

// Click outside to close
onClickOutside(sortRef, closeSort)

// Keyboard navigation
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    closeSort()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Smooth transitions */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
