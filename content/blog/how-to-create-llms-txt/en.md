---
title: "How to Create an llms.txt That AI Agents Actually Use"
description: "A quick guide to creating an effective llms.txt file — the robots.txt for AI agents. Tell ChatGPT, Claude, and Perplexity what your site is about."
---

# How to Create an llms.txt That AI Agents Actually Use

The `llms.txt` file is the simplest way to tell AI agents what your website is about. Think of it as `robots.txt` for LLMs — a plain text file at your site root that describes your content, structure, and capabilities for AI consumption.

If an agent doesn't know what your site offers, it can't recommend you. This takes 5 minutes to set up.

## What Is llms.txt?

The [llms.txt standard](https://llmstxt.org) defines a simple text file served at `https://yoursite.com/llms.txt` that provides AI agents with:

- A description of your site and business
- Key pages and their purpose
- Content structure and navigation hints
- API endpoints or special capabilities
- What the agent should and shouldn't do

It's not a technical spec — it's a conversation with the agent in plain language.

## Basic Structure

Here's a minimal `llms.txt` that works:

```markdown
# Your Site Name

> Brief description of your site (1-2 sentences).

## Main Pages

- [Homepage](https://yoursite.com): What visitors find here
- [Products](https://yoursite.com/products): Your product catalog
- [Blog](https://yoursite.com/blog): Articles about your industry
- [Contact](https://yoursite.com/contact): How to reach you

## What This Site Offers

Describe your value proposition in 2-3 sentences.
What makes your site relevant to someone asking an AI about your topic?
```

## Real-World Example

Here's the `llms.txt` for [makospec.vercel.app](https://makospec.vercel.app/llms.txt):

```markdown
# MAKO — Markdown Agent Knowledge Optimization

> Open protocol for serving LLM-optimized web content.
> Reduces token consumption by ~93% via content negotiation.

## Documentation

- [Specification](https://makospec.vercel.app/en/docs/spec): Full MAKO protocol spec
- [CEF Format](https://makospec.vercel.app/en/docs/cef): Compact Embedding Format
- [HTTP Headers](https://makospec.vercel.app/en/docs/headers): Headers reference
- [Examples](https://makospec.vercel.app/en/docs/examples): Product, article, docs

## Tools

- [Analyzer](https://makospec.vercel.app/en/analyzer): Generate MAKO for any URL
- [Score](https://makospec.vercel.app/en/score): AI-readiness audit (0-100)
- [Directory](https://makospec.vercel.app/en/directory): Public analyses

## Packages

- npm: @mako-spec/js (TypeScript SDK)
- npm: @mako-spec/cli (CLI tool)
- WordPress: mako-wp plugin
```

## Tips for an Effective llms.txt

### Be specific, not generic

Bad: "We sell things online."
Good: "B2B SaaS platform for inventory management. 2,000+ SKUs across electronics, furniture, and office supplies."

### Include your key URLs

Agents use these to navigate your site. List the 5-10 pages that matter most.

### Mention your capabilities

If your site has an API, search, or special features, say so:

```markdown
## API

- POST /api/search: Search products by query
- GET /api/products/:id: Get product details as JSON
```

### Update it when your site changes

A stale `llms.txt` is worse than none. If you add a new section, product category, or feature, update the file.

### Keep it under 500 lines

This is a summary, not your entire sitemap. Agents have context limits.

## Where to Put It

The file must be served at the root of your domain:

```
https://yoursite.com/llms.txt
```

**Static sites (HTML, Hugo, Astro):** Add `llms.txt` to your `public/` or `static/` folder.

**Next.js:** Create `public/llms.txt` or add a route handler at `app/llms.txt/route.ts`.

**WordPress:** Use a plugin or add to your theme's root, or create a rewrite rule.

**Nginx/Apache:** Place the file in your web root directory.

## llms.txt vs MAKO

These two standards complement each other:

| | llms.txt | MAKO |
|---|---|---|
| **Scope** | Site-level | Page-level |
| **Purpose** | Describe what your site offers | Serve optimized content per page |
| **Format** | Plain text / markdown | YAML frontmatter + markdown body |
| **Best for** | Discovery and navigation | Content consumption and actions |

Use `llms.txt` to help agents find your content. Use [MAKO](https://makospec.vercel.app/en/docs) to serve it efficiently.

## Verify It Works

After creating your `llms.txt`:

1. Visit `https://yoursite.com/llms.txt` in your browser — it should display as plain text
2. Run your site through [MAKO Score](https://makospec.vercel.app/en/score) — the "Has llms.txt" check should pass
3. Ask ChatGPT or Claude: "What does [yoursite.com] offer?" — if `llms.txt` is indexed, the answer improves

Five minutes of work. Permanent visibility to every AI agent that visits.
