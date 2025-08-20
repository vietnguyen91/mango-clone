# QA Agent Testing Instructions for Vietnamese Mango Platform

## 🎯 Mission
Test the LOCAL Vietnamese manga platform using MCP Playwright browser automation to ensure optimal experience for Vietnamese mobile users.

## 🚀 CRITICAL: Test on Local Development Server

### Step 1: Verify Development Server is Running
**IMPORTANT**: QA agent MUST test on `http://localhost:3000` (local development server)

1. First check if server is running:
```bash
curl http://localhost:3000
```

2. If not running, start the development server:
```bash
cd mango-clone
npm install
npm run dev
```

3. Wait for server to start and show "Local: http://localhost:3000"

### Step 2: Verify Local Site is Accessible
Use MCP Playwright to navigate to: `http://localhost:3000`
- This should load the Vietnamese Mango platform we built
- NOT MangaDex or any external site

### Step 2: Execute Critical Tests First
Use MCP Playwright to run these tests in priority order:

## 🔥 CRITICAL TESTS (Must Pass)

### Test 1: Vietnamese Mobile Homepage
```javascript
// Navigate and test homepage
await page.goto('http://localhost:3000')
await page.setViewportSize({ width: 375, height: 667 })

// Check Vietnamese content
await expect(page.locator('text=Truyện tranh')).toBeVisible()
await expect(page.locator('text=Thể loại')).toBeVisible()
await expect(page.locator('text=Tìm kiếm')).toBeVisible()

// Test mobile navigation
await page.click('[data-testid="mobile-menu-button"]')
await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()

// Performance check
const startTime = Date.now()
await page.reload()
const loadTime = Date.now() - startTime
expect(loadTime).toBeLessThan(3000) // Must load under 3 seconds
```

### Test 2: Mobile Reading Experience
```javascript
// Navigate to reader
await page.goto('http://localhost:3000/read/test-chapter-id')
await page.setViewportSize({ width: 375, height: 667 })

// Test mobile reader interface
await expect(page.locator('[data-testid="mobile-reader"]')).toBeVisible()

// Test swipe navigation
const reader = page.locator('[data-testid="reader-container"]')
await reader.swipe({ direction: 'left' })
await page.waitForTimeout(500)

// Check page changed
const pageNumber = await page.locator('[data-testid="current-page"]').textContent()
expect(parseInt(pageNumber)).toBeGreaterThan(1)

// Test settings panel
await page.click('[data-testid="reader-settings-button"]')
await expect(page.locator('text=Cuộn dọc')).toBeVisible()
await expect(page.locator('text=Chế độ đêm')).toBeVisible()
```

## 📱 HIGH PRIORITY TESTS

### Test 3: Vietnamese Search
```javascript
// Test search with Vietnamese diacritics
await page.goto('http://localhost:3000')
await page.click('[data-testid="search-button"]')
await page.fill('[data-testid="search-input"]', 'hành động')
await page.press('[data-testid="search-input"]', 'Enter')

// Check results
await expect(page.locator('[data-testid="search-results"]')).toBeVisible()

// Test fuzzy search (without diacritics)
await page.fill('[data-testid="search-input"]', 'hanh dong')
await page.press('[data-testid="search-input"]', 'Enter')
await expect(page.locator('.manga-card')).toHaveCount({ min: 1 })
```

### Test 4: Performance on Slow Networks
```javascript
// Simulate 3G network
await page.route('**/*', async route => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  await route.continue()
})

const startTime = Date.now()
await page.goto('http://localhost:3000')
const loadTime = Date.now() - startTime

// Should still load within 10 seconds on slow network
expect(loadTime).toBeLessThan(10000)

// Check loading states appear
await expect(page.locator('[data-testid="skeleton-loader"]')).toBeVisible()
```

## 🔧 MEDIUM PRIORITY TESTS

### Test 5: User Authentication
```javascript
// Test registration with Vietnamese name
await page.goto('http://localhost:3000/auth/register')
await page.fill('[data-testid="name-input"]', 'Nguyễn Văn Nam')
await page.fill('[data-testid="email-input"]', 'nam.test@example.com')
await page.fill('[data-testid="password-input"]', 'password123')
await page.click('[data-testid="register-button"]')

// Check success or validation
await expect(page.locator('.toast, .error-message')).toBeVisible()
```

### Test 6: Bookmark System
```javascript
// Test bookmark functionality
await page.goto('http://localhost:3000/manga/test-manga-slug')
await page.click('[data-testid="bookmark-button"]')

// Check Vietnamese success message
await expect(page.locator('.toast')).toContainText(['yêu thích', 'bookmark'])

// Check bookmark list
await page.goto('http://localhost:3000/bookmarks')
await expect(page.locator('.manga-card')).toHaveCount({ min: 1 })
```

