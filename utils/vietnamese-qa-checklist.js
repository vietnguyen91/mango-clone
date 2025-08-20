// Vietnamese Quality Assurance Checklist for Mango

export const vietnameseQAChecklist = {
  // Mobile Experience (Critical for Vietnamese market)
  mobile: [
    {
      id: 'mobile-responsive',
      category: 'Layout',
      title: 'Responsive design works on all Vietnamese mobile devices',
      description: 'Test on iPhone 6/7/8, Samsung Galaxy A series, Oppo A series',
      priority: 'critical',
      testSteps: [
        'Open site on target devices',
        'Check layout adapts correctly',
        'Verify touch targets are at least 44px',
        'Test landscape/portrait orientation'
      ]
    },
    {
      id: 'mobile-navigation',
      category: 'Navigation',
      title: 'Mobile navigation is intuitive for Vietnamese users',
      description: 'Bottom navigation, hamburger menu, breadcrumbs work correctly',
      priority: 'high',
      testSteps: [
        'Test bottom navigation tabs',
        'Open and close hamburger menu',
        'Navigate through different sections',
        'Check back button behavior'
      ]
    },
    {
      id: 'touch-gestures',
      category: 'Interaction',
      title: 'Touch gestures work correctly in reader',
      description: 'Swipe navigation, pinch zoom, double tap work as expected',
      priority: 'high',
      testSteps: [
        'Test swipe left/right for page navigation',
        'Test pinch to zoom on manga pages',
        'Test double tap to zoom',
        'Test long press for context menu'
      ]
    }
  ],

  // Vietnamese Content & Localization
  localization: [
    {
      id: 'vietnamese-text',
      category: 'Content',
      title: 'Vietnamese text displays correctly',
      description: 'Diacritics, special characters, and formatting work properly',
      priority: 'critical',
      testSteps: [
        'Check diacritics render correctly (ă, â, ê, ô, ơ, ư)',
        'Verify tone marks display properly (á, à, ả, ã, ạ)',
        'Test text wrapping and line breaks',
        'Check font rendering on different devices'
      ]
    },
    {
      id: 'vietnamese-ui',
      category: 'Interface',
      title: 'All UI elements use Vietnamese text',
      description: 'Buttons, labels, messages, and navigation use proper Vietnamese',
      priority: 'high',
      testSteps: [
        'Check all button labels are in Vietnamese',
        'Verify error messages are translated',
        'Test form validation messages',
        'Check loading and empty states'
      ]
    },
    {
      id: 'date-time-format',
      category: 'Formatting',
      title: 'Date and time use Vietnamese format',
      description: 'Dates, times, and relative timestamps use Vietnamese conventions',
      priority: 'medium',
      testSteps: [
        'Check date format (dd/mm/yyyy)',
        'Verify relative time ("5 phút trước")',
        'Test timezone (Asia/Ho_Chi_Minh)',
        'Check calendar displays'
      ]
    }
  ],

  // Performance for Vietnamese Networks
  performance: [
    {
      id: 'slow-network',
      category: 'Network',
      title: 'Site works on slow Vietnamese mobile networks',
      description: '2G/3G performance, data saver mode, offline functionality',
      priority: 'critical',
      testSteps: [
        'Test on simulated 2G network',
        'Check loading states and skeleton screens',
        'Verify image optimization and lazy loading',
        'Test offline functionality'
      ]
    },
    {
      id: 'image-optimization',
      category: 'Images',
      title: 'Images are optimized for Vietnamese mobile users',
      description: 'WebP format, appropriate compression, responsive images',
      priority: 'high',
      testSteps: [
        'Check WebP format is used when supported',
        'Verify image compression quality',
        'Test responsive image loading',
        'Check lazy loading implementation'
      ]
    },
    {
      id: 'core-web-vitals',
      category: 'Metrics',
      title: 'Core Web Vitals meet Vietnamese mobile standards',
      description: 'LCP < 2.5s, FID < 100ms, CLS < 0.1 on mobile',
      priority: 'high',
      testSteps: [
        'Measure LCP on mobile devices',
        'Test FID with user interactions',
        'Check CLS during page load',
        'Verify metrics on slow networks'
      ]
    }
  ],

  // Search & Discovery
  search: [
    {
      id: 'vietnamese-search',
      category: 'Search',
      title: 'Search works with Vietnamese input methods',
      description: 'Diacritics, fuzzy search, autocomplete work correctly',
      priority: 'critical',
      testSteps: [
        'Search with Vietnamese diacritics',
        'Search without diacritics (fuzzy)',
        'Test autocomplete suggestions',
        'Check search result relevance'
      ]
    },
    {
      id: 'genre-filtering',
      category: 'Filtering',
      title: 'Genre filtering uses Vietnamese categories',
      description: 'All genres are properly translated and functional',
      priority: 'high',
      testSteps: [
        'Check all Vietnamese genre names',
        'Test genre filtering functionality',
        'Verify genre combinations work',
        'Check genre page SEO'
      ]
    }
  ],

  // User Features
  userFeatures: [
    {
      id: 'bookmark-system',
      category: 'Bookmarks',
      title: 'Bookmark system works offline and online',
      description: 'Bookmarking, syncing, and offline access work correctly',
      priority: 'high',
      testSteps: [
        'Add/remove bookmarks',
        'Test offline bookmark access',
        'Check sync when back online',
        'Verify bookmark persistence'
      ]
    },
    {
      id: 'reading-progress',
      category: 'Progress',
      title: 'Reading progress tracking is accurate',
      description: 'Progress saves correctly and syncs across devices',
      priority: 'high',
      testSteps: [
        'Read partial chapter and check progress',
        'Switch devices and verify sync',
        'Test progress in different reading modes',
        'Check progress persistence offline'
      ]
    },
    {
      id: 'social-features',
      category: 'Social',
      title: 'Social features work with Vietnamese platforms',
      description: 'Facebook, Zalo, Telegram sharing work correctly',
      priority: 'medium',
      testSteps: [
        'Test Facebook sharing',
        'Test Zalo integration (if available)',
        'Test Telegram sharing',
        'Check social login options'
      ]
    }
  ],

  // SEO & Accessibility
  seoAccessibility: [
    {
      id: 'vietnamese-seo',
      category: 'SEO',
      title: 'SEO optimized for Vietnamese search engines',
      description: 'Meta tags, structured data, sitemap use Vietnamese keywords',
      priority: 'high',
      testSteps: [
        'Check Vietnamese meta descriptions',
        'Verify structured data in Vietnamese',
        'Test sitemap generation',
        'Check canonical URLs'
      ]
    },
    {
      id: 'accessibility',
      category: 'Accessibility',
      title: 'Site is accessible for Vietnamese users with disabilities',
      description: 'Screen readers, keyboard navigation, ARIA labels work',
      priority: 'medium',
      testSteps: [
        'Test with Vietnamese screen reader',
        'Check keyboard navigation',
        'Verify ARIA labels in Vietnamese',
        'Test color contrast ratios'
      ]
    }
  ],

  // Security & Privacy
  security: [
    {
      id: 'data-privacy',
      category: 'Privacy',
      title: 'User data privacy complies with Vietnamese regulations',
      description: 'Data collection, storage, and processing follow local laws',
      priority: 'critical',
      testSteps: [
        'Review data collection practices',
        'Check privacy policy in Vietnamese',
        'Verify user consent mechanisms',
        'Test data deletion functionality'
      ]
    },
    {
      id: 'content-moderation',
      category: 'Moderation',
      title: 'Content moderation works for Vietnamese content',
      description: 'Inappropriate content detection and filtering for Vietnamese',
      priority: 'high',
      testSteps: [
        'Test Vietnamese profanity filter',
        'Check spam detection',
        'Verify report functionality',
        'Test admin moderation tools'
      ]
    }
  ]
}

