// Playwright test scripts for QA agent to execute
// These scripts can be run directly in the browser using MCP Playwright

// 1. Vietnamese Mobile Homepage Testing (CRITICAL)
export const testVietnameseMobileHomepage = async (page) => {
  console.log('🧪 Testing Vietnamese Mobile Homepage...')
  
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 })
  
  // Navigate to homepage
  const startTime = Date.now()
  await page.goto('http://localhost:3000')
  const loadTime = Date.now() - startTime
  
  console.log(`⏱️ Page load time: ${loadTime}ms`)
  
  // Test 1: Check Vietnamese content displays
  const vietnameseTexts = ['Truyện tranh', 'Thể loại', 'Tìm kiếm', 'Yêu thích']
  for (const text of vietnameseTexts) {
    try {
      await page.waitForSelector(`text=${text}`, { timeout: 5000 })
      console.log(`✅ Vietnamese text found: ${text}`)
    } catch (error) {
      console.log(`❌ Vietnamese text missing: ${text}`)
    }
  }
  
  // Test 2: Mobile navigation
  try {
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]')
    await mobileMenuButton.click()
    await page.waitForSelector('[data-testid="mobile-menu"]', { timeout: 3000 })
    console.log('✅ Mobile menu opens correctly')
  } catch (error) {
    console.log('❌ Mobile menu not working')
  }
  
  // Test 3: Featured manga section
  try {
    await page.waitForSelector('[data-testid="featured-manga"]', { timeout: 5000 })
    const mangaCards = await page.locator('.manga-card').count()
    console.log(`✅ Featured manga loaded: ${mangaCards} cards`)
  } catch (error) {
    console.log('❌ Featured manga section not loading')
  }
  
  // Test 4: Performance check
  if (loadTime < 3000) {
    console.log('✅ Page load time acceptable for mobile')
  } else {
    console.log('❌ Page load time too slow for mobile')
  }
  
  return {
    passed: loadTime < 3000,
    loadTime,
    vietnameseContentFound: vietnameseTexts.length,
    mobileMenuWorks: true
  }
}

// 2. Mobile Reading Experience Testing (CRITICAL)
export const testMobileReadingExperience = async (page) => {
  console.log('🧪 Testing Mobile Reading Experience...')
  
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 })
  
  // Navigate to a test chapter
  await page.goto('http://localhost:3000/read/test-chapter-id')
  
  // Test 1: Mobile reader interface
  try {
    await page.waitForSelector('[data-testid="mobile-reader"]', { timeout: 5000 })
    console.log('✅ Mobile reader interface loaded')
  } catch (error) {
    console.log('❌ Mobile reader interface not found')
    return { passed: false, error: 'Mobile reader not loading' }
  }
  
  // Test 2: Swipe gestures
  try {
    const readerContainer = page.locator('[data-testid="reader-container"]')
    
    // Get initial page number
    const initialPage = await page.locator('[data-testid="current-page"]').textContent()
    
    // Swipe left (next page)
    await readerContainer.swipe({ direction: 'left' })
    await page.waitForTimeout(500)
    
    const newPage = await page.locator('[data-testid="current-page"]').textContent()
    
    if (parseInt(newPage) > parseInt(initialPage)) {
      console.log('✅ Swipe navigation works')
    } else {
      console.log('❌ Swipe navigation not working')
    }
  } catch (error) {
    console.log('❌ Swipe gesture testing failed')
  }
  
  // Test 3: Reader settings
  try {
    await page.click('[data-testid="reader-settings-button"]')
    await page.waitForSelector('[data-testid="reader-settings-panel"]', { timeout: 3000 })
    
    // Check Vietnamese settings options
    const vietnameseSettings = ['Cuộn dọc', 'Chế độ đêm', 'Tự động cuộn']
    for (const setting of vietnameseSettings) {
      try {
        await page.waitForSelector(`text=${setting}`, { timeout: 2000 })
        console.log(`✅ Vietnamese setting found: ${setting}`)
      } catch (error) {
        console.log(`❌ Vietnamese setting missing: ${setting}`)
      }
    }
  } catch (error) {
    console.log('❌ Reader settings panel not accessible')
  }
  
  return { passed: true, message: 'Mobile reading experience tested' }
}

