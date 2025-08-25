<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      @click="toggleDropdown"
      :class="[
        'w-full flex items-center justify-between px-3 py-2 text-left border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors',
        isOpen ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-white hover:bg-gray-50'
      ]"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
    >
      <div class="flex-1 min-w-0">
        <span v-if="selectedItems.length === 0" class="text-gray-500 text-sm">
          {{ placeholder }}
        </span>
        <div v-else class="flex flex-wrap gap-1">
          <span
            v-for="item in displayedItems"
            :key="item.value"
            class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-800"
          >
            {{ item.label }}
            <button
              @click.stop="removeItem(item.value)"
              class="ml-1 hover:text-primary-600"
              :aria-label="`Remove ${item.label}`"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </span>
          <span
            v-if="selectedItems.length > maxDisplayed"
            class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600"
          >
            +{{ selectedItems.length - maxDisplayed }} more
          </span>
        </div>
      </div>
      
      <!-- Dropdown Arrow -->
      <svg
        :class="['w-4 h-4 transition-transform', isOpen ? 'rotate-180' : '']"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
        role="listbox"
        :aria-multiselectable="multiple"
      >
        <!-- Search Input (for large lists) -->
        <div v-if="searchable && options.length > 10" class="p-2 border-b border-gray-200">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm..."
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            @click.stop
          />
        </div>

        <!-- Select All / Clear All (for multiple selection) -->
        <div v-if="multiple && filteredOptions.length > 1" class="p-2 border-b border-gray-200">
          <div class="flex justify-between">
            <button
              @click="selectAll"
              class="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Chọn tất cả
            </button>
            <button
              @click="clearAll"
              class="text-xs text-gray-500 hover:text-gray-700 font-medium"
            >
              Bỏ chọn tất cả
            </button>
          </div>
        </div>

        <!-- Options List -->
        <div class="py-1">
          <div
            v-for="option in filteredOptions"
            :key="option.value"
            @click="toggleOption(option)"
            :class="[
              'flex items-center px-3 py-2 text-sm cursor-pointer transition-colors',
              isSelected(option.value) 
                ? 'bg-primary-50 text-primary-700' 
                : 'text-gray-900 hover:bg-gray-50'
            ]"
            role="option"
            :aria-selected="isSelected(option.value)"
          >
            <!-- Checkbox for multiple selection -->
            <div v-if="multiple" class="flex items-center mr-3">
              <input
                type="checkbox"
                :checked="isSelected(option.value)"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                @click.stop
                readonly
              />
            </div>

            <!-- Option Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <span class="truncate">{{ option.label }}</span>
                <span v-if="option.count" class="ml-2 text-xs text-gray-500">
                  ({{ option.count }})
                </span>
              </div>
              <div v-if="option.description" class="text-xs text-gray-500 mt-1">
                {{ option.description }}
              </div>
            </div>

            <!-- Selected indicator for single selection -->
            <svg
              v-if="!multiple && isSelected(option.value)"
              class="w-4 h-4 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>

          <!-- No options message -->
          <div v-if="filteredOptions.length === 0" class="px-3 py-2 text-sm text-gray-500 text-center">
            {{ searchQuery ? 'Không tìm thấy kết quả' : 'Không có tùy chọn nào' }}
          </div>
        </div>

        <!-- Apply/Cancel buttons for multiple selection -->
        <div v-if="multiple && hasChanges" class="p-2 border-t border-gray-200 flex justify-end space-x-2">
          <button
            @click="cancelChanges"
            class="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
          >
            Hủy
          </button>
          <button
            @click="applyChanges"
            class="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: [String, Number, Array],
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Chọn...'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: false
  },
  maxDisplayed: {
    type: Number,
    default: 3
  }
})

const emit = defineEmits(['update:modelValue'])

// Reactive state
const isOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref()
const tempSelectedItems = ref([])

// Computed properties
const selectedItems = computed(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : []
  }
  return props.modelValue ? [props.modelValue] : []
})

const displayedItems = computed(() => {
  return props.options
    .filter(option => selectedItems.value.includes(option.value))
    .slice(0, props.maxDisplayed)
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(option =>
    option.label.toLowerCase().includes(query) ||
    option.description?.toLowerCase().includes(query)
  )
})

const hasChanges = computed(() => {
  if (!props.multiple) return false
  
  const current = selectedItems.value.slice().sort()
  const temp = tempSelectedItems.value.slice().sort()
  
  return JSON.stringify(current) !== JSON.stringify(temp)
})

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && props.multiple) {
    tempSelectedItems.value = [...selectedItems.value]
  }
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

const closeDropdown = () => {
  isOpen.value = false
  searchQuery.value = ''
}

const isSelected = (value) => {
  if (props.multiple) {
    return tempSelectedItems.value.includes(value)
  }
  return selectedItems.value.includes(value)
}

const toggleOption = (option) => {
  if (props.multiple) {
    const index = tempSelectedItems.value.indexOf(option.value)
    if (index > -1) {
      tempSelectedItems.value.splice(index, 1)
    } else {
      tempSelectedItems.value.push(option.value)
    }
  } else {
    emit('update:modelValue', option.value)
    closeDropdown()
  }
}

const removeItem = (value) => {
  if (props.multiple) {
    const newValue = selectedItems.value.filter(item => item !== value)
    emit('update:modelValue', newValue)
  } else {
    emit('update:modelValue', '')
  }
}

const selectAll = () => {
  tempSelectedItems.value = filteredOptions.value.map(option => option.value)
}

const clearAll = () => {
  tempSelectedItems.value = []
}

const applyChanges = () => {
  emit('update:modelValue', tempSelectedItems.value)
  closeDropdown()
}

const cancelChanges = () => {
  tempSelectedItems.value = [...selectedItems.value]
  closeDropdown()
}

// Click outside to close
onClickOutside(dropdownRef, closeDropdown)

// Keyboard navigation
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Custom scrollbar for dropdown */
.overflow-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
