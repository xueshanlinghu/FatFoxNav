<template>
  <a
    :href="site.url"
    target="_blank"
    rel="noopener noreferrer"
    class="site-card group"
  >
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
      </div>
    </div>

    <!-- 悬浮装饰 -->
    <div class="card-glow"></div>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Site, Locale } from '@/types'
import SiteIcon from './SiteIcon.vue'

const props = defineProps<{
  site: Site
}>()

const { locale } = useI18n()

const localizedName = computed(() => {
  return props.site.name[locale.value as Locale] || props.site.name['zh-CN']
})

const localizedDesc = computed(() => {
  return props.site.description[locale.value as Locale] || props.site.description['zh-CN']
})
</script>

<style scoped>
.site-card {
  @apply relative block overflow-hidden rounded-xl bg-white dark:bg-dark-card
         border border-gray-100 dark:border-dark-border
         transition-all duration-300 ease-out
         hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary-500/10
         hover:border-primary-200 dark:hover:border-primary-800;
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
         line-clamp-2;
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