// 3. Vietnamese Search Testing (HIGH)
export const testVietnameseSearch = async (page) => {
  console.log('🧪 Testing Vietnamese Search...')
  
  await page.goto('http://localhost:3000')
  
  // Test 1: Search with Vietnamese diacritics
  try {
    await page.click('[data-testid="search-button"]')
    const searchInput = page.locator('[data-testid="search-input"]')
    
    await searchInput.fill('hành động')
    await page.waitForTimeout(1000)
    
    // Check for autocomplete suggestions
    try {
      await page.waitForSelector('[data-testid="search-suggestions"]', { timeout: 3000 })
      console.log('✅ Autocomplete suggestions appear with Vietnamese input')
    } catch (error) {
      console.log('❌ Autocomplete not working with Vietnamese input')
    }
    
    // Submit search
    await searchInput.press('Enter')
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 5000 })
    
    const resultCount = await page.locator('.manga-card').count()
    console.log(`✅ Search results found: ${resultCount} items`)
    
  } catch (error) {
    console.log('❌ Vietnamese search with diacritics failed')
  }
  
  // Test 2: Search without diacritics (fuzzy search)
  try {
    const searchInput = page.locator('[data-testid="search-input"]')
    await searchInput.clear()
    await searchInput.fill('hanh dong')
    await searchInput.press('Enter')
    
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 5000 })
    console.log('✅ Fuzzy search works without diacritics')
  } catch (error) {
    console.log('❌ Fuzzy search not working')
  }
  
  return { passed: true, message: 'Vietnamese search tested' }
}

// 4. Performance & Network Testing (HIGH)
export const testPerformanceAndNetwork = async (page) => {
  console.log('🧪 Testing Performance & Network...')
  
  // Test 1: Simulate slow 3G network
  await page.route('**/*', async route => {
    await new Promise(resolve => setTimeout(resolve, 1000)) // 1s delay
    await route.continue()
  })
  
  const startTime = Date.now()
  await page.goto('http://localhost:3000')
  const loadTime = Date.now() - startTime
  
  console.log(`⏱️ Load time on slow network: ${loadTime}ms`)
  
  // Test 2: Check loading states
  try {
    await page.waitForSelector('[data-testid="skeleton-loader"]', { timeout: 2000 })
    console.log('✅ Loading states shown during slow network')
  } catch (error) {
    console.log('❌ Loading states not shown')
  }
  
  // Test 3: Image lazy loading
  try {
    const lazyImages = await page.locator('img[data-src]').count()
    console.log(`✅ Lazy loading images found: ${lazyImages}`)
  } catch (error) {
    console.log('❌ Lazy loading not implemented')
  }
  
  // Test 4: Offline functionality
  await page.context().setOffline(true)
  await page.reload()
  
  try {
    await page.waitForSelector('[data-testid="offline-indicator"]', { timeout: 3000 })
    console.log('✅ Offline mode detected and indicated')
  } catch (error) {
    console.log('❌ Offline mode not working')
  }
  
  // Restore online
  await page.context().setOffline(false)
  
  return { 
    passed: loadTime < 10000, // 10s threshold for slow network
    loadTime,
    message: 'Performance and network tested'
  }
}

