---
title: "Introducing MAKO: The Open Protocol for AI-Optimized Content"
description: "Why we built MAKO and how it reduces token consumption by 94% while making every web page understandable to AI agents."
---

# Introducing MAKO

The web wasn't designed for AI agents. Every time ChatGPT, Perplexity, or a shopping assistant visits a website, it downloads navigation bars, cookie banners, ad scripts, and thousands of lines of markup — just to find a product name and price.

The result? **4,000+ tokens consumed** before the agent reaches the actual content. For JavaScript-rendered SPAs, the situation is even worse: the agent sees an empty `<div id="root"></div>` and nothing else.

## The Problem

Consider a typical e-commerce product page. A human visitor sees a clean layout with a product image, title, price, and an "Add to Cart" button. An AI agent sees this:

- 181 KB of raw HTML
- Navigation with 47 links
- 3 cookie consent scripts
- Inline CSS for 200+ components
- The actual product data buried somewhere in the middle

This is **93% noise, 7% signal**.

## The SPA Black Hole

For modern JavaScript applications (React, Vue, Angular, Next.js CSR), the situation is even worse. When an AI agent requests a page, the server responds with something like:

```html
<div id="root"></div>
<script src="/bundle.js"></script>
```

The actual content — products, articles, prices, descriptions — is rendered client-side by JavaScript. AI agents don't execute JavaScript. They see an empty page. Your entire site is **invisible**.

Server-side rendering (SSR) and static generation help, but even then the HTML is bloated with hydration markers, embedded state, and framework artifacts. A Next.js SSR page still sends 5-10x more tokens than necessary because it includes the full React tree alongside the actual content.

The web is split: legacy sites send too much noise, modern SPAs send nothing at all. Neither format is designed for the audience that's growing fastest.

## What MAKO Does

MAKO adds a structured, AI-optimized layer to any website using standard HTTP content negotiation. When an AI agent sends `Accept: text/mako+markdown`, the server responds with a clean MAKO document instead of raw HTML:

```yaml
---
mako: "1.0"
type: product
entity: "Wireless Headphones Pro"
tokens: 276
language: en
updated: "2026-02-20T10:00:00Z"
---
```

The same URL, the same server — just a different response for a different audience.

## Key Design Decisions

**Content negotiation over new endpoints.** We chose the `Accept` header pattern because it requires zero URL changes. Every existing page can serve MAKO without creating duplicate routes.

**Markdown over JSON.** LLMs are trained on markdown. A well-structured markdown document with YAML frontmatter is more token-efficient and more naturally readable by language models than equivalent JSON.

**10 content types.** Product, article, docs, landing, listing, profile, event, recipe, FAQ, and custom. Each type tells the agent exactly what structure to expect.

**Declared actions.** Instead of hoping the agent finds your "Add to Cart" button in the HTML, MAKO declares machine-readable actions with endpoints and parameters.

## The Numbers

In our benchmarks across 50+ real-world pages:

| Metric | Raw HTML | MAKO |
|--------|----------|------|
| Average size | 181 KB | 3 KB |
| Average tokens | ~4,125 | ~276 |
| Reduction | — | **93%** |

That's not a marginal improvement. It's the difference between an agent that can process 3 pages per context window and one that can process 45.

## Getting Started

MAKO is available today:

- **WordPress:** Install the [mako-wp plugin](https://github.com/juanisidoro/mako-wp) — activate and it works with WooCommerce, Yoast, and ACF
- **Any stack:** Use [@mako-spec/js](https://www.npmjs.com/package/@mako-spec/js) — TypeScript SDK with Express middleware
- **Validate:** Use [@mako-spec/cli](https://www.npmjs.com/package/@mako-spec/cli) to validate your MAKO files

The protocol is open source under Apache 2.0. The full specification is available at [makospec.vercel.app/docs](https://makospec.vercel.app/en/docs).

## What's Next

We're working on MAKO Score — an auditing tool that measures how AI-ready any website is across four dimensions: Discoverable, Readable, Trustworthy, and Actionable. Check your site at [makospec.vercel.app/score](https://makospec.vercel.app/en/score).

The web is gaining a new audience. MAKO helps you speak their language.
