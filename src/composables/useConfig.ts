import { ref, computed, readonly } from 'vue'
import type { Category, Site, SiteSettings } from '@/types'

// 导入YAML配置（vite-plugin-yaml支持）
import sitesData from '@data/sites.yaml'
import categoriesData from '@data/categories.yaml'
import settingsData from '@data/settings.yaml'

const sites = ref<Site[]>((sitesData as any).sites || [])
const categories = ref<Category[]>((categoriesData as any).categories || [])
const settings = ref<SiteSettings>(settingsData as SiteSettings)
const isLoaded = ref(true)

export function useConfig() {
  // 根据分类ID获取网站列表
  const getSitesByCategory = (categoryId: string): Site[] => {
    return sites.value.filter(site => site.category === categoryId)
  }

  // 获取精选网站
  const featuredSites = computed(() => {
    return sites.value.filter(site => site.featured)
  })

  // 获取所有标签
  const allTags = computed(() => {
    const tagSet = new Set<string>()
    sites.value.forEach(site => {
      site.tags?.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet)
  })

  // 扁平化分类（包含子分类）
  const flatCategories = computed(() => {
    const result: Category[] = []
    const flatten = (cats: readonly Category[]) => {
      cats.forEach(cat => {
        result.push(cat)
        if (cat.children) {
          flatten(cat.children)
        }
      })
    }
    flatten(categories.value)
    return result
  })

  // 获取分类的所有网站（包括子分类）
  const getSitesByCategoryWithChildren = (categoryId: string): Site[] => {
    const category = flatCategories.value.find(c => c.id === categoryId)
    if (!category) return []

    const categoryIds = [categoryId]
    if (category.children) {
      category.children.forEach(child => categoryIds.push(child.id))
    }

    return sites.value.filter(site => categoryIds.includes(site.category))
  }

  return {
    sites: readonly(sites),
    categories: readonly(categories),
    settings: readonly(settings),
    isLoaded: readonly(isLoaded),
    getSitesByCategory,
    getSitesByCategoryWithChildren,
    featuredSites,
    allTags,
    flatCategories
  }
}