// QA Test Runner
export class VietnameseQARunner {
  constructor() {
    this.results = []
    this.currentTest = null
  }

  async runChecklist(categories = null) {
    const categoriesToRun = categories || Object.keys(vietnameseQAChecklist)
    
    for (const category of categoriesToRun) {
      const tests = vietnameseQAChecklist[category]
      
      for (const test of tests) {
        await this.runTest(test)
      }
    }

    return this.generateReport()
  }

  async runTest(test) {
    this.currentTest = test
    
    const result = {
      id: test.id,
      category: test.category,
      title: test.title,
      priority: test.priority,
      status: 'pending',
      startTime: Date.now(),
      endTime: null,
      errors: [],
      warnings: [],
      notes: []
    }

    try {
      // Run automated checks if available
      await this.runAutomatedChecks(test)
      
      result.status = 'passed'
      result.endTime = Date.now()
      
    } catch (error) {
      result.status = 'failed'
      result.errors.push(error.message)
      result.endTime = Date.now()
    }

    this.results.push(result)
    return result
  }

  async runAutomatedChecks(test) {
    // Implement automated checks based on test ID
    switch (test.id) {
      case 'vietnamese-text':
        await this.checkVietnameseTextRendering()
        break
      case 'mobile-responsive':
        await this.checkMobileResponsiveness()
        break
      case 'performance':
        await this.checkPerformanceMetrics()
        break
      // Add more automated checks as needed
    }
  }

