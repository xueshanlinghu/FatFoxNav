<template>
  <a
    :href="site.url"
    target="_blank"
    rel="noopener noreferrer"
    class="site-card group"
    :class="{ 'featured': site.featured }"
  >
    <!-- 精选标记 -->
    <div v-if="site.featured" class="featured-badge">
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span>{{ locale === 'zh-CN' ? '推荐' : 'Featured' }}</span>
    </div>

    <!-- 卡片内容 -->
    <div class="card-inner">
      <!-- 图标 -->
      <div class="card-icon">
        <SiteIcon
          :src="site.icon"
          :url="site.url"
          :name="localizedName"
        />
      </div>

      <!-- 信息 -->
      <div class="card-info">
        <h3 class="card-title">{{ localizedName }}</h3>
        <p class="card-desc">{{ localizedDesc }}</p>
        
        <!-- 标签区域 -->
        <div v-if="site.tags && site.tags.length > 0" class="card-tags">
          <span
            v-for="tag in site.tags"
            :key="tag"
            class="tag"
            @click.prevent="handleTagClick(tag)"
            :title="locale === 'zh-CN' ? `点击查看更多「${tag}」相关网站` : `Click to see more sites tagged with '${tag}'`"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- 悬浮装饰 -->
    <div class="card-glow"></div>
  </a>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Site, Locale } from '@/types'
import SiteIcon from './SiteIcon.vue'

const props = defineProps<{
  site: Site
}>()

const { locale } = useI18n()

// 注入标签筛选函数
const setCurrentTag = inject<(tag: string) => void>('setCurrentTag')

const localizedName = computed(() => {
  return props.site.name[locale.value as Locale] || props.site.name['zh-CN']
})

const localizedDesc = computed(() => {
  return props.site.description[locale.value as Locale] || props.site.description['zh-CN']
})

// 处理标签点击
const handleTagClick = (tag: string) => {
  // 使用注入的函数设置当前标签
  if (setCurrentTag) {
    setCurrentTag(tag)
  }
}
</script>

<style scoped>
.site-card {
  @apply relative block overflow-hidden rounded-xl bg-white dark:bg-dark-card
         border border-gray-100 dark:border-dark-border
         transition-all duration-300 ease-out
         hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary-500/10
         hover:border-primary-200 dark:hover:border-primary-800;
}

/* 精选卡片样式 */
.site-card.featured {
  @apply border-amber-200 dark:border-amber-800/50
         bg-gradient-to-br from-amber-50/50 to-white
         dark:from-amber-950/20 dark:to-dark-card;
}

.site-card.featured:hover {
  @apply border-amber-300 dark:border-amber-700
         shadow-amber-500/20;
}

/* 精选徽章 */
.featured-badge {
  @apply absolute top-2 right-2 z-10
         flex items-center gap-1
         px-2 py-0.5 rounded-full
         bg-amber-500 text-white
         text-xs font-medium
         shadow-sm;
}

.card-inner {
  @apply flex items-center gap-4 p-4;
}

.card-icon {
  @apply flex-shrink-0 w-12 h-12
         transition-transform duration-300
         group-hover:scale-110;
}

.card-info {
  @apply flex-1 min-w-0;
}

.card-title {
  @apply text-base font-semibold text-gray-900 dark:text-white
         truncate mb-1
         group-hover:text-primary-500 transition-colors duration-200;
}

.card-desc {
  @apply text-sm text-gray-500 dark:text-gray-400
         line-clamp-2 mb-2;
}

/* 标签区域 */
.card-tags {
  @apply flex flex-wrap gap-1.5 mt-2;
}

.tag {
  @apply inline-flex items-center
         px-2 py-0.5 rounded-md
         text-xs font-medium
         bg-primary-50 text-primary-600
         dark:bg-primary-900/30 dark:text-primary-400
         border border-primary-100 dark:border-primary-800/50
         transition-all duration-200
         cursor-pointer
         hover:bg-primary-100 hover:text-primary-700
         dark:hover:bg-primary-900/50 dark:hover:text-primary-300
         hover:border-primary-200 dark:hover:border-primary-700
         hover:shadow-sm hover:scale-105;
}

.tag:active {
  @apply scale-95;
}

/* 发光效果 */
.card-glow {
  @apply absolute inset-0 opacity-0 transition-opacity duration-300
         pointer-events-none
         group-hover:opacity-100;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(249, 115, 22, 0.08) 0%,
    transparent 70%
  );
}
</style>
