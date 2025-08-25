import { defineStore } from 'pinia'

export interface RecentManga {
  mangaId: string
  title: string
  coverImage: string
  slug: string
  lastReadChapter?: number
  lastReadChapterTitle?: string
  lastReadAt: string
  readingProgress: number // percentage 0-100
  totalChapters?: number
}

export const useRecentlyViewedStore = defineStore('recentlyViewed', {
  state: () => ({
    recentManga: [] as RecentManga[],
    maxItems: 20,
    isLoaded: false
  }),

  getters: {
    getRecentManga: (state) => state.recentManga,
    
    getRecentMangaById: (state) => (mangaId: string) => {
      return state.recentManga.find(manga => manga.mangaId === mangaId)
    },

    hasRecentManga: (state) => state.recentManga.length > 0,

    getRecentMangaForDisplay: (state) => state.recentManga.slice(0, 12) // Show max 12 on homepage
  },

  actions: {
    // Load from localStorage on app start
    loadFromStorage() {
      if (process.client) {
        try {
          const stored = localStorage.getItem('mango-recently-viewed')
          if (stored) {
            const parsed = JSON.parse(stored)
            this.recentManga = Array.isArray(parsed) ? parsed : []
            // Clean up old entries (older than 30 days)
            this.cleanupOldEntries()
          }
        } catch (error) {
          console.error('Error loading recently viewed from storage:', error)
          this.recentManga = []
        }
        this.isLoaded = true
      }
    },

    // Save to localStorage
    saveToStorage() {
      if (process.client) {
        try {
          localStorage.setItem('mango-recently-viewed', JSON.stringify(this.recentManga))
        } catch (error) {
          console.error('Error saving recently viewed to storage:', error)
        }
      }
    },

    // Add manga to recently viewed
    addToRecent(manga: Omit<RecentManga, 'lastReadAt'>) {
      const now = new Date().toISOString()
      const existingIndex = this.recentManga.findIndex(item => item.mangaId === manga.mangaId)
      
      const recentManga: RecentManga = {
        ...manga,
        lastReadAt: now
      }

      if (existingIndex >= 0) {
        // Update existing entry
        this.recentManga[existingIndex] = recentManga
        // Move to front
        this.recentManga.unshift(this.recentManga.splice(existingIndex, 1)[0])
      } else {
        // Add new entry at the beginning
        this.recentManga.unshift(recentManga)
      }

      // Keep only maxItems
      if (this.recentManga.length > this.maxItems) {
        this.recentManga = this.recentManga.slice(0, this.maxItems)
      }

      this.saveToStorage()
    },

    // Update reading progress for a manga
    updateReadingProgress(mangaId: string, chapterNumber: number, chapterTitle?: string, totalChapters?: number) {
      const manga = this.recentManga.find(item => item.mangaId === mangaId)
      if (manga) {
        manga.lastReadChapter = chapterNumber
        manga.lastReadChapterTitle = chapterTitle
        manga.lastReadAt = new Date().toISOString()
        manga.totalChapters = totalChapters
        
        // Calculate reading progress
        if (totalChapters && totalChapters > 0) {
          manga.readingProgress = Math.round((chapterNumber / totalChapters) * 100)
        }

        // Move to front
        const index = this.recentManga.indexOf(manga)
        this.recentManga.unshift(this.recentManga.splice(index, 1)[0])
        
        this.saveToStorage()
      }
    },

    // Remove manga from recently viewed
    removeFromRecent(mangaId: string) {
      this.recentManga = this.recentManga.filter(manga => manga.mangaId !== mangaId)
      this.saveToStorage()
    },

    // Clear all recently viewed
    clearAll() {
      this.recentManga = []
      this.saveToStorage()
    },

    // Clean up entries older than 30 days
    cleanupOldEntries() {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      this.recentManga = this.recentManga.filter(manga => {
        const lastReadDate = new Date(manga.lastReadAt)
        return lastReadDate > thirtyDaysAgo
      })
    },

    // Get reading statistics
    getReadingStats() {
      const totalManga = this.recentManga.length
      const completedManga = this.recentManga.filter(manga => manga.readingProgress >= 100).length
      const inProgressManga = this.recentManga.filter(manga => manga.readingProgress > 0 && manga.readingProgress < 100).length
      
      return {
        total: totalManga,
        completed: completedManga,
        inProgress: inProgressManga,
        notStarted: totalManga - completedManga - inProgressManga
      }
    }
  }
})
