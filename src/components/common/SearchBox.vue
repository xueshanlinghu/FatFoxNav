<template>
  <div class="search-box" :class="{ 'focused': isFocused, 'has-results': hasResults }">
    <div class="search-input-wrapper">
      <!-- 搜索图标 -->
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>

      <!-- 输入框 -->
      <input
        ref="inputRef"
        type="text"
        v-model="searchQuery"
        :placeholder="t('search.placeholder')"
        class="search-input"
        @focus="isFocused = true"
        @blur="handleBlur"
        @keydown.escape="clearSearch"
        @keydown.down.prevent="navigateResults(1)"
        @keydown.up.prevent="navigateResults(-1)"
        @keydown.enter.prevent="selectResult"
      />

      <!-- 清除按钮 -->
      <Transition name="fade">
        <button
          v-if="searchQuery"
          class="clear-btn"
          @click="clearSearch"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </Transition>

      <!-- 快捷键提示 -->
      <kbd class="shortcut-hint" v-show="!isFocused && !searchQuery">
        {{ isMac ? '⌘' : 'Ctrl' }} K
      </kbd>
    </div>

    <!-- 搜索结果 -->
    <Transition name="dropdown">
      <div v-if="showResults" class="search-results">
        <div v-if="hasResults" class="results-header">
          {{ t('search.results', { count: searchResults.length }) }}
        </div>

        <ul v-if="hasResults" class="results-list">
          <li
            v-for="(result, index) in searchResults"
            :key="result.site.url"
            class="result-item"
            :class="{ 'active': activeIndex === index }"
          >
            <a
              :href="result.site.url"
              target="_blank"
              class="result-link"
              @mouseenter="activeIndex = index"
            >
              <img
                :src="result.site.icon"
                :alt="getLocalizedText(result.site.name)"
                class="result-icon"
                @error="handleImageError"
              />
              <div class="result-info">
                <span class="result-name">{{ getLocalizedText(result.site.name) }}</span>
                <span class="result-desc">{{ getLocalizedText(result.site.description) }}</span>
              </div>
              <span class="result-badge" v-if="result.matchType === 'tag'">
                {{ t('search.tagMatch') }}
              </span>
            </a>
          </li>
        </ul>

        <div v-if="noResults" class="no-results">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <p>{{ t('search.noResults') }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSearch } from '@/composables/useSearch'
import type { I18nText, Locale } from '@/types'

const { t, locale } = useI18n()
const { searchQuery, searchResults, hasResults, noResults, clearSearch } = useSearch()

const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)
const activeIndex = ref(0)

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

const showResults = computed(() => isFocused.value && searchQuery.value.length > 0)

const getLocalizedText = (text: I18nText) => {
  return text[locale.value as Locale] || text['zh-CN']
}

const handleBlur = () => {
  setTimeout(() => {
    isFocused.value = false
    activeIndex.value = 0
  }, 200)
}

const navigateResults = (direction: number) => {
  if (!hasResults.value) return
  activeIndex.value = Math.max(0, Math.min(searchResults.value.length - 1, activeIndex.value + direction))
}

const selectResult = () => {
  const result = searchResults.value[activeIndex.value]
  if (hasResults.value && result) {
    window.open(result.site.url, '_blank')
  }
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/icons/default.png'
}

// 全局快捷键
const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    inputRef.value?.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.search-box {
  @apply relative w-full max-w-md;
}

.search-input-wrapper {
  @apply relative flex items-center;
}

.search-icon {
  @apply absolute left-3 w-5 h-5 text-gray-400;
}

.search-input {
  @apply w-full pl-10 pr-20 py-2.5
         bg-gray-100 dark:bg-gray-800
         border-2 border-transparent
         rounded-xl
         text-gray-900 dark:text-white
         placeholder-gray-400
         transition-all duration-200
         focus:bg-white dark:focus:bg-gray-900
         focus:border-primary-500
         focus:outline-none
         focus:ring-4 focus:ring-primary-500/20;
}

.shortcut-hint {
  @apply absolute right-3 px-2 py-0.5
         text-xs text-gray-400
         bg-gray-200 dark:bg-gray-700
         rounded hidden sm:inline;
}

.clear-btn {
  @apply absolute right-3 p-1
         text-gray-400 hover:text-gray-600
         dark:hover:text-gray-200
         transition-colors;
}

.search-results {
  @apply absolute top-full left-0 right-0 mt-2
         bg-white dark:bg-dark-card
         border border-gray-200 dark:border-dark-border
         rounded-xl shadow-xl
         overflow-hidden z-50;
}

.results-header {
  @apply px-4 py-2 text-sm text-gray-500
         border-b border-gray-100 dark:border-gray-700;
}

.results-list {
  @apply max-h-80 overflow-y-auto;
}

.result-item {
  @apply border-b border-gray-50 dark:border-gray-700/50 last:border-0;
}

.result-link {
  @apply flex items-center gap-3 px-4 py-3
         hover:bg-gray-50 dark:hover:bg-gray-800
         transition-colors;
}

.result-item.active .result-link {
  @apply bg-primary-50 dark:bg-primary-900/20;
}

.result-icon {
  @apply w-8 h-8 rounded-lg object-contain bg-gray-100 dark:bg-gray-700;
}

.result-info {
  @apply flex-1 min-w-0;
}

.result-name {
  @apply block text-sm font-medium text-gray-900 dark:text-white truncate;
}

.result-desc {
  @apply block text-xs text-gray-500 truncate;
}

.result-badge {
  @apply px-2 py-0.5 text-xs
         bg-primary-100 text-primary-600
         dark:bg-primary-900/30 dark:text-primary-400
         rounded;
}

.no-results {
  @apply py-8 text-center text-gray-400;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
