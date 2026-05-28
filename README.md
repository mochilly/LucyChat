# LucyChat

一个极简风格的 AI Chat 网页客户端，基于 Vue 3 + TypeScript 构建，支持 OpenAI 兼容协议的任意大模型 API。

## 特性

- 流式对话 — SSE 实时逐 Token 渲染，响应零延迟
- Markdown 渲染 — 完整支持代码高亮（20 种语言）、表格、列表等
- 虚拟滚动 — 长对话场景下保持丝滑流畅
- 响应式布局 — 完美适配桌面端与移动端
- 暗色模式 — 自动跟随系统主题
- 本地持久化 — 对话记录存储在浏览器本地，刷新不丢失

## 快速开始

```bash
npm install
npm run dev
```

## 环境变量

在项目根目录创建 `.env` 文件：

```
VITE_API_BASE_URL=https://api.openai.com/v1
VITE_API_KEY=your-api-key-here
VITE_MODEL=gpt-5.5
```

不创建 `.env` 文件时，将使用内置的默认值。

## 技术栈

Vue 3 · TypeScript · Vite · Pinia · highlight.js · @tanstack/vue-virtual
