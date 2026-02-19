---
title: "MAKO 介绍：面向 AI 优化内容的开放协议"
description: "我们为什么要构建 MAKO，以及它如何将 token 消耗降低 94%，同时让每个网页都能被 AI 代理理解。"
---

# MAKO 介绍

互联网并非为 AI 代理而设计。每当 ChatGPT、Perplexity 或购物助手访问一个网站时，它都需要下载导航栏、cookie 横幅、广告脚本以及数千行 markup——仅仅是为了找到一个产品名称和价格。

结果呢？在代理到达实际内容之前，已经**消耗了超过 4,000 个 tokens**。对于 JavaScript 渲染的 SPA 应用，情况更加糟糕：代理看到的只是一个空的 `<div id="root"></div>`，别无其他。

## 问题所在

以一个典型的电商产品页面为例。人类访问者看到的是一个简洁的布局——产品图片、标题、价格和一个"加入购物车"按钮。而 AI 代理看到的是：

- 181 KB 的原始 HTML
- 包含 47 个链接的导航
- 3 个 cookie 同意脚本
- 200 多个组件的内联 CSS
- 实际产品数据被埋没在页面中间某处

这意味着 **93% 是噪音，只有 7% 是有效信号**。

## MAKO 的作用

MAKO 利用标准的 HTTP 内容协商机制，为任何网站添加了结构化的、AI 优化的内容层。当 AI 代理发送 `Accept: text/mako+markdown` 时，服务器会返回一个干净的 MAKO 文档，而非原始 HTML：

```yaml
---
mako: "1.0"
type: product
entity: "无线耳机 Pro"
tokens: 276
language: zh
updated: "2026-02-20T10:00:00Z"
---
```

同一个 URL，同一台服务器——只是为不同的受众提供不同的响应。

## 关键设计决策

**内容协商优于新建端点。** 我们选择了 `Accept` 请求头模式，因为它不需要任何 URL 变更。每个现有页面都可以直接提供 MAKO 内容，无需创建重复路由。

**Markdown 优于 JSON。** LLM 是基于 markdown 训练的。一个结构良好的 markdown 文档配合 YAML frontmatter，比等效的 JSON 更节省 tokens，也更易于语言模型自然理解。

**10 种内容类型。** 产品、文章、文档、着陆页、列表、个人资料、活动、食谱、FAQ 和自定义。每种类型都明确告诉代理应该期望什么结构。

**声明式操作。** 与其寄希望于代理在 HTML 中找到你的"加入购物车"按钮，MAKO 直接声明机器可读的操作，包括端点和参数。

## 数据说话

在我们对 50 多个真实页面的基准测试中：

| 指标 | 原始 HTML | MAKO |
|------|-----------|------|
| 平均大小 | 181 KB | 3 KB |
| 平均 tokens | ~4,125 | ~276 |
| 缩减幅度 | — | **93%** |

这不是微小的改进。这意味着一个代理在单个上下文窗口中可以从处理 3 个页面提升到处理 45 个页面。

## 快速上手

MAKO 现已可用：

- **WordPress：** 安装 [mako-wp 插件](https://github.com/juanisidoro/mako-wp)——激活即可与 WooCommerce、Yoast 和 ACF 配合使用
- **任何技术栈：** 使用 [@mako-spec/js](https://www.npmjs.com/package/@mako-spec/js)——TypeScript SDK，内含 Express 中间件
- **验证：** 使用 [@mako-spec/cli](https://www.npmjs.com/package/@mako-spec/cli) 验证你的 MAKO 文件

该协议基于 Apache 2.0 许可证开源。完整规范请访问 [makospec.vercel.app/docs](https://makospec.vercel.app/zh/docs)。

## 下一步

我们正在开发 MAKO Score——一个审计工具，从四个维度衡量任何网站的 AI 就绪程度：可发现性、可读性、可信度和可操作性。立即在 [makospec.vercel.app/score](https://makospec.vercel.app/zh/score) 检测你的网站。

互联网正在迎来一批全新的受众。MAKO 帮助你用它们的语言与之对话。
