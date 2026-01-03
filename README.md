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
    featured: true # 是否精选
```

### 分类配置 (data/categories.yaml)

```yaml
categories:
  - id: "category-id"
    name:
      zh-CN: "分类名称"
      en-US: "Category Name"
    icon: "star" # 图标名称，可用图标见下方说明
    hot: true # 是否显示 Hot 标记
    children:
      - id: "sub-category"
        name:
          zh-CN: "子分类"
          en-US: "Sub Category"
        icon: "message-circle" # 子分类也支持自定义图标
```

#### 可用图标

**主分类图标**（每个图标都有专属颜色主题）

| 图标名称    | 说明      | 推荐用途           | 颜色   |
| ----------- | --------- | ------------------ | ------ |
| `star`      | ⭐ 星标   | 常用推荐、精选内容 | 金黄色 |
| `sparkles`  | ✨ 闪光   | AI 工具、创新功能  | 紫色   |
| `code`      | 💻 代码   | 开发工具、编程     | 蓝色   |
| `palette`   | 🎨 调色板 | 设计资源、创意     | 粉色   |
| `zap`       | ⚡ 闪电   | 效率工具、快速操作 | 黄色   |
| `book-open` | 📖 书本   | 学习资源、文档     | 绿色   |
| `heart`     | ❤️ 心形   | 生活服务、收藏     | 红色   |
| `download`  | 📥 下载   | 软件资源、下载     | 靛蓝色 |
| `info`      | ℹ️ 信息   | 关于、帮助         | 青色   |

**子分类图标**（继承父分类颜色）

| 图标名称         | 说明        | 推荐用途           |
| ---------------- | ----------- | ------------------ |
| `message-circle` | 💬 对话气泡 | AI 对话、聊天      |
| `image`          | 🖼️ 图片     | AI 绘画、图片工具  |
| `video`          | 🎬 视频     | AI 视频、视频编辑  |
| `music`          | 🎵 音乐     | AI 音频、音乐工具  |
| `terminal`       | 💻 终端     | AI 编程、命令行    |
| `pen`            | ✏️ 笔       | AI 写作、编辑      |
| `layers`         | 📚 图层     | AI 综合、多功能    |
| `compass`        | 🧭 指南针   | AI 导航、导航站    |
| `layout`         | 📐 布局     | 前端框架、界面     |
| `file-text`      | 📄 文档     | 开发文档、说明     |
| `monitor`        | 🖥️ 显示器   | 在线 IDE、编辑器   |
| `git-branch`     | 🌿 分支     | 代码托管、版本控制 |
| `lightbulb`      | 💡 灯泡     | 灵感采集、创意     |
| `tool`           | 🛠️ 工具     | 设计工具、实用工具 |
| `smile`          | 😊 笑脸     | 图标素材、表情     |
| `type`           | 🔤 字体     | 字体资源、排版     |
| `edit`           | ✍️ 编辑     | 笔记工具、编辑     |
| `folder`         | 📁 文件夹   | 文件处理、管理     |
| `rss`            | 📡 RSS      | 技术博客、订阅     |
| `graduation-cap` | 🎓 学士帽   | 在线课程、教育     |
| `users`          | 👥 用户     | 技术社区、社交     |
| `briefcase`      | 💼 公文包   | 求职招聘、工作     |
| `mail`           | 📧 邮件     | 邮箱服务、通信     |
| `shield`         | 🛡️ 盾牌     | 政务服务、安全     |

> **提示**：每个图标都会根据所属分类自动应用相应的颜色主题，无需手动配置颜色。子分类图标会继承父分类的颜色风格，保持视觉一致性。

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
