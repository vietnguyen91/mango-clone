<template>
  <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 flex items-center">
          <span class="mr-2">⚙️</span>
          Cài đặt đọc truyện nâng cao
        </h2>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Settings Content -->
      <div class="overflow-y-auto max-h-[calc(90vh-140px)]">
        <div class="p-6 space-y-8">
          <!-- Reading Mode -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="mr-2">📖</span>
              Chế độ đọc
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                v-for="mode in readingModes"
                :key="mode.value"
                @click="updateSetting('readingMode', mode.value)"
                :class="[
                  'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                  settings.readingMode === mode.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <div class="text-2xl mb-2">{{ mode.icon }}</div>
                <div class="font-medium text-gray-900">{{ mode.label }}</div>
                <div class="text-sm text-gray-600">{{ mode.description }}</div>
              </button>
            </div>
          </div>

          <!-- Display Settings -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="mr-2">🖥️</span>
              Hiển thị
            </h3>
            
            <!-- Image Fit -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">Kích thước ảnh</label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  v-for="fit in imageFitOptions"
                  :key="fit.value"
                  @click="updateSetting('imageFit', fit.value)"
                  :class="[
                    'p-3 rounded-lg border text-center transition-colors',
                    settings.imageFit === fit.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <div class="text-lg mb-1">{{ fit.icon }}</div>
                  <div class="text-sm font-medium">{{ fit.label }}</div>
                </button>
              </div>
            </div>

            <!-- Background Color -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">Màu nền</label>
              <div class="flex gap-3">
                <button
                  v-for="color in backgroundColors"
                  :key="color.value"
                  @click="updateSetting('backgroundColor', color.value)"
                  :class="[
                    'w-12 h-12 rounded-lg border-2 transition-all',
                    settings.backgroundColor === color.value
                      ? 'border-primary-500 scale-110'
                      : 'border-gray-300 hover:scale-105'
                  ]"
                  :style="{ backgroundColor: color.value }"
                  :title="color.label"
                ></button>
              </div>
            </div>

            <!-- Brightness -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Độ sáng: {{ settings.brightness }}%
              </label>
              <input
                type="range"
                min="20"
                max="150"
                step="10"
                :value="settings.brightness"
                @input="updateSetting('brightness', parseInt($event.target.value))"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              >
            </div>

            <!-- Contrast -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Độ tương phản: {{ settings.contrast }}%
              </label>
              <input
                type="range"
                min="50"
                max="150"
                step="10"
                :value="settings.contrast"
                @input="updateSetting('contrast', parseInt($event.target.value))"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              >
            </div>
          </div>

          <!-- Vietnamese Features -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="mr-2">🇻🇳</span>
              Tính năng Việt Nam
            </h3>
            
            <div class="space-y-4">
              <!-- Night Mode -->
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium text-gray-900">Chế độ ban đêm</div>
                  <div class="text-sm text-gray-600">Tự động bật từ 22h-6h</div>
                </div>
                <ToggleSwitch
                  :value="vietnameseFeatures.nightMode"
                  @update="updateVietnameseFeature('nightMode', $event)"
                />
              </div>

              <!-- Eye Protection -->
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium text-gray-900">Bảo vệ mắt</div>
                  <div class="text-sm text-gray-600">Lọc ánh sáng xanh</div>
                </div>
                <ToggleSwitch
                  :value="vietnameseFeatures.eyeProtection"
                  @update="updateVietnameseFeature('eyeProtection', $event)"
                />
              </div>

              <!-- Data Saver Mode -->
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium text-gray-900">Tiết kiệm dữ liệu</div>
                  <div class="text-sm text-gray-600">Giảm chất lượng ảnh cho mạng chậm</div>
                </div>
                <ToggleSwitch
                  :value="vietnameseFeatures.dataSaverMode"
                  @update="updateVietnameseFeature('dataSaverMode', $event)"
                />
              </div>

              <!-- Mobile Optimization -->
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium text-gray-900">Tối ưu di động</div>
                  <div class="text-sm text-gray-600">Cử chỉ và điều khiển cảm ứng</div>
                </div>
                <ToggleSwitch
                  :value="vietnameseFeatures.mobileOptimized"
                  @update="updateVietnameseFeature('mobileOptimized', $event)"
                />
              </div>
            </div>
          </div>

          <!-- Auto Features -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="mr-2">🤖</span>
              Tự động hóa
            </h3>
            
            <div class="space-y-4">
              <!-- Auto Scroll -->
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium text-gray-900">Tự động cuộn</div>
                  <div class="text-sm text-gray-600">Cuộn trang tự động</div>
                </div>
                <ToggleSwitch
                  :value="settings.autoScroll"
                  @update="updateSetting('autoScroll', $event)"
                />
              </div>

              <!-- Auto Scroll Speed -->
              <div v-if="settings.autoScroll" class="ml-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tốc độ cuộn: {{ settings.autoScrollSpeed }}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  :value="settings.autoScrollSpeed"
                  @input="updateSetting('autoScrollSpeed', parseInt($event.target.value))"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                >
              </div>

              <!-- Preload Pages -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tải trước: {{ settings.preloadPages }} trang
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  :value="settings.preloadPages"
                  @input="updateSetting('preloadPages', parseInt($event.target.value))"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                >
                <div class="text-xs text-gray-500 mt-1">
                  Nhiều hơn = mượt hơn nhưng tốn băng thông
                </div>
              </div>
            </div>
          </div>

          <!-- Keyboard Shortcuts -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="mr-2">⌨️</span>
              Phím tắt
            </h3>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Trang trước:</span>
                  <kbd class="px-2 py-1 bg-white border border-gray-300 rounded text-xs">A hoặc ←</kbd>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Trang sau:</span>
                  <kbd class="px-2 py-1 bg-white border border-gray-300 rounded text-xs">D hoặc →</kbd>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Cuộn lên:</span>
                  <kbd class="px-2 py-1 bg-white border border-gray-300 rounded text-xs">W hoặc ↑</kbd>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Cuộn xuống:</span>
                  <kbd class="px-2 py-1 bg-white border border-gray-300 rounded text-xs">S hoặc ↓</kbd>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Toàn màn hình:</span>
                  <kbd class="px-2 py-1 bg-white border border-gray-300 rounded text-xs">F</kbd>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Ẩn/hiện UI:</span>
                  <kbd class="px-2 py-1 bg-white border border-gray-300 rounded text-xs">H</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-gray-200 bg-gray-50">
        <div class="flex justify-between">
          <button
            @click="resetToDefaults"
            class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Đặt lại mặc định
          </button>
          <div class="flex space-x-3">
            <button
              @click="exportSettings"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Xuất cài đặt
            </button>
            <button
              @click="$emit('close')"
              class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              Xong
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  settings: {
    type: Object,
    required: true
  },
  vietnameseFeatures: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'update-setting', 'update-vietnamese-feature'])

