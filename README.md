# Stranger - 匿名随机聊天应用

一个基于 Next.js 构建的现代化匿名随机聊天应用，支持实时消息交流、图片分享和即阅即焚等功能。

API接口：[https://github.com/pengsy94/stranger-api](https://github.com/pengsy94/stranger-api)

## ✨ 功能特点

### 核心功能
- **随机匹配聊天**：自动匹配在线用户进行匿名聊天
- **实时消息通信**：支持文本消息的实时发送和接收
- **图片分享**：支持发送和接收图片消息
- **即阅即焚**：发送的图片默认开启即阅即焚模式，查看后立即销毁
- **表情选择器**：内置表情库，丰富聊天表达方式
- **在线人数显示**：实时显示当前在线用户数量

### 用户体验
- **响应式设计**：完美适配桌面和移动设备
- **简洁界面**：现代化 UI 设计，直观易用
- **聊天对象信息**：显示聊天对象的基本信息（性别、年龄、居住地）
- **聊天控制**：支持离开当前聊天和重新匹配新用户
- **隐私保护**：聊天内容不会在本地持久化存储

## 🛠️ 技术栈

### 核心框架
- **Next.js 16** - React 全栈框架
- **React 19** - UI 构建库
- **TypeScript** - 类型安全的 JavaScript 超集

### 状态管理
- **Zustand** - 轻量级状态管理库

### 样式方案
- **Tailwind CSS 4** - 实用优先的 CSS 框架
- **SASS** - CSS 预处理器
- **clsx & tailwind-merge** - 类名管理工具

### 工具库
- **Lucide React** - 现代化图标库
- **Moment.js** - 日期和时间处理
- **UUID** - 唯一标识符生成
- **React Responsive** - 响应式设计辅助

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn 或 pnpm

### 安装和运行

1. **安装依赖**
```bash
npm install
```

2. **启动开发服务器**
```bash
npm run dev
```

3. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本
```bash
npm run build
npm start
```

## 📁 项目结构

```
src/
├── app/                # Next.js App Router
├── components/         # React 组件
│   ├── home/           # 聊天页面组件
│   │   ├── message/    # 消息项组件
│   │   └── Chat.tsx    # 聊天主组件
│   └── ui/             # 通用 UI 组件
├── hooks/              # 自定义 React Hooks
├── lib/                # 工具函数和业务逻辑
│   ├── data/           # 静态数据
│   ├── event/          # 事件处理
│   └── provider/       # 状态提供者
├── stores/             # Zustand 状态存储
├── styles/             # 全局样式
└── types/              # TypeScript 类型定义
```

## 📋 主要组件

- **Chat** - 聊天主界面组件
- **OtherMessageItem** - 对方消息项组件
- **MeMessageItem** - 己方消息项组件
- **EmojiPicker** - 表情选择器组件
- **MessageImage** - 图片消息组件
- **ImagePreview** - 图片预览组件

## 🔧 开发指南

### 代码规范
项目使用 ESLint 进行代码检查：

```bash
npm run lint
```

### 类型检查
TypeScript 类型检查已集成到构建流程中。

## 📱 移动端适配

应用采用响应式设计，在以下设备上有良好的体验：
- 桌面端 (≥ 768px)
- 平板 (≥ 640px)
- 手机 (< 640px)

## 🔒 隐私与安全

- 聊天消息不会在本地持久化存储
- 即阅即焚功能保护图片隐私
- 随机匹配机制保护用户身份

## 🚀 部署

### Vercel（推荐）

1. 登录 [Vercel](https://vercel.com)
2. 选择 "Add New Project"
3. 导入项目仓库
4. 按照提示完成部署

### 其他平台

请参考 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 进行部署。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

## 📄 许可证

[MIT](LICENSE)

## 📞 联系方式

如有问题或建议，请通过 Issue 反馈。

---

**享受匿名聊天的乐趣！** 🎉
