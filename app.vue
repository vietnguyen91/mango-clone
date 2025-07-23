<template>
  <div>
    <AppHeader />
    <main class="min-h-screen bg-gray-50">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
useHead({
  htmlAttrs: {
    lang: 'vi'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
});
</script>