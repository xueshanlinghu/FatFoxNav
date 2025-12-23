import { ref, computed } from 'vue'
import { useConfig } from './useConfig'
import type { SearchResult } from '@/types'

export function useSearch() {
  const { sites } = useConfig()
  const searchQuery = ref('')
  const isSearching = ref(false)

  const searchResults = computed<SearchResult[]>(() => {
    const query = searchQuery.value.toLowerCase().trim()

    if (!query || query.length < 1) return []

    isSearching.value = true
    const results: SearchResult[] = []

    sites.value.forEach(site => {
      let score = 0
      let matchType: SearchResult['matchType'] = 'name'

      // 名称匹配（权重最高）
      const nameCN = site.name['zh-CN'].toLowerCase()
      const nameEN = site.name['en-US'].toLowerCase()
      if (nameCN.includes(query) || nameEN.includes(query)) {
        score = 100
        if (nameCN.startsWith(query) || nameEN.startsWith(query)) {
          score = 150
        }
        matchType = 'name'
      }

      // 描述匹配
      const descCN = site.description['zh-CN'].toLowerCase()
      const descEN = site.description['en-US'].toLowerCase()
      if (descCN.includes(query) || descEN.includes(query)) {
        if (score === 0) {
          score = 50
          matchType = 'description'
        }
      }

      // 标签匹配
      if (site.tags?.some(tag => tag.toLowerCase().includes(query))) {
        if (score === 0) {
          score = 75
          matchType = 'tag'
        } else {
          score += 25
        }
      }

      // URL匹配
      if (site.url.toLowerCase().includes(query)) {
        if (score === 0) {
          score = 30
          matchType = 'url'
        }
      }

      if (score > 0) {
        results.push({ site, matchType, score })
      }
    })

    isSearching.value = false

    // 按分数排序
    return results.sort((a, b) => b.score - a.score).slice(0, 20)
  })

  const clearSearch = () => {
    searchQuery.value = ''
  }

  const hasResults = computed(() => searchQuery.value.length > 0 && searchResults.value.length > 0)
  const noResults = computed(() => searchQuery.value.length > 0 && searchResults.value.length === 0)

  return {
    searchQuery,
    searchResults,
    isSearching,
    hasResults,
    noResults,
    clearSearch
  }
}
