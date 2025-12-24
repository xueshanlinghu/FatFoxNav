import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import yaml from '@modyfi/vite-plugin-yaml'
import { resolve } from 'path'

// 确定 base 路径
// 优先级: CUSTOM_DOMAIN > GITHUB_PAGES > 默认
function getBasePath(): string {
  // 自定义域名部署 (如 nav.zsduo.com)，base 为 '/'
  if (process.env.CUSTOM_DOMAIN === 'true') {
    return '/'
  }
  // GitHub Pages 默认域名部署 (如 username.github.io/FatFoxNav/)
  if (process.env.GITHUB_PAGES === 'true') {
    return '/FatFoxNav/'
  }
  // 本地开发或 Docker 部署
  return '/'
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    yaml()
  ],
  base: getBasePath(),
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@data': resolve(__dirname, 'data')
    }
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-i18n'],
        }
      }
    }
  }
})
