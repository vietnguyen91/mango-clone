import { test, expect, devices } from '@playwright/test'

// Vietnamese mobile device configurations
const vietnameseMobileDevices = {
  'iPhone 8 Vietnam': {
    ...devices['iPhone 8'],
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh'
  },
  'Samsung Galaxy A Vietnam': {
    userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-A505F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
    screen: { width: 412, height: 869 },
    viewport: { width: 412, height: 869 },
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true,
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh'
  },
  'Oppo A Vietnam': {
    userAgent: 'Mozilla/5.0 (Linux; Android 9; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
    screen: { width: 360, height: 760 },
    viewport: { width: 360, height: 760 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh'
  }
}

// Test Vietnamese mobile experience
Object.entries(vietnameseMobileDevices).forEach(([deviceName, device]) => {
  test.describe(`Vietnamese Mobile Experience - ${deviceName}`, () => {
    test.use(device)

    test('Homepage loads correctly on Vietnamese mobile', async ({ page }) => {
      // Navigate to homepage
      await page.goto('/')

      // Check Vietnamese content
      await expect(page.locator('h1')).toContainText(['Mango', 'Truyện Tranh'])
      
      // Check mobile navigation
      await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible()
      
      // Check featured manga section
      await expect(page.locator('[data-testid="featured-manga"]')).toBeVisible()
      
      // Check Vietnamese genre categories
      const genreSection = page.locator('[data-testid="genre-categories"]')
      await expect(genreSection).toBeVisible()
      await expect(genreSection).toContainText(['Hành Động', 'Lãng Mạn', 'Huyền Huyễn'])

      // Performance check
      const performanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0]
        return {
          loadTime: navigation.loadEventEnd - navigation.fetchStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart
        }
      })

      // Vietnamese mobile should load within 3 seconds
      expect(performanceMetrics.loadTime).toBeLessThan(3000)
    })

    test('Search functionality works in Vietnamese', async ({ page }) => {
      await page.goto('/')

      // Open search
      await page.click('[data-testid="search-button"]')
      
      // Test Vietnamese search
      const searchInput = page.locator('[data-testid="search-input"]')
      await searchInput.fill('hành động')
      
      // Check autocomplete suggestions
      await expect(page.locator('[data-testid="search-suggestions"]')).toBeVisible()
      
      // Submit search
      await searchInput.press('Enter')
      
      // Check search results
      await expect(page.locator('[data-testid="search-results"]')).toBeVisible()
      await expect(page.locator('.manga-card')).toHaveCount({ min: 1 })
    })

    test('Mobile reading experience', async ({ page }) => {
      // Navigate to a manga chapter
      await page.goto('/read/test-chapter-id')

      // Check mobile reader interface
      await expect(page.locator('[data-testid="mobile-reader"]')).toBeVisible()
      
      // Test touch navigation
      const readerContainer = page.locator('[data-testid="reader-container"]')
      
      // Swipe left (next page)
      await readerContainer.swipe({ direction: 'left' })
      await page.waitForTimeout(500)
      
      // Check page changed
      const currentPage = await page.locator('[data-testid="current-page"]').textContent()
      expect(parseInt(currentPage)).toBeGreaterThan(1)

      // Test settings panel
      await page.click('[data-testid="reader-settings-button"]')
      await expect(page.locator('[data-testid="reader-settings-panel"]')).toBeVisible()
      
      // Check Vietnamese settings options
      await expect(page.locator('[data-testid="reading-mode-vertical"]')).toContainText('Cuộn dọc')
      await expect(page.locator('[data-testid="night-mode-toggle"]')).toBeVisible()
    })

    test('Bookmark functionality', async ({ page }) => {
      // Login first (mock user)
      await page.goto('/manga/test-manga-slug')
      
      // Click bookmark button
      const bookmarkButton = page.locator('[data-testid="bookmark-button"]')
      await bookmarkButton.click()
      
      // Check success message
      await expect(page.locator('.toast')).toContainText('Đã thêm vào yêu thích')
      
      // Check bookmark state
      await expect(bookmarkButton).toContainText('Đã yêu thích')
      
      // Navigate to bookmarks page
      await page.goto('/bookmarks')
      await expect(page.locator('.manga-card')).toHaveCount({ min: 1 })
    })

    test('Vietnamese comment system', async ({ page }) => {
      await page.goto('/manga/test-manga-slug')

      // Scroll to comments section
      await page.locator('[data-testid="comment-system"]').scrollIntoViewIfNeeded()
      
      // Check comment form (requires login)
      const commentForm = page.locator('[data-testid="comment-form"]')
      if (await commentForm.isVisible()) {
        // Test Vietnamese comment submission
        await commentForm.locator('textarea').fill('Truyện này hay quá! Rất thích phong cách vẽ.')
        await commentForm.locator('button[type="submit"]').click()
        
        // Check success
        await expect(page.locator('.toast')).toContainText('Bình luận đã được gửi')
      }
      
      // Check existing comments display
      const comments = page.locator('[data-testid="comment-item"]')
      if (await comments.count() > 0) {
        await expect(comments.first()).toBeVisible()
        
        // Check Vietnamese time formatting
        await expect(comments.first().locator('.comment-time')).toContainText(['phút trước', 'giờ trước', 'ngày trước'])
      }
    })

    test('Offline functionality', async ({ page, context }) => {
      // Go offline
      await context.setOffline(true)
      
      await page.goto('/')
      
      // Check offline message
      await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible()
      await expect(page.locator('[data-testid="offline-indicator"]')).toContainText('Không có kết nối mạng')
      
      // Check cached content still works
      await expect(page.locator('[data-testid="cached-content"]')).toBeVisible()
      
      // Go back online
      await context.setOffline(false)
      await page.reload()
      
      // Check online functionality restored
      await expect(page.locator('[data-testid="offline-indicator"]')).not.toBeVisible()
    })
  })
})

