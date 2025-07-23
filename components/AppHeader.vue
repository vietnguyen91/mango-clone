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

        <!-- Search Bar -->
        <div class="flex-1 max-w-lg mx-8">
          <div class="relative">
            <input
              v-model="searchQuery"
              @keyup.enter="performSearch"
              type="text"
              placeholder="Tìm kiếm truyện..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
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
const searchQuery = ref('');
const mobileMenuOpen = ref(false);
const router = useRouter();

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`);
    searchQuery.value = '';
    mobileMenuOpen.value = false;
  }
};
</script>