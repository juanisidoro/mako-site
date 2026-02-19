---
title: "如何创建一个 AI 代理真正使用的 llms.txt"
description: "快速指南：创建有效的 llms.txt 文件——AI 代理的 robots.txt。告诉 ChatGPT、Claude 和 Perplexity 你的网站提供什么。"
---

# 如何创建一个 AI 代理真正使用的 llms.txt

`llms.txt` 文件是告诉 AI 代理你的网站内容的最简单方式。可以把它看作 LLM 的 `robots.txt`——一个放在网站根目录的纯文本文件，向 AI 描述你的内容、结构和功能。

如果代理不知道你的网站提供什么，它就无法推荐你。设置只需 5 分钟。

## 什么是 llms.txt？

[llms.txt 标准](https://llmstxt.org)定义了一个位于 `https://yoursite.com/llms.txt` 的文本文件，为 AI 代理提供：

- 网站和业务描述
- 关键页面及其用途
- 内容结构和导航提示
- API 端点或特殊功能
- 代理应该做什么和不应该做什么

它不是技术规范——而是用自然语言与代理的对话。

## 基本结构

一个有效的最简 `llms.txt`：

```markdown
# 你的网站名称

> 网站简介（1-2 句话）。

## 主要页面

- [首页](https://yoursite.com)：访客在这里能找到什么
- [产品](https://yoursite.com/products)：产品目录
- [博客](https://yoursite.com/blog)：行业相关文章
- [联系](https://yoursite.com/contact)：联系方式

## 本站提供什么

用 2-3 句话描述你的价值主张。
当有人向 AI 询问你的领域时，是什么让你的网站具有相关性？
```

## 实际案例

[makospec.vercel.app](https://makospec.vercel.app/llms.txt) 的 `llms.txt`：

```markdown
# MAKO — Markdown Agent Knowledge Optimization

> 用于提供 LLM 优化网页内容的开放协议。
> 通过内容协商将 token 消耗减少约 93%。

## 文档

- [规范](https://makospec.vercel.app/zh/docs/spec)：完整的 MAKO 协议规范
- [CEF 格式](https://makospec.vercel.app/zh/docs/cef)：紧凑嵌入格式
- [HTTP 头部](https://makospec.vercel.app/zh/docs/headers)：头部参考
- [示例](https://makospec.vercel.app/zh/docs/examples)：产品、文章、文档

## 工具

- [分析器](https://makospec.vercel.app/zh/analyzer)：为任意 URL 生成 MAKO
- [评分](https://makospec.vercel.app/zh/score)：AI 就绪度审计（0-100）
- [目录](https://makospec.vercel.app/zh/directory)：公开分析

## 软件包

- npm：@mako-spec/js（TypeScript SDK）
- npm：@mako-spec/cli（CLI 工具）
- WordPress：mako-wp 插件
```

## 编写有效 llms.txt 的技巧

### 具体而非笼统

不好："我们在网上卖东西。"
好："B2B SaaS 库存管理平台。涵盖电子产品、家具和办公用品，超过 2,000 个 SKU。"

### 包含关键 URL

代理使用这些链接来浏览你的网站。列出最重要的 5-10 个页面。

### 说明你的功能

如果你的网站有 API、搜索或特殊功能，请说明：

```markdown
## API

- POST /api/search：按关键词搜索产品
- GET /api/products/:id：获取产品详情（JSON 格式）
```

### 网站变更时及时更新

过时的 `llms.txt` 比没有还糟糕。如果你添加了新版块、产品类别或功能，请更新文件。

### 保持在 500 行以内

这是摘要，不是完整的站点地图。代理有上下文限制。

## 放置位置

文件必须在域名根路径提供：

```
https://yoursite.com/llms.txt
```

**静态网站（HTML、Hugo、Astro）：** 将 `llms.txt` 添加到 `public/` 或 `static/` 文件夹。

**Next.js：** 创建 `public/llms.txt` 或在 `app/llms.txt/route.ts` 添加路由处理器。

**WordPress：** 使用插件、添加到主题根目录，或创建重写规则。

**Nginx/Apache：** 将文件放在 Web 根目录中。

## llms.txt 与 MAKO 的对比

这两个标准相辅相成：

| | llms.txt | MAKO |
|---|---|---|
| **范围** | 站点级别 | 页面级别 |
| **用途** | 描述网站提供什么 | 按页面提供优化内容 |
| **格式** | 纯文本 / Markdown | YAML 前置数据 + Markdown 正文 |
| **适用于** | 发现和导航 | 内容消费和操作 |

使用 `llms.txt` 帮助代理找到你的内容。使用 [MAKO](https://makospec.vercel.app/zh/docs) 高效地提供内容。

## 验证是否生效

创建 `llms.txt` 后：

1. 在浏览器中访问 `https://yoursite.com/llms.txt`——应该显示为纯文本
2. 通过 [MAKO Score](https://makospec.vercel.app/zh/score) 检测你的网站——"Has llms.txt" 检查项应该通过
3. 问 ChatGPT 或 Claude："[yoursite.com] 提供什么？"——如果 `llms.txt` 已被索引，回答会更准确

五分钟的工作，让每个访问你网站的 AI 代理都能持续看到你。
