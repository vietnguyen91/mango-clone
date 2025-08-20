import { ref, computed } from 'vue'

export const useOfflineReading = () => {
  // State
  const offlineChapters = ref([])
  const downloadQueue = ref([])
  const downloadProgress = ref({})
  const storageUsed = ref(0)
  const storageLimit = ref(0)
  const isOnline = ref(true)

  // IndexedDB setup
  const DB_NAME = 'MangoOfflineDB'
  const DB_VERSION = 1
  const STORE_NAME = 'chapters'

  // Initialize IndexedDB
  const initDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'chapterId' })
          store.createIndex('mangaId', 'mangaId', { unique: false })
          store.createIndex('downloadedAt', 'downloadedAt', { unique: false })
        }
      }
    })
  }

  // Check storage quota
  const checkStorageQuota = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate()
        storageUsed.value = estimate.usage || 0
        storageLimit.value = estimate.quota || 0
      } catch (error) {
        console.error('Error checking storage quota:', error)
      }
    }
  }

  // Download chapter for offline reading
  const downloadChapter = async (chapterId, mangaInfo) => {
    if (downloadQueue.value.includes(chapterId)) {
      return { success: false, error: 'Already downloading' }
    }

    // Check storage space
    await checkStorageQuota()
    const availableSpace = storageLimit.value - storageUsed.value
    const estimatedSize = 50 * 1024 * 1024 // 50MB estimate per chapter
    
    if (availableSpace < estimatedSize) {
      return { 
        success: false, 
        error: 'Không đủ dung lượng. Vui lòng xóa một số chương đã tải.' 
      }
    }

    downloadQueue.value.push(chapterId)
    downloadProgress.value[chapterId] = 0

    try {
      // Fetch chapter data
      const response = await $fetch(`/api/chapters/${chapterId}`)
      
      if (!response.success) {
        throw new Error('Failed to fetch chapter data')
      }

      const chapterData = response.data
      downloadProgress.value[chapterId] = 20

      // Download all images
      const images = []
      const totalImages = chapterData.images.length

      for (let i = 0; i < totalImages; i++) {
        const imageUrl = chapterData.images[i]
        
        try {
          // Fetch image as blob
          const imageResponse = await fetch(imageUrl)
          const imageBlob = await imageResponse.blob()
          
          // Convert to base64 for storage
          const base64 = await blobToBase64(imageBlob)
          images.push({
            url: imageUrl,
            data: base64,
            size: imageBlob.size
          })

          // Update progress
          downloadProgress.value[chapterId] = 20 + ((i + 1) / totalImages) * 70

        } catch (imageError) {
          console.error(`Error downloading image ${i}:`, imageError)
          // Continue with other images
        }
      }

      // Store in IndexedDB
      const db = await initDB()
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)

      const offlineChapter = {
        chapterId,
        mangaId: chapterData.mangaId,
        mangaTitle: mangaInfo.title,
        mangaSlug: mangaInfo.slug,
        chapterNumber: chapterData.chapterNumber,
        chapterTitle: chapterData.title,
        images,
        downloadedAt: new Date().toISOString(),
        size: images.reduce((total, img) => total + (img.size || 0), 0)
      }

      await new Promise((resolve, reject) => {
        const request = store.put(offlineChapter)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })

      // Update local state
      offlineChapters.value.push({
        chapterId,
        mangaId: chapterData.mangaId,
        mangaTitle: mangaInfo.title,
        chapterNumber: chapterData.chapterNumber,
        chapterTitle: chapterData.title,
        downloadedAt: new Date().toISOString(),
        size: offlineChapter.size
      })

      downloadProgress.value[chapterId] = 100
      await checkStorageQuota()

      return { 
        success: true, 
        message: 'Đã tải xuống thành công!' 
      }

    } catch (error) {
      console.error('Download error:', error)
      return { 
        success: false, 
        error: 'Không thể tải xuống chương này' 
      }
    } finally {
      downloadQueue.value = downloadQueue.value.filter(id => id !== chapterId)
    }
  }

  // Get offline chapter data
  const getOfflineChapter = async (chapterId) => {
    try {
      const db = await initDB()
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)

      return new Promise((resolve, reject) => {
        const request = store.get(chapterId)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

    } catch (error) {
      console.error('Error getting offline chapter:', error)
      return null
    }
  }

  // Delete offline chapter
  const deleteOfflineChapter = async (chapterId) => {
    try {
      const db = await initDB()
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)

      await new Promise((resolve, reject) => {
        const request = store.delete(chapterId)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })

      // Update local state
      offlineChapters.value = offlineChapters.value.filter(
        chapter => chapter.chapterId !== chapterId
      )

      await checkStorageQuota()
      return { success: true }

    } catch (error) {
      console.error('Error deleting offline chapter:', error)
      return { success: false, error: 'Không thể xóa chương' }
    }
  }

  // Load offline chapters list
  const loadOfflineChapters = async () => {
    try {
      const db = await initDB()
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)

      const chapters = await new Promise((resolve, reject) => {
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      offlineChapters.value = chapters.map(chapter => ({
        chapterId: chapter.chapterId,
        mangaId: chapter.mangaId,
        mangaTitle: chapter.mangaTitle,
        chapterNumber: chapter.chapterNumber,
        chapterTitle: chapter.chapterTitle,
        downloadedAt: chapter.downloadedAt,
        size: chapter.size
      }))

      await checkStorageQuota()

    } catch (error) {
      console.error('Error loading offline chapters:', error)
    }
  }

  // Clear all offline data
  const clearAllOfflineData = async () => {
    try {
      const db = await initDB()
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)

      await new Promise((resolve, reject) => {
        const request = store.clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })

      offlineChapters.value = []
      await checkStorageQuota()

      return { success: true }

    } catch (error) {
      console.error('Error clearing offline data:', error)
      return { success: false }
    }
  }

  // Check if chapter is available offline
  const isChapterOffline = (chapterId) => {
    return offlineChapters.value.some(chapter => chapter.chapterId === chapterId)
  }

  // Get offline chapters by manga
  const getOfflineChaptersByManga = (mangaId) => {
    return offlineChapters.value.filter(chapter => chapter.mangaId === mangaId)
  }

  // Utility function to convert blob to base64
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  // Monitor online/offline status
  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
  }

  // Computed
  const storageUsedMB = computed(() => Math.round(storageUsed.value / (1024 * 1024)))
  const storageLimitMB = computed(() => Math.round(storageLimit.value / (1024 * 1024)))
  const storagePercentage = computed(() => {
    if (storageLimit.value === 0) return 0
    return (storageUsed.value / storageLimit.value) * 100
  })

  const totalOfflineChapters = computed(() => offlineChapters.value.length)
  const totalOfflineSize = computed(() => {
    return offlineChapters.value.reduce((total, chapter) => total + (chapter.size || 0), 0)
  })

  // Initialize
  const initialize = async () => {
    await loadOfflineChapters()
    await checkStorageQuota()
    
    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    updateOnlineStatus()
  }

  return {
    // State
    offlineChapters: readonly(offlineChapters),
    downloadQueue: readonly(downloadQueue),
    downloadProgress: readonly(downloadProgress),
    storageUsed: readonly(storageUsed),
    storageLimit: readonly(storageLimit),
    isOnline: readonly(isOnline),

    // Computed
    storageUsedMB,
    storageLimitMB,
    storagePercentage,
    totalOfflineChapters,
    totalOfflineSize,

    // Methods
    downloadChapter,
    getOfflineChapter,
    deleteOfflineChapter,
    loadOfflineChapters,
    clearAllOfflineData,
    isChapterOffline,
    getOfflineChaptersByManga,
    checkStorageQuota,
    initialize
  }
}