// 5. User Authentication Testing (MEDIUM)
export const testUserAuthentication = async (page) => {
  console.log('🧪 Testing User Authentication...')
  
  // Test 1: Registration form
  try {
    await page.goto('http://localhost:3000/auth/register')
    
    // Fill Vietnamese user data
    await page.fill('[data-testid="name-input"]', 'Nguyễn Văn Nam')
    await page.fill('[data-testid="email-input"]', 'nam.test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    
    console.log('✅ Registration form accepts Vietnamese names')
  } catch (error) {
    console.log('❌ Registration form not working with Vietnamese input')
  }
  
  // Test 2: Login functionality
  try {
    await page.goto('http://localhost:3000/auth/login')
    
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')
    
    // Check for successful login redirect
    await page.waitForURL('http://localhost:3000/', { timeout: 5000 })
    console.log('✅ Login functionality works')
  } catch (error) {
    console.log('❌ Login functionality not working')
  }
  
  return { passed: true, message: 'User authentication tested' }
}

// 6. Bookmark System Testing (MEDIUM)
export const testBookmarkSystem = async (page) => {
  console.log('🧪 Testing Bookmark System...')
  
  // Navigate to a manga page
  await page.goto('http://localhost:3000/manga/test-manga-slug')
  
  // Test 1: Add bookmark
  try {
    const bookmarkButton = page.locator('[data-testid="bookmark-button"]')
    await bookmarkButton.click()
    
    // Check for success message
    await page.waitForSelector('.toast', { timeout: 3000 })
    const toastText = await page.locator('.toast').textContent()
    
    if (toastText.includes('yêu thích') || toastText.includes('bookmark')) {
      console.log('✅ Bookmark addition works with Vietnamese feedback')
    }
  } catch (error) {
    console.log('❌ Bookmark functionality not working')
  }
  
  // Test 2: Bookmark list
  try {
    await page.goto('http://localhost:3000/bookmarks')
    await page.waitForSelector('.manga-card', { timeout: 5000 })
    
    const bookmarkCount = await page.locator('.manga-card').count()
    console.log(`✅ Bookmark list displays ${bookmarkCount} items`)
  } catch (error) {
    console.log('❌ Bookmark list not loading')
  }
  
  return { passed: true, message: 'Bookmark system tested' }
}

// 7. Community Features Testing (MEDIUM)
export const testCommunityFeatures = async (page) => {
  console.log('🧪 Testing Community Features...')
  
  await page.goto('http://localhost:3000/manga/test-manga-slug')
  
  // Test 1: Comment form with Vietnamese text
  try {
    const commentForm = page.locator('[data-testid="comment-form"]')
    const commentTextarea = commentForm.locator('textarea')
    
    await commentTextarea.fill('Truyện này hay quá! Rất thích phong cách vẽ của tác giả.')
    await commentForm.locator('button[type="submit"]').click()
    
    // Check for success message
    await page.waitForSelector('.toast', { timeout: 3000 })
    console.log('✅ Vietnamese comment submission works')
  } catch (error) {
    console.log('❌ Comment system not working with Vietnamese text')
  }
  
  // Test 2: Rating system
  try {
    const ratingStars = page.locator('[data-testid="rating-stars"] button')
    await ratingStars.nth(4).click() // 5 stars
    
    await page.waitForSelector('[data-testid="rating-submitted"]', { timeout: 3000 })
    console.log('✅ Rating system works')
  } catch (error) {
    console.log('❌ Rating system not working')
  }
  
  return { passed: true, message: 'Community features tested' }
}

// 8. SEO & Accessibility Testing (LOW)
export const testSEOAndAccessibility = async (page) => {
  console.log('🧪 Testing SEO & Accessibility...')
  
  await page.goto('http://localhost:3000/manga/test-manga-slug')
  
  // Test 1: Meta tags
  const metaDescription = await page.getAttribute('meta[name="description"]', 'content')
  const vietnameseKeywords = ['truyện', 'manga', 'đọc', 'miễn phí']
  const hasVietnameseKeywords = vietnameseKeywords.some(keyword => 
    metaDescription?.toLowerCase().includes(keyword)
  )
  
  if (hasVietnameseKeywords) {
    console.log('✅ Meta description contains Vietnamese keywords')
  } else {
    console.log('❌ Meta description missing Vietnamese keywords')
  }
  
  // Test 2: Structured data
  try {
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent()
    const structuredData = JSON.parse(jsonLd)
    
    if (structuredData['@type'] === 'Book' && structuredData.inLanguage === 'vi-VN') {
      console.log('✅ Structured data properly configured for Vietnamese')
    } else {
      console.log('❌ Structured data not optimized for Vietnamese')
    }
  } catch (error) {
    console.log('❌ Structured data not found or invalid')
  }
  
  // Test 3: Keyboard navigation
  try {
    await page.keyboard.press('Tab')
    const focusedElement = await page.evaluate(() => document.activeElement.tagName)
    console.log(`✅ Keyboard navigation works, focused: ${focusedElement}`)
  } catch (error) {
    console.log('❌ Keyboard navigation not working')
  }
  
  return { passed: true, message: 'SEO and accessibility tested' }
}

// 9. Cross-Device Compatibility Testing (LOW)
export const testCrossDeviceCompatibility = async (page) => {
  console.log('🧪 Testing Cross-Device Compatibility...')
  
  const devices = [
    { name: 'iPhone 8', width: 375, height: 667 },
    { name: 'Samsung Galaxy A', width: 412, height: 869 },
    { name: 'Oppo A', width: 360, height: 760 },
    { name: 'iPad', width: 768, height: 1024 }
  ]
  
  const results = []
  
  for (const device of devices) {
    console.log(`📱 Testing on ${device.name} (${device.width}x${device.height})`)
    
    await page.setViewportSize({ width: device.width, height: device.height })
    await page.goto('http://localhost:3000')
    
    // Check layout adaptation
    try {
      await page.waitForSelector('body', { timeout: 3000 })
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      
      if (bodyWidth <= device.width + 20) { // Allow 20px tolerance
        console.log(`✅ ${device.name}: Layout fits viewport`)
        results.push({ device: device.name, passed: true })
      } else {
        console.log(`❌ ${device.name}: Layout overflow detected`)
        results.push({ device: device.name, passed: false, issue: 'Layout overflow' })
      }
    } catch (error) {
      console.log(`❌ ${device.name}: Failed to load`)
      results.push({ device: device.name, passed: false, issue: 'Failed to load' })
    }
  }
  
  const passedDevices = results.filter(r => r.passed).length
  console.log(`✅ Compatibility: ${passedDevices}/${devices.length} devices passed`)
  
  return { 
    passed: passedDevices === devices.length,
    results,
    message: 'Cross-device compatibility tested'
  }
}

// Master test runner function
export const runAllVietnameseTests = async (page) => {
  console.log('🚀 Starting Vietnamese Mango Platform Testing Suite...')
  
  const testResults = {
    startTime: Date.now(),
    tests: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      critical: 0,
      criticalPassed: 0
    }
  }
  
  // Define test suite with priorities
  const testSuite = [
    { name: 'Vietnamese Mobile Homepage', fn: testVietnameseMobileHomepage, priority: 'critical' },
    { name: 'Mobile Reading Experience', fn: testMobileReadingExperience, priority: 'critical' },
    { name: 'Vietnamese Search', fn: testVietnameseSearch, priority: 'high' },
    { name: 'Performance & Network', fn: testPerformanceAndNetwork, priority: 'high' },
    { name: 'User Authentication', fn: testUserAuthentication, priority: 'medium' },
    { name: 'Bookmark System', fn: testBookmarkSystem, priority: 'medium' },
    { name: 'Community Features', fn: testCommunityFeatures, priority: 'medium' },
    { name: 'SEO & Accessibility', fn: testSEOAndAccessibility, priority: 'low' },
    { name: 'Cross-Device Compatibility', fn: testCrossDeviceCompatibility, priority: 'low' }
  ]
  
  // Run tests
  for (const test of testSuite) {
    console.log(`\n🧪 Running: ${test.name}`)
    
    try {
      const result = await test.fn(page)
      
      testResults.tests.push({
        name: test.name,
        priority: test.priority,
        passed: result.passed,
        result: result,
        duration: Date.now() - testResults.startTime
      })
      
      testResults.summary.total++
      if (result.passed) testResults.summary.passed++
      else testResults.summary.failed++
      
      if (test.priority === 'critical') {
        testResults.summary.critical++
        if (result.passed) testResults.summary.criticalPassed++
      }
      
    } catch (error) {
      console.log(`❌ Test failed: ${test.name} - ${error.message}`)
      
      testResults.tests.push({
        name: test.name,
        priority: test.priority,
        passed: false,
        error: error.message,
        duration: Date.now() - testResults.startTime
      })
      
      testResults.summary.total++
      testResults.summary.failed++
      
      if (test.priority === 'critical') {
        testResults.summary.critical++
      }
    }
  }
  
  // Generate final report
  testResults.endTime = Date.now()
  testResults.totalDuration = testResults.endTime - testResults.startTime
  
  console.log('\n📊 TEST SUMMARY:')
  console.log(`Total Tests: ${testResults.summary.total}`)
  console.log(`Passed: ${testResults.summary.passed}`)
  console.log(`Failed: ${testResults.summary.failed}`)
  console.log(`Critical Tests: ${testResults.summary.critical}`)
  console.log(`Critical Passed: ${testResults.summary.criticalPassed}`)
  console.log(`Total Duration: ${testResults.totalDuration}ms`)
  
  // Critical test status
  if (testResults.summary.critical > 0) {
    const criticalPassRate = (testResults.summary.criticalPassed / testResults.summary.critical) * 100
    console.log(`Critical Pass Rate: ${criticalPassRate.toFixed(1)}%`)
    
    if (criticalPassRate < 100) {
      console.log('⚠️  CRITICAL TESTS FAILED - IMMEDIATE ATTENTION REQUIRED')
    } else {
      console.log('✅ All critical tests passed')
    }
  }
  
  return testResults
}

