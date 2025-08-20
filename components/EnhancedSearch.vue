<template>
  <div class="relative">
    <!-- Search Input -->
    <div class="relative">
      <input
        ref="searchInput"
        v-model="searchQuery"
        @input="handleSearchInput"
        @keydown="handleKeydown"
        @focus="showSuggestions = true"
        @blur="handleBlur"
        type="text"
        :placeholder="isMobile ? 'Tìm truyện...' : 'Tìm kiếm truyện tranh...'"
        class="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        :class="{ 'rounded-b-none': showSuggestions && suggestions.length > 0 }"
      >
      
      <!-- Search Icon -->
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      
      <!-- Clear Button -->
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Suggestions Dropdown -->
    <div
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute top-full left-0 right-0 bg-white border border-gray-300 border-t-0 rounded-b-lg shadow-lg z-50 max-h-80 overflow-y-auto"
    >
      <!-- Recent Searches -->
      <div v-if="recentSearches.length > 0 && !searchQuery" class="p-3 border-b border-gray-100">
        <div class="text-xs font-medium text-gray-500 mb-2">Tìm kiếm gần đây</div>
        <div class="space-y-1">
          <button
            v-for="(recent, index) in recentSearches.slice(0, 3)"
            :key="index"
            @click="selectSuggestion(recent)"
            class="flex items-center w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded"
          >
            <svg class="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ recent }}
          </button>
        </div>
      </div>

      <!-- Manga Suggestions -->
      <div v-if="mangaSuggestions.length > 0" class="p-3">
        <div class="text-xs font-medium text-gray-500 mb-2">Truyện tranh</div>
        <div class="space-y-1">
          <button
            v-for="(manga, index) in mangaSuggestions"
            :key="manga._id"
            @click="selectManga(manga)"
            :class="[
              'flex items-center w-full text-left px-2 py-2 rounded hover:bg-gray-50 transition-colors',
              { 'bg-primary-50': selectedIndex === index }
            ]"
          >
            <img
              :src="getImageUrl(manga.s3CoverUrl, manga.coverImage)"
              :alt="manga.title"
              class="w-8 h-10 object-cover rounded mr-3 flex-shrink-0"
              loading="lazy"
            >
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-900 truncate">
                {{ highlightMatch(manga.title) }}
              </div>
              <div class="text-xs text-gray-500 truncate">
                {{ manga.genres?.slice(0, 2).join(', ') }}
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Genre Suggestions -->
      <div v-if="genreSuggestions.length > 0" class="p-3 border-t border-gray-100">
        <div class="text-xs font-medium text-gray-500 mb-2">Thể loại</div>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="genre in genreSuggestions"
            :key="genre"
            @click="selectGenre(genre)"
            class="px-2 py-1 text-xs bg-primary-50 text-primary-600 rounded-md hover:bg-primary-100 transition-colors"
          >
            {{ genre }}
          </button>
        </div>
      </div>

      <!-- Popular Searches -->
      <div v-if="popularSearches.length > 0 && !searchQuery" class="p-3 border-t border-gray-100">
        <div class="text-xs font-medium text-gray-500 mb-2">Tìm kiếm phổ biến</div>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="popular in popularSearches.slice(0, 6)"
            :key="popular"
            @click="selectSuggestion(popular)"
            class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            {{ popular }}
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Filter Toggle -->
    <div v-if="isMobile && showMobileFilters" class="mt-2">
      <MobileSearchFilters @apply-filters="handleMobileFilters" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'

const router = useRouter()
const config = useRuntimeConfig()

// Reactive data
const searchInput = ref(null)
const searchQuery = ref('')
const showSuggestions = ref(false)
const mangaSuggestions = ref([])
const genreSuggestions = ref([])
const selectedIndex = ref(-1)
const loading = ref(false)
const showMobileFilters = ref(false)

// Vietnamese search data
const recentSearches = ref([])
const popularSearches = ref([
  'One Piece', 'Naruto', 'Attack on Titan', 'Demon Slayer', 
  'My Hero Academia', 'Dragon Ball', 'Bleach', 'Hunter x Hunter'
])

// Mobile detection
const isMobile = ref(false)

