import { ref, computed, watch } from 'vue'

export const useBookmarks = () => {
  // Reactive state
  const bookmarks = ref([])
  const readingHistory = ref([])
  const readingProgress = ref({})
  const loading = ref(false)
  const error = ref('')

  // Computed
  const bookmarkCount = computed(() => bookmarks.value.length)
  const historyCount = computed(() => readingHistory.value.length)
  
  const recentlyRead = computed(() => {
    return readingHistory.value
      .sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt))
      .slice(0, 10)
  })

  const favoriteGenres = computed(() => {
    const genreCount = {}
    bookmarks.value.forEach(bookmark => {
      bookmark.manga?.genres?.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1
      })
    })
    
    return Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }))
  })

  // Load data from localStorage (for offline support)
  const loadLocalData = () => {
    try {
      const savedBookmarks = localStorage.getItem('mango-bookmarks')
      const savedHistory = localStorage.getItem('mango-reading-history')
      const savedProgress = localStorage.getItem('mango-reading-progress')

      if (savedBookmarks) {
        bookmarks.value = JSON.parse(savedBookmarks)
      }
      if (savedHistory) {
        readingHistory.value = JSON.parse(savedHistory)
      }
      if (savedProgress) {
        readingProgress.value = JSON.parse(savedProgress)
      }
    } catch (error) {
      console.error('Error loading local bookmark data:', error)
    }
  }

  // Save data to localStorage
  const saveLocalData = () => {
    try {
      localStorage.setItem('mango-bookmarks', JSON.stringify(bookmarks.value))
      localStorage.setItem('mango-reading-history', JSON.stringify(readingHistory.value))
      localStorage.setItem('mango-reading-progress', JSON.stringify(readingProgress.value))
    } catch (error) {
      console.error('Error saving local bookmark data:', error)
    }
  }

  // Fetch bookmarks from server
  const fetchBookmarks = async () => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/api/user/bookmarks')
      if (response.success) {
        bookmarks.value = response.data || []
        saveLocalData()
      }
    } catch (err) {
      console.error('Error fetching bookmarks:', err)
      error.value = 'Không thể tải danh sách yêu thích'
      // Fallback to local data
      loadLocalData()
    } finally {
      loading.value = false
    }
  }

  // Fetch reading history from server
  const fetchReadingHistory = async () => {
    try {
      const response = await $fetch('/api/user/reading-history')
      if (response.success) {
        readingHistory.value = response.data || []
        saveLocalData()
      }
    } catch (err) {
      console.error('Error fetching reading history:', err)
      // Fallback to local data
      loadLocalData()
    }
  }

  // Add bookmark
  const addBookmark = async (manga) => {
    if (isBookmarked(manga._id)) return

    const bookmark = {
      mangaId: manga._id,
      manga: {
        _id: manga._id,
        title: manga.title,
        slug: manga.slug,
        coverImage: manga.coverImage,
        s3CoverUrl: manga.s3CoverUrl,
        genres: manga.genres,
        status: manga.status,
        author: manga.author
      },
      addedAt: new Date().toISOString(),
      lastReadAt: null,
      currentChapter: null,
      readingProgress: 0
    }

    // Add to local state immediately
    bookmarks.value.unshift(bookmark)
    saveLocalData()

    // Sync with server
    try {
      const response = await $fetch('/api/user/bookmarks', {
        method: 'POST',
        body: { mangaId: manga._id }
      })
      
      if (!response.success) {
        // Revert on server error
        bookmarks.value = bookmarks.value.filter(b => b.mangaId !== manga._id)
        saveLocalData()
        error.value = 'Không thể thêm vào yêu thích'
      }
    } catch (err) {
      console.error('Error adding bookmark:', err)
      // Keep local bookmark but show warning
      error.value = 'Đã lưu cục bộ, sẽ đồng bộ khi có mạng'
    }
  }

  // Remove bookmark
  const removeBookmark = async (mangaId) => {
    const originalBookmarks = [...bookmarks.value]
    
    // Remove from local state immediately
    bookmarks.value = bookmarks.value.filter(b => b.mangaId !== mangaId)
    saveLocalData()

    // Sync with server
    try {
      const response = await $fetch(`/api/user/bookmarks/${mangaId}`, {
        method: 'DELETE'
      })
      
      if (!response.success) {
        // Revert on server error
        bookmarks.value = originalBookmarks
        saveLocalData()
        error.value = 'Không thể xóa khỏi yêu thích'
      }
    } catch (err) {
      console.error('Error removing bookmark:', err)
      error.value = 'Đã xóa cục bộ, sẽ đồng bộ khi có mạng'
    }
  }

  // Check if manga is bookmarked
  const isBookmarked = (mangaId) => {
    return bookmarks.value.some(b => b.mangaId === mangaId)
  }

  // Add to reading history
  const addToHistory = async (manga, chapter) => {
    const historyItem = {
      mangaId: manga._id,
      chapterId: chapter.chapterId,
      manga: {
        _id: manga._id,
        title: manga.title,
        slug: manga.slug,
        coverImage: manga.coverImage,
        s3CoverUrl: manga.s3CoverUrl
      },
      chapter: {
        chapterId: chapter.chapterId,
        chapterNumber: chapter.chapterNumber,
        title: chapter.title
      },
      lastReadAt: new Date().toISOString(),
      readingProgress: 0,
      totalPages: chapter.images?.length || 0
    }

    // Remove existing entry for same chapter
    readingHistory.value = readingHistory.value.filter(
      h => !(h.mangaId === manga._id && h.chapterId === chapter.chapterId)
    )

    // Add to beginning
    readingHistory.value.unshift(historyItem)

    // Keep only last 100 items
    if (readingHistory.value.length > 100) {
      readingHistory.value = readingHistory.value.slice(0, 100)
    }

    saveLocalData()

    // Sync with server
    try {
      await $fetch('/api/user/reading-history', {
        method: 'POST',
        body: historyItem
      })
    } catch (err) {
      console.error('Error syncing reading history:', err)
    }
  }

  // Update reading progress
  const updateProgress = async (mangaId, chapterId, progress) => {
    const progressKey = `${mangaId}-${chapterId}`
    readingProgress.value[progressKey] = {
      mangaId,
      chapterId,
      progress,
      updatedAt: new Date().toISOString()
    }

    // Update in history
    const historyItem = readingHistory.value.find(
      h => h.mangaId === mangaId && h.chapterId === chapterId
    )
    if (historyItem) {
      historyItem.readingProgress = progress
      historyItem.lastReadAt = new Date().toISOString()
    }

    // Update in bookmarks
    const bookmark = bookmarks.value.find(b => b.mangaId === mangaId)
    if (bookmark) {
      bookmark.lastReadAt = new Date().toISOString()
      bookmark.currentChapter = chapterId
      bookmark.readingProgress = progress
    }

    saveLocalData()

    // Sync with server (debounced)
    clearTimeout(updateProgress.timeout)
    updateProgress.timeout = setTimeout(async () => {
      try {
        await $fetch('/api/user/reading-progress', {
          method: 'POST',
          body: { mangaId, chapterId, progress }
        })
      } catch (err) {
        console.error('Error syncing reading progress:', err)
      }
    }, 2000)
  }

  // Get reading progress for a chapter
  const getProgress = (mangaId, chapterId) => {
    const progressKey = `${mangaId}-${chapterId}`
    return readingProgress.value[progressKey]?.progress || 0
  }

  // Mark chapter as read
  const markAsRead = async (mangaId, chapterId) => {
    await updateProgress(mangaId, chapterId, 100)
  }

  // Get continue reading suggestions
  const getContinueReading = () => {
    return readingHistory.value
      .filter(h => h.readingProgress < 100)
      .sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt))
      .slice(0, 5)
  }

  // Sync with server
  const syncWithServer = async () => {
    try {
      // Upload local data to server
      await $fetch('/api/user/sync-bookmarks', {
        method: 'POST',
        body: {
          bookmarks: bookmarks.value,
          readingHistory: readingHistory.value,
          readingProgress: readingProgress.value
        }
      })

      // Fetch latest from server
      await Promise.all([
        fetchBookmarks(),
        fetchReadingHistory()
      ])

    } catch (err) {
      console.error('Error syncing with server:', err)
    }
  }

  // Clear all data
  const clearAllData = () => {
    bookmarks.value = []
    readingHistory.value = []
    readingProgress.value = {}
    saveLocalData()
  }

  // Export data for backup
  const exportData = () => {
    return {
      bookmarks: bookmarks.value,
      readingHistory: readingHistory.value,
      readingProgress: readingProgress.value,
      exportedAt: new Date().toISOString()
    }
  }

  // Import data from backup
  const importData = (data) => {
    if (data.bookmarks) bookmarks.value = data.bookmarks
    if (data.readingHistory) readingHistory.value = data.readingHistory
    if (data.readingProgress) readingProgress.value = data.readingProgress
    saveLocalData()
  }

  // Initialize
  const initialize = async () => {
    loadLocalData()
    
    // Try to sync with server if user is logged in
    const { $auth } = useNuxtApp()
    if ($auth?.user) {
      await syncWithServer()
    }
  }

  // Watch for changes and auto-save
  watch([bookmarks, readingHistory, readingProgress], saveLocalData, { deep: true })

  return {
    // State
    bookmarks: readonly(bookmarks),
    readingHistory: readonly(readingHistory),
    readingProgress: readonly(readingProgress),
    loading: readonly(loading),
    error: readonly(error),
    
    // Computed
    bookmarkCount,
    historyCount,
    recentlyRead,
    favoriteGenres,
    
    // Methods
    addBookmark,
    removeBookmark,
    isBookmarked,
    addToHistory,
    updateProgress,
    getProgress,
    markAsRead,
    getContinueReading,
    syncWithServer,
    clearAllData,
    exportData,
    importData,
    initialize
  }
}
