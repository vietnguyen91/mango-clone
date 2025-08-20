import { ref, computed, watch } from 'vue'

export const useReadingStatistics = () => {
  // Reading statistics state
  const stats = ref({
    totalReadingTime: 0, // minutes
    totalPagesRead: 0,
    totalChaptersRead: 0,
    totalMangaRead: 0,
    averageReadingSpeed: 0, // pages per minute
    favoriteGenres: [],
    readingStreak: 0,
    longestStreak: 0,
    lastReadDate: null,
    weeklyGoal: 60, // minutes per week
    monthlyGoal: 240, // minutes per month
    achievements: []
  })

  // Daily reading data for charts
  const dailyStats = ref([])
  const weeklyStats = ref([])
  const monthlyStats = ref([])

  // Reading sessions
  const currentSession = ref({
    startTime: null,
    mangaId: null,
    chapterId: null,
    pagesRead: 0,
    timeSpent: 0
  })

  // Vietnamese reading achievements
  const vietnameseAchievements = [
    {
      id: 'first_chapter',
      name: 'Chương đầu tiên',
      description: 'Đọc chương đầu tiên',
      icon: '📖',
      requirement: { type: 'chapters', value: 1 },
      reward: 'Huy hiệu người mới'
    },
    {
      id: 'speed_reader',
      name: 'Tốc độ ánh sáng',
      description: 'Đọc 50 trang trong 1 giờ',
      icon: '⚡',
      requirement: { type: 'speed', value: 50 },
      reward: '100 điểm kinh nghiệm'
    },
    {
      id: 'night_owl',
      name: 'Cú đêm',
      description: 'Đọc truyện sau 11h đêm',
      icon: '🦉',
      requirement: { type: 'time', value: 23 },
      reward: 'Chế độ đêm đặc biệt'
    },
    {
      id: 'genre_explorer',
      name: 'Thám hiểm thể loại',
      description: 'Đọc ít nhất 5 thể loại khác nhau',
      icon: '🗺️',
      requirement: { type: 'genres', value: 5 },
      reward: 'Gợi ý cá nhân hóa'
    },
    {
      id: 'weekly_warrior',
      name: 'Chiến binh tuần',
      description: 'Đạt mục tiêu đọc hàng tuần',
      icon: '🏆',
      requirement: { type: 'weekly_goal', value: 1 },
      reward: 'Huy hiệu tuần'
    },
    {
      id: 'binge_reader',
      name: 'Cày truyện',
      description: 'Đọc liên tục 3 giờ',
      icon: '📚',
      requirement: { type: 'session_time', value: 180 },
      reward: 'Danh hiệu cày truyện'
    },
    {
      id: 'early_bird',
      name: 'Chim sớm',
      description: 'Đọc truyện trước 7h sáng',
      icon: '🌅',
      requirement: { type: 'time', value: 7 },
      reward: 'Chế độ sáng đặc biệt'
    },
    {
      id: 'social_butterfly',
      name: 'Bướm xã hội',
      description: 'Chia sẻ 10 bộ truyện',
      icon: '🦋',
      requirement: { type: 'shares', value: 10 },
      reward: 'Huy hiệu chia sẻ'
    },
    {
      id: 'reviewer',
      name: 'Nhà phê bình',
      description: 'Viết 20 bình luận',
      icon: '✍️',
      requirement: { type: 'comments', value: 20 },
      reward: 'Huy hiệu phê bình'
    },
    {
      id: 'completionist',
      name: 'Người hoàn thành',
      description: 'Đọc xong 10 bộ truyện',
      icon: '🎯',
      requirement: { type: 'completed_manga', value: 10 },
      reward: 'Danh hiệu hoàn thành'
    }
  ]

  // Computed statistics
  const todayStats = computed(() => {
    const today = new Date().toDateString()
    return dailyStats.value.find(day => day.date === today) || {
      date: today,
      readingTime: 0,
      pagesRead: 0,
      chaptersRead: 0
    }
  })

  const thisWeekStats = computed(() => {
    const weekStart = getWeekStart(new Date())
    return weeklyStats.value.find(week => week.weekStart === weekStart.toDateString()) || {
      weekStart: weekStart.toDateString(),
      readingTime: 0,
      pagesRead: 0,
      chaptersRead: 0
    }
  })

  const thisMonthStats = computed(() => {
    const monthKey = new Date().toISOString().slice(0, 7) // YYYY-MM
    return monthlyStats.value.find(month => month.month === monthKey) || {
      month: monthKey,
      readingTime: 0,
      pagesRead: 0,
      chaptersRead: 0
    }
  })

  const weeklyProgress = computed(() => {
    const weekTime = thisWeekStats.value.readingTime
    return Math.min((weekTime / stats.value.weeklyGoal) * 100, 100)
  })

  const monthlyProgress = computed(() => {
    const monthTime = thisMonthStats.value.readingTime
    return Math.min((monthTime / stats.value.monthlyGoal) * 100, 100)
  })

  const readingLevel = computed(() => {
    const totalTime = stats.value.totalReadingTime
    if (totalTime < 60) return { level: 1, name: 'Người mới', next: 60 }
    if (totalTime < 300) return { level: 2, name: 'Độc giả', next: 300 }
    if (totalTime < 1000) return { level: 3, name: 'Mọt truyện', next: 1000 }
    if (totalTime < 3000) return { level: 4, name: 'Chuyên gia', next: 3000 }
    return { level: 5, name: 'Bậc thầy', next: null }
  })

  // Start reading session
  const startReadingSession = (mangaId, chapterId) => {
    currentSession.value = {
      startTime: Date.now(),
      mangaId,
      chapterId,
      pagesRead: 0,
      timeSpent: 0
    }
  }

  // Update reading session
  const updateReadingSession = (pagesRead) => {
    if (!currentSession.value.startTime) return

    currentSession.value.pagesRead = pagesRead
    currentSession.value.timeSpent = (Date.now() - currentSession.value.startTime) / 1000 / 60 // minutes
  }

  // End reading session
  const endReadingSession = async () => {
    if (!currentSession.value.startTime) return

    const session = { ...currentSession.value }
    session.timeSpent = (Date.now() - session.startTime) / 1000 / 60 // minutes

    // Update statistics
    await updateStatistics(session)

    // Check for achievements
    await checkAchievements(session)

    // Reset session
    currentSession.value = {
      startTime: null,
      mangaId: null,
      chapterId: null,
      pagesRead: 0,
      timeSpent: 0
    }

    // Save to server
    try {
      await $fetch('/api/user/reading-session', {
        method: 'POST',
        body: session
      })
    } catch (error) {
      console.error('Error saving reading session:', error)
    }
  }

  // Update statistics
  const updateStatistics = async (session) => {
    // Update total stats
    stats.value.totalReadingTime += session.timeSpent
    stats.value.totalPagesRead += session.pagesRead
    stats.value.totalChaptersRead += 1

    // Calculate average reading speed
    if (stats.value.totalReadingTime > 0) {
      stats.value.averageReadingSpeed = stats.value.totalPagesRead / stats.value.totalReadingTime
    }

    // Update daily stats
    const today = new Date().toDateString()
    let todayData = dailyStats.value.find(day => day.date === today)
    
    if (!todayData) {
      todayData = {
        date: today,
        readingTime: 0,
        pagesRead: 0,
        chaptersRead: 0
      }
      dailyStats.value.push(todayData)
    }

    todayData.readingTime += session.timeSpent
    todayData.pagesRead += session.pagesRead
    todayData.chaptersRead += 1

    // Update reading streak
    updateReadingStreak()

    // Save to localStorage
    saveStatsToLocal()
  }

  // Update reading streak
  const updateReadingStreak = () => {
    const today = new Date()
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    
    const todayString = today.toDateString()
    const yesterdayString = yesterday.toDateString()

    const hasReadToday = dailyStats.value.some(day => day.date === todayString && day.readingTime > 0)
    const hasReadYesterday = dailyStats.value.some(day => day.date === yesterdayString && day.readingTime > 0)

    if (hasReadToday) {
      if (stats.value.lastReadDate === yesterdayString || stats.value.readingStreak === 0) {
        stats.value.readingStreak += 1
      }
      stats.value.lastReadDate = todayString
      
      // Update longest streak
      if (stats.value.readingStreak > stats.value.longestStreak) {
        stats.value.longestStreak = stats.value.readingStreak
      }
    } else if (!hasReadYesterday && stats.value.lastReadDate !== todayString) {
      // Reset streak if missed a day
      stats.value.readingStreak = 0
    }
  }

  // Check for achievements
  const checkAchievements = async (session) => {
    const newAchievements = []

    for (const achievement of vietnameseAchievements) {
      // Skip if already earned
      if (stats.value.achievements.includes(achievement.id)) continue

      let earned = false

      switch (achievement.requirement.type) {
        case 'chapters':
          earned = stats.value.totalChaptersRead >= achievement.requirement.value
          break
        case 'speed':
          earned = session.pagesRead >= achievement.requirement.value && session.timeSpent <= 60
          break
        case 'time':
          const hour = new Date().getHours()
          earned = (achievement.requirement.value === 23 && hour >= 23) || 
                   (achievement.requirement.value === 7 && hour <= 7)
          break
        case 'genres':
          earned = stats.value.favoriteGenres.length >= achievement.requirement.value
          break
        case 'weekly_goal':
          earned = weeklyProgress.value >= 100
          break
        case 'session_time':
          earned = session.timeSpent >= achievement.requirement.value
          break
      }

      if (earned) {
        stats.value.achievements.push(achievement.id)
        newAchievements.push(achievement)
      }
    }

    // Show achievement notifications
    newAchievements.forEach(achievement => {
      showAchievementNotification(achievement)
    })

    return newAchievements
  }

  // Show achievement notification
  const showAchievementNotification = (achievement) => {
    // Create achievement toast
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl shadow-lg max-w-sm'
    
    toast.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="text-2xl">${achievement.icon}</div>
        <div>
          <div class="font-bold">Thành tựu mới!</div>
          <div class="text-sm">${achievement.name}</div>
          <div class="text-xs opacity-90">${achievement.description}</div>
        </div>
      </div>
    `
    
    document.body.appendChild(toast)
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)'
      toast.style.opacity = '1'
    }, 100)
    
    // Remove after 5 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)'
      toast.style.opacity = '0'
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast)
        }
      }, 300)
    }, 5000)

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100])
    }
  }

  // Get reading statistics for display
  const getReadingInsights = () => {
    const insights = []

    // Reading speed insight
    if (stats.value.averageReadingSpeed > 0) {
      const speed = stats.value.averageReadingSpeed.toFixed(1)
      insights.push({
        type: 'speed',
        title: 'Tốc độ đọc',
        value: `${speed} trang/phút`,
        description: speed > 2 ? 'Bạn đọc khá nhanh!' : 'Bạn đọc ở tốc độ bình thường',
        icon: '⚡'
      })
    }

    // Reading time insight
    const dailyAverage = stats.value.totalReadingTime / Math.max(dailyStats.value.length, 1)
    insights.push({
      type: 'time',
      title: 'Thời gian đọc trung bình',
      value: `${dailyAverage.toFixed(0)} phút/ngày`,
      description: dailyAverage > 30 ? 'Bạn là một độc giả tích cực!' : 'Hãy thử đọc nhiều hơn mỗi ngày',
      icon: '⏰'
    })

    // Streak insight
    if (stats.value.readingStreak > 0) {
      insights.push({
        type: 'streak',
        title: 'Chuỗi đọc hiện tại',
        value: `${stats.value.readingStreak} ngày`,
        description: stats.value.readingStreak >= 7 ? 'Tuyệt vời! Hãy duy trì!' : 'Tiếp tục để xây dựng thói quen',
        icon: '🔥'
      })
    }

    // Favorite genre insight
    if (stats.value.favoriteGenres.length > 0) {
      const topGenre = stats.value.favoriteGenres[0]
      insights.push({
        type: 'genre',
        title: 'Thể loại yêu thích',
        value: topGenre.name,
        description: `${topGenre.count} bộ truyện đã đọc`,
        icon: '❤️'
      })
    }

    return insights
  }

  // Get weekly reading chart data
  const getWeeklyChartData = () => {
    const last7Days = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      const dateString = date.toDateString()
      
      const dayData = dailyStats.value.find(day => day.date === dateString)
      
      last7Days.push({
        date: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
        readingTime: dayData?.readingTime || 0,
        pagesRead: dayData?.pagesRead || 0,
        chaptersRead: dayData?.chaptersRead || 0
      })
    }

    return last7Days
  }

  // Get monthly reading chart data
  const getMonthlyChartData = () => {
    const last30Days = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      const dateString = date.toDateString()
      
      const dayData = dailyStats.value.find(day => day.date === dateString)
      
      last30Days.push({
        date: date.getDate(),
        readingTime: dayData?.readingTime || 0,
        pagesRead: dayData?.pagesRead || 0
      })
    }

    return last30Days
  }

  // Set reading goals
  const setWeeklyGoal = (minutes) => {
    stats.value.weeklyGoal = minutes
    saveStatsToLocal()
  }

  const setMonthlyGoal = (minutes) => {
    stats.value.monthlyGoal = minutes
    saveStatsToLocal()
  }

  // Export statistics
  const exportStatistics = () => {
    const exportData = {
      stats: stats.value,
      dailyStats: dailyStats.value,
      weeklyStats: weeklyStats.value,
      monthlyStats: monthlyStats.value,
      achievements: vietnameseAchievements.filter(a => stats.value.achievements.includes(a.id)),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `mango-reading-stats-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  // Load statistics from localStorage
  const loadStatsFromLocal = () => {
    try {
      const savedStats = localStorage.getItem('mango-reading-stats')
      const savedDaily = localStorage.getItem('mango-daily-stats')
      const savedWeekly = localStorage.getItem('mango-weekly-stats')
      const savedMonthly = localStorage.getItem('mango-monthly-stats')

      if (savedStats) {
        Object.assign(stats.value, JSON.parse(savedStats))
      }
      if (savedDaily) {
        dailyStats.value = JSON.parse(savedDaily)
      }
      if (savedWeekly) {
        weeklyStats.value = JSON.parse(savedWeekly)
      }
      if (savedMonthly) {
        monthlyStats.value = JSON.parse(savedMonthly)
      }
    } catch (error) {
      console.error('Error loading reading statistics:', error)
    }
  }

  // Save statistics to localStorage
  const saveStatsToLocal = () => {
    try {
      localStorage.setItem('mango-reading-stats', JSON.stringify(stats.value))
      localStorage.setItem('mango-daily-stats', JSON.stringify(dailyStats.value))
      localStorage.setItem('mango-weekly-stats', JSON.stringify(weeklyStats.value))
      localStorage.setItem('mango-monthly-stats', JSON.stringify(monthlyStats.value))
    } catch (error) {
      console.error('Error saving reading statistics:', error)
    }
  }

  // Sync with server
  const syncWithServer = async () => {
    try {
      // Upload local stats
      await $fetch('/api/user/reading-stats', {
        method: 'POST',
        body: {
          stats: stats.value,
          dailyStats: dailyStats.value,
          weeklyStats: weeklyStats.value,
          monthlyStats: monthlyStats.value
        }
      })

      // Fetch latest from server
      const response = await $fetch('/api/user/reading-stats')
      if (response.success) {
        // Merge server data with local data
        mergeServerStats(response.data)
      }

    } catch (error) {
      console.error('Error syncing reading statistics:', error)
    }
  }

  // Merge server statistics with local
  const mergeServerStats = (serverData) => {
    // Take the maximum values for cumulative stats
    stats.value.totalReadingTime = Math.max(stats.value.totalReadingTime, serverData.stats?.totalReadingTime || 0)
    stats.value.totalPagesRead = Math.max(stats.value.totalPagesRead, serverData.stats?.totalPagesRead || 0)
    stats.value.totalChaptersRead = Math.max(stats.value.totalChaptersRead, serverData.stats?.totalChaptersRead || 0)
    stats.value.longestStreak = Math.max(stats.value.longestStreak, serverData.stats?.longestStreak || 0)

    // Merge achievements
    const serverAchievements = serverData.stats?.achievements || []
    stats.value.achievements = [...new Set([...stats.value.achievements, ...serverAchievements])]

    saveStatsToLocal()
  }

  // Utility function to get week start
  const getWeekStart = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday as first day
    return new Date(d.setDate(diff))
  }

  // Initialize
  const initialize = async () => {
    loadStatsFromLocal()
    
    // Try to sync with server if user is logged in
    const { $auth } = useNuxtApp()
    if ($auth?.user) {
      await syncWithServer()
    }
  }

  // Watch for changes and auto-save
  watch([stats, dailyStats, weeklyStats, monthlyStats], saveStatsToLocal, { deep: true })

  return {
    // State
    stats: readonly(stats),
    dailyStats: readonly(dailyStats),
    currentSession: readonly(currentSession),
    vietnameseAchievements,

    // Computed
    todayStats,
    thisWeekStats,
    thisMonthStats,
    weeklyProgress,
    monthlyProgress,
    readingLevel,

    // Methods
    startReadingSession,
    updateReadingSession,
    endReadingSession,
    setWeeklyGoal,
    setMonthlyGoal,
    getReadingInsights,
    getWeeklyChartData,
    getMonthlyChartData,
    exportStatistics,
    syncWithServer,
    initialize
  }
}
