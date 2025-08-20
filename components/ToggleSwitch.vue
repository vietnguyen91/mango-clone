<template>
  <button
    @click="toggle"
    :class="[
      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      value ? 'bg-primary-600' : 'bg-gray-200'
    ]"
    :aria-pressed="value"
  >
    <span
      :class="[
        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-lg',
        value ? 'translate-x-6' : 'translate-x-1'
      ]"
    />
  </button>
</template>

<script setup>
const props = defineProps({
  value: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update'])

const toggle = () => {
  emit('update', !props.value)
}
</script>

<style scoped>
/* Smooth transitions */
button {
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

span {
  transition: transform 0.2s ease;
}

/* Focus styles */
button:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Active state */
button:active span {
  transform: scale(0.95);
}
</style>