// Performance testing for Vietnamese networks
test.describe('Vietnamese Network Performance', () => {
  test('2G network simulation', async ({ page, context }) => {
    // Simulate slow 2G network
    await context.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000)) // 2s delay
      await route.continue()
    })

    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime

    // Should still load within reasonable time
    expect(loadTime).toBeLessThan(10000) // 10 seconds max for 2G

    // Check loading states are shown
    await expect(page.locator('[data-testid="skeleton-loader"]')).toBeVisible()
  })

  test('Image optimization for slow networks', async ({ page }) => {
    await page.goto('/')

    // Check that images have proper optimization attributes
    const images = page.locator('img[data-src]')
    const imageCount = await images.count()

    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i)
      const src = await img.getAttribute('data-src')
      
      // Check for optimization parameters
      expect(src).toMatch(/[?&]q=\d+/) // Quality parameter
      expect(src).toMatch(/[?&]w=\d+/) // Width parameter
    }
  })
})

// Accessibility testing for Vietnamese users
test.describe('Vietnamese Accessibility', () => {
  test('Keyboard navigation works', async ({ page }) => {
    await page.goto('/')

    // Test tab navigation
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toBeVisible()

    // Test search with keyboard
    await page.keyboard.press('/')
    await expect(page.locator('[data-testid="search-input"]')).toBeFocused()

    // Type Vietnamese search
    await page.keyboard.type('truyện hành động')
    await page.keyboard.press('Enter')

    // Check results
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible()
  })

  test('Screen reader compatibility', async ({ page }) => {
    await page.goto('/')

    // Check for proper ARIA labels in Vietnamese
    const searchButton = page.locator('[data-testid="search-button"]')
    await expect(searchButton).toHaveAttribute('aria-label', /tìm kiếm/i)

    const menuButton = page.locator('[data-testid="mobile-menu-button"]')
    await expect(menuButton).toHaveAttribute('aria-label', /menu|thực đơn/i)

    // Check heading hierarchy
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    
    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    const headingCount = await headings.count()
    expect(headingCount).toBeGreaterThan(0)
  })
})

