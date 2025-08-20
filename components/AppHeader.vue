<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">M</span>
            </div>
            <span class="text-xl font-bold text-gray-900">Mango</span>
          </NuxtLink>
        </div>

        <!-- Enhanced Search Bar -->
        <div class="flex-1 max-w-lg mx-8">
          <EnhancedSearch />
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink 
            to="/" 
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium"
          >
            Trang chủ
          </NuxtLink>
          <NuxtLink 
            to="/manga" 
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium"
          >
            Truyện tranh
          </NuxtLink>
          <NuxtLink 
            to="/genres" 
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium"
          >
            Thể loại
          </NuxtLink>
        </nav>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 py-4">
        <!-- Mobile Search (visible when menu is open) -->
        <div class="px-4 pb-4 border-b border-gray-200 mb-4">
          <EnhancedSearch />
        </div>

        <nav class="flex flex-col space-y-2">
          <NuxtLink
            to="/"
            @click="mobileMenuOpen = false"
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium px-2 py-1"
          >
            Trang chủ
          </NuxtLink>
          <NuxtLink
            to="/manga"
            @click="mobileMenuOpen = false"
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium px-2 py-1"
          >
            Truyện tranh
          </NuxtLink>
          <NuxtLink
            to="/genres"
            @click="mobileMenuOpen = false"
            class="text-gray-700 hover:text-primary-600 transition-colors font-medium px-2 py-1"
          >
            Thể loại
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
const mobileMenuOpen = ref(false);
</script>