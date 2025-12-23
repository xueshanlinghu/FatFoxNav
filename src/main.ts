import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './assets/styles/main.css'

// 导入语言包
import zhCN from './locales/zh-CN.yaml'
import enUS from './locales/en-US.yaml'

// 获取存储的语言偏好
const savedLocale = localStorage.getItem('panghu-nav-locale') || 'zh-CN'

// 创建i18n实例
const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')