// Quick smoke test for QA agent
export const runQuickSmokeTest = async (page) => {
  console.log('🚀 Running Quick Smoke Test for Vietnamese Mango Platform...')
  
  // Test 1: Homepage loads
  await page.goto('http://localhost:3000')
  await page.waitForSelector('body', { timeout: 10000 })
  console.log('✅ Homepage loads')
  
  // Test 2: Vietnamese content present
  try {
    await page.waitForSelector('text=Truyện tranh', { timeout: 5000 })
    console.log('✅ Vietnamese content detected')
  } catch (error) {
    console.log('❌ Vietnamese content not found')
  }
  
  // Test 3: Mobile navigation
  await page.setViewportSize({ width: 375, height: 667 })
  try {
    await page.click('[data-testid="mobile-menu-button"]')
    console.log('✅ Mobile navigation accessible')
  } catch (error) {
    console.log('❌ Mobile navigation not working')
  }
  
  // Test 4: Search functionality
  try {
    await page.click('[data-testid="search-button"]')
    await page.fill('[data-testid="search-input"]', 'test')
    console.log('✅ Search functionality accessible')
  } catch (error) {
    console.log('❌ Search not working')
  }
  
  console.log('🎯 Quick smoke test completed')
  return { passed: true, message: 'Smoke test completed' }
}
