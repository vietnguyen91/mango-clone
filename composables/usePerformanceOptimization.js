import { ref, onMounted, onUnmounted } from 'vue'

export const usePerformanceOptimization = () => {
  // Performance metrics
  const metrics = ref({
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    fid: 0, // First Input Delay
    cls: 0, // Cumulative Layout Shift
    ttfb: 0, // Time to First Byte
    pageLoadTime: 0
  })

  // Network information
  const networkInfo = ref({
    effectiveType: '4g',
    downlink: 10,
    rtt: 100,
    saveData: false
  })

  // Device information
  const deviceInfo = ref({
    memory: 0,
    cores: 0,
    isMobile: false,
    isSlowDevice: false
  })

  // Performance recommendations
  const recommendations = ref([])

  // Vietnamese mobile optimization flags
  const optimizationFlags = ref({
    enableImageOptimization: true,
    enableLazyLoading: true,
    enablePrefetching: true,
    enableServiceWorker: true,
    enableCompression: true,
    enableCDN: true,
    reduceAnimations: false,
    enableOfflineMode: false
  })

  // Measure Core Web Vitals
  const measureCoreWebVitals = () => {
    // First Contentful Paint
    const paintEntries = performance.getEntriesByType('paint')
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    if (fcpEntry) {
      metrics.value.fcp = fcpEntry.startTime
    }

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0]
    if (navigationEntry) {
      metrics.value.ttfb = navigationEntry.responseStart - navigationEntry.requestStart
      metrics.value.pageLoadTime = navigationEntry.loadEventEnd - navigationEntry.fetchStart
    }

    // Use PerformanceObserver for other metrics
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        metrics.value.lcp = lastEntry.startTime
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // Cumulative Layout Shift
      let clsValue = 0
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        }
        metrics.value.cls = clsValue
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          metrics.value.fid = entry.processingStart - entry.startTime
        }
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
    }
  }

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

      // Adjust optimizations based on network
      const slowNetworks = ['slow-2g', '2g', '3g']
      if (slowNetworks.includes(connection.effectiveType) || connection.downlink < 1.5) {
        optimizationFlags.value.enablePrefetching = false
        optimizationFlags.value.reduceAnimations = true
      }

      if (connection.saveData) {
        optimizationFlags.value.enableImageOptimization = true
        optimizationFlags.value.enablePrefetching = false
      }
    }
  }

  // Detect device capabilities
  const detectDevice = () => {
    deviceInfo.value.isMobile = window.innerWidth < 768

    if ('memory' in navigator) {
      deviceInfo.value.memory = navigator.memory.jsHeapSizeLimit / (1024 * 1024 * 1024)
      deviceInfo.value.isSlowDevice = navigator.memory.jsHeapSizeLimit < 1073741824 // < 1GB
    }

    if ('hardwareConcurrency' in navigator) {
      deviceInfo.value.cores = navigator.hardwareConcurrency
      if (navigator.hardwareConcurrency <= 2) {
        deviceInfo.value.isSlowDevice = true
      }
    }

    // Adjust optimizations for slow devices
    if (deviceInfo.value.isSlowDevice) {
      optimizationFlags.value.reduceAnimations = true
      optimizationFlags.value.enableOfflineMode = true
    }
  }

  // Generate performance recommendations
  const generateRecommendations = () => {
    const recs = []

    // Core Web Vitals recommendations
    if (metrics.value.lcp > 2500) {
      recs.push({
        type: 'performance',
        priority: 'high',
        title: 'Tối ưu Largest Contentful Paint',
        description: 'Thời gian tải nội dung chính quá chậm',
        action: 'Tối ưu hóa hình ảnh và lazy loading',
        impact: 'Cải thiện trải nghiệm người dùng đáng kể'
      })
    }

    if (metrics.value.fid > 100) {
      recs.push({
        type: 'interactivity',
        priority: 'high',
        title: 'Giảm First Input Delay',
        description: 'Thời gian phản hồi tương tác chậm',
        action: 'Tối ưu JavaScript và giảm blocking tasks',
        impact: 'Tăng tính tương tác của ứng dụng'
      })
    }

    if (metrics.value.cls > 0.1) {
      recs.push({
        type: 'layout',
        priority: 'medium',
        title: 'Giảm Cumulative Layout Shift',
        description: 'Layout bị dịch chuyển nhiều',
        action: 'Cố định kích thước elements và fonts',
        impact: 'Giảm việc nhảy layout khi tải'
      })
    }

    // Network-specific recommendations
    if (networkInfo.value.effectiveType === '2g' || networkInfo.value.effectiveType === 'slow-2g') {
      recs.push({
        type: 'network',
        priority: 'high',
        title: 'Tối ưu cho mạng 2G',
        description: 'Mạng chậm được phát hiện',
        action: 'Giảm chất lượng hình ảnh và tắt prefetching',
        impact: 'Cải thiện tốc độ tải trên mạng chậm'
      })
    }

    if (networkInfo.value.saveData) {
      recs.push({
        type: 'data-saving',
        priority: 'medium',
        title: 'Chế độ tiết kiệm dữ liệu',
        description: 'Người dùng bật chế độ tiết kiệm dữ liệu',
        action: 'Giảm kích thước tài nguyên và tắt auto-play',
        impact: 'Tiết kiệm băng thông cho người dùng'
      })
    }

    // Device-specific recommendations
    if (deviceInfo.value.isSlowDevice) {
      recs.push({
        type: 'device',
        priority: 'medium',
        title: 'Tối ưu cho thiết bị yếu',
        description: 'Thiết bị có hiệu năng thấp',
        action: 'Giảm animations và tối ưu rendering',
        impact: 'Cải thiện hiệu năng trên thiết bị cũ'
      })
    }

    recommendations.value = recs
  }

  // Image optimization for Vietnamese networks
  const optimizeImageForNetwork = (imageUrl, options = {}) => {
    const {
      width = 800,
      quality = 80,
      format = 'auto'
    } = options

    // Adjust quality based on network
    let adjustedQuality = quality
    if (networkInfo.value.effectiveType === '2g') {
      adjustedQuality = Math.min(quality - 30, 40)
    } else if (networkInfo.value.effectiveType === '3g') {
      adjustedQuality = Math.min(quality - 15, 60)
    }

    if (networkInfo.value.saveData) {
      adjustedQuality = Math.min(adjustedQuality - 10, 50)
    }

    // Build optimized URL
    const params = new URLSearchParams({
      w: width,
      q: adjustedQuality,
      f: format
    })

    return `${imageUrl}?${params.toString()}`
  }

  // Preload critical resources
  const preloadCriticalResources = (resources) => {
    if (!optimizationFlags.value.enablePrefetching) return

    resources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.url
      link.as = resource.type || 'image'
      
      if (resource.type === 'image') {
        link.type = 'image/webp'
      }
      
      document.head.appendChild(link)
    })
  }

  // Lazy load images with Intersection Observer
  const setupLazyLoading = () => {
    if (!optimizationFlags.value.enableLazyLoading) return

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
            imageObserver.unobserve(img)
          }
        }
      })
    }, {
      rootMargin: '50px'
    })

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img)
    })

    return imageObserver
  }

  // Monitor performance continuously
  const startPerformanceMonitoring = () => {
    measureCoreWebVitals()
    detectNetwork()
    detectDevice()

    // Re-check network every 30 seconds (Vietnamese networks can be unstable)
    const networkInterval = setInterval(detectNetwork, 30000)

    // Generate recommendations after initial measurements
    setTimeout(generateRecommendations, 3000)

    return () => {
      clearInterval(networkInterval)
    }
  }

  // Send performance data to analytics
  const sendPerformanceAnalytics = () => {
    const analyticsData = {
      metrics: metrics.value,
      network: networkInfo.value,
      device: deviceInfo.value,
      optimizations: optimizationFlags.value,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
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

  // Vietnamese-specific performance optimizations
  const applyVietnameseOptimizations = () => {
    // Common Vietnamese mobile devices optimization
    const commonVietnameseDevices = [
      'iPhone 6', 'iPhone 7', 'iPhone 8', 'iPhone SE',
      'Samsung Galaxy J', 'Samsung Galaxy A', 'Oppo A', 'Vivo Y'
    ]

    const userAgent = navigator.userAgent
    const isCommonVietnameseDevice = commonVietnameseDevices.some(device => 
      userAgent.includes(device)
    )

    if (isCommonVietnameseDevice) {
      optimizationFlags.value.reduceAnimations = true
      optimizationFlags.value.enableImageOptimization = true
    }

    // Vietnamese peak hours optimization (7-9 PM)
    const hour = new Date().getHours()
    if (hour >= 19 && hour <= 21) {
      // Peak usage time - be more conservative
      optimizationFlags.value.enablePrefetching = false
    }
  }

  // Resource hints for Vietnamese CDN
  const addResourceHints = () => {
    const hints = [
      { rel: 'dns-prefetch', href: '//cdn.mango.vn' },
      { rel: 'dns-prefetch', href: '//images.mango.vn' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
    ]

    hints.forEach(hint => {
      const link = document.createElement('link')
      Object.assign(link, hint)
      document.head.appendChild(link)
    })
  }

  // Critical CSS inlining
  const inlineCriticalCSS = (css) => {
    const style = document.createElement('style')
    style.textContent = css
    style.setAttribute('data-critical', 'true')
    document.head.appendChild(style)
  }

  // Defer non-critical JavaScript
  const deferNonCriticalJS = () => {
    const scripts = document.querySelectorAll('script[data-defer]')
    scripts.forEach(script => {
      script.defer = true
    })
  }

  // Image format detection and optimization
  const detectOptimalImageFormat = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1

    // Check WebP support
    const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0

    // Check AVIF support
    const supportsAVIF = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0

    return {
      webp: supportsWebP,
      avif: supportsAVIF,
      optimal: supportsAVIF ? 'avif' : supportsWebP ? 'webp' : 'jpg'
    }
  }

  // Vietnamese mobile performance score
  const calculateVietnameseMobileScore = () => {
    let score = 100

    // Deduct points for poor Core Web Vitals
    if (metrics.value.lcp > 2500) score -= 20
    if (metrics.value.fid > 100) score -= 15
    if (metrics.value.cls > 0.1) score -= 15
    if (metrics.value.fcp > 1800) score -= 10

    // Deduct points for slow network
    if (networkInfo.value.effectiveType === '2g') score -= 20
    if (networkInfo.value.effectiveType === '3g') score -= 10

    // Deduct points for slow device
    if (deviceInfo.value.isSlowDevice) score -= 15

    // Bonus points for optimizations
    if (optimizationFlags.value.enableImageOptimization) score += 5
    if (optimizationFlags.value.enableLazyLoading) score += 5
    if (optimizationFlags.value.enableServiceWorker) score += 5

    return Math.max(score, 0)
  }

  // Performance budget checker
  const checkPerformanceBudget = () => {
    const budget = {
      maxLCP: 2500, // 2.5s for Vietnamese mobile
      maxFID: 100,  // 100ms
      maxCLS: 0.1,  // 0.1
      maxPageSize: 2 * 1024 * 1024, // 2MB
      maxImageSize: 500 * 1024 // 500KB per image
    }

    const violations = []

    if (metrics.value.lcp > budget.maxLCP) {
      violations.push({
        metric: 'LCP',
        current: metrics.value.lcp,
        budget: budget.maxLCP,
        severity: 'high'
      })
    }

    if (metrics.value.fid > budget.maxFID) {
      violations.push({
        metric: 'FID',
        current: metrics.value.fid,
        budget: budget.maxFID,
        severity: 'high'
      })
    }

    if (metrics.value.cls > budget.maxCLS) {
      violations.push({
        metric: 'CLS',
        current: metrics.value.cls,
        budget: budget.maxCLS,
        severity: 'medium'
      })
    }

    return violations
  }

  // Initialize performance monitoring
  const initialize = () => {
    measureCoreWebVitals()
    detectNetwork()
    detectDevice()
    applyVietnameseOptimizations()
    addResourceHints()

    // Send analytics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        generateRecommendations()
        sendPerformanceAnalytics()
      }, 2000)
    })

    // Monitor network changes
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', detectNetwork)
    }

    return startPerformanceMonitoring()
  }

  // Cleanup
  let cleanup = null

  onMounted(() => {
    cleanup = initialize()
  })

  onUnmounted(() => {
    if (cleanup) cleanup()
  })

  return {
    // State
    metrics: readonly(metrics),
    networkInfo: readonly(networkInfo),
    deviceInfo: readonly(deviceInfo),
    recommendations: readonly(recommendations),
    optimizationFlags: readonly(optimizationFlags),

    // Methods
    measureCoreWebVitals,
    detectNetwork,
    detectDevice,
    generateRecommendations,
    optimizeImageForNetwork,
    preloadCriticalResources,
    setupLazyLoading,
    detectOptimalImageFormat,
    calculateVietnameseMobileScore,
    checkPerformanceBudget,
    applyVietnameseOptimizations,

    // Utils
    inlineCriticalCSS,
    deferNonCriticalJS,
    addResourceHints
  }
}
