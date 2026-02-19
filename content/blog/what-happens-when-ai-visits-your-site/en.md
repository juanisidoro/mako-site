---
title: "What Happens When an AI Agent Visits Your Website"
description: "The invisible journey from HTTP request to reasoning — and why 93% of what your server sends is noise an AI agent can't use."
---

# What Happens When an AI Agent Visits Your Website

Every day, millions of AI agents visit websites. ChatGPT, Claude, Perplexity, shopping assistants, research bots — they all need to read web content. But none of them see your website the way a human does.

No CSS. No rendered layouts. No images (usually). Just raw text extracted from your HTML source code.

Here's what actually happens, step by step.

## Step 1: The Agent Receives a URL

A user asks something like "Compare prices for wireless headphones on this store." The AI agent identifies the relevant URL and prepares to fetch it.

The agent itself doesn't have a browser. It delegates to a tool — typically an HTTP client or a specialized web-fetching service — that will make the request on its behalf.

## Step 2: An HTTP Request Is Made

The tool sends a standard `GET` request to your server. Your server doesn't know (or care) that the visitor is an AI agent — it responds with the same HTML it would send to any browser.

The response typically includes:
- Navigation bars and menus (47+ links)
- Cookie consent banners and scripts
- CSS stylesheets (inline and external)
- JavaScript bundles
- Advertising scripts and tracking pixels
- The actual content, buried somewhere in the middle

For a typical e-commerce product page, this is **181 KB of HTML** — roughly **4,125 tokens** in an LLM's context window.

## Step 3: Content Extraction

The raw HTML is far too noisy and token-expensive to pass directly to the AI model. So the fetching tool applies a pre-processing step:

1. **Strip irrelevant tags:** `<script>`, `<style>`, `<nav>`, `<footer>`, tracking pixels
2. **Extract readable text:** paragraphs, headings, lists, tables
3. **Convert to markdown** (sometimes) for compactness
4. **Truncate** to fit within token limits

This extraction is heuristic and imperfect. The tool doesn't know which `<div>` contains your product price and which contains a cookie banner. It guesses based on HTML structure — and often guesses wrong.

## Step 4: Text Enters the Context Window

The cleaned text arrives in the AI's context window as if it were a regular message. The agent doesn't "see" the page — it reads a text document that may or may not accurately represent what a human would see.

Key constraints at this point:
- **Context window is finite.** A 128K-token model sounds spacious, but a single noisy webpage can consume 3-5% of it
- **No visual information.** Images, charts, and layouts are invisible unless alt text is provided
- **No interaction.** The agent can't click buttons, fill forms, or scroll

## Step 5: The Agent Reasons

From the extracted text, the agent tries to answer the user's question. It identifies product names, prices, descriptions, and any structured information it can find.

If the extraction was clean, the agent gives a great answer. If the extraction missed the price (because it was rendered by JavaScript) or included cookie banner text as if it were product information, the answer is wrong or incomplete.

## The Limitations Are Structural

This isn't a problem with any particular AI model. It's a structural problem with how the web serves content:

**No JavaScript execution.** If your content is rendered client-side (React, Vue, Angular SPAs), the AI agent sees an empty `<div id="root"></div>` and nothing else. Your entire site is invisible.

**No state or sessions.** Each request is independent. The agent can't log in, maintain a shopping cart, or access gated content.

**No purposeful navigation.** The agent doesn't know which of your 47 navigation links leads to relevant content and which leads to your privacy policy. Every link is equally opaque.

**Truncation is lossy.** When a page is too long, the tool cuts content — and it might cut the most important part.

## What This Means for Your Business

If your website depends on AI traffic — and increasingly, it does — the current model is deeply inefficient:

| What happens | Impact |
|---|---|
| Agent downloads 181 KB of HTML | Wastes tokens on noise |
| Content extraction guesses wrong | Inaccurate information about your products |
| JavaScript-rendered content | Completely invisible to agents |
| No structured actions | Agent can't find your "Buy" or "Subscribe" buttons |
| No semantic links | Agent crawls blindly instead of navigating purposefully |

The web serves **one format for two completely different audiences.** Browsers need HTML, CSS, and JavaScript. AI agents need structured text, metadata, and declared actions.

## A Better Approach

What if your server could detect that the visitor is an AI agent and respond with exactly what it needs?

That's the core idea behind content negotiation for AI — and it's what the [MAKO protocol](https://makospec.vercel.app/en/docs) enables. Instead of 4,125 tokens of noisy HTML, the agent receives ~276 tokens of structured, metadata-rich markdown. Same URL, same server, different response.

**Want to see how AI agents experience your site today?** [Check your MAKO Score](https://makospec.vercel.app/en/score) — a free audit across Discoverability, Readability, Trustworthiness, and Actionability.
