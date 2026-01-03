# 胖狐导航 (Fat Fox Nav)

[![GitHub](https://img.shields.io/github/license/xueshanlinghu/FatFoxNav)](https://github.com/xueshanlinghu/FatFoxNav)

一个现代化、配置驱动的网址导航站，基于 Vue 3 + Vite + Tailwind CSS 构建。

**GitHub**: https://github.com/xueshanlinghu/FatFoxNav

**在线体验**: https://xueshanlinghu.github.io/FatFoxNav/

## 特性

- 🦊 **配置驱动** - 通过 YAML 配置文件管理网站和分类，无需编写代码
- 🎨 **现代 UI** - 使用 Tailwind CSS 打造精美界面，支持暗黑模式
- 🎯 **多彩图标** - 每个分类都有专属彩色图标，视觉识别度高
- ⭐ **精选标记** - 支持标记精选网站，自动显示推荐徽章
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

### GitHub Pages 部署

项目已配置 GitHub Actions 自动部署，推送到 `master` 分支会自动触发部署。

#### 使用 GitHub 默认域名

如果使用 `username.github.io/FatFoxNav/` 格式访问，无需额外配置。

#### 使用自定义域名

如果配置了自定义域名（如 `nav.zsduo.com`），需要设置 GitHub 仓库变量：

1. 进入仓库 **Settings** → **Secrets and variables** → **Actions**
2. 切换到 **Variables** 标签页
3. 点击 **New repository variable**
4. 添加变量：
   - **Name**: `CUSTOM_DOMAIN`
   - **Value**: `true`
5. 重新触发部署（推送新代码或手动触发 workflow）

> 注意：同时需要在 GitHub Pages 设置中配置自定义域名，并添加相应的 DNS 记录。

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
    icon: "star"  # 图标名称，可用图标见下方说明
    hot: true     # 是否显示 Hot 标记
    children:
      - id: "sub-category"
        name:
          zh-CN: "子分类"
          en-US: "Sub Category"
        icon: "message-circle"  # 子分类也支持自定义图标
```

#### 可用图标

主分类图标：`star`、`sparkles`、`code`、`palette`、`zap`、`book-open`、`heart`、`download`、`info`

子分类图标：`message-circle`、`image`、`video`、`music`、`terminal`、`pen`、`layers`、`compass`、`layout`、`file-text`、`monitor`、`git-branch`、`lightbulb`、`tool`、`smile`、`type`、`edit`、`folder`、`rss`、`graduation-cap`、`users`、`briefcase`、`mail`、`shield`

每个图标都会根据所属分类自动应用相应的颜色主题。

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
