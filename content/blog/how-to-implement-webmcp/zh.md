---
title: "什么是 WebMCP 以及如何添加到你的网站"
description: "WebMCP 是新的 W3C 标准，让 AI 代理通过 HTML 表单与你的网站交互。了解如何用几个属性来实现它。"
---

# 什么是 WebMCP 以及如何添加到你的网站

每当 AI 代理想在网站上买东西、搜索产品或预订餐位时，它都得假装自己是人类。打开浏览器、看屏幕、点击按钮、猜测每个字段是做什么的。

能用——勉强算。但很慢、很脆弱，而且经常出错。

WebMCP 解决了这个问题。你只需在已有的表单上添加几个 HTML 属性，AI 代理就能立刻知道你的网站能做什么。

## 什么是 WebMCP

WebMCP（Web Model Context Protocol）是一个由 Google 和 Microsoft 支持的 [W3C 标准](https://webmachinelearning.github.io/webmcp/)。它让网站能够声明自己的交互能力，使 AI 代理可以直接使用——无需屏幕抓取，无需猜测。

你已经有了表单：搜索栏、结账流程、预订组件。WebMCP 让你用语义属性标注这些表单，使代理将它们理解为结构化工具。

它在 [Chrome 146](https://developer.chrome.com/blog/webmcp-epp)（2026 年 2 月）中作为早期预览版发布。Firefox、Safari 和 Edge 是 [W3C 工作组](https://webmachinelearning.github.io/webmcp/)的成员。

## 工作原理：为表单添加属性

这是一个没有 WebMCP 的产品搜索表单：

```html
<form action="/search">
  <input type="text" name="q" placeholder="搜索产品...">
  <button type="submit">搜索</button>
</form>
```

人类看到的是搜索栏。AI 代理看到的是……一个输入框。它不知道搜索什么、该输入什么、提交后会发生什么。

现在是加上 WebMCP 的同一个表单：

```html
<form action="/search"
      toolname="search_catalog"
      tooldescription="按名称、品牌或类别搜索我们的 3000 多种产品目录"
      toolautosubmit="true">

  <input type="text" name="q"
         toolparamtitle="查询"
         toolparamdescription="要搜索的产品名称、品牌或类别">

  <button type="submit">搜索</button>
</form>
```

表单上三个属性，输入框上两个。代理现在确切地知道这个工具做什么，并能自信地使用它。

### 属性说明

**`<form>` 上的属性：**

| 属性 | 必需 | 用途 |
|---|---|---|
| `toolname` | 是 | 工具的唯一标识符 |
| `tooldescription` | 是 | 用自然语言描述表单的功能 |
| `toolautosubmit` | 否 | 代理填完所有字段后自动提交 |

**`<input>`、`<select>`、`<textarea>` 上的属性：**

| 属性 | 用途 |
|---|---|
| `toolparamtitle` | 字段的简短标签 |
| `toolparamdescription` | 这里该填什么数据（标签不明显时很有用） |

## 电商示例

### 带筛选的产品搜索

```html
<form action="/products"
      toolname="find_products"
      tooldescription="搜索产品，支持可选的价格和类别筛选">

  <input type="text" name="q"
         toolparamtitle="搜索"
         toolparamdescription="产品名称或关键词">

  <select name="category"
          toolparamtitle="类别"
          toolparamdescription="按产品类别筛选">
    <option value="">所有类别</option>
    <option value="electronics">电子产品</option>
    <option value="clothing">服装</option>
    <option value="home">家居与园艺</option>
  </select>

  <input type="number" name="max_price"
         toolparamtitle="最高价格"
         toolparamdescription="最高价格（人民币）">

  <button type="submit">搜索</button>
</form>
```

当有人对 AI 助手说_"帮我找 250 元以下的耳机"_时，代理会填写查询内容、选择类别、设置最高价格并提交。无需猜测 DOM。

### 加入购物车

```html
<form action="/cart/add" method="POST"
      toolname="add_to_cart"
      tooldescription="通过 SKU 和数量将产品添加到购物车"
      toolautosubmit="true">

  <input type="hidden" name="sku" value="SKU-7821"
         toolparamtitle="SKU"
         toolparamdescription="产品 SKU 标识符">

  <input type="number" name="qty" value="1" min="1"
         toolparamtitle="数量"
         toolparamdescription="要添加的数量">

  <button type="submit">加入购物车</button>
</form>
```

### 按邮编查库存

```html
<form action="/api/stock-check"
      toolname="check_local_stock"
      tooldescription="查询某个产品在指定邮编附近的门店是否可自提"
      toolautosubmit="true">

  <input type="hidden" name="product_id" value="12345">

  <input type="text" name="zip"
         toolparamtitle="邮编"
         toolparamdescription="6 位邮编，用于查找附近门店">

  <button type="submit">查询库存</button>
</form>
```

## JavaScript API

对于无法用静态表单表示的动态工具，使用命令式 API：

```javascript
navigator.modelContext.registerTool({
  name: "get_shipping_estimate",
  description: "计算购物车的运费和预计送达日期",
  inputSchema: {
    type: "object",
    properties: {
      zip: {
        type: "string",
        description: "目的地邮编"
      },
      method: {
        type: "string",
        description: "配送方式：standard、express 或 overnight"
      }
    },
    required: ["zip"]
  },
  execute: async (input) => {
    const res = await fetch(`/api/shipping?zip=${input.zip}&method=${input.method || 'standard'}`);
    return await res.json();
  }
});
```

`navigator.modelContext` API 还提供：
- `provideContext()` — 一次注册多个工具
- `unregisterTool(name)` — 移除指定工具
- `clearContext()` — 移除所有已注册工具

完整参考：[W3C WebMCP Spec](https://webmachinelearning.github.io/webmcp/)。

## 如何测试

1. 下载 [Chrome Canary](https://www.google.com/chrome/canary/)
2. 打开 `chrome://flags/`，启用 **"WebMCP for testing"**
3. 安装 WebMCP Chrome 扩展（使用来自 [Google AI Studio](https://aistudio.google.com) 的免费 Gemini API 密钥）
4. 打开任何带有 WebMCP 属性的页面——代理就能与你的表单交互

## 为什么现在就该做

添加 WebMCP 非常简单。在已有的表单上加两三个属性。无需改后端，无需新文件，无需构建 API。

没有这些属性，AI 代理仍然会尝试使用你的网站——但只能通过缓慢、不可靠的屏幕自动化。有了这些属性，代理与你的表单交互就像开发者使用你的 API 一样：直接而精确。

尽早采用很重要。随着越来越多的代理支持 WebMCP，已经声明了工具的网站将获得交互。没有声明的网站只会被抓取——而且效果很差。

## WebMCP + llms.txt + MAKO

三个标准，三个层次：

| 标准 | 层次 | 作用 |
|---|---|---|
| **[llms.txt](/zh/blog/ruhe-chuangjian-llms-txt)** | 发现 | 告诉代理你的网站是关于什么的 |
| **WebMCP** | 交互 | 让代理使用你的表单和工具 |
| **[MAKO](https://makospec.vercel.app/zh/docs)** | 内容 | 按页面提供 AI 优化的内容 |

llms.txt 是地图。WebMCP 是接口。MAKO 是内容。三者结合，让你的网站对每一个访问的 AI 代理完全可用。

## 参考资料

- [W3C WebMCP 规范](https://webmachinelearning.github.io/webmcp/)
- [Chrome 博客：WebMCP Early Preview](https://developer.chrome.com/blog/webmcp-epp)
- [GoogleChromeLabs/webmcp-tools](https://github.com/GoogleChromeLabs/webmcp-tools) — 官方演示和工具
