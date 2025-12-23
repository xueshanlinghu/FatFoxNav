<template>
  <aside
    class="sidebar"
    :class="{ 'collapsed': isCollapsed, 'mobile-open': isMobileOpen }"
  >
    <div class="sidebar-inner">
      <!-- Logo -->
      <div class="sidebar-header">
        <a href="/" class="logo">
          <div class="logo-icon">
            <span class="text-2xl">🦊</span>
          </div>
          <span class="logo-text" v-show="!isCollapsed">
            {{ localizedSiteName }}
          </span>
        </a>
        <button
          class="collapse-btn hidden lg:flex"
          @click="toggleCollapse"
          :aria-label="isCollapsed ? '展开菜单' : '折叠菜单'"
        >
          <svg class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': isCollapsed }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      <!-- 导航菜单 -->
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li
            v-for="category in categories"
            :key="category.id"
            class="nav-item"
            :class="{
              'active': activeSection === category.id || isChildActive(category),
              'has-children': category.children?.length
            }"
          >
            <button
              class="nav-link"
              @click="handleNavClick(category)"
            >
              <span class="nav-icon">
                <component :is="getIconComponent(category.icon)" />
              </span>
              <span class="nav-text" v-show="!isCollapsed">
                {{ getLocalizedText(category.name) }}
              </span>
              <span
                v-if="category.hot && !isCollapsed"
                class="hot-badge"
              >
                Hot
              </span>
              <svg
                v-if="category.children?.length && !isCollapsed"
                class="expand-icon"
                :class="{ 'rotate-180': expandedItems.includes(category.id) }"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <!-- 子菜单 -->
            <Transition name="slide">
              <ul
                v-if="category.children?.length && expandedItems.includes(category.id) && !isCollapsed"
                class="sub-nav"
              >
                <li
                  v-for="child in category.children"
                  :key="child.id"
                  class="sub-nav-item"
                  :class="{ 'active': activeSection === child.id }"
                >
                  <button
                    class="sub-nav-link"
                    @click="scrollToSection(child.id)"
                  >
                    {{ getLocalizedText(child.name) }}
                  </button>
                </li>
              </ul>
            </Transition>
          </li>
        </ul>
      </nav>

      <!-- 页脚链接 -->
      <div class="sidebar-footer" v-show="!isCollapsed">
        <a
          v-for="link in settings.footer.links"
          :key="link.url"
          :href="link.url"
          target="_blank"
          class="footer-link"
        >
          {{ getLocalizedText(link.name) }}
        </a>
      </div>
    </div>

    <!-- 移动端遮罩 -->
    <Transition name="fade">
      <div
        v-if="isMobileOpen"
        class="sidebar-overlay"
        @click="closeMobileSidebar"
      ></div>
    </Transition>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, h, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfig } from '@/composables/useConfig'
import { useScrollSpy } from '@/composables/useScrollSpy'
import type { Category, I18nText, Locale } from '@/types'

const { categories, settings, flatCategories } = useConfig()
const { locale } = useI18n()

// 获取所有分类ID用于滚动监听
const sectionIds = computed(() => flatCategories.value.map(c => c.id))
const { activeSection, scrollToSection } = useScrollSpy(() => sectionIds.value)

const isCollapsed = ref(false)
const isMobileOpen = ref(false)
const expandedItems = ref<string[]>([])

// 监听activeSection变化，自动展开父分类
watch(activeSection, (newVal) => {
  categories.value.forEach(cat => {
    if (cat.children?.some(child => child.id === newVal)) {
      if (!expandedItems.value.includes(cat.id)) {
        expandedItems.value.push(cat.id)
      }
    }
  })
})

const localizedSiteName = computed(() => {
  return settings.value.site.name[locale.value as Locale] || settings.value.site.name['zh-CN']
})

