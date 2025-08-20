# Vietnamese Mango Platform - QA Testing Guide

## Overview
This guide provides detailed testing instructions for the QA agent to test the Mango manga platform using MCP Playwright browser automation. All tests focus on Vietnamese mobile users and their specific needs.

## Prerequisites
- Mango development server running on `http://localhost:3000`
- Test data populated in MongoDB
- Playwright browser automation tools available

## Test Execution Instructions

### 1. Vietnamese Mobile UI/UX Testing Suite
**Objective**: Test overall mobile user interface and Vietnamese user experience

**Test Steps**:
1. Navigate to `http://localhost:3000`
2. Verify Vietnamese language content displays correctly
3. Test mobile responsive design on different screen sizes
4. Check Vietnamese font rendering and diacritics
5. Test mobile navigation menu functionality
6. Verify touch targets are appropriately sized (minimum 44px)
7. Test orientation changes (portrait/landscape)

**Expected Results**:
- All Vietnamese text renders correctly with proper diacritics
- Mobile layout adapts to different screen sizes
- Navigation is intuitive and accessible
- Touch interactions work smoothly

### 2. Vietnamese Mobile Homepage Testing
**Objective**: Test homepage functionality and Vietnamese content presentation

**Test Steps**:
1. Navigate to homepage `http://localhost:3000`
2. Check featured manga section loads with Vietnamese titles
3. Test genre categories display Vietnamese genre names
4. Verify trending manga section shows relevant content
5. Test homepage search functionality
6. Check loading states and skeleton screens
7. Test infinite scroll or pagination
8. Verify Vietnamese time formatting (e.g., "5 phút trước")

**Expected Results**:
- Homepage loads within 3 seconds on mobile
- All sections display Vietnamese content correctly
- Search from homepage works with Vietnamese input
- Loading states provide good user feedback

### 3. Vietnamese Search & Discovery Testing
**Objective**: Test search functionality with Vietnamese input methods

**Test Steps**:
1. Navigate to search page `/search`
2. Test search with Vietnamese diacritics: "hành động"
3. Test search without diacritics: "hanh dong"
4. Test autocomplete suggestions appear
5. Test genre filtering with Vietnamese categories
6. Test advanced search filters
7. Test search result relevance and sorting
8. Test empty search results handling

**Expected Results**:
- Search works with and without Vietnamese diacritics
- Autocomplete provides relevant Vietnamese suggestions
- Genre filters work correctly
- Search results are relevant and well-formatted

### 4. Mobile Reading Experience Testing
**Objective**: Test mobile manga reader functionality

**Test Steps**:
1. Navigate to a manga chapter `/read/[chapterId]`
2. Test mobile reader interface loads correctly
3. Test swipe gestures for page navigation
4. Test pinch-to-zoom functionality
5. Test double-tap zoom
6. Test reading mode switches (vertical/horizontal)
7. Test reader settings panel
8. Test Vietnamese reading preferences
9. Test fullscreen mode
10. Test reading progress tracking

**Expected Results**:
- Mobile reader loads quickly and smoothly
- Touch gestures work intuitively
- Reading modes function correctly
- Settings are accessible and functional
- Progress tracking works accurately

### 5. User Account & Authentication Testing
**Objective**: Test Vietnamese user account features

**Test Steps**:
1. Test user registration form with Vietnamese input
2. Test email validation and Vietnamese email formats
3. Test login functionality
4. Test social media login (Facebook simulation)
5. Test profile management with Vietnamese names
6. Test password reset functionality
7. Test account settings and preferences
8. Test logout functionality

**Expected Results**:
- Registration accepts Vietnamese names and addresses
- Login/logout works correctly
- Profile management handles Vietnamese text
- Social login integration works (if available)

### 6. Bookmark & Reading History Testing
**Objective**: Test bookmark system and reading history

**Test Steps**:
1. Navigate to a manga page `/manga/[slug]`
2. Test bookmark addition and removal
3. Navigate to bookmarks page `/bookmarks`
4. Test bookmark list display and management
5. Test reading history tracking
6. Navigate to history page `/history`
7. Test history list and continue reading
8. Test reading progress persistence
9. Test offline bookmark access

**Expected Results**:
- Bookmarks add/remove correctly
- Bookmark list displays Vietnamese manga titles
- Reading history tracks accurately
- Progress persists across sessions

### 7. Vietnamese Community Features Testing
**Objective**: Test comment system and social features

**Test Steps**:
1. Navigate to manga page with comments
2. Test comment form with Vietnamese text input
3. Test comment submission and display
4. Test comment likes and replies
5. Test Vietnamese content moderation
6. Test rating system functionality
7. Test social sharing buttons
8. Test report functionality for inappropriate content

**Expected Results**:
- Comments accept and display Vietnamese text correctly
- Moderation filters inappropriate Vietnamese content
- Rating system works smoothly
- Social sharing generates correct Vietnamese content

### 8. Performance & Network Testing
**Objective**: Test performance on Vietnamese mobile networks

