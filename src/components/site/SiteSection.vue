<template>
  <section :id="category.id" class="site-section">
    <!-- 分类标题 -->
    <div class="section-header">
      <div class="section-icon">
        <component :is="iconComponent" class="w-5 h-5" />
      </div>
      <h2 class="section-title">{{ localizedName }}</h2>
      <span v-if="category.hot" class="hot-badge">Hot</span>
      <span class="site-count">{{ sites.length }}</span>
    </div>

    <!-- 网站卡片网格 -->
    <div class="site-grid">
      <SiteCard
        v-for="(site, index) in sites"
        :key="site.url"
        :site="site"
        :style="{ '--index': index }"
        class="animate-fade-in"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import SiteCard from './SiteCard.vue'
import type { Category, Site, Locale } from '@/types'

const props = defineProps<{
  category: Category
  sites: Site[]
}>()

const { locale } = useI18n()

const localizedName = computed(() => {
  return props.category.name[locale.value as Locale] || props.category.name['zh-CN']
})

// 简单的图标映射（使用SVG）
const iconMap: Record<string, string> = {
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  sparkles: 'M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM19 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zM5 18l.7 2.3L8 21l-2.3.7L5 24l-.7-2.3L2 21l2.3-.7L5 18z',
  palette: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.96-4.48-9-10-9zM6.5 12c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
  code: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  'book-open': 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3zm20 0h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3z',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'
}

const iconComponent = computed(() => {
  const path = iconMap[props.category.icon] || iconMap['star']
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  }, [h('path', { d: path })])
})
</script>

<style scoped>
.site-section {
  @apply mb-10;
}

.section-header {
  @apply flex items-center gap-3 mb-5;
}

.section-icon {
  @apply w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/30
         flex items-center justify-center
         text-primary-600 dark:text-primary-400;
}

.section-title {
  @apply text-lg font-bold text-gray-900 dark:text-white;
}

.hot-badge {
  @apply px-2 py-0.5 text-xs font-semibold
         bg-red-100 text-red-600
         dark:bg-red-900/30 dark:text-red-400
         rounded-full;
}

.site-count {
  @apply ml-auto text-sm text-gray-400;
}

.site-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4;
}

.animate-fade-in {
  animation: fadeSlideIn 0.4s ease-out forwards;
  animation-delay: calc(var(--index) * 0.03s);
  opacity: 0;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
