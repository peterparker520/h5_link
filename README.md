# 时光拍 H5 视频分享应用

一个基于 React + Vite 构建的移动端 H5 视频分享应用，完美复刻了短视频平台的用户界面和交互体验。项目包含视频播放、社交互动、分享下载等完整功能模块。

## ✨ 项目亮点

- **📱 移动端优化**: 专为移动设备设计的响应式界面，完美适配各种屏幕尺寸
- [object Object] 视频播放器**: 自定义视频播放控件，支持播放/暂停、进度控制、全屏切换
- **👥 社交互动**: 用户信息展示、关注按钮、点赞评论等完整社交元素
- [object Object] 支持话题标签展示（#旅行vlog #旅行日常等）
- [object Object] 完整的评论展示界面，包含用户头像、认证标识、回复功能
- *[object Object]享功能**: 微信、朋友圈分享按钮，支持社交[object Object]精美UI**: 高度还原短视频平台的视觉设计和交互体验

## 🛠️ 技术栈

- **前端框架**: React 19.1.1
- **构建工具**: Vite 7.1.7  
- **路由管理**: React Router DOM 7.9.4
- **样式方案**: 原生 CSS + 响应式设计
- **代码规范**: ESLint + React Hooks 规则

## 📁 项目结构

```
h5_link/
├── public/                    # 静态资源目录
│   └── logo.png              # 应用品牌logo
├── src/
│   ├── components/           # React组件目录
│   │   ├── VideoSharePage.jsx    # 视频分享主页面
│   │   ├── VideoSharePage.css    # 主页面样式
│   │   ├── DownloadPage.jsx      # 应用下载页面  
│   │   ├── DownloadPage.css      # 下载页面样式
│   │   └── OpenAppButton.jsx     # 打开应用按钮组件
│   ├── img/                  # 图片和媒体资源
│   │   ├── background.jpeg       # 下载页背景图
│   │   ├── test_portrait.mp4     # 竖屏测试视频
│   │   ├── test_landscap.mp4     # 横屏测试视频
│   │   ├── cover_portrait.jpg    # 竖屏视频封面
│   │   ├── cover_landscap.jpg    # 横屏视频封面
│   │   ├── wechat.png           # 微信分享图标
│   │   ├── wechat_moment.png    # 朋友圈分享图标
│   │   ├── thumb.png            # 点赞图标
│   │   ├── reply.png            # 回复图标
│   │   ├── music.png            # 音乐图标
│   │   └── microphone.png       # 麦克风图标
│   ├── assets/               # Vite资源目录
│   ├── App.jsx              # 主应用组件
│   ├── App.css              # 全局样式
│   ├── main.jsx             # 应用入口文件
│   └── index.css            # 基础样式
├── package.json             # 项目依赖配置
├── vite.config.js          # Vite构建配置
└── eslint.config.js        # ESLint代码规范配置
```

## 🎯 核心功能

### 🏠 视频分享页面 (`/`)
- **品牌展示**: 时光拍品牌信息（时光会走远，美剪能留痕）
- **用户信息**: 头像、用户名、认证标识、地理位置、发布时间
- **视频播放**: 自定义播放器控件、进度条、时间显示、全屏支持
- **内容展示**: 视频描述、话题标签、模板推广卡片
- **社交互动**: 点赞按钮、分享到微信/朋友圈
- **评论系统**: 用户评论列表、作者标识、首评标识、回复功能
- **智能跳转**: 点击非视频区域自动跳转到下载页面

### 📱 下载页面 (`/download`)  
- **视觉设计**: 精美背景图片展示
- **下载引导**: 醒目的"立即下载"按钮
- **用户体验**: 简洁明了的下载流程

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
启动后访问 `http://localhost:5173`

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

### 代码检查
```bash
npm run lint
```

## 📱 页面路由

- `/` - 视频分享主页面
- `/download` - 应用下载页面

## 🎨 UI 特性

- 移动端适配的响应式设计
- 仿真短视频平台的视觉风格
- 流畅的交互动画效果
- 自定义视频播放控件
- 社交平台风格的用户界面

## 📝 开发说明

项目采用现代化的前端开发技术栈：
- 使用 Vite 作为构建工具，提供快速的热重载和构建体验
- React 19 提供最新的组件化开发能力
- React Router 实现单页面应用的路由管理
- ESLint 确保代码质量和一致性

## 🔧 自定义配置

### Vite 配置
项目使用默认的 Vite React 配置，支持：
- 快速热重载 (HMR)
- ES6+ 语法支持
- CSS 预处理
- 静态资源处理

### ESLint 配置
项目配置了 React 相关的 ESLint 规则：
- React Hooks 规则检查
- React Refresh 支持
- 现代 JavaScript 语法支持

## 🌟 项目特色

### 视频播放功能
- 支持竖屏和横屏两种视频格式
- 自定义播放控件界面
- 视频封面预览功能
- 播放进度控制

### 社交互动体验
- 完整的用户信息展示
- 点赞和分享功能
- 评论系统实现
- 社交媒体分享集成

### 移动端优化
- 响应式布局设计
- 触摸友好的交互
- 移动端性能优化
- 跨设备兼容性

## 📄 许可证

本项目仅供学习和演示使用。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

---

**时光拍** - 时光会走远，美剪能留痕 ✨
