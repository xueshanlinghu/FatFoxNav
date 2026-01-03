<template>
  <AppLayout>
    <!-- 标签筛选提示条 -->
    <div v-if="currentTag" class="tag-filter-banner">
      <div class="banner-content">
        <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <span class="banner-text">
          {{ locale === 'zh-CN' ? '正在显示标签为' : 'Showing sites tagged with' }}
          <strong class="tag-name">{{ currentTag }}</strong>
          {{ locale === 'zh-CN' ? `的网站（共 ${filteredSitesCount} 个）` : `(${filteredSitesCount} sites)` }}
        </span>
        <button @click="clearTagFilter" class="clear-btn" :title="locale === 'zh-CN' ? '清除筛选' : 'Clear filter'">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {{ locale === 'zh-CN' ? '清除' : 'Clear' }}
        </button>
      </div>
    </div>

    <!-- 各分类区块 -->
    <template v-for="category in displayCategories" :key="category.id">
      <SiteSection
        v-if="getFilteredSitesByCategory(category.id).length > 0"
        :category="category"
        :sites="getFilteredSitesByCategory(category.id)"
      />

      <!-- 子分类 -->
      <template v-if="category.children">
        <SiteSection
          v-for="child in category.children"
          :key="child.id"
          :category="child"
          :sites="getFilteredSitesByCategory(child.id)"
          v-if="getFilteredSitesByCategory(child.id).length > 0"
        />
      </template>
    </template>

    <!-- 无结果提示 -->
    <div v-if="currentTag && filteredSitesCount === 0" class="no-results">
      <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-lg text-gray-500 dark:text-gray-400 mb-2">
        {{ locale === 'zh-CN' ? '没有找到相关网站' : 'No sites found' }}
      </p>
      <button @click="clearTagFilter" class="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
        {{ locale === 'zh-CN' ? '清除筛选条件' : 'Clear filter' }}
      </button>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfig } from '@/composables/useConfig'
import AppLayout from '@/components/layout/AppLayout.vue'
import SiteSection from '@/components/site/SiteSection.vue'

const { locale } = useI18n()
const { categories, getSitesByCategory, sites } = useConfig()

// 当前筛选的标签（使用响应式状态）
const currentTag = ref<string>('')

// 提供给子组件使用
provide('currentTag', currentTag)
provide('setCurrentTag', (tag: string) => {
  currentTag.value = tag
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// 根据标签筛选站点
const getFilteredSitesByCategory = (categoryId: string) => {
  const categorySites = getSitesByCategory(categoryId)
  
  if (!currentTag.value) {
    return categorySites
  }
  
  return categorySites.filter(site => 
    site.tags?.includes(currentTag.value)
  )
}

// 筛选后的站点总数
const filteredSitesCount = computed(() => {
  if (!currentTag.value) return 0
  
  return sites.value.filter(site => 
    site.tags?.includes(currentTag.value)
  ).length
})

// 清除标签筛选
const clearTagFilter = () => {
  currentTag.value = ''
}

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
         hover:bg-gray-50 dark:hover:bg-dark-hover
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
