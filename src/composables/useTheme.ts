import { ref, watch, onMounted } from 'vue'
import { usePreferredDark, useStorage } from '@vueuse/core'
import type { Theme } from '@/types'

export function useTheme() {
  const prefersDark = usePreferredDark()
  const storedTheme = useStorage<Theme>('panghu-nav-theme', 'system')
  const currentTheme = ref<Theme>(storedTheme.value)

  // 计算实际是否为暗色主题
  const isDark = ref(false)

  const updateTheme = () => {
    if (currentTheme.value === 'system') {
      isDark.value = prefersDark.value
    } else {
      isDark.value = currentTheme.value === 'dark'
    }

    // 更新DOM
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    storedTheme.value = theme
    updateTheme()
  }

  const toggleTheme = () => {
    if (isDark.value) {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]
    if (nextTheme) {
      setTheme(nextTheme)
    }
  }

  // 监听系统主题变化
  watch(prefersDark, updateTheme)

  onMounted(updateTheme)

  return {
    currentTheme,
    isDark,
    setTheme,
    toggleTheme,
    cycleTheme
  }
}