onMounted(() => {
  isMobile.value = window.innerWidth < 768
  loadRecentSearches()
  
  // Handle window resize
  const handleResize = () => {
    isMobile.value = window.innerWidth < 768
  }
  window.addEventListener('resize', handleResize)
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})

// Load recent searches from localStorage
const loadRecentSearches = () => {
  try {
    const stored = localStorage.getItem('mango-recent-searches')
    if (stored) {
      recentSearches.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading recent searches:', error)
  }
}

// Save recent search
const saveRecentSearch = (query) => {
  try {
    const searches = recentSearches.value.filter(s => s !== query)
    searches.unshift(query)
    recentSearches.value = searches.slice(0, 10) // Keep only 10 recent searches
    localStorage.setItem('mango-recent-searches', JSON.stringify(recentSearches.value))
  } catch (error) {
    console.error('Error saving recent search:', error)
  }
}

// Debounced search function
const debouncedSearch = useDebounceFn(async (query) => {
  if (!query || query.length < 2) {
    mangaSuggestions.value = []
    genreSuggestions.value = []
    return
  }

  loading.value = true
  try {
    // Search for manga
    const mangaResponse = await $fetch(`/api/manga/search-suggestions?q=${encodeURIComponent(query)}&limit=5`)
    mangaSuggestions.value = mangaResponse.data || []

    // Search for genres
    const genreResponse = await $fetch(`/api/categories`)
    const allGenres = genreResponse.data?.genres || []
    genreSuggestions.value = allGenres.filter(genre => 
      genre.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5)

  } catch (error) {
    console.error('Search suggestions error:', error)
    mangaSuggestions.value = []
    genreSuggestions.value = []
  } finally {
    loading.value = false
  }
}, 300)

// Handle search input
const handleSearchInput = (event) => {
  const query = event.target.value
  searchQuery.value = query
  selectedIndex.value = -1
  
  if (query.length >= 2) {
    debouncedSearch(query)
  } else {
    mangaSuggestions.value = []
    genreSuggestions.value = []
  }
}

// Handle keyboard navigation
const handleKeydown = (event) => {
  const totalSuggestions = mangaSuggestions.value.length
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, totalSuggestions - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && selectedIndex.value < totalSuggestions) {
        selectManga(mangaSuggestions.value[selectedIndex.value])
      } else {
        performSearch()
      }
      break
    case 'Escape':
      showSuggestions.value = false
      searchInput.value?.blur()
      break
  }
}

// Handle blur with delay to allow clicks
const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  mangaSuggestions.value = []
  genreSuggestions.value = []
  selectedIndex.value = -1
  showSuggestions.value = false
}

// Select suggestion
const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion
  performSearch()
}

// Select manga
const selectManga = (manga) => {
  router.push(`/manga/${manga.slug}`)
  showSuggestions.value = false
}

// Select genre
const selectGenre = (genre) => {
  router.push(`/manga?genre=${encodeURIComponent(genre)}`)
  showSuggestions.value = false
}

// Perform search
const performSearch = () => {
  if (!searchQuery.value.trim()) return
  
  saveRecentSearch(searchQuery.value.trim())
  router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
  showSuggestions.value = false
  
  // Clear on mobile after search
  if (isMobile.value) {
    searchQuery.value = ''
  }
}

// Handle mobile filters
const handleMobileFilters = (filters) => {
  const query = new URLSearchParams(filters)
  if (searchQuery.value) {
    query.set('q', searchQuery.value)
  }
  router.push(`/search?${query.toString()}`)
  showMobileFilters.value = false
}

// Get image URL
const getImageUrl = (s3Path, fallback) => {
  if (s3Path && s3Path.startsWith('/')) {
    return config.public.staticUrl + s3Path
  }
  return s3Path || fallback || '/placeholder-manga.svg'
}

// Highlight search match
const highlightMatch = (text) => {
  if (!searchQuery.value || !text) return text
  
  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
}

// Computed
const suggestions = computed(() => {
  return [...mangaSuggestions.value, ...genreSuggestions.value]
})
</script>

<style scoped>
mark {
  @apply bg-yellow-200 px-0;
}

/* Custom scrollbar for suggestions */
.max-h-80::-webkit-scrollbar {
  width: 4px;
}

.max-h-80::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.max-h-80::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.max-h-80::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