// Vietnamese content validation
test.describe('Vietnamese Content Validation', () => {
  test('Vietnamese text rendering', async ({ page }) => {
    await page.goto('/')

    // Check Vietnamese diacritics render correctly
    const vietnameseText = page.locator('text=Truyện tranh')
    await expect(vietnameseText).toBeVisible()

    // Check font loading for Vietnamese characters
    const computedStyle = await page.evaluate(() => {
      const element = document.querySelector('body')
      return window.getComputedStyle(element).fontFamily
    })
    
    // Should include Vietnamese-friendly fonts
    expect(computedStyle).toMatch(/(Inter|Roboto|system-ui)/)
  })

  test('Vietnamese date and number formatting', async ({ page }) => {
    await page.goto('/manga/test-manga-slug')

    // Check Vietnamese date formatting
    const dateElements = page.locator('[data-testid="update-date"]')
    if (await dateElements.count() > 0) {
      const dateText = await dateElements.first().textContent()
      expect(dateText).toMatch(/(ngày|tháng|năm|trước|phút|giờ)/)
    }

    // Check number formatting (Vietnamese uses . for thousands)
    const viewCount = page.locator('[data-testid="view-count"]')
    if (await viewCount.count() > 0) {
      const viewText = await viewCount.first().textContent()
      expect(viewText).toMatch(/\d+(\.\d{3})*/)
    }
  })
})

// Mobile-specific Vietnamese testing
test.describe('Vietnamese Mobile UX', () => {
  test.use(vietnameseMobileDevices['iPhone 8 Vietnam'])

  test('Touch gestures work correctly', async ({ page }) => {
    await page.goto('/read/test-chapter-id')

    const reader = page.locator('[data-testid="mobile-reader"]')
    
    // Test swipe navigation
    await reader.swipe({ direction: 'left' })
    await page.waitForTimeout(300)
    
    // Check page navigation
    const pageIndicator = page.locator('[data-testid="page-indicator"]')
    await expect(pageIndicator).toContainText(/\d+\/\d+/)

    // Test double tap zoom
    await reader.dblclick()
    await page.waitForTimeout(300)
    
    // Check zoom state
    const zoomedImage = page.locator('[data-testid="manga-page-image"]')
    const transform = await zoomedImage.evaluate(el => el.style.transform)
    expect(transform).toContain('scale')
  })

  test('Vietnamese mobile menu navigation', async ({ page }) => {
    await page.goto('/')

    // Open mobile menu
    await page.click('[data-testid="mobile-menu-button"]')
    
    // Check Vietnamese menu items
    const menu = page.locator('[data-testid="mobile-menu"]')
    await expect(menu).toBeVisible()
    await expect(menu).toContainText(['Trang chủ', 'Thể loại', 'Yêu thích', 'Lịch sử'])

    // Test menu navigation
    await page.click('text=Thể loại')
    await expect(page).toHaveURL(/\/genres/)
    
    // Check genre page loads
    await expect(page.locator('[data-testid="genre-grid"]')).toBeVisible()
  })

  test('Vietnamese search autocomplete', async ({ page }) => {
    await page.goto('/')

    // Open search
    await page.click('[data-testid="search-button"]')
    
    const searchInput = page.locator('[data-testid="search-input"]')
    
    // Test Vietnamese autocomplete
    await searchInput.fill('hành')
    await page.waitForTimeout(500)
    
    // Check suggestions appear
    const suggestions = page.locator('[data-testid="search-suggestions"]')
    await expect(suggestions).toBeVisible()
    await expect(suggestions).toContainText('hành động')

    // Test fuzzy search
    await searchInput.fill('hanh dong') // Without diacritics
    await page.waitForTimeout(500)
    await expect(suggestions).toContainText('hành động')
  })
})

