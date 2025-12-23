import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useThrottleFn } from '@vueuse/core'

export function useScrollSpy(sectionIds: () => string[]) {
  const activeSection = ref<string>('')

  const updateActiveSection = useThrottleFn(() => {
    const ids = sectionIds()
    if (ids.length === 0) return

    const scrollY = window.scrollY
    const windowHeight = window.innerHeight

    // 如果在页面顶部，激活第一个分类
    if (scrollY < 100) {
      activeSection.value = ids[0] || ''
      return
    }

    for (const id of ids) {
      const element = document.getElementById(id)
      if (element) {
        const rect = element.getBoundingClientRect()
        const top = rect.top + scrollY
        const bottom = top + rect.height

        // 当元素进入视口上部时激活
        if (scrollY >= top - windowHeight / 3 && scrollY < bottom - 100) {
          activeSection.value = id
          break
        }
      }
    }
  }, 100)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // 顶部导航栏高度
      const top = element.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({
        top,
        behavior: 'smooth'
      })
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', updateActiveSection)
    updateActiveSection()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateActiveSection)
  })

  // 监听分类变化
  watch(sectionIds, () => {
    updateActiveSection()
  })

  return {
    activeSection,
    scrollToSection
  }
}
