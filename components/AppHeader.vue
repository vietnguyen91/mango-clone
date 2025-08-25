<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14 md:h-16">
        <!-- Mobile-optimized Logo -->
        <div class="flex items-center flex-shrink-0">
          <NuxtLink to="/" class="flex items-center space-x-2 touch-manipulation">
            <div class="w-8 h-8 md:w-10 md:h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg md:text-xl">M</span>
            </div>
            <span class="text-lg md:text-xl font-bold text-gray-900 hidden sm:block">Mango</span>
          </NuxtLink>
        </div>

        <!-- Mobile-first Search Bar -->
        <div class="flex-1 max-w-sm md:max-w-lg mx-4 md:mx-8">
          <EnhancedSearch />
        </div>

        <!-- Desktop Navigation -->
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

        <!-- Mobile menu button with better touch target -->
        <div class="md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600 p-2 -mr-2 touch-manipulation"
            :aria-expanded="mobileMenuOpen"
            aria-label="Toggle mobile menu"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Enhanced Mobile menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <!-- Mobile Navigation with better touch targets -->
          <nav class="px-4 py-4 space-y-1">
            <NuxtLink
              to="/"
              @click="mobileMenuOpen = false"
              class="flex items-center text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors font-medium px-3 py-3 rounded-lg touch-manipulation"
            >
              <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Trang chủ
            </NuxtLink>
            <NuxtLink
              to="/manga"
              @click="mobileMenuOpen = false"
              class="flex items-center text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors font-medium px-3 py-3 rounded-lg touch-manipulation"
            >
              <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              Truyện tranh
            </NuxtLink>
            <NuxtLink
              to="/genres"
              @click="mobileMenuOpen = false"
              class="flex items-center text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors font-medium px-3 py-3 rounded-lg touch-manipulation"
            >
              <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              Thể loại
            </NuxtLink>
          </nav>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup>
const mobileMenuOpen = ref(false);
</script>