// Performance testing for Vietnamese conditions
test.describe('Vietnamese Performance Optimization', () => {
  test('Image lazy loading works', async ({ page }) => {
    await page.goto('/')

    // Check initial images are loaded
    const visibleImages = page.locator('img[src]:visible')
    const visibleCount = await visibleImages.count()
    expect(visibleCount).toBeGreaterThan(0)

    // Check lazy images have data-src
    const lazyImages = page.locator('img[data-src]')
    const lazyCount = await lazyImages.count()
    expect(lazyCount).toBeGreaterThan(0)

    // Scroll to trigger lazy loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)

    // Check more images are loaded
    const newVisibleCount = await visibleImages.count()
    expect(newVisibleCount).toBeGreaterThan(visibleCount)
  })

  test('PWA installation prompt', async ({ page, context }) => {
    // Mock PWA installation
    await context.addInitScript(() => {
      window.addEventListener('beforeinstallprompt', (e) => {
        window.deferredPrompt = e
      })
    })

    await page.goto('/')
    
    // Simulate PWA install conditions
    await page.evaluate(() => {
      const event = new Event('beforeinstallprompt')
      window.dispatchEvent(event)
    })

    // Check install prompt appears (if conditions are met)
    const installPrompt = page.locator('[data-testid="pwa-install-prompt"]')
    if (await installPrompt.isVisible()) {
      await expect(installPrompt).toContainText(['Cài đặt', 'Thêm vào màn hình'])
    }
  })

  test('Offline functionality', async ({ page, context }) => {
    await page.goto('/')
    
    // Wait for service worker registration
    await page.waitForTimeout(2000)

    // Go offline
    await context.setOffline(true)
    
    // Navigate to cached page
    await page.goto('/')
    
    // Check offline indicator
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible()
    await expect(page.locator('[data-testid="offline-indicator"]')).toContainText('Không có kết nối')

    // Check cached content still works
    await expect(page.locator('[data-testid="cached-manga-list"]')).toBeVisible()
  })
})

// Vietnamese SEO testing
test.describe('Vietnamese SEO Optimization', () => {
  test('Meta tags are properly set', async ({ page }) => {
    await page.goto('/manga/test-manga-slug')

    // Check Vietnamese meta description
    const metaDescription = page.locator('meta[name="description"]')
    const description = await metaDescription.getAttribute('content')
    expect(description).toMatch(/(truyện|manga|đọc|miễn phí)/)

    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]')
    const ogDescription = page.locator('meta[property="og:description"]')
    const ogLocale = page.locator('meta[property="og:locale"]')
    
    await expect(ogTitle).toHaveAttribute('content', /.+/)
    await expect(ogDescription).toHaveAttribute('content', /.+/)
    await expect(ogLocale).toHaveAttribute('content', 'vi_VN')
  })

  test('Structured data is present', async ({ page }) => {
    await page.goto('/manga/test-manga-slug')

    // Check for JSON-LD structured data
    const structuredData = page.locator('script[type="application/ld+json"]')
    await expect(structuredData).toHaveCount({ min: 1 })

    const jsonLd = await structuredData.first().textContent()
    const data = JSON.parse(jsonLd)
    
    expect(data['@type']).toBe('Book')
    expect(data.inLanguage).toBe('vi-VN')
  })

  test('Canonical URLs are correct', async ({ page }) => {
    await page.goto('/manga/test-manga-slug')

    const canonical = page.locator('link[rel="canonical"]')
    const href = await canonical.getAttribute('href')
    
    expect(href).toMatch(/^https:\/\/mango\.vn\/manga\//)
  })
})

// Error handling and edge cases
test.describe('Vietnamese Error Handling', () => {
  test('404 page shows Vietnamese message', async ({ page }) => {
    const response = await page.goto('/non-existent-page')
    expect(response.status()).toBe(404)

    await expect(page.locator('[data-testid="error-message"]')).toContainText(['Không tìm thấy', 'Trang không tồn tại'])
    await expect(page.locator('[data-testid="back-home-button"]')).toContainText('Về trang chủ')
  })

  test('Network error handling', async ({ page, context }) => {
    // Block all network requests
    await context.route('**/api/**', route => route.abort())

    await page.goto('/')
    
    // Check error handling
    await expect(page.locator('[data-testid="network-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="network-error"]')).toContainText(['Lỗi kết nối', 'Thử lại'])
  })

  test('Loading states show Vietnamese text', async ({ page }) => {
    await page.goto('/')

    // Check skeleton loaders have Vietnamese labels
    const skeletonLoader = page.locator('[data-testid="skeleton-loader"]')
    if (await skeletonLoader.isVisible()) {
      await expect(page.locator('[data-testid="loading-text"]')).toContainText(['Đang tải', 'Vui lòng chờ'])
    }
  })
})