// Reading mode options
const readingModes = [
  {
    value: 'vertical',
    label: 'Cuộn dọc',
    description: 'Cuộn liên tục như webtoon',
    icon: '📱'
  },
  {
    value: 'horizontal',
    label: 'Lật trang',
    description: 'Lật từng trang như sách',
    icon: '📖'
  },
  {
    value: 'webtoon',
    label: 'Webtoon',
    description: 'Tối ưu cho truyện dài',
    icon: '📜'
  }
]

// Image fit options
const imageFitOptions = [
  { value: 'width', label: 'Vừa rộng', icon: '↔️' },
  { value: 'height', label: 'Vừa cao', icon: '↕️' },
  { value: 'original', label: 'Kích thước gốc', icon: '🔍' },
  { value: 'smart', label: 'Thông minh', icon: '🧠' }
]

// Background color options
const backgroundColors = [
  { value: '#000000', label: 'Đen' },
  { value: '#1a1a1a', label: 'Xám đậm' },
  { value: '#2d2d2d', label: 'Xám' },
  { value: '#ffffff', label: 'Trắng' },
  { value: '#f5f5f5', label: 'Xám nhạt' },
  { value: '#fef7e0', label: 'Vàng nhạt' }
]

// Methods
const updateSetting = (key, value) => {
  emit('update-setting', key, value)
}

const updateVietnameseFeature = (key, value) => {
  emit('update-vietnamese-feature', key, value)
}

const resetToDefaults = () => {
  const defaults = {
    readingMode: 'vertical',
    imageFit: 'width',
    backgroundColor: '#000000',
    brightness: 100,
    contrast: 100,
    autoScroll: false,
    autoScrollSpeed: 3,
    pageTransition: 'slide',
    doubleTapZoom: true,
    gestureNavigation: true,
    fullscreen: false,
    hideUI: false,
    readingDirection: 'ltr',
    preloadPages: 3,
    offlineMode: false
  }

  const vietnameseDefaults = {
    vietnameseUI: true,
    mobileOptimized: true,
    slowNetworkMode: false,
    dataSaverMode: false,
    nightMode: false,
    eyeProtection: false
  }

  Object.entries(defaults).forEach(([key, value]) => {
    updateSetting(key, value)
  })

  Object.entries(vietnameseDefaults).forEach(([key, value]) => {
    updateVietnameseFeature(key, value)
  })

  showToast('Đã đặt lại cài đặt mặc định', 'success')
}

const exportSettings = () => {
  const settingsData = {
    readerSettings: props.settings,
    vietnameseFeatures: props.vietnameseFeatures,
    exportedAt: new Date().toISOString(),
    version: '1.0'
  }

  const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `mango-reader-settings-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
  showToast('Đã xuất cài đặt thành công!', 'success')
}

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
</script>

<style scoped>
/* Custom slider styles */
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .max-w-2xl {
    @apply max-w-full m-2;
  }
  
  .grid-cols-3 {
    @apply grid-cols-1;
  }
  
  .md\:grid-cols-4 {
    @apply grid-cols-2;
  }
}

/* Accessibility */
button:focus {
  @apply outline-none ring-2 ring-primary-500 ring-offset-2;
}

kbd {
  @apply font-mono;
}
</style>
