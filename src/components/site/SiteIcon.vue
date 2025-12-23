<template>
  <div class="site-icon" :class="{ 'loaded': imageLoaded }">
    <!-- 首字母头像（作为底层，始终渲染） -->
    <div
      class="avatar"
      :style="{ backgroundColor: avatarColor }"
    >
      {{ firstLetter }}
    </div>

    <!-- 真实图标（加载成功后显示在上层） -->
    <img
      v-if="currentSrc && !loadFailed"
      :src="currentSrc"
      :alt="name"
      class="icon-img"
      loading="lazy"
      @load="onImageLoad"
      @error="onImageError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps<{
  src?: string        // 配置的图标地址
  url: string         // 网站 URL（用于获取 favicon）
  name: string        // 网站名称（用于生成首字母）
}>()

// 状态
const imageLoaded = ref(false)
const loadFailed = ref(false)
const currentSrc = ref('')
const fallbackIndex = ref(0)

// 检查是否是 DuckDuckGo 返回的默认图标
// DuckDuckGo 默认图标的特征：48x48 尺寸且来自 DuckDuckGo 域名
const isDuckDuckGoDefaultIcon = (img: HTMLImageElement, src: string): boolean => {
  // 只检查来自 DuckDuckGo 的图标
  if (!src.includes('icons.duckduckgo.com')) {
    return false
  }
  // DuckDuckGo 默认图标是 48x48
  if (img.naturalWidth === 48 && img.naturalHeight === 48) {
    return true
  }
  return false
}

// 从 URL 提取域名
const getDomain = (url: string): string => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return ''
  }
}

// Favicon 服务列表（按优先级）
const getFaviconUrls = (domain: string): string[] => {
  if (!domain) return []
  return [
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://icon.horse/icon/${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
  ]
}

// 生成首字母
const firstLetter = computed(() => {
  if (!props.name) return '?'
  const trimmed = props.name.trim()
  if (trimmed.length === 0) return '?'
  const char = trimmed[0]!
  // 如果是英文字母，转大写
  if (/[a-zA-Z]/.test(char)) {
    return char.toUpperCase()
  }
  // 中文或其他字符直接返回
  return char
})

// 基于名称生成稳定的颜色
const avatarColor = computed(() => {
  const name = props.name || 'default'
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 65%, 55%)`
})

// 所有可能的图标源
const allSources = computed(() => {
  const sources: string[] = []

  // 1. 配置的图标
  if (props.src && props.src.trim()) {
    sources.push(props.src)
  }

  // 2. Favicon 服务
  const domain = getDomain(props.url)
  sources.push(...getFaviconUrls(domain))

  return sources
})

// 尝试加载下一个源
const tryNextSource = () => {
  if (fallbackIndex.value < allSources.value.length) {
    currentSrc.value = allSources.value[fallbackIndex.value] || ''
    fallbackIndex.value++
  } else {
    // 所有源都失败了
    loadFailed.value = true
    currentSrc.value = ''
  }
}

// 图片加载成功
const onImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement

  // 检查是否是 DuckDuckGo 返回的默认占位图标
  if (isDuckDuckGoDefaultIcon(img, currentSrc.value)) {
    // 是默认图标，尝试下一个源
    onImageError()
    return
  }

  imageLoaded.value = true
}

// 图片加载失败
const onImageError = () => {
  tryNextSource()
}

// 初始化
onMounted(() => {
  tryNextSource()
})

// 监听 props 变化，重新加载
watch(() => [props.src, props.url], () => {
  imageLoaded.value = false
  loadFailed.value = false
  fallbackIndex.value = 0
  tryNextSource()
})
</script>

<style scoped>
.site-icon {
  @apply relative w-full h-full rounded-xl overflow-hidden;
}

/* 首字母头像 */
.avatar {
  @apply absolute inset-0 flex items-center justify-center
         text-white font-bold text-lg
         transition-opacity duration-300;
}

/* 真实图标 */
.icon-img {
  @apply absolute inset-0 w-full h-full object-contain
         bg-gray-100 dark:bg-gray-700
         opacity-0 transition-opacity duration-300;
}

/* 加载成功后显示图标，隐藏首字母 */
.site-icon.loaded .icon-img {
  @apply opacity-100;
}

.site-icon.loaded .avatar {
  @apply opacity-0;
}
</style>
