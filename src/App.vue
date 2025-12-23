<template>
  <AppLayout>
    <!-- 各分类区块 -->
    <template v-for="category in displayCategories" :key="category.id">
      <SiteSection
        v-if="getSitesByCategory(category.id).length > 0"
        :category="category"
        :sites="getSitesByCategory(category.id)"
      />

      <!-- 子分类 -->
      <template v-if="category.children">
        <SiteSection
          v-for="child in category.children"
          :key="child.id"
          :category="child"
          :sites="getSitesByCategory(child.id)"
        />
      </template>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConfig } from '@/composables/useConfig'
import AppLayout from '@/components/layout/AppLayout.vue'
import SiteSection from '@/components/site/SiteSection.vue'

const { categories, getSitesByCategory } = useConfig()

// 过滤掉"关于"分类，只显示有网站的分类
const displayCategories = computed(() => {
  return categories.value.filter(cat => cat.id !== 'about')
})
</script>
