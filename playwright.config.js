import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh'
  },

  projects: [
    // Desktop browsers
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        locale: 'vi-VN',
        timezoneId: 'Asia/Ho_Chi_Minh'
      }
    },
    {
      name: 'firefox-desktop',
      use: { 
        ...devices['Desktop Firefox'],
        locale: 'vi-VN',
        timezoneId: 'Asia/Ho_Chi_Minh'
      }
    },

    // Vietnamese mobile devices (most common)
    {
      name: 'iphone-8-vietnam',
      use: {
        ...devices['iPhone 8'],
        locale: 'vi-VN',
        timezoneId: 'Asia/Ho_Chi_Minh'
      }
    },
    {
      name: 'samsung-galaxy-vietnam',
      use: {
        userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-A505F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        screen: { width: 412, height: 869 },
        viewport: { width: 412, height: 869 },
        deviceScaleFactor: 2.625,
        isMobile: true,
        hasTouch: true,
        locale: 'vi-VN',
        timezoneId: 'Asia/Ho_Chi_Minh'
      }
    },
    {
      name: 'oppo-a-vietnam',
      use: {
        userAgent: 'Mozilla/5.0 (Linux; Android 9; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        screen: { width: 360, height: 760 },
        viewport: { width: 360, height: 760 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        locale: 'vi-VN',
        timezoneId: 'Asia/Ho_Chi_Minh'
      }
    },

    // Tablet testing
    {
      name: 'ipad-vietnam',
      use: {
        ...devices['iPad Pro'],
        locale: 'vi-VN',
        timezoneId: 'Asia/Ho_Chi_Minh'
      }
    },

    // Low-end device simulation
    {
      name: 'low-end-android-vietnam',
      use: {
        userAgent: 'Mozilla/5.0 (Linux; Android 7.0; SM-J330F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        screen: { width: 360, height: 640 },
        viewport: { width: 360, height: 640 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        locale: 'vi-VN',
        timezoneId: 'Asia/Ho_Chi_Minh',
        // Simulate slower device
        launchOptions: {
          args: ['--memory-pressure-off', '--max_old_space_size=512']
        }
      }
    }
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  },

  // Global test configuration
  globalSetup: './tests/global-setup.js',
  globalTeardown: './tests/global-teardown.js',

  // Test timeout
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000
  },

  // Output directory
  outputDir: 'test-results/',

  // Test patterns
  testMatch: [
    '**/*.spec.js',
    '**/*.test.js',
    '**/vietnamese-*.spec.js'
  ]
})
