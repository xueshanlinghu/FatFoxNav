<template>
  <div class="app-layout">
    <!-- 侧边栏 -->
    <AppSidebar ref="sidebarRef" />

    <!-- 主内容区 -->
    <div class="main-wrapper">
      <!-- 顶部导航 -->
      <AppHeader @toggle-sidebar="toggleSidebar" />

      <!-- 内容区 -->
      <main class="main-content">
        <slot />
      </main>

      <!-- 页脚 -->
      <footer class="app-footer">
        <div class="footer-inner">
          <p class="copyright">
            {{ localizedCopyright }}
          </p>
          <p class="credits">
            {{ t('footer.credits') }}:
            <a
              v-for="credit in settings.footer.credits"
              :key="credit.url"
              :href="credit.url"
              target="_blank"
              class="credit-link"
            >
              {{ credit.name }}
            </a>
          </p>
        </div>
      </footer>
    </div>

    <!-- 返回顶部按钮 -->
    <Transition name="scale">
      <button
        v-show="showBackToTop"
        class="back-to-top"
        @click="scrollToTop"
        :title="t('backToTop.title')"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfig } from '@/composables/useConfig'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import type { Locale } from '@/types'

const { t, locale } = useI18n()
const { settings } = useConfig()

const sidebarRef = ref<InstanceType<typeof AppSidebar> | null>(null)
const showBackToTop = ref(false)

const localizedCopyright = computed(() => {
  return settings.value.footer.copyright[locale.value as Locale] || settings.value.footer.copyright['zh-CN']
})

const toggleSidebar = () => {
  sidebarRef.value?.toggleMobile()
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.app-layout {
  @apply min-h-screen;
}

.main-wrapper {
  @apply lg:ml-64 min-h-screen flex flex-col;
}

.main-content {
  @apply flex-1 pt-20 pb-8 px-4 lg:px-8;
}

.app-footer {
  @apply py-6 px-4 lg:px-8 border-t border-gray-100 dark:border-dark-border;
}

.footer-inner {
  @apply text-center text-sm text-gray-400;
}

.copyright {
  @apply mb-2;
}

.credits {
  @apply flex items-center justify-center gap-2 flex-wrap;
}

.credit-link {
  @apply text-primary-500 hover:text-primary-600 transition-colors;
}

.back-to-top {
  @apply fixed right-6 bottom-6 z-50
         w-12 h-12 rounded-full
         bg-primary-500 text-white
         shadow-lg shadow-primary-500/30
         flex items-center justify-center
         hover:bg-primary-600 hover:-translate-y-1
         transition-all duration-200;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