const getLocalizedText = (text: I18nText) => {
  return text[locale.value as Locale] || text['zh-CN']
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const closeMobileSidebar = () => {
  isMobileOpen.value = false
}

const isChildActive = (category: Category): boolean => {
  return category.children?.some(child => child.id === activeSection.value) || false
}

const handleNavClick = (category: Category) => {
  if (category.children?.length) {
    const index = expandedItems.value.indexOf(category.id)
    if (index > -1) {
      expandedItems.value.splice(index, 1)
    } else {
      expandedItems.value.push(category.id)
    }
  } else {
    scrollToSection(category.id)
    isMobileOpen.value = false
  }
}

// 图标映射
const iconMap: Record<string, string> = {
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  sparkles: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
  palette: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.96-4.48-9-10-9z',
  code: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  'book-open': 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3zm20 0h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3z',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'
}

const getIconComponent = (iconName: string) => {
  const path = iconMap[iconName] || iconMap['star']
  return h('svg', {
    class: 'w-5 h-5',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }, [h('path', { d: path })])
}

// 暴露方法给父组件
defineExpose({
  toggleMobile: () => { isMobileOpen.value = !isMobileOpen.value }
})
</script>

<style scoped>
.sidebar {
  @apply fixed left-0 top-0 h-screen w-64 z-40
         bg-white dark:bg-dark-card
         border-r border-gray-200 dark:border-dark-border
         transition-all duration-300 ease-out;
}

.sidebar.collapsed {
  @apply w-20;
}

.sidebar-inner {
  @apply flex flex-col h-full;
}

.sidebar-header {
  @apply flex items-center justify-between p-4 h-16
         border-b border-gray-100 dark:border-dark-border;
}

.logo {
  @apply flex items-center gap-3;
}

.logo-icon {
  @apply w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600
         flex items-center justify-center shadow-lg shadow-primary-500/30;
}

.logo-text {
  @apply text-xl font-bold text-gray-900 dark:text-white;
}

.collapse-btn {
  @apply w-8 h-8 rounded-lg
         flex items-center justify-center
         text-gray-400 hover:text-gray-600 hover:bg-gray-100
         dark:hover:text-gray-300 dark:hover:bg-gray-700
         transition-colors;
}

.sidebar-nav {
  @apply flex-1 overflow-y-auto py-4 scrollbar-hide;
}

.nav-list {
  @apply space-y-1 px-3;
}

.nav-link {
  @apply flex items-center gap-3 w-full px-3 py-2.5
         rounded-lg text-gray-600 dark:text-gray-300
         hover:bg-gray-100 dark:hover:bg-gray-700/50
         transition-all duration-200;
}

.nav-item.active > .nav-link {
  @apply bg-primary-50 dark:bg-primary-900/20
         text-primary-600 dark:text-primary-400
         font-medium;
}

.nav-icon {
  @apply w-5 h-5 flex-shrink-0;
}

.nav-text {
  @apply flex-1 text-left;
}

.hot-badge {
  @apply px-1.5 py-0.5 text-xs font-medium
         bg-red-100 text-red-600
         dark:bg-red-900/30 dark:text-red-400
         rounded;
}

.expand-icon {
  @apply w-4 h-4 transition-transform duration-200;
}

.sub-nav {
  @apply mt-1 ml-8 space-y-1 overflow-hidden;
}

.sub-nav-link {
  @apply block w-full text-left px-3 py-2
         text-sm text-gray-500 dark:text-gray-400 rounded-lg
         hover:text-primary-600 dark:hover:text-primary-400
         hover:bg-gray-50 dark:hover:bg-gray-800
         transition-colors;
}

.sub-nav-item.active .sub-nav-link {
  @apply text-primary-600 dark:text-primary-400 font-medium
         bg-primary-50/50 dark:bg-primary-900/10;
}

.sidebar-footer {
  @apply p-4 border-t border-gray-100 dark:border-dark-border
         flex gap-4;
}

.footer-link {
  @apply text-sm text-gray-400 hover:text-primary-500 transition-colors;
}

/* 展开动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 300px;
}

/* 移动端遮罩 */
.sidebar-overlay {
  @apply fixed inset-0 bg-black/50 z-[-1] lg:hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 1024px) {
  .sidebar {
    @apply -translate-x-full;
  }

  .sidebar.mobile-open {
    @apply translate-x-0;
  }
}
</style>
