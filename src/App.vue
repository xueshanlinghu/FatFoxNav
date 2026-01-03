<template>
  <AppLayout>
    <!-- 各分类区块 -->
    <template v-for="category in displayCategories" :key="category.id">
      <SiteSection
        v-if="getSitesByCategory(category.id).length > 0"
        :category="category"
        :sites="getSitesByCategory(category.id)"
      />

      <!-- 子分类 -->
      <template v-if="category.children">
        <SiteSection
          v-for="child in category.children"
          :key="child.id"
          :category="child"
          :sites="getSitesByCategory(child.id)"
        />
      </template>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConfig } from '@/composables/useConfig'
import AppLayout from '@/components/layout/AppLayout.vue'
import SiteSection from '@/components/site/SiteSection.vue'

const { categories, getSitesByCategory } = useConfig()

// 过滤掉"关于"分类，只显示有网站的分类
const displayCategories = computed(() => {
  return categories.value.filter(cat => cat.id !== 'about')
})
</script>

<style scoped>
/* 标签筛选提示条 */
.tag-filter-banner {
  @apply sticky top-16 z-40 mb-6 -mx-4 px-4 py-3
         bg-primary-50 dark:bg-primary-900/20
         border-l-4 border-primary-500
         shadow-sm;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.banner-content {
  @apply flex items-center gap-3 max-w-6xl mx-auto;
}

.banner-text {
  @apply flex-1 text-sm text-gray-700 dark:text-gray-300;
}

.tag-name {
  @apply text-primary-600 dark:text-primary-400 font-semibold
         px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-900/40;
}

.clear-btn {
  @apply flex items-center gap-1.5 px-3 py-1.5 rounded-lg
         text-sm font-medium
         bg-white dark:bg-dark-card
         text-gray-700 dark:text-gray-300
         border border-gray-200 dark:border-dark-border
         hover:bg-gray-50 dark:hover:bg-slate-700
         hover:border-gray-300 dark:hover:border-gray-600
         transition-all duration-200
         shadow-sm hover:shadow;
}

/* 无结果提示 */
.no-results {
  @apply flex flex-col items-center justify-center
         py-16 px-4 text-center;
}
</style>