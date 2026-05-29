# LucyChat

一个极简风格的 AI Chat 应用，前后端分离架构，支持 OpenAI 兼容协议的任意大模型 API。

## 项目结构

```
LucyChat/
├── client/          前端 — Vue 3 + TypeScript + Vite
├── server/          后端 — Node.js + Express + TypeScript
└── README.md
```

## 快速开始

### 后端

```bash
cd server
cp .env.example .env   # 填入你的 API Key
npm install
npm run dev
```

### 前端

```bash
cd client
npm install
npm run dev
```

前端默认运行在 `http://localhost:5173`，后端运行在 `http://localhost:3000`。

## 技术栈

**前端** — Vue 3 · TypeScript · Vite · Pinia · highlight.js · @tanstack/vue-virtual

**后端** — Node.js · Express · TypeScript · dotenv
