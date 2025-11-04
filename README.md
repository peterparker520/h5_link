# 时光拍 H5 视频分享落地页

一个基于 React + Vite 构建的现代化 H5 视频分享落地页应用，支持移动端和桌面端自适应展示，专为"时光拍"视频社区打造。

## ✨ 核心特性

### 🎯 功能特性
- **动态视频加载**：通过 URL 参数 `video_id` 动态获取并展示视频内容
- **响应式设计**：自动识别设备类型，提供移动端和桌面端不同的 UI 体验
- **智能路由管理**：基于 React Router 实现 SPA 单页应用，支持浏览器历史记录
- **实时窗口适配**：监听窗口大小变化，动态切换移动端/桌面端视图
- **完善的错误处理**：优雅处理视频不存在、已删除等异常情况
- **加载状态管理**：提供友好的加载动画和空状态提示

### 📱 页面组件
- **VideoSharePage (移动端)**：移动端视频详情页，包含视频播放、用户信息、评论互动
- **VideoSharePage_Desktop (桌面端)**：桌面端视频详情页，采用左右分栏布局
- **DownloadPage**：APP 下载引导页，带背景图和下载按钮
- **BlankPage**：内容不存在提示页
- **LoadingPage**：数据加载中页面

### 🎨 技术亮点
- **iOS 微信视频优化**：针对 iOS 微信环境的视频播放进行深度优化，解决黑屏、卡顿等问题
- **GPU 渲染加速**：使用 CSS3 transform 和 will-change 属性激活硬件加速
- **智能时间格式化**：相对时间显示（刚刚、X分钟前、X天前等）
- **二维码下载引导**：桌面端提供二维码扫描下载功能

## 🛠️ 技术栈

| 类别 | 技术/工具 | 版本 |
|------|----------|------|
| **前端框架** | React | 19.1.1 |
| **构建工具** | Vite | 7.1.7 |
| **路由管理** | React Router DOM | 7.9.4 |
| **代码规范** | ESLint | 9.36.0 |
| **开发语言** | JavaScript (ES6+) | - |
| **样式方案** | CSS3 | - |

## 📦 项目结构

```
h5_link/
├── public/                      # 静态资源
│   └── logo.png                # 应用 Logo
├── src/
│   ├── components/             # 页面组件
│   │   ├── VideoSharePage.jsx         # 移动端视频详情页
│   │   ├── VideoSharePage.css
│   │   ├── VideoSharePage_Desktop.jsx # 桌面端视频详情页
│   │   ├── VideoSharePage_Desktop.css
│   │   ├── DownloadPage.jsx           # 下载页
│   │   ├── DownloadPage.css
│   │   ├── BlankPage.jsx              # 空白提示页
│   │   ├── BlankPage.css
│   │   ├── Loading.jsx                # 加载页
│   │   └── Loading.css
│   ├── img/                    # 图片资源
│   │   ├── image.png          # 下载页背景图
│   │   └── qr_code.png        # APP 下载二维码
│   ├── utils/                  # 工具函数
│   │   └── timeFormatter.js   # 时间格式化工具
│   ├── App.jsx                 # 主应用组件（路由与核心逻辑）
│   ├── App.css                 # 主应用样式
│   ├── api.js                  # API 接口封装
│   ├── main.jsx                # 应用入口
│   └── index.css               # 全局样式
├── dist/                       # 构建输出目录
├── index.html                  # HTML 模板
├── vite.config.js             # Vite 配置（含开发代理）
├── eslint.config.js           # ESLint 配置
├── package.json               # 项目依赖
└── README.md                  # 项目文档
```

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 16.0.0
- **npm**: >= 7.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

开发服务器将在 `http://localhost:5173` 启动。

**访问示例**：
```
http://localhost:5173/?video_id=10904038
```

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 🔧 核心功能详解

### 1. 路由系统

应用使用 React Router DOM 实现以下路由：

| 路由 | 组件 | 说明 |
|------|------|------|
| `/` | LoadingPage | 首页加载页，获取视频数据后自动跳转 |
| `/mobile` | VideoSharePage | 移动端视频详情页 |
| `/desktop` | VideoSharePage_Desktop | 桌面端视频详情页 |
| `/download` | DownloadPage | APP 下载页 |
| `/blank` | BlankPage | 内容不存在提示页 |

### 2. API 接口

**API 基础地址**：`/api` (开发环境通过 Vite 代理到 `https://sgp-test.xinpianchang.com`)

**接口列表**：

```javascript
// 获取视频详情
POST /api/v1/content/video/detail
Body: { video_id: number }

// 获取视频评论列表
POST /api/v1/content/video/comment/list
Body: { video_id: number }

// 获取模板分类名称
POST /api/v1/distribute/template/category_names
Body: { template_id: number }
```


### 3. 数据流转

