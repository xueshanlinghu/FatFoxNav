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
        <!-- 一键展开/折叠按钮 -->
        <div class="expand-all-btn-wrapper" v-show="!isCollapsed">
          <button
            class="expand-all-btn"
            @click="toggleAllCategories"
            :title="isAllExpanded ? '折叠所有' : '展开所有'"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path v-if="isAllExpanded" d="M18 15l-6-6-6 6" />
              <path v-else d="M6 9l6 6 6-6" />
            </svg>
            <span>{{ isAllExpanded ? '折叠所有' : '展开所有' }}</span>
          </button>
        </div>
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
              <span class="nav-icon" :class="{ 'active-icon': activeSection === category.id || isChildActive(category) }">
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
                    <span class="sub-nav-icon" v-if="child.icon">
                      <component :is="getIconComponent(child.icon)" />
                    </span>
                    <span class="sub-nav-text">
                      {{ getLocalizedText(child.name) }}
                    </span>
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
import { ref, computed, h } from 'vue'
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

// 获取所有有子分类的分类ID
const expandableCategories = computed(() =>
  categories.value.filter(c => c.children?.length).map(c => c.id)
)

// 检查是否所有分类都已展开
const isAllExpanded = computed(() => {
  if (expandableCategories.value.length === 0) return false
  return expandableCategories.value.every(id => expandedItems.value.includes(id))
})

// 一键展开/折叠所有分类
const toggleAllCategories = () => {
  if (isAllExpanded.value) {
    // 折叠所有
    expandedItems.value = []
  } else {
    // 展开所有
    expandedItems.value = [...expandableCategories.value]
  }
}

// 注意：移除了原来的 watch(activeSection) 自动展开逻辑
// 因为用户希望滚动时不自动展开分类，只有手动点击时才展开

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
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  info: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-14v2m0 4v4',
  'message-circle': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  image: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 11c.83 0 1.5-.67 1.5-1.5S9.83 8 9 8s-1.5.67-1.5 1.5S8.17 11 9 11zm7.5 6h-11l2.75-3.54 1.96 2.36 2.75-3.54L16.5 17z',
  video: 'M23 7l-7 5 7 5V7zM15 5H1v14h14V5z',
  music: 'M9 18V5l12-2v13M9 13c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm9-1c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
  terminal: 'M4 17l6-6-6-6M12 19h8',
  pen: 'M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z',
  layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  compass: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z',
  layout: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h6v14H5zm14 0h-6v-7h6v7zm0-9h-6V5h6v5z',
  'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  monitor: 'M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h5l-1 2v1h8v-1l-1-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM4 16V5h16v11H4z',
  'git-branch': 'M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9',
  lightbulb: 'M9 18h6M10 22h4M15 2a7 7 0 0 0-5.1 11.8c.3.4.5.8.5 1.2v2h4v-2c0-.4.2-.8.5-1.2A7 7 0 0 0 15 2z',
  tool: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  smile: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01',
  type: 'M4 7V4h16v3M9 20h6M12 4v16',
  edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  folder: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z',
  rss: 'M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16M5 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  'graduation-cap': 'M22 10l-10-5-10 5 10 5 10-5zM6 12v5c0 1.1 2.24 2 5 2s5-.9 5-2v-5',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  briefcase: 'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'
}

// 图标颜色映射
const iconColorMap: Record<string, string> = {
  // 主分类
  star: 'text-amber-500 dark:text-amber-400',
  sparkles: 'text-purple-500 dark:text-purple-400',
  code: 'text-blue-500 dark:text-blue-400',
  palette: 'text-pink-500 dark:text-pink-400',
  zap: 'text-yellow-500 dark:text-yellow-400',
  'book-open': 'text-green-500 dark:text-green-400',
  heart: 'text-red-500 dark:text-red-400',
  download: 'text-indigo-500 dark:text-indigo-400',
  info: 'text-cyan-500 dark:text-cyan-400',
  // AI工具子分类 - 紫色系
  'message-circle': 'text-purple-500 dark:text-purple-400',
  image: 'text-purple-500 dark:text-purple-400',
  video: 'text-purple-500 dark:text-purple-400',
  music: 'text-purple-500 dark:text-purple-400',
  terminal: 'text-purple-500 dark:text-purple-400',
  pen: 'text-purple-500 dark:text-purple-400',
  layers: 'text-purple-500 dark:text-purple-400',
  compass: 'text-purple-500 dark:text-purple-400',
  // 开发工具子分类 - 蓝色系
  layout: 'text-blue-500 dark:text-blue-400',
  'file-text': 'text-blue-500 dark:text-blue-400',
  monitor: 'text-blue-500 dark:text-blue-400',
  'git-branch': 'text-blue-500 dark:text-blue-400',
  // 设计资源子分类 - 粉色系
  lightbulb: 'text-pink-500 dark:text-pink-400',
  tool: 'text-pink-500 dark:text-pink-400',
  smile: 'text-pink-500 dark:text-pink-400',
  type: 'text-pink-500 dark:text-pink-400',
  // 效率工具子分类 - 黄色系
  edit: 'text-yellow-500 dark:text-yellow-400',
  folder: 'text-yellow-500 dark:text-yellow-400',
  // 学习资源子分类 - 绿色系
  rss: 'text-green-500 dark:text-green-400',
  'graduation-cap': 'text-green-500 dark:text-green-400',
  users: 'text-green-500 dark:text-green-400',
  // 生活服务子分类 - 红色系
  briefcase: 'text-red-500 dark:text-red-400',
  mail: 'text-red-500 dark:text-red-400',
  shield: 'text-red-500 dark:text-red-400'
}

const getIconComponent = (iconName: string) => {
  const path = iconMap[iconName] || iconMap['star']
  const colorClass = iconColorMap[iconName] || 'text-gray-500 dark:text-gray-400'
  return h('svg', {
    class: `w-5 h-5 ${colorClass}`,
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

.expand-all-btn-wrapper {
  @apply px-3 mb-2;
}

.expand-all-btn {
  @apply flex items-center gap-2 w-full px-3 py-1.5
         text-xs text-gray-400 dark:text-gray-500
         hover:text-primary-500 dark:hover:text-primary-400
         rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800
         transition-colors;
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
  @apply w-5 h-5 flex-shrink-0 transition-all duration-200;
}

.nav-icon.active-icon {
  @apply scale-110;
}

.nav-icon.active-icon :deep(svg) {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
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
  @apply flex items-center gap-2 w-full text-left px-3 py-2
         text-sm text-gray-500 dark:text-gray-400 rounded-lg
         hover:text-primary-600 dark:hover:text-primary-400
         hover:bg-gray-50 dark:hover:bg-gray-800
         transition-colors;
}

.sub-nav-icon {
  @apply w-4 h-4 flex-shrink-0;
}

.sub-nav-text {
  @apply flex-1;
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