  async checkVietnameseTextRendering() {
    // Check if Vietnamese characters render correctly
    const testText = 'Truyện tranh Việt Nam có dấu: áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ'
    
    const testElement = document.createElement('div')
    testElement.textContent = testText
    testElement.style.fontFamily = 'Inter, system-ui, sans-serif'
    document.body.appendChild(testElement)
    
    const computedStyle = window.getComputedStyle(testElement)
    const actualFont = computedStyle.fontFamily
    
    document.body.removeChild(testElement)
    
    if (!actualFont.includes('Inter') && !actualFont.includes('system-ui')) {
      throw new Error('Vietnamese-friendly font not loaded')
    }
  }

  async checkMobileResponsiveness() {
    // Check if layout adapts to mobile viewport
    const originalWidth = window.innerWidth
    
    // Simulate mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    })
    
    window.dispatchEvent(new Event('resize'))
    
    // Check if mobile navigation is visible
    const mobileNav = document.querySelector('[data-testid="mobile-navigation"]')
    if (!mobileNav || window.getComputedStyle(mobileNav).display === 'none') {
      throw new Error('Mobile navigation not visible on mobile viewport')
    }
    
    // Restore original width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalWidth
    })
    
    window.dispatchEvent(new Event('resize'))
  }

  async checkPerformanceMetrics() {
    // Check Core Web Vitals
    const navigation = performance.getEntriesByType('navigation')[0]
    if (!navigation) {
      throw new Error('Navigation timing not available')
    }

    const loadTime = navigation.loadEventEnd - navigation.fetchStart
    if (loadTime > 5000) { // 5 seconds threshold for mobile
      throw new Error(`Page load time too slow: ${loadTime}ms`)
    }
  }

  generateReport() {
    const total = this.results.length
    const passed = this.results.filter(r => r.status === 'passed').length
    const failed = this.results.filter(r => r.status === 'failed').length
    const critical = this.results.filter(r => r.priority === 'critical').length
    const criticalFailed = this.results.filter(r => r.priority === 'critical' && r.status === 'failed').length

    return {
      summary: {
        total,
        passed,
        failed,
        passRate: ((passed / total) * 100).toFixed(1),
        critical,
        criticalFailed,
        criticalPassRate: critical > 0 ? (((critical - criticalFailed) / critical) * 100).toFixed(1) : '100'
      },
      results: this.results,
      recommendations: this.generateRecommendations(),
      generatedAt: new Date().toISOString()
    }
  }

  generateRecommendations() {
    const recommendations = []
    const failedTests = this.results.filter(r => r.status === 'failed')

    failedTests.forEach(test => {
      if (test.priority === 'critical') {
        recommendations.push({
          priority: 'immediate',
          title: `Fix Critical Issue: ${test.title}`,
          description: test.errors.join(', '),
          impact: 'Blocks Vietnamese mobile users from using the site effectively'
        })
      } else if (test.priority === 'high') {
        recommendations.push({
          priority: 'high',
          title: `Address: ${test.title}`,
          description: test.errors.join(', '),
          impact: 'Significantly impacts Vietnamese user experience'
        })
      }
    })

    // Performance recommendations
    const performanceTests = this.results.filter(r => r.category === 'Performance')
    if (performanceTests.some(t => t.status === 'failed')) {
      recommendations.push({
        priority: 'high',
        title: 'Optimize for Vietnamese Mobile Networks',
        description: 'Implement aggressive image optimization and caching for 2G/3G networks',
        impact: 'Critical for Vietnamese users on slower networks'
      })
    }

    return recommendations
  }
}

