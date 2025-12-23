import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import yaml from '@modyfi/vite-plugin-yaml'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    yaml()
  ],
  // GitHub Pages 部署时设置为仓库名，如 '/FatFoxNav/'
  // 本地开发或 Docker 部署时设置为 '/'
  base: process.env.GITHUB_PAGES === 'true' ? '/FatFoxNav/' : '/',
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
