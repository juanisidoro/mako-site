---
title: "AI-Ready Website Checklist: 20 Steps to Optimize for AI Agents"
description: "A practical checklist to make your website readable, discoverable, and actionable for ChatGPT, Claude, Perplexity, and every AI agent."
---

# AI-Ready Website Checklist

AI agents are a growing share of your website traffic. ChatGPT, Claude, Perplexity, shopping assistants, and research bots visit millions of pages every day — but most websites aren't built for them.

This checklist covers 20 concrete steps you can take today, organized by the four dimensions that matter: **Discoverable**, **Readable**, **Trustworthy**, and **Actionable**.

## Discoverable: Can AI Agents Find You?

If agents can't discover your content, nothing else matters.

### 1. Allow AI crawlers in robots.txt

Check that your `robots.txt` doesn't block AI crawlers. Many sites inadvertently block user agents like `GPTBot`, `ClaudeBot`, or `PerplexityBot`.

```
User-agent: *
Allow: /
```

### 2. Add a sitemap.xml

A sitemap helps agents discover all your pages without crawling link by link. Make sure it's referenced in your `robots.txt` and includes all important pages.

### 3. Add an llms.txt file

The [llms.txt standard](https://llmstxt.org) tells AI agents what your site offers and how to access it. Think of it as `robots.txt` for LLMs — a site-level instruction file.

### 4. Add structured data (JSON-LD)

Schema.org markup in JSON-LD format helps agents understand what your page is about without parsing the HTML. Include at least `@type`, `name`, `description`, and relevant properties for your content type.

### 5. Add Open Graph tags

Open Graph tags (`og:title`, `og:description`, `og:type`, `og:image`) are used by AI agents to preview and classify content, not just social platforms.

## Readable: Can AI Agents Understand You?

Most web pages are 90%+ boilerplate. Agents need clean, structured content.

### 6. Use semantic HTML

Tags like `<main>`, `<article>`, `<section>`, and `<aside>` tell agents where the real content lives. Without them, the agent sees a flat soup of `<div>` elements.

### 7. Add a single, descriptive H1

The H1 is the primary signal agents use to understand what a page is about. Use exactly one, and make it descriptive — not "Welcome" or "Home."

### 8. Use meaningful headings

Headings (`<h2>`, `<h3>`) should summarize section content. Agents use them for smart skimming — understanding structure without reading everything. Avoid generic headings like "More Information."

### 9. Add alt text to images

Without alt text, images are invisible to AI agents. With it, agents understand your visual content and can reference it in responses.

### 10. Use descriptive link text

Replace generic link text ("click here," "read more," "learn more") with descriptive labels. Agents use link text to decide whether following a link is worthwhile.

### 11. Don't depend on JavaScript for content

AI agents and crawlers cannot execute JavaScript. If your content requires client-side rendering (React, Vue, Angular SPAs without SSR), it's invisible to every AI agent. Use SSR or static generation.

### 12. Reduce HTML bloat

Remove unnecessary inline styles, empty elements, and non-semantic markup. The less noise in your HTML, the better the signal-to-noise ratio agents experience.

## Trustworthy: Can AI Agents Trust You?

Trust signals help agents verify accuracy and decide whether to cite your page.

### 13. Add a meta description

The meta description is the quick summary agents use when they don't read the full page. Keep it under 160 characters, specific, and accurate.

### 14. Set a canonical URL

`<link rel="canonical">` prevents agents from indexing duplicate versions of your content. Essential if you have URL parameters, pagination, or print versions.

### 15. Declare the language

The `lang` attribute on `<html>` tells agents what language your content is in. Simple, but often missing — and it directly affects comprehension.

```html
<html lang="en">
```

### 16. Keep content fresh

Agents pay attention to dates. Include `datePublished` and `dateModified` in your structured data. Stale content loses trust.

### 17. Use ETag or Last-Modified headers

These headers let agents check if content has changed without re-downloading everything. Efficient caching signals a well-maintained site.

## Actionable: Can AI Agents Interact With You?

The future of the agent web is transactional. If agents can't find your actions, you miss conversions.

### 18. Define clear CTAs in the content

Your "Buy Now," "Subscribe," "Book a Demo" buttons should be clear in the HTML content, not just visually styled. Agents identify actions from text and HTML structure, not CSS.

### 19. Use semantic links with context

Links should have descriptive text that explains where they lead. Instead of "Click here for pricing," use "View pricing plans." This helps agents navigate your site purposefully.

### 20. Put your main content first

Agents scan the first few hundred characters to decide if a page is relevant. If they find only navigation or boilerplate before real content, they may skip your page entirely. Move your H1 and main content as high as possible in the HTML.

## Beyond the Checklist: The MAKO Level

Everything above makes your site better for AI agents using the existing HTML format. But there's a ceiling — even perfectly optimized HTML still sends **15-20x more tokens** than necessary.

The next level is serving structured, AI-native content alongside your HTML through content negotiation. That's what the [MAKO protocol](https://makospec.vercel.app/en/docs) enables: same URL, same server, but when an AI agent visits, it receives optimized markdown with metadata instead of raw HTML.

The result: **~94% fewer tokens**, declared actions agents can execute, and semantic links they can follow with purpose.

## Measure Where You Stand

Every item in this checklist maps to a specific check in [MAKO Score](https://makospec.vercel.app/en/score) — a free audit that measures your site across all four dimensions (Discoverable, Readable, Trustworthy, Actionable) and gives you a score from 0 to 100.

Most sites without any optimization score 30-40. With this checklist, you can reach 60+. With MAKO, 90+.

[Check your AI Score now](https://makospec.vercel.app/en/score).