```
URL (?video_id=xxx)
    ↓
App.jsx (提取 video_id)
    ↓
api.js (并行请求视频详情、评论、分类)
    ↓
判断设备类型 (window.innerWidth <= 768)
    ↓
路由跳转 (/mobile 或 /desktop)
    ↓
页面组件渲染 (通过 location.state 接收数据)
```

### 4. 响应式适配

- **断点**：768px
- **移动端** (≤768px)：单列布局，视频全屏展示
- **桌面端** (>768px)：左右分栏，左侧视频内容，右侧下载引导

**动态切换**：监听 `window.resize` 事件，实时切换路由

### 5. iOS 微信视频优化

针对 iOS 微信浏览器的视频播放问题，实现了以下优化：

```javascript
// 1. 设置内联播放属性
video.setAttribute('webkit-playsinline', 'true')
video.setAttribute('x5-playsinline', 'true')

// 2. 激活 GPU 渲染
video.style.transform = 'translateZ(0)'
video.style.willChange = 'transform'

// 3. 定时器保活机制（移动端）
// 通过微小的 transform 抖动保持 GPU 合成层活跃

// 4. 强制刷新视频帧
video.currentTime = currentTime + 0.001
```

### 6. 时间格式化

`utils/timeFormatter.js` 提供智能时间显示：

- **0-59秒**：刚刚
- **1-59分钟**：X分钟前
- **1-23小时**：X小时前
- **1-7天**：X天前
- **7天以上（当年）**：M月D日
- **跨年**：YYYY年M月D日

## ⚙️ 配置说明

### Vite 配置 (vite.config.js)

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://sgp-test.xinpianchang.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path
      }
    }
  }
})
```

### HTML 配置 (index.html)

```html
<!-- 移动端适配 -->
<meta name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

## 🚢 部署指南

### 静态托管 + API 代理

1. **构建项目**
```bash
npm run build
```

2. **配置 Nginx 反向代理**
```nginx
server {
    listen 80 ; 
    listen 443 ssl http2 ; 
    server_name h5-link.incandescent.top; 
    index index.php index.html index.htm default.php default.htm default.html; 
    proxy_set_header Host $host; 
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
    proxy_set_header X-Forwarded-Host $server_name; 
    proxy_set_header X-Real-IP $remote_addr; 
    proxy_http_version 1.1; 
    proxy_set_header Upgrade $http_upgrade; 
    proxy_set_header Connection $http_connection; 
    access_log /www/sites/h5-link.incandescent.top/log/access.log main; 
    error_log /www/sites/h5-link.incandescent.top/log/error.log; 
    location ^~ /.well-known/acme-challenge {
        allow all; 
        root /usr/share/nginx/html; 
    }
    location /api/ {
        proxy_pass https://sgp-test.xinpianchang.com;  
        proxy_set_header Host sgp-test.xinpianchang.com;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_http_version 1.1;
        proxy_set_header Connection "";

        proxy_redirect off;
        proxy_ssl_server_name on;
        proxy_ssl_verify off; 
    }

    root /www/sites/h5-link.incandescent.top/index; 
    error_page 404 /404.html; 
    if ($scheme = http) {
        return 301 https://$host$request_uri; 
    }
    ssl_certificate /www/sites/h5-link.incandescent.top/ssl/fullchain.pem; 
    ssl_certificate_key /www/sites/h5-link.incandescent.top/ssl/privkey.pem; 
    ssl_protocols TLSv1.3 TLSv1.2 TLSv1.1 TLSv1; 
    ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA256:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK:!KRB5:!SRP:!CAMELLIA:!SEED; 
    ssl_prefer_server_ciphers on; 
    ssl_session_cache shared:SSL:10m; 
    ssl_session_timeout 10m; 
    error_page 497 https://$host$request_uri; 
    proxy_set_header X-Forwarded-Proto https; 
    add_header Strict-Transport-Security "max-age=31536000"; 

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📝 开发注意事项

1. **视频播放**：iOS 微信环境需要特殊处理，已在代码中实现
2. **API 代理**：生产环境需要配置服务器端代理或 CORS
3. **图片资源**：确保 `public/logo.png` 和 `src/img/` 下的图片存在
4. **路由模式**：使用 BrowserRouter，需要服务器支持 History 模式

## 🐛 常见问题

**Q: 视频在 iOS 微信中播放黑屏？**
A: 已通过 GPU 渲染优化和定时器保活机制解决。

**Q: 页面刷新后 404？**
A: 需要配置服务器将所有路由指向 `index.html`。

**Q: API 请求跨域？**
A: 开发环境已配置 Vite 代理，生产环境需配置服务器端代理。

## 📜 可用脚本

- `npm run dev`: 启动 Vite 开发服务器
- `npm run build`: 构建生产版本
- `npm run lint`: 运行 ESLint 代码检查
- `npm run preview`: 预览生产构建