### Test 7: Community Features
```javascript
// Test Vietnamese comment submission
await page.goto('http://localhost:3000/manga/test-manga-slug')
await page.fill('[data-testid="comment-textarea"]', 'Truyện này hay quá!')
await page.click('[data-testid="submit-comment"]')

// Check comment appears
await expect(page.locator('.comment-item')).toContainText('Truyện này hay quá!')

// Test rating system
await page.click('[data-testid="rating-star-5"]')
await expect(page.locator('.toast')).toContainText('đánh giá')
```

## 📊 REPORTING REQUIREMENTS

After each test, the QA agent should report:

### 1. Test Execution Status
```
✅ PASSED: Vietnamese Mobile Homepage Testing
- Load time: 2.1s (under 3s threshold)
- Vietnamese content: All text displayed correctly
- Mobile navigation: Working properly
- Performance: Meets mobile standards

❌ FAILED: Mobile Reading Experience Testing  
- Issue: Swipe gestures not responding
- Error: Touch events not registered
- Impact: Critical for mobile users
- Recommendation: Fix touch event handlers
```

### 2. Performance Metrics
```
📊 Performance Results:
- Page Load Time: 2.1s (Target: <3s)
- First Contentful Paint: 1.2s (Target: <1.8s)
- Largest Contentful Paint: 2.0s (Target: <2.5s)
- Cumulative Layout Shift: 0.05 (Target: <0.1)
- Mobile Performance Score: 85/100
```

### 3. Vietnamese Content Validation
```
🇻🇳 Vietnamese Content Check:
- Diacritics rendering: ✅ Correct
- UI translations: ✅ Complete
- Date formatting: ✅ Vietnamese format
- Error messages: ✅ Translated
- Genre names: ✅ Vietnamese terms
```

### 4. Critical Issues Summary
```
🚨 Critical Issues Found:
1. Mobile reader swipe gestures not working
2. Search autocomplete missing Vietnamese suggestions
3. Page load time exceeds 3s on 3G networks

🔧 Immediate Actions Required:
1. Fix touch event handlers in mobile reader
2. Implement Vietnamese autocomplete dictionary
3. Optimize image loading for slow networks
```

## 🎯 Success Criteria

### Critical Tests Must Pass:
- ✅ Homepage loads under 3 seconds on mobile
- ✅ Vietnamese content displays correctly
- ✅ Mobile navigation works
- ✅ Mobile reader functions properly
- ✅ Search works with Vietnamese input

### Performance Standards:
- 📱 Mobile load time: <3 seconds (4G), <10 seconds (3G)
- 🖼️ Images: Lazy loading implemented
- 📶 Offline: Basic functionality available
- 🔄 PWA: Installation prompt appears

### Vietnamese Localization:
- 🇻🇳 All UI text in Vietnamese
- ✍️ Diacritics render correctly
- 📅 Date/time in Vietnamese format
- 🔍 Search works with/without diacritics
- 💬 Comments support Vietnamese text

## 🚨 Emergency Stop Conditions

Stop testing and report immediately if:
1. Homepage doesn't load within 10 seconds
2. Vietnamese text appears as question marks or boxes
3. Mobile navigation completely broken
4. Critical JavaScript errors in console
5. Database connection failures

## 📝 Test Execution Commands for QA Agent

Use these exact MCP Playwright commands:

```javascript
// 1. Start browser and navigate
await page.goto('http://localhost:3000')

// 2. Set mobile viewport
await page.setViewportSize({ width: 375, height: 667 })

// 3. Test Vietnamese text
await expect(page.locator('text=Truyện tranh')).toBeVisible()

// 4. Test mobile interactions
await page.click('[data-testid="mobile-menu-button"]')
await page.swipe('[data-testid="reader-container"]', { direction: 'left' })

// 5. Test form inputs
await page.fill('[data-testid="search-input"]', 'hành động')
await page.press('[data-testid="search-input"]', 'Enter')

// 6. Check performance
const metrics = await page.evaluate(() => {
  const navigation = performance.getEntriesByType('navigation')[0]
  return {
    loadTime: navigation.loadEventEnd - navigation.fetchStart,
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart
  }
})

// 7. Take screenshots on failures
await page.screenshot({ path: 'test-failure.png', fullPage: true })
```

## 🎯 Final Deliverable

The QA agent should provide:
1. **Test execution report** with pass/fail status for each task
2. **Performance metrics** for Vietnamese mobile conditions  
3. **Screenshots** of any failures or issues
4. **Prioritized bug list** with Vietnamese-specific issues
5. **Recommendations** for improving Vietnamese mobile experience

Execute tests in the order listed in the current task list, focusing on CRITICAL priority tests first.
