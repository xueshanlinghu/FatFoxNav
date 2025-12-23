<template>
  <button
    class="theme-toggle"
    @click="toggleTheme"
    :title="t('theme.toggle')"
  >
    <Transition name="rotate" mode="out-in">
      <!-- 浅色模式图标 -->
      <svg v-if="!isDark" key="light" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      <!-- 深色模式图标 -->
      <svg v-else key="dark" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'

const { t } = useI18n()
const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
  @apply w-10 h-10 rounded-xl
         flex items-center justify-center
         text-gray-500 dark:text-gray-400
         hover:bg-gray-100 dark:hover:bg-gray-700
         hover:text-primary-500 dark:hover:text-primary-400
         transition-all duration-200;
}

.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.2s ease;
}

.rotate-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.rotate-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}
</style>
