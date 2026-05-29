# Information — RSS 聚合阅读

收集中文互联网与外网 RSS，按分类与时间线整理展示；外网内容支持 AI 翻译为中文。

## 功能

- **中文源**：知乎热榜、B站热门/排行榜、微博热搜、V2EX、36氪、少数派等（通过 [RSSHub](https://docs.rsshub.app)）
- **外网源**：Hacker News、The Verge、BBC 等
- **AI 翻译**：在设置中填写 Provider（OpenAI / DeepSeek / 自定义兼容接口）与 API Key，自动或手动将外网标题/摘要译为中文
- 按「国内 / 外网」、分类、来源筛选与搜索
- 5 分钟服务端缓存，支持手动刷新

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

## 设置说明

1. 打开页面右上角 **设置**
2. **RSSHub 实例**：B站/知乎/微博等需 RSSHub。建议 [自建](https://docs.rsshub.app/install/)，公共实例可能限流或失效
3. **AI 翻译**：选择 Provider、填写 API Key；可选自定义 Base URL（OneAPI、硅基流动、本地 Ollama 等 OpenAI 兼容接口）与模型名

API Key 保存在浏览器 `localStorage`，请求时经本项目的 `/api/translate` 转发到你的 Provider。

## 添加 RSS 源

编辑 `src/config/feeds.ts`：

```ts
// 中文站（RSSHub）
{
  id: "douban-movie",
  name: "豆瓣电影",
  rsshubPath: "/douban/movie/playing",
  siteUrl: "https://movie.douban.com",
  category: "social",
  locale: "zh",
}

// 外网直链
{
  id: "example",
  name: "Example",
  url: "https://example.com/feed.xml",
  category: "tech",
  locale: "en",  // 外网会参与 AI 翻译
}
```

## 项目结构

```
src/
  config/feeds.ts    # RSS 源配置
  lib/feeds.ts       # 拉取、解析、缓存
  app/api/feeds/     # 聚合 API
  components/        # 前端展示
```

## 后续可扩展

- 用户自定义订阅（数据库 + 管理页）
- OPML 导入/导出
- 定时后台任务（cron / Vercel Cron）
- 已读标记、收藏
- 全文抓取（需遵守版权与 robots）

## 技术栈

Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · rss-parser