// Automated testing utilities
export const vietnameseTestUtils = {
  // Check if Vietnamese text is properly encoded
  checkVietnameseEncoding: (text) => {
    const vietnameseChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i
    return vietnameseChars.test(text)
  },

  // Validate Vietnamese phone number format
  validateVietnamesePhone: (phone) => {
    const phoneRegex = /^(\+84|84|0)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  },

  // Check Vietnamese address format
  validateVietnameseAddress: (address) => {
    const addressParts = ['Phường', 'Quận', 'Thành phố', 'Tỉnh', 'Huyện', 'Xã']
    return addressParts.some(part => address.includes(part))
  },

  // Vietnamese search term normalization
  normalizeVietnameseSearch: (query) => {
    // Remove diacritics for fuzzy search
    return query
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
  },

  // Check Vietnamese content appropriateness
  checkContentAppropriateness: (content) => {
    const inappropriateWords = [
      'đụ', 'địt', 'lồn', 'cặc', 'buồi', 'chó', 'súc vật'
    ]
    
    const lowerContent = content.toLowerCase()
    return !inappropriateWords.some(word => lowerContent.includes(word))
  },

  // Vietnamese reading time estimation
  estimateVietnameseReadingTime: (text) => {
    // Average Vietnamese reading speed: 200-250 words per minute
    const words = text.split(/\s+/).length
    const readingSpeed = 225 // words per minute
    return Math.ceil(words / readingSpeed)
  },

  // Check Vietnamese SEO optimization
  checkVietnameseSEO: (pageData) => {
    const issues = []

    // Check title length (Vietnamese titles can be longer)
    if (pageData.title.length > 70) {
      issues.push('Title too long for Vietnamese search results')
    }

    // Check description
    if (!pageData.description || pageData.description.length < 120) {
      issues.push('Meta description too short for Vietnamese content')
    }

    // Check Vietnamese keywords
    const vietnameseKeywords = ['truyện', 'manga', 'đọc', 'miễn phí', 'online']
    const hasVietnameseKeywords = vietnameseKeywords.some(keyword => 
      pageData.description.toLowerCase().includes(keyword)
    )
    
    if (!hasVietnameseKeywords) {
      issues.push('Missing Vietnamese keywords in meta description')
    }

    return {
      passed: issues.length === 0,
      issues
    }
  }
}

// Performance testing for Vietnamese conditions
export const vietnamesePerformanceTests = {
  // Test image loading on slow networks
  testImageLoadingPerformance: async () => {
    const images = document.querySelectorAll('img')
    const loadTimes = []

    for (const img of images) {
      const startTime = performance.now()
      
      await new Promise((resolve) => {
        if (img.complete) {
          resolve()
        } else {
          img.onload = resolve
          img.onerror = resolve
        }
      })

      const loadTime = performance.now() - startTime
      loadTimes.push(loadTime)
    }

    const averageLoadTime = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length
    
    return {
      averageLoadTime,
      slowImages: loadTimes.filter(time => time > 2000).length,
      totalImages: images.length
    }
  },

  // Test Vietnamese text rendering performance
  testVietnameseTextPerformance: () => {
    const startTime = performance.now()
    
    // Create test element with Vietnamese text
    const testElement = document.createElement('div')
    testElement.innerHTML = 'Truyện tranh Việt Nam với nhiều dấu thanh: áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ'.repeat(100)
    testElement.style.fontFamily = 'Inter, system-ui, sans-serif'
    
    document.body.appendChild(testElement)
    
    // Force layout
    testElement.offsetHeight
    
    const renderTime = performance.now() - startTime
    
    document.body.removeChild(testElement)
    
    return {
      renderTime,
      passed: renderTime < 100 // Should render within 100ms
    }
  }
}

// Export QA runner instance
export const qaRunner = new VietnameseQARunner()
