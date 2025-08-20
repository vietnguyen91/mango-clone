<template>
  <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end">
    <div class="w-full bg-gray-900 rounded-t-2xl text-white transform transition-transform duration-300">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 class="text-lg font-semibold">Cài đặt đọc truyện</h3>
        <button @click="$emit('close')" class="p-2 hover:bg-gray-800 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="p-4 space-y-6 max-h-96 overflow-y-auto">
        <!-- Reading Mode -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-3">Chế độ đọc</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="mode in readingModes"
              :key="mode.value"
              @click="updateReadingMode(mode.value)"
              :class="[
                'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                readingMode === mode.value
                  ? 'border-primary-500 bg-primary-500/20'
                  : 'border-gray-600 bg-gray-800 hover:border-gray-500'
              ]"
            >
              <div class="flex items-center space-x-3">
                <div class="text-2xl">{{ mode.icon }}</div>
                <div>
                  <div class="font-medium">{{ mode.label }}</div>
                  <div class="text-xs text-gray-400">{{ mode.description }}</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Image Fit -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-3">Kích thước ảnh</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="fit in imageFitOptions"
              :key="fit.value"
              @click="updateImageFit(fit.value)"
              :class="[
                'p-3 rounded-lg border transition-all duration-200 text-center',
                imageFit === fit.value
                  ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                  : 'border-gray-600 bg-gray-800 hover:border-gray-500 text-gray-300'
              ]"
            >
              <div class="text-lg mb-1">{{ fit.icon }}</div>
              <div class="text-xs font-medium">{{ fit.label }}</div>
            </button>
          </div>
        </div>

        <!-- Brightness -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-3">
            Độ sáng: {{ brightness }}%
          </label>
          <div class="flex items-center space-x-4">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
            <input
              type="range"
              min="20"
              max="100"
              step="10"
              :value="brightness"
              @input="updateBrightness($event.target.value)"
              class="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            >
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </div>
        </div>

        <!-- Reading Direction -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-3">Hướng đọc</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="direction in readingDirections"
              :key="direction.value"
              @click="updateReadingDirection(direction.value)"
              :class="[
                'p-3 rounded-lg border transition-all duration-200 text-center',
                readingDirection === direction.value
                  ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                  : 'border-gray-600 bg-gray-800 hover:border-gray-500 text-gray-300'
              ]"
            >
              <div class="text-lg mb-1">{{ direction.icon }}</div>
              <div class="text-sm font-medium">{{ direction.label }}</div>
            </button>
          </div>
        </div>

        <!-- Auto Scroll -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-3">Tự động cuộn</label>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-300">Bật tự động cuộn</div>
              <div class="text-xs text-gray-500">Tự động chuyển trang sau một khoảng thời gian</div>
            </div>
            <button
              @click="toggleAutoScroll"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                autoScroll ? 'bg-primary-600' : 'bg-gray-600'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  autoScroll ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
          
          <div v-if="autoScroll" class="mt-3">
            <label class="block text-xs text-gray-400 mb-2">
              Thời gian chờ: {{ autoScrollDelay }}s
            </label>
            <input
              type="range"
              min="3"
              max="10"
              step="1"
              :value="autoScrollDelay"
              @input="updateAutoScrollDelay($event.target.value)"
              class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            >
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-700">
        <div class="flex gap-3">
          <button
            @click="resetSettings"
            class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Đặt lại mặc định
          </button>
          <button
            @click="$emit('close')"
            class="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  readingMode: String,
  imageFit: String,
  brightness: Number
})

const emit = defineEmits(['update-settings', 'close'])

// Local state
const readingDirection = ref('ltr')
const autoScroll = ref(false)
const autoScrollDelay = ref(5)

// Options
const readingModes = [
  {
    value: 'vertical',
    label: 'Dọc',
    description: 'Cuộn dọc liên tục',
    icon: '📱'
  },
  {
    value: 'horizontal',
    label: 'Ngang',
    description: 'Lật trang ngang',
    icon: '📖'
  }
]

const imageFitOptions = [
  { value: 'width', label: 'Vừa rộng', icon: '↔️' },
  { value: 'height', label: 'Vừa cao', icon: '↕️' },
  { value: 'original', label: 'Gốc', icon: '🔍' }
]

const readingDirections = [
  { value: 'ltr', label: 'Trái → Phải', icon: '➡️' },
  { value: 'rtl', label: 'Phải → Trái', icon: '⬅️' }
]

// Methods
const updateReadingMode = (mode) => {
  emitSettings({ readingMode: mode })
}

const updateImageFit = (fit) => {
  emitSettings({ imageFit: fit })
}

const updateBrightness = (value) => {
  emitSettings({ brightness: parseInt(value) })
}

const updateReadingDirection = (direction) => {
  readingDirection.value = direction
  emitSettings({ readingDirection: direction })
}

const toggleAutoScroll = () => {
  autoScroll.value = !autoScroll.value
  emitSettings({ autoScroll: autoScroll.value })
}

const updateAutoScrollDelay = (delay) => {
  autoScrollDelay.value = parseInt(delay)
  emitSettings({ autoScrollDelay: autoScrollDelay.value })
}

const resetSettings = () => {
  const defaultSettings = {
    readingMode: 'vertical',
    imageFit: 'width',
    brightness: 100,
    readingDirection: 'ltr',
    autoScroll: false,
    autoScrollDelay: 5
  }
  
  readingDirection.value = defaultSettings.readingDirection
  autoScroll.value = defaultSettings.autoScroll
  autoScrollDelay.value = defaultSettings.autoScrollDelay
  
  emitSettings(defaultSettings)
}

const emitSettings = (updates) => {
  emit('update-settings', {
    readingMode: props.readingMode,
    imageFit: props.imageFit,
    brightness: props.brightness,
    readingDirection: readingDirection.value,
    autoScroll: autoScroll.value,
    autoScrollDelay: autoScrollDelay.value,
    ...updates
  })
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
  border: 2px solid #1F2937;
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  border: 2px solid #1F2937;
}
</style>
