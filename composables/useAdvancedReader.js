import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

export const useAdvancedReader = () => {
  // Reading settings
  const settings = ref({
    readingMode: 'vertical', // 'vertical', 'horizontal', 'webtoon'
    imageFit: 'width', // 'width', 'height', 'original', 'smart'
    backgroundColor: '#000000',
    brightness: 100,
    contrast: 100,
    autoScroll: false,
    autoScrollSpeed: 3,
    pageTransition: 'slide', // 'slide', 'fade', 'none'
    doubleTapZoom: true,
    gestureNavigation: true,
    fullscreen: false,
    hideUI: false,
    readingDirection: 'ltr', // 'ltr', 'rtl'
    preloadPages: 3,
    offlineMode: false
  })

  // Reading state
  const currentPage = ref(1)
  const totalPages = ref(0)
  const loadedPages = ref(new Set())
  const preloadedPages = ref(new Set())
  const readingProgress = ref(0)
  const readingTime = ref(0)
  const startTime = ref(null)

  // Offline reading
  const offlineChapters = ref([])
  const downloadQueue = ref([])
  const downloadProgress = ref({})

  // Vietnamese reading enhancements
  const vietnameseFeatures = ref({
    vietnameseUI: true,
    mobileOptimized: true,
    slowNetworkMode: false,
    dataSaverMode: false,
    nightMode: false,
    eyeProtection: false
  })

  // Touch and gesture handling
  const touchState = ref({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    startTime: 0,
    isScrolling: false,
    lastTap: 0
  })

  // Computed
  const progressPercentage = computed(() => {
    if (totalPages.value === 0) return 0
    return (currentPage.value / totalPages.value) * 100
  })

  const isLastPage = computed(() => currentPage.value >= totalPages.value)
  const isFirstPage = computed(() => currentPage.value <= 1)

  const readingStats = computed(() => ({
    currentPage: currentPage.value,
    totalPages: totalPages.value,
    progress: progressPercentage.value,
    timeSpent: readingTime.value,
    pagesPerMinute: readingTime.value > 0 ? (currentPage.value / (readingTime.value / 60)).toFixed(1) : 0
  }))

  // Load settings from localStorage
  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('mango-reader-settings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        Object.assign(settings.value, parsed)
      }

      const savedVietnameseFeatures = localStorage.getItem('mango-vietnamese-features')
      if (savedVietnameseFeatures) {
        const parsed = JSON.parse(savedVietnameseFeatures)
        Object.assign(vietnameseFeatures.value, parsed)
      }
    } catch (error) {
      console.error('Error loading reader settings:', error)
    }
  }

  // Save settings to localStorage
  const saveSettings = () => {
    try {
      localStorage.setItem('mango-reader-settings', JSON.stringify(settings.value))
      localStorage.setItem('mango-vietnamese-features', JSON.stringify(vietnameseFeatures.value))
    } catch (error) {
      console.error('Error saving reader settings:', error)
    }
  }

  // Update reading setting
  const updateSetting = (key, value) => {
    settings.value[key] = value
    saveSettings()
    
    // Apply setting immediately
    applyReaderSettings()
  }

  // Apply reader settings to DOM
  const applyReaderSettings = () => {
    const readerElement = document.querySelector('.reader-container')
    if (!readerElement) return

    // Background color
    readerElement.style.backgroundColor = settings.value.backgroundColor

    // Brightness and contrast
    const filters = []
    if (settings.value.brightness !== 100) {
      filters.push(`brightness(${settings.value.brightness}%)`)
    }
    if (settings.value.contrast !== 100) {
      filters.push(`contrast(${settings.value.contrast}%)`)
    }
    
    readerElement.style.filter = filters.join(' ')

    // Night mode
    if (vietnameseFeatures.value.nightMode) {
      readerElement.classList.add('night-mode')
    } else {
      readerElement.classList.remove('night-mode')
    }

    // Eye protection (blue light filter)
    if (vietnameseFeatures.value.eyeProtection) {
      readerElement.classList.add('eye-protection')
    } else {
      readerElement.classList.remove('eye-protection')
    }
  }

  // Navigation methods
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
      updateReadingProgress()
      preloadNextPages()
    }
  }

  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
      updateReadingProgress()
    }
  }

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages.value) {
      currentPage.value = pageNumber
      updateReadingProgress()
      preloadNextPages()
    }
  }

  // Preload pages for smooth reading
  const preloadNextPages = async () => {
    const preloadCount = settings.value.preloadPages
    const startPage = currentPage.value + 1
    const endPage = Math.min(startPage + preloadCount - 1, totalPages.value)

    for (let page = startPage; page <= endPage; page++) {
      if (!preloadedPages.value.has(page)) {
        preloadPage(page)
      }
    }
  }

  const preloadPage = async (pageNumber) => {
    // Implementation depends on how images are structured
    // This is a placeholder for the preloading logic
    preloadedPages.value.add(pageNumber)
  }

  // Touch gesture handling
  const handleTouchStart = (event) => {
    const touch = event.touches[0]
    touchState.value.startX = touch.clientX
    touchState.value.startY = touch.clientY
    touchState.value.startTime = Date.now()
    touchState.value.isScrolling = false
  }

  const handleTouchMove = (event) => {
    if (!settings.value.gestureNavigation) return

    const touch = event.touches[0]
    const deltaX = Math.abs(touch.clientX - touchState.value.startX)
    const deltaY = Math.abs(touch.clientY - touchState.value.startY)

    // Determine if user is scrolling
    if (deltaY > deltaX && deltaY > 10) {
      touchState.value.isScrolling = true
    }
  }

  const handleTouchEnd = (event) => {
    if (!settings.value.gestureNavigation) return

    const touch = event.changedTouches[0]
    touchState.value.endX = touch.clientX
    touchState.value.endY = touch.clientY

    const deltaX = touchState.value.endX - touchState.value.startX
    const deltaY = touchState.value.endY - touchState.value.startY
    const deltaTime = Date.now() - touchState.value.startTime

    // Handle double tap for zoom
    if (settings.value.doubleTapZoom && deltaTime < 300) {
      const now = Date.now()
      if (now - touchState.value.lastTap < 300) {
        handleDoubleTap(event)
        return
      }
      touchState.value.lastTap = now
    }

    // Handle swipe gestures
    if (!touchState.value.isScrolling && deltaTime < 300) {
      const minSwipeDistance = 50

      if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          // Swipe right - previous page (or next page for RTL)
          settings.value.readingDirection === 'rtl' ? nextPage() : previousPage()
        } else {
          // Swipe left - next page (or previous page for RTL)
          settings.value.readingDirection === 'rtl' ? previousPage() : nextPage()
        }
      }
    }
  }

  const handleDoubleTap = (event) => {
    const target = event.target
    if (target.tagName === 'IMG') {
      // Toggle zoom on image
      if (target.style.transform === 'scale(2)') {
        target.style.transform = 'scale(1)'
        target.style.cursor = 'default'
      } else {
        target.style.transform = 'scale(2)'
        target.style.cursor = 'grab'
      }
    }
  }

  // Auto-scroll functionality
  let autoScrollInterval = null

  const startAutoScroll = () => {
    if (!settings.value.autoScroll) return

    autoScrollInterval = setInterval(() => {
      const scrollAmount = settings.value.autoScrollSpeed * 10
      window.scrollBy(0, scrollAmount)

      // Check if reached bottom of page
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        nextPage()
      }
    }, 100)
  }

  const stopAutoScroll = () => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval)
      autoScrollInterval = null
    }
  }

  // Offline reading functionality
  const downloadChapterForOffline = async (chapterId) => {
    if (downloadQueue.value.includes(chapterId)) return

    downloadQueue.value.push(chapterId)
    downloadProgress.value[chapterId] = 0

    try {
      const response = await $fetch(`/api/chapters/${chapterId}/download`)
      
      if (response.success) {
        // Store chapter data in IndexedDB
        await storeChapterOffline(chapterId, response.data)
        
        offlineChapters.value.push(chapterId)
        downloadProgress.value[chapterId] = 100
        
        showToast('Đã tải xuống để đọc offline!', 'success')
      }

    } catch (err) {
      console.error('Error downloading chapter:', err)
      showToast('Không thể tải xuống chương này', 'error')
    } finally {
      downloadQueue.value = downloadQueue.value.filter(id => id !== chapterId)
    }
  }

  const storeChapterOffline = async (chapterId, chapterData) => {
    // IndexedDB implementation for offline storage
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MangoOfflineDB', 1)
      
      request.onerror = () => reject(request.error)
      
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(['chapters'], 'readwrite')
        const store = transaction.objectStore('chapters')
        
        store.put({
          chapterId,
          data: chapterData,
          downloadedAt: new Date().toISOString()
        })
        
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
      }
      
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains('chapters')) {
          db.createObjectStore('chapters', { keyPath: 'chapterId' })
        }
      }
    })
  }

  // Update reading progress
  const updateReadingProgress = () => {
    readingProgress.value = progressPercentage.value
    
    // Update reading time
    if (startTime.value) {
      readingTime.value = (Date.now() - startTime.value) / 1000 / 60 // minutes
    }
  }

  // Vietnamese reading mode optimizations
  const optimizeForVietnamese = () => {
    // Detect slow network
    if ('connection' in navigator) {
      const connection = navigator.connection
      if (connection.effectiveType === '2g' || connection.effectiveType === '3g') {
        vietnameseFeatures.value.slowNetworkMode = true
        settings.value.preloadPages = 1 // Reduce preloading
      }
    }

    // Detect data saver mode
    if ('connection' in navigator && navigator.connection.saveData) {
      vietnameseFeatures.value.dataSaverMode = true
      settings.value.preloadPages = 1
    }

    // Auto night mode based on time
    const hour = new Date().getHours()
    if (hour >= 22 || hour <= 6) {
      vietnameseFeatures.value.nightMode = true
      settings.value.backgroundColor = '#1a1a1a'
    }
  }

  // Keyboard shortcuts
  const handleKeydown = (event) => {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return

    switch (event.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        event.preventDefault()
        settings.value.readingDirection === 'rtl' ? nextPage() : previousPage()
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        event.preventDefault()
        settings.value.readingDirection === 'rtl' ? previousPage() : nextPage()
        break
      case 'ArrowUp':
      case 'w':
      case 'W':
        event.preventDefault()
        window.scrollBy(0, -100)
        break
      case 'ArrowDown':
      case 's':
      case 'S':
        event.preventDefault()
        window.scrollBy(0, 100)
        break
      case 'f':
      case 'F':
        event.preventDefault()
        toggleFullscreen()
        break
      case 'h':
      case 'H':
        event.preventDefault()
        settings.value.hideUI = !settings.value.hideUI
        break
      case ' ':
        event.preventDefault()
        nextPage()
        break
      case 'Escape':
        if (settings.value.fullscreen) {
          toggleFullscreen()
        }
        break
    }
  }

  // Fullscreen functionality
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        settings.value.fullscreen = true
      } else {
        await document.exitFullscreen()
        settings.value.fullscreen = false
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
    }
  }

  // Reading analytics for Vietnamese market
  const trackReadingSession = async (mangaId, chapterId, sessionData) => {
    try {
      await $fetch('/api/analytics/reading-session', {
        method: 'POST',
        body: {
          mangaId,
          chapterId,
          sessionData: {
            ...sessionData,
            readingTime: readingTime.value,
            pagesRead: currentPage.value,
            readingMode: settings.value.readingMode,
            device: vietnameseFeatures.value.mobileOptimized ? 'mobile' : 'desktop',
            networkType: vietnameseFeatures.value.slowNetworkMode ? 'slow' : 'fast'
          },
          timestamp: new Date().toISOString()
        }
      })
    } catch (err) {
      console.error('Error tracking reading session:', err)
    }
  }

  // Vietnamese reading habits optimization
  const optimizeReadingExperience = () => {
    const hour = new Date().getHours()
    
    // Evening reading optimization (popular time in Vietnam)
    if (hour >= 19 && hour <= 23) {
      vietnameseFeatures.value.nightMode = true
      vietnameseFeatures.value.eyeProtection = true
      settings.value.brightness = 80
    }
    
    // Lunch break reading (12-14h)
    if (hour >= 12 && hour <= 14) {
      settings.value.autoScroll = true
      settings.value.autoScrollSpeed = 2 // Slower for quick reading
    }
    
    // Weekend binge reading
    const isWeekend = [0, 6].includes(new Date().getDay())
    if (isWeekend) {
      settings.value.preloadPages = 5 // More aggressive preloading
    }
  }

  // Initialize reading session
  const initializeReading = (pages) => {
    totalPages.value = pages
    currentPage.value = 1
    startTime.value = Date.now()
    readingTime.value = 0
    
    // Start reading timer
    const timer = setInterval(() => {
      if (startTime.value) {
        readingTime.value = (Date.now() - startTime.value) / 1000 / 60
      }
    }, 1000)

    // Cleanup timer on unmount
    onUnmounted(() => {
      clearInterval(timer)
    })

    // Apply Vietnamese optimizations
    optimizeForVietnamese()
    optimizeReadingExperience()
    applyReaderSettings()
    
    // Start preloading
    preloadNextPages()
  }

  // Vietnamese-specific toast notifications
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

  // Watch for auto-scroll changes
  watch(() => settings.value.autoScroll, (newValue) => {
    if (newValue) {
      startAutoScroll()
    } else {
      stopAutoScroll()
    }
  })

  // Watch for fullscreen changes
  const handleFullscreenChange = () => {
    settings.value.fullscreen = !!document.fullscreenElement
  }

  // Lifecycle
  onMounted(() => {
    loadSettings()
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
  })

  onUnmounted(() => {
    stopAutoScroll()
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
  })

  return {
    // Settings
    settings: readonly(settings),
    vietnameseFeatures: readonly(vietnameseFeatures),
    
    // State
    currentPage: readonly(currentPage),
    totalPages: readonly(totalPages),
    loadedPages: readonly(loadedPages),
    readingProgress: readonly(readingProgress),
    readingTime: readonly(readingTime),
    offlineChapters: readonly(offlineChapters),
    downloadQueue: readonly(downloadQueue),
    downloadProgress: readonly(downloadProgress),
    
    // Computed
    progressPercentage,
    isLastPage,
    isFirstPage,
    readingStats,
    
    // Methods
    updateSetting,
    nextPage,
    previousPage,
    goToPage,
    toggleFullscreen,
    downloadChapterForOffline,
    initializeReading,
    trackReadingSession,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    
    // Utils
    loadSettings,
    saveSettings,
    applyReaderSettings,
    optimizeForVietnamese,
    optimizeReadingExperience
  }
}
