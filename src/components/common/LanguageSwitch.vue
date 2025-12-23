<template>
  <button
    class="lang-switch"
    @click="toggleLocale"
  >
    <span class="lang-icon">{{ currentLocale === 'zh-CN' ? '中' : 'EN' }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const currentLocale = computed(() => locale.value)

const toggleLocale = () => {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  localStorage.setItem('panghu-nav-locale', locale.value)
}
</script>

<style scoped>
.lang-switch {
  @apply w-10 h-10 rounded-xl
         flex items-center justify-center
         text-gray-500 dark:text-gray-400
         hover:bg-gray-100 dark:hover:bg-gray-700
         hover:text-primary-500 dark:hover:text-primary-400
         transition-all duration-200;
}

.lang-icon {
  @apply text-sm font-bold;
}
</style>
