<template>
  <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
    <!-- Active Filters Label -->
    <span class="text-sm font-medium text-gray-700 flex items-center">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"/>
      </svg>
      Bộ lọc:
    </span>

    <!-- Filter Chips -->
    <div class="flex flex-wrap gap-2">
      <!-- Genre Chips -->
      <div
        v-for="genre in activeGenres"
        :key="`genre-${genre}`"
        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
      >
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>
        {{ genre }}
        <button
          @click="removeGenre(genre)"
          class="ml-2 hover:text-blue-600 focus:outline-none"
          :aria-label="`Remove ${genre} filter`"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Status Chip -->
      <div
        v-if="activeStatus"
        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200"
      >
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        {{ getStatusLabel(activeStatus) }}
        <button
          @click="removeStatus"
          class="ml-2 hover:text-green-600 focus:outline-none"
          aria-label="Remove status filter"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Year Range Chip -->
      <div
        v-if="activeYearRange"
        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200"
      >
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        {{ activeYearRange }}
        <button
          @click="removeYearRange"
          class="ml-2 hover:text-purple-600 focus:outline-none"
          aria-label="Remove year range filter"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Chapter Range Chip -->
      <div
        v-if="activeChapterRange"
        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200"
      >
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
        {{ activeChapterRange }}
        <button
          @click="removeChapterRange"
          class="ml-2 hover:text-orange-600 focus:outline-none"
          aria-label="Remove chapter range filter"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Rating Range Chip -->
      <div
        v-if="activeRatingRange"
        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200"
      >
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
        {{ activeRatingRange }}
        <button
          @click="removeRatingRange"
          class="ml-2 hover:text-yellow-600 focus:outline-none"
          aria-label="Remove rating range filter"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Sort Chip (if not default) -->
      <div
        v-if="activeSortLabel && activeSortLabel !== 'Liên quan nhất'"
        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
      >
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"/>
        </svg>
        {{ activeSortLabel }}
        <button
          @click="removeSort"
          class="ml-2 hover:text-indigo-600 focus:outline-none"
          aria-label="Remove sort filter"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Clear All Button -->
    <button
      @click="clearAllFilters"
      class="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors"
      aria-label="Clear all filters"
    >
      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
      </svg>
      Xóa tất cả
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  genres: {
    type: Array,
    default: () => []
  },
  status: {
    type: String,
    default: ''
  },
  yearFrom: {
    type: Number,
    default: null
  },
  yearTo: {
    type: Number,
    default: null
  },
  chapterMin: {
    type: Number,
    default: null
  },
  chapterMax: {
    type: Number,
    default: null
  },
  ratingMin: {
    type: Number,
    default: null
  },
  ratingMax: {
    type: Number,
    default: null
  },
  sort: {
    type: String,
    default: 'relevance'
  },
  sortLabel: {
    type: String,
    default: 'Liên quan nhất'
  }
})

const emit = defineEmits([
  'remove-genre',
  'remove-status',
  'remove-year-range',
  'remove-chapter-range',
  'remove-rating-range',
  'remove-sort',
  'clear-all'
])

// Computed properties
const activeGenres = computed(() => props.genres.filter(Boolean))

const activeStatus = computed(() => props.status)

const activeYearRange = computed(() => {
  if (props.yearFrom && props.yearTo) {
    return `${props.yearFrom} - ${props.yearTo}`
  } else if (props.yearFrom) {
    return `Từ ${props.yearFrom}`
  } else if (props.yearTo) {
    return `Đến ${props.yearTo}`
  }
  return null
})

const activeChapterRange = computed(() => {
  if (props.chapterMin && props.chapterMax) {
    return `${props.chapterMin} - ${props.chapterMax} chapters`
  } else if (props.chapterMin) {
    return `Từ ${props.chapterMin} chapters`
  } else if (props.chapterMax) {
    return `Đến ${props.chapterMax} chapters`
  }
  return null
})

const activeRatingRange = computed(() => {
  if (props.ratingMin && props.ratingMax) {
    return `${props.ratingMin} - ${props.ratingMax} sao`
  } else if (props.ratingMin) {
    return `Từ ${props.ratingMin} sao`
  } else if (props.ratingMax) {
    return `Đến ${props.ratingMax} sao`
  }
  return null
})

const activeSortLabel = computed(() => props.sortLabel)

const hasActiveFilters = computed(() => {
  return (
    activeGenres.value.length > 0 ||
    activeStatus.value ||
    activeYearRange.value ||
    activeChapterRange.value ||
    activeRatingRange.value ||
    (activeSortLabel.value && activeSortLabel.value !== 'Liên quan nhất')
  )
})

// Methods
const getStatusLabel = (status) => {
  const statusLabels = {
    ongoing: 'Đang tiến hành',
    completed: 'Hoàn thành',
    hiatus: 'Tạm dừng',
    cancelled: 'Đã hủy'
  }
  return statusLabels[status] || status
}

const removeGenre = (genre) => {
  emit('remove-genre', genre)
}

const removeStatus = () => {
  emit('remove-status')
}

const removeYearRange = () => {
  emit('remove-year-range')
}

const removeChapterRange = () => {
  emit('remove-chapter-range')
}

const removeRatingRange = () => {
  emit('remove-rating-range')
}

const removeSort = () => {
  emit('remove-sort')
}

const clearAllFilters = () => {
  emit('clear-all')
}
</script>

<style scoped>
/* Smooth transitions for chips */
.inline-flex {
  transition: all 0.2s ease-in-out;
}

.inline-flex:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Animation for chip removal */
.chip-leave-active {
  transition: all 0.3s ease-in-out;
}

.chip-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
