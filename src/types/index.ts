// 多语言文本类型
export interface I18nText {
  readonly 'zh-CN': string
  readonly 'en-US': string
}

// 分类类型
export interface Category {
  readonly id: string
  readonly name: I18nText
  readonly icon: string
  readonly description?: I18nText
  readonly hot?: boolean
  readonly children?: readonly Category[]
}

// 网站类型
export interface Site {
  readonly name: I18nText
  readonly url: string
  readonly description: I18nText
  readonly icon: string
  readonly category: string
  readonly tags?: readonly string[]
  readonly featured?: boolean
}

// 站点设置类型
export interface SiteSettings {
  readonly site: {
    readonly name: I18nText
    readonly description: I18nText
    readonly keywords: string
    readonly logo: string
    readonly favicon: string
  }
  readonly features: {
    readonly search: boolean
    readonly darkMode: boolean
    readonly i18n: boolean
    readonly backToTop: boolean
  }
  readonly defaults: {
    readonly language: string
    readonly theme: 'light' | 'dark' | 'system'
  }
  readonly seo: {
    readonly ogImage: string
    readonly twitterCard: string
  }
  readonly footer: {
    readonly copyright: I18nText
    readonly links: readonly {
      readonly name: I18nText
      readonly url: string
      readonly icon?: string
    }[]
    readonly credits: readonly {
      readonly name: string
      readonly url: string
      readonly description: I18nText
    }[]
  }
}

// 搜索结果类型
export interface SearchResult {
  site: Site
  matchType: 'name' | 'description' | 'tag' | 'url'
  score: number
}

// 主题类型
export type Theme = 'light' | 'dark' | 'system'

// 语言类型
export type Locale = 'zh-CN' | 'en-US'
