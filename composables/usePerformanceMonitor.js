import { ref, onMounted, onUnmounted } from 'vue'

export const usePerformanceMonitor = () => {
  // Network information
  const networkInfo = ref({
    effectiveType: '4g',
    downlink: 10,
    rtt: 100,
    saveData: false
  })

  // Performance metrics
  const performanceMetrics = ref({
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0
  })

  // Device information
  const deviceInfo = ref({
    isMobile: false,
    isSlowDevice: false,
    memoryGB: 0,
    cores: 0,
    screenWidth: 0,
    screenHeight: 0,
    pixelRatio: 1
  })

  // Vietnamese network optimization flags
  const optimizationFlags = ref({
    useWebP: false,
    reducedQuality: false,
    prefetchDisabled: false,
    lazyLoadingAggressive: false
  })

  // Performance recommendations
  const recommendations = ref([])

  // Detect network capabilities
  const detectNetwork = () => {
    if ('connection' in navigator) {
      const connection = navigator.connection
      networkInfo.value = {
        effectiveType: connection.effectiveType || '4g',
        downlink: connection.downlink || 10,
        rtt: connection.rtt || 100,
        saveData: connection.saveData || false
      }

      // Vietnamese mobile network optimization
      const slowNetworks = ['slow-2g', '2g', '3g']
      if (slowNetworks.includes(connection.effectiveType) || connection.downlink < 1.5) {
        optimizationFlags.value.reducedQuality = true
        optimizationFlags.value.lazyLoadingAggressive = true
        optimizationFlags.value.prefetchDisabled = true
      }

      // Data saver mode (common in Vietnam)
      if (connection.saveData) {
        optimizationFlags.value.reducedQuality = true
        optimizationFlags.value.prefetchDisabled = true
      }
    }
  }

  // Detect device capabilities
  const detectDevice = () => {
    deviceInfo.value = {
      isMobile: window.innerWidth < 768,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1
    }

    // Detect memory (if available)
    if ('memory' in navigator) {
      deviceInfo.value.memoryGB = navigator.memory.jsHeapSizeLimit / (1024 * 1024 * 1024)
      deviceInfo.value.isSlowDevice = navigator.memory.jsHeapSizeLimit < 1073741824 // < 1GB
    }

    // Detect CPU cores
    if ('hardwareConcurrency' in navigator) {
      deviceInfo.value.cores = navigator.hardwareConcurrency
      if (navigator.hardwareConcurrency <= 2) {
        deviceInfo.value.isSlowDevice = true
      }
    }

    // WebP support detection
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    optimizationFlags.value.useWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }

  // Measure Core Web Vitals
  const measureCoreWebVitals = () => {
    // First Contentful Paint
    const paintEntries = performance.getEntriesByType('paint')
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    if (fcpEntry) {
      performanceMetrics.value.firstContentfulPaint = fcpEntry.startTime
    }

    // Page Load Time
    const navigationEntry = performance.getEntriesByType('navigation')[0]
    if (navigationEntry) {
      performanceMetrics.value.pageLoadTime = navigationEntry.loadEventEnd - navigationEntry.fetchStart
    }

    // Largest Contentful Paint (using PerformanceObserver)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          const lastEntry = entries[entries.length - 1]
          performanceMetrics.value.largestContentfulPaint = lastEntry.startTime
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((entryList) => {
          let clsValue = 0
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          }
          performanceMetrics.value.cumulativeLayoutShift = clsValue
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })

        // First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            performanceMetrics.value.firstInputDelay = entry.processingStart - entry.startTime
          }
        })
        fidObserver.observe({ entryTypes: ['first-input'] })

      } catch (error) {
        console.warn('Performance Observer not fully supported:', error)
      }
    }
  }

  // Generate Vietnamese-specific recommendations
  const generateRecommendations = () => {
    const recs = []

    // Network-based recommendations
    if (networkInfo.value.effectiveType === '2g' || networkInfo.value.effectiveType === 'slow-2g') {
      recs.push({
        type: 'network',
        priority: 'high',
        message: 'Mạng 2G được phát hiện - Đã tối ưu hóa cho tốc độ chậm',
        action: 'Giảm chất lượng hình ảnh và tắt tự động tải'
      })
    }

    if (networkInfo.value.saveData) {
      recs.push({
        type: 'data-saver',
        priority: 'medium',
        message: 'Chế độ tiết kiệm dữ liệu được bật',
        action: 'Tối ưu hóa cho việc sử dụng dữ liệu thấp'
      })
    }

    // Device-based recommendations
    if (deviceInfo.value.isSlowDevice) {
      recs.push({
        type: 'device',
        priority: 'medium',
        message: 'Thiết bị có hiệu năng thấp được phát hiện',
        action: 'Giảm hiệu ứng animation và tối ưu hóa rendering'
      })
    }

    // Performance-based recommendations
    if (performanceMetrics.value.largestContentfulPaint > 2500) {
      recs.push({
        type: 'performance',
        priority: 'high',
        message: 'Thời gian tải trang chậm',
        action: 'Cần tối ưu hóa hình ảnh và lazy loading'
      })
    }

    if (performanceMetrics.value.cumulativeLayoutShift > 0.1) {
      recs.push({
        type: 'layout',
        priority: 'medium',
        message: 'Layout shift cao',
        action: 'Cần cố định kích thước elements'
      })
    }

    recommendations.value = recs
  }

  // Get optimization settings for images
  const getImageOptimization = (imageUrl = '') => {
    // Skip optimization for Contabo images
    if (imageUrl && imageUrl.includes('usc1.contabostorage.com')) {
      return {
        quality: 80, // Default quality, no processing
        format: 'auto',
        progressive: false,
        blur: 0,
        skipOptimization: true
      }
    }

    const baseQuality = 80
    let quality = baseQuality

    // Reduce quality for slow networks
    if (networkInfo.value.effectiveType === '2g' || networkInfo.value.effectiveType === 'slow-2g') {
      quality = 50
    } else if (networkInfo.value.effectiveType === '3g') {
      quality = 65
    }

    // Further reduce for data saver mode
    if (networkInfo.value.saveData) {
      quality = Math.min(quality - 15, 40)
    }

    // Adjust for device capabilities
    if (deviceInfo.value.isSlowDevice) {
      quality = Math.min(quality - 10, 45)
    }

    return {
      quality,
      format: optimizationFlags.value.useWebP ? 'webp' : 'auto',
      progressive: networkInfo.value.effectiveType !== '2g',
      blur: quality < 60 ? 2 : 0, // Slight blur for very low quality
      skipOptimization: false
    }
  }

  // Get lazy loading settings
  const getLazyLoadingSettings = () => {
    return {
      rootMargin: optimizationFlags.value.lazyLoadingAggressive ? '10px' : '50px',
      threshold: optimizationFlags.value.lazyLoadingAggressive ? 0.01 : 0.1,
      enablePrefetch: !optimizationFlags.value.prefetchDisabled
    }
  }

  // Monitor performance continuously
  const startMonitoring = () => {
    detectNetwork()
    detectDevice()
    measureCoreWebVitals()

    // Re-check network periodically (Vietnamese networks can be unstable)
    const networkCheckInterval = setInterval(detectNetwork, 30000) // Every 30 seconds

    // Generate recommendations after initial load
    setTimeout(generateRecommendations, 3000)

    return () => {
      clearInterval(networkCheckInterval)
    }
  }

  // Send analytics (Vietnamese market insights)
  const sendAnalytics = () => {
    const analyticsData = {
      network: networkInfo.value,
      device: deviceInfo.value,
      performance: performanceMetrics.value,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      location: 'vietnam' // Can be detected more precisely
    }

    // Send to analytics endpoint (non-blocking)
    try {
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analyticsData)
      }).catch(() => {}) // Silent fail
    } catch (error) {
      // Silent fail - analytics shouldn't break the app
    }
  }

  // Lifecycle
  let cleanup = null

  onMounted(() => {
    cleanup = startMonitoring()
    
    // Send analytics after page is fully loaded
    window.addEventListener('load', () => {
      setTimeout(sendAnalytics, 2000)
    })
  })

  onUnmounted(() => {
    if (cleanup) cleanup()
  })

  return {
    networkInfo: readonly(networkInfo),
    deviceInfo: readonly(deviceInfo),
    performanceMetrics: readonly(performanceMetrics),
    optimizationFlags: readonly(optimizationFlags),
    recommendations: readonly(recommendations),
    getImageOptimization,
    getLazyLoadingSettings,
    generateRecommendations
  }
}