**Test Steps**:
1. Test site performance on simulated 2G network
2. Test site performance on simulated 3G network
3. Test image lazy loading functionality
4. Test offline mode when network is unavailable
5. Test PWA installation prompt
6. Test service worker caching
7. Test data saver mode compatibility
8. Measure Core Web Vitals (LCP, FID, CLS)

**Expected Results**:
- Site loads within acceptable time on slow networks
- Images load progressively with lazy loading
- Offline mode provides basic functionality
- Core Web Vitals meet mobile standards

### 9. Vietnamese SEO & Accessibility Testing
**Objective**: Test SEO optimization and accessibility

**Test Steps**:
1. Check meta tags contain Vietnamese keywords
2. Test structured data (JSON-LD) for manga pages
3. Test canonical URLs are correct
4. Test sitemap.xml generation
5. Test robots.txt accessibility
6. Test keyboard navigation
7. Test screen reader compatibility
8. Test color contrast ratios
9. Test ARIA labels in Vietnamese

**Expected Results**:
- Meta tags optimized for Vietnamese search
- Structured data follows schema.org standards
- Site is accessible via keyboard navigation
- ARIA labels provide Vietnamese descriptions

### 10. Cross-Device Compatibility Testing
**Objective**: Test across popular Vietnamese mobile devices

**Test Steps**:
1. Test on iPhone 8 (popular in Vietnam)
2. Test on Samsung Galaxy A series simulation
3. Test on Oppo A series simulation
4. Test on Vivo Y series simulation
5. Test on iPad for tablet experience
6. Test on low-end Android devices
7. Test different screen resolutions
8. Test different pixel densities

**Expected Results**:
- Site works correctly on all target devices
- Layout adapts appropriately to different screens
- Performance is acceptable on low-end devices
- Touch interactions work on all devices

## Playwright Test Commands

For the QA agent to execute these tests, use these Playwright commands:

### Basic Navigation and Verification
```javascript
// Navigate to page
await page.goto('http://localhost:3000')

// Check Vietnamese text
await expect(page.locator('text=Truyện tranh')).toBeVisible()

// Test mobile viewport
await page.setViewportSize({ width: 375, height: 667 })

// Test touch gestures
await page.locator('[data-testid="reader-container"]').swipe({ direction: 'left' })
```

### Vietnamese Content Testing
```javascript
// Test Vietnamese search
await page.fill('[data-testid="search-input"]', 'hành động')
await page.press('[data-testid="search-input"]', 'Enter')
await expect(page.locator('[data-testid="search-results"]')).toBeVisible()

// Test Vietnamese form input
await page.fill('[data-testid="name-input"]', 'Nguyễn Văn Nam')
await page.fill('[data-testid="comment-input"]', 'Truyện này hay quá!')
```

### Performance Testing
```javascript
// Measure page load time
const startTime = Date.now()
await page.goto('http://localhost:3000')
const loadTime = Date.now() - startTime
expect(loadTime).toBeLessThan(3000) // 3 seconds for mobile
```

### Network Simulation
```javascript
// Simulate slow 3G network
await page.route('**/*', async route => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  await route.continue()
})
```

## Test Data Requirements

The QA agent should use these test scenarios:

### Vietnamese Test Users
- Name: "Nguyễn Văn Nam"
- Email: "nam.test@example.com"
- Preferences: Mobile reading, night mode, Vietnamese UI

### Vietnamese Test Manga
- Title: "Thế Giới Huyền Huyễn"
- Genres: ["Huyền Huyễn", "Hành Động"]
- Status: "Đang cập nhật"

### Vietnamese Test Comments
- "Truyện này hay quá! Phong cách vẽ rất đẹp."
- "Cốt truyện hấp dẫn, chờ chương tiếp theo."
- "Nhân vật chính rất được, mong tác giả cập nhật nhanh."

## Success Criteria

Each test should verify:
1. **Functionality**: All features work as expected
2. **Vietnamese Content**: Text displays correctly with proper diacritics
3. **Mobile UX**: Touch interactions and responsive design work
4. **Performance**: Load times meet Vietnamese mobile standards
5. **Accessibility**: Site is usable by Vietnamese users with disabilities

## Reporting

The QA agent should report:
- Test execution status (pass/fail)
- Performance metrics (load times, Core Web Vitals)
- Screenshots of any failures
- Specific Vietnamese content issues
- Mobile usability problems
- Recommendations for improvements

## Priority Testing Order

1. **Critical**: Vietnamese Mobile Homepage Testing
2. **Critical**: Mobile Reading Experience Testing  
3. **High**: Vietnamese Search & Discovery Testing
4. **High**: Performance & Network Testing
5. **Medium**: User Account & Authentication Testing
6. **Medium**: Bookmark & Reading History Testing
7. **Medium**: Vietnamese Community Features Testing
8. **Low**: Vietnamese SEO & Accessibility Testing
9. **Low**: Cross-Device Compatibility Testing

Execute tests in this priority order to catch the most critical issues first.
