# 胖狐导航 (Fat Fox Nav)

一个现代化、配置驱动的网址导航站，基于 Vue 3 + Vite + Tailwind CSS 构建。

## 特性

- 🦊 **配置驱动** - 通过 YAML 配置文件管理网站和分类，无需编写代码
- 🎨 **现代 UI** - 使用 Tailwind CSS 打造精美界面，支持暗黑模式
- 🔍 **快速搜索** - 支持名称、描述、标签搜索，快捷键 Ctrl+K
- 🌍 **国际化** - 支持中英文切换
- 📱 **响应式** - 完美适配桌面端和移动端
- 🐳 **Docker 友好** - 提供 Docker 部署配置

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### Docker 部署

```bash
docker-compose up -d
```

## 配置说明

### 网站配置 (data/sites.yaml)

```yaml
sites:
  - name:
      zh-CN: "网站名称"
      en-US: "Site Name"
    url: "https://example.com"
    description:
      zh-CN: "网站描述"
      en-US: "Site description"
    icon: "/icons/example.png"
    category: "category-id"
    tags:
      - "标签1"
    featured: true  # 是否精选
```

### 分类配置 (data/categories.yaml)

```yaml
categories:
  - id: "category-id"
    name:
      zh-CN: "分类名称"
      en-US: "Category Name"
    icon: "star"
    hot: true
    children:
      - id: "sub-category"
        name:
          zh-CN: "子分类"
          en-US: "Sub Category"
```

## 添加网站图标

将网站图标放入 `public/icons/` 目录，建议尺寸 120x120px，PNG 格式。

## 技术栈

- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- [vue-i18n](https://vue-i18n.intlify.dev/) - 国际化

## 致谢

本项目灵感来源于 [WebStackPage](https://github.com/WebStackPage/WebStackPage.github.io)，感谢原作者 viggo 的开源贡献。

## 许可证

[MIT License](LICENSE)
