import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

const BASE = siteConfig.baseUrl;

interface MakoPage {
  type: string;
  entity: string;
  summary: string;
  freshness: string;
  actions?: string;
  links: string;
  related: string[];
  body: string;
}

const MAKO_PAGES: Record<string, MakoPage> = {
  "/": {
    type: "landing",
    entity: "MAKO Protocol",
    summary: "Open protocol for serving LLM-optimized web content via content negotiation. 93% fewer tokens.",
    freshness: "weekly",
    actions: `actions:
  - name: analyze_url
    description: "Generate MAKO-optimized content for any URL"
    endpoint: ${BASE}/api/analyze
    method: POST
    params:
      - name: url
        type: string
        required: true
        description: "The URL to analyze"
  - name: check_score
    description: "Audit a website's AI-readiness score (0-100)"
    endpoint: ${BASE}/api/score
    method: POST
    params:
      - name: url
        type: string
        required: true
        description: "The URL to score"`,
    links: `links:
  internal:
    - url: /how-it-works
      context: "Deep dive into the 6-layer architecture"
      type: child
    - url: /analyzer
      context: "Try the analyzer — generate MAKO for any URL"
      type: child
    - url: /score
      context: "Audit any website's AI-readiness"
      type: child
    - url: /directory
      context: "Browse public MAKO analyses"
      type: child
  external:
    - url: ${siteConfig.github}
      context: "Protocol specification source"
      type: source
    - url: ${siteConfig.npm}
      context: "TypeScript SDK (@mako-spec/js)"
      type: reference
    - url: ${siteConfig.githubWp}
      context: "WordPress plugin (mako-wp)"
      type: reference`,
    related: ["/how-it-works", "/analyzer", "/score"],
    body: `# MAKO — Markdown Agent Knowledge Optimization

Open protocol that transforms web pages into optimized Markdown for AI agents.

## What is MAKO?

MAKO defines a content negotiation protocol: when an AI agent sends \`Accept: text/mako+markdown\`, the server responds with a structured, token-efficient Markdown document instead of raw HTML. ~93% fewer tokens while preserving semantic meaning.

## 6-Layer Architecture

1. **Discovery** — Agent finds MAKO support via \`.well-known/mako\`, \`<link>\` tags, or embedded \`<script>\` elements
2. **Pre-filter** — HEAD request returns typed headers (content type, tokens, language) — zero bytes transferred
3. **Content** — GET returns YAML frontmatter + clean Markdown body (~245 tokens vs ~4,125)
4. **Navigation** — Semantic links with context replace blind crawling (5 purposeful links vs 127)
5. **Actions** — Machine-readable actions declared in frontmatter (no JS execution needed)
6. **Cache** — Conditional requests via ETag/If-None-Match — 304 Not Modified, zero re-processing

## Key Features

- **Content negotiation** — standard HTTP, no new endpoints needed
- **YAML frontmatter** — structured metadata (type, entity, links, actions)
- **10 content types** — product, article, docs, landing, listing, profile, event, recipe, faq, custom
- **HTTP headers** — X-Mako-Version, X-Mako-Type, X-Mako-Tokens, X-Mako-Lang
- **Complementary** — works alongside llms.txt, Schema.org, and MCP

## Get Started

- Spec: ${BASE}
- SDK: \`npm install @mako-spec/js\`
- CLI: \`npm install -g @mako-spec/cli\`
- WordPress: ${siteConfig.githubWp}`,
  },
  "/how-it-works": {
    type: "docs",
    entity: "How MAKO Works",
    summary: "Deep dive into the 6-layer MAKO architecture: Discovery, Pre-filter, Content, Navigation, Actions, Cache.",
    freshness: "weekly",
    links: `links:
  internal:
    - url: /
      context: "MAKO Protocol overview and key features"
      type: parent
    - url: /analyzer
      context: "Try the analyzer — see MAKO output for any URL"
      type: sibling
    - url: /score
      context: "Audit any site's AI-readiness"
      type: sibling
  external:
    - url: ${siteConfig.github}
      context: "Full protocol specification (spec.md)"
      type: source`,
    related: ["/", "/analyzer", "/score"],
    body: `# How MAKO Works

MAKO defines a 6-layer architecture built entirely on standard HTTP.

## Layer 1: Discovery

Three mechanisms for agents to find MAKO support:
- **Site-level:** \`/.well-known/mako\` returns \`{ "mako": "1.0" }\`
- **Page-level:** \`<link rel="alternate" type="text/mako+markdown">\` in HTML
- **Embedded:** \`<script type="text/mako+markdown">\` with inline MAKO content

## Layer 2: Pre-filter

A HEAD request with \`Accept: text/mako+markdown\` returns typed headers:
- **MUST:** Content-Type, X-Mako-Version, X-Mako-Type, X-Mako-Tokens, X-Mako-Lang, Vary
- **SHOULD:** ETag, Cache-Control, Last-Modified, Content-Location
- **MAY:** X-Mako-Actions, X-Mako-Embedding

Zero bytes transferred. Agent decides relevance from headers alone.

## Layer 3: Content

GET request returns YAML frontmatter + clean Markdown body. Example: 245 tokens instead of 4,125 — a 94% reduction.

## Layer 4: Navigation

Semantic links with context in frontmatter. 5 purposeful links vs 127 blind HTML links. Each link includes a description of why it's relevant.

## Layer 5: Actions

Machine-readable actions declared in frontmatter: name, description, endpoint, method, params. Agents invoke directly without parsing HTML forms or executing JavaScript.

## Layer 6: Cache

Standard HTTP caching: ETag + If-None-Match. Conditional GET returns 304 Not Modified — zero bytes, zero tokens re-processed.`,
  },
  "/analyzer": {
    type: "docs",
    entity: "MAKO Analyzer",
    summary: "Free tool to analyze any URL and generate MAKO-optimized content with token savings.",
    freshness: "weekly",
    actions: `actions:
  - name: analyze_url
    description: "Generate MAKO-optimized content for any URL"
    endpoint: ${BASE}/api/analyze
    method: POST
    params:
      - name: url
        type: string
        required: true
        description: "The URL to analyze"`,
    links: `links:
  internal:
    - url: /directory
      context: "Browse all public analyses"
      type: child
    - url: /score
      context: "Audit AI-readiness instead of generating content"
      type: sibling
    - url: /
      context: "MAKO Protocol overview"
      type: parent
  external:
    - url: ${siteConfig.github}
      context: "Protocol specification"
      type: source`,
    related: ["/score", "/directory"],
    body: `# MAKO Analyzer

Free tool that analyzes any URL and generates MAKO-optimized content.

## What It Does

1. Fetches the target URL (with Jina Reader fallback for JS-rendered pages)
2. Extracts clean content from HTML (strips nav, footer, ads, scripts)
3. Detects content type (product, article, docs, landing, etc.)
4. Extracts entity name, semantic links, and actions
5. Generates complete MAKO file with frontmatter + optimized Markdown
6. Calculates token savings vs raw HTML

## Output

- Original HTML token count
- Generated MAKO token count
- Savings percentage (typically 85-95%)
- Complete MAKO file with frontmatter and headers
- Detected content type and entity

## Public Directory

All public analyses are listed in the directory for browsing and comparison.`,
  },
  "/score": {
    type: "docs",
    entity: "MAKO Score",
    summary: "AI-readiness audit for any website. Scores 0-100 across Discoverable, Readable, Trustworthy, Actionable.",
    freshness: "weekly",
    actions: `actions:
  - name: check_score
    description: "Audit a website's AI-readiness score (0-100)"
    endpoint: ${BASE}/api/score
    method: POST
    params:
      - name: url
        type: string
        required: true
        description: "The URL to score"`,
    links: `links:
  internal:
    - url: /analyzer
      context: "Generate MAKO content instead of auditing"
      type: sibling
    - url: /directory
      context: "Browse analyzed sites"
      type: sibling
    - url: /
      context: "MAKO Protocol overview"
      type: parent
  external:
    - url: ${siteConfig.github}
      context: "Protocol specification"
      type: source`,
    related: ["/analyzer", "/directory"],
    body: `# MAKO Score

AI-readiness audit that scores any website from 0 to 100 using the DTRA framework.

## Categories (30 checks)

- **Discoverable (15 pts)** — Can AI agents find your optimized content? Checks: serves MAKO, content negotiation, link tag, llms.txt, MCP endpoint.
- **Readable (30 pts)** — Can AI agents understand your content cleanly? Checks: content signal ratio, no JS dependency, headings, semantic HTML, alt text, link quality.
- **Trustworthy (30 pts)** — Can AI agents trust your metadata? Checks: JSON-LD, Open Graph, meta description, canonical, language, robots, sitemap, freshness, ETag, token accuracy.
- **Actionable (25 pts)** — Can AI agents take actions? Checks: structured actions, semantic links, action completeness, headers, clean extraction.

## Grades

- **A+** (95-100): Agent-first excellence
- **A** (80-94): Agent-ready
- **B** (60-79): Optimized for AI
- **C** (40-59): Accessible but inefficient
- **D** (20-39): Readable with effort
- **F** (0-19): Invisible to AI agents

## Ceiling Without MAKO

Sites without MAKO support can reach ~60-62/100 (Grade B) maximum. Full MAKO implementation unlocks the remaining 40 points.`,
  },
  "/docs": {
    type: "docs",
    entity: "MAKO Documentation",
    summary: "Full documentation: protocol specification, CEF encoding format, HTTP headers reference, and real-world examples.",
    freshness: "weekly",
    links: `links:
  internal:
    - url: /docs/spec
      context: "Full MAKO protocol specification"
      type: child
    - url: /docs/cef
      context: "Compact Embedding Format specification"
      type: child
    - url: /docs/headers
      context: "HTTP headers reference"
      type: child
    - url: /docs/examples
      context: "Real-world MAKO file examples"
      type: child
    - url: /
      context: "MAKO Protocol overview"
      type: parent
  external:
    - url: ${siteConfig.github}
      context: "Specification source on GitHub"
      type: source`,
    related: ["/docs/spec", "/docs/cef", "/docs/headers", "/docs/examples"],
    body: `# MAKO Documentation

Everything you need to implement the MAKO protocol.

## Specification

The full protocol: file format, 10 content types, YAML frontmatter schema, HTTP content negotiation, conformance levels, and versioning.

## CEF — Compact Embedding Format

Standard for compressing 512-dimension embedding vectors to ~470 bytes for HTTP header transport. Enables semantic pre-filtering without downloading content.

## HTTP Headers Reference

Complete reference for MAKO request and response headers. Required (MUST), Recommended (SHOULD), and Optional (MAY) headers with examples.

## Examples

Real-world MAKO files: product page (Nike Air Max 90), article, and documentation.`,
  },
  "/docs/spec": {
    type: "docs",
    entity: "MAKO Specification v0.1.0",
    summary: "Full MAKO protocol specification: file format, content types, frontmatter, content negotiation, conformance levels.",
    freshness: "monthly",
    links: `links:
  internal:
    - url: /docs
      context: "Documentation index"
      type: parent
    - url: /docs/cef
      context: "CEF encoding format"
      type: sibling
    - url: /docs/headers
      context: "HTTP headers reference"
      type: sibling
  external:
    - url: ${siteConfig.github}
      context: "Specification source (spec.md)"
      type: source`,
    related: ["/docs/cef", "/docs/headers", "/docs/examples"],
    body: `# MAKO Specification v0.1.0

Open standard that defines how web pages serve semantically optimized content to AI agents via HTTP content negotiation.

## Key Concepts

- **MAKO file:** YAML frontmatter + Markdown body, served as \`text/mako+markdown\`
- **Content negotiation:** \`Accept: text/mako+markdown\` triggers MAKO response
- **10 content types:** product, article, docs, landing, listing, profile, event, recipe, faq, custom
- **6 required frontmatter fields:** mako, type, entity, updated, tokens, language
- **3 conformance levels:** L1 (valid file), L2 (+ content negotiation), L3 (+ CEF embeddings)

## Discovery

Three complementary mechanisms: \`.well-known/mako\`, \`<link rel="alternate">\`, and \`<script type="text/mako+markdown">\`.

## Token Efficiency

~94% reduction vs raw HTML. A product page: 245 tokens vs 4,125.

## Read the Full Spec

The complete specification covers file format, actions, semantic links, content negotiation, HTTP headers, CEF embeddings, conformance, and security considerations.`,
  },
  "/docs/cef": {
    type: "docs",
    entity: "CEF — Compact Embedding Format",
    summary: "Standard for compressing 512-dim embeddings to ~470 bytes for HTTP header transport.",
    freshness: "monthly",
    links: `links:
  internal:
    - url: /docs
      context: "Documentation index"
      type: parent
    - url: /docs/spec
      context: "Full MAKO specification"
      type: sibling
    - url: /docs/headers
      context: "HTTP headers reference (X-Mako-Embedding)"
      type: sibling
  external:
    - url: ${siteConfig.github}
      context: "CEF specification source (cef.md)"
      type: source`,
    related: ["/docs/spec", "/docs/headers"],
    body: `# CEF — Compact Embedding Format v0.1.0

Standard method for compressing semantic embedding vectors for HTTP header transport.

## Encoding Pipeline

1. **Quantize** — float32 to int8 (2,048 → 520 bytes)
2. **Compress** — gzip (520 → ~350 bytes)
3. **Encode** — base64url (~350 → ~470 chars)

Result: a 512-dimension embedding fits in a single HTTP header.

## Headers

- \`X-Mako-Embedding\`: CEF-encoded string
- \`X-Mako-Embedding-Model\`: model identifier (required)
- \`X-Mako-Embedding-Dim\`: dimensions (required)

## Similarity Thresholds

- >0.85: Highly relevant — download immediately
- 0.70-0.85: Potentially relevant — download if within budget
- 0.50-0.70: Marginal — skip unless no better results
- <0.50: Not relevant — skip entirely`,
  },
  "/docs/headers": {
    type: "docs",
    entity: "MAKO HTTP Headers Reference",
    summary: "Complete reference for MAKO request and response HTTP headers: required, recommended, and optional.",
    freshness: "monthly",
    links: `links:
  internal:
    - url: /docs
      context: "Documentation index"
      type: parent
    - url: /docs/spec
      context: "Full MAKO specification"
      type: sibling
    - url: /docs/cef
      context: "CEF embedding headers"
      type: sibling
  external:
    - url: ${siteConfig.github}
      context: "Headers reference source (headers.md)"
      type: source`,
    related: ["/docs/spec", "/docs/cef"],
    body: `# MAKO HTTP Headers Reference

## Request

- \`Accept: text/mako+markdown\` — triggers MAKO response

## Required Response Headers (MUST)

- \`Content-Type: text/mako+markdown; charset=utf-8\`
- \`X-Mako-Version: 1.0\`
- \`X-Mako-Tokens: 280\` — token count for budget decisions
- \`X-Mako-Type: product\` — content category filter
- \`X-Mako-Lang: en\` — language filter
- \`Vary: Accept\` — CDN correctness

## Recommended (SHOULD)

- \`ETag\` — conditional requests (304 Not Modified)
- \`Cache-Control\` — caching strategy based on freshness
- \`Last-Modified\` — content update timestamp
- \`Content-Location\` — canonical HTML URL

## Optional (MAY)

- \`X-Mako-Actions\` — comma-separated action names
- \`X-Mako-Embedding\` — CEF-encoded embedding (experimental)
- \`X-Mako-Embedding-Model\` — embedding model ID
- \`X-Mako-Embedding-Dim\` — embedding dimensions`,
  },
  "/docs/examples": {
    type: "docs",
    entity: "MAKO Examples",
    summary: "Real-world MAKO file examples: product, article, and documentation pages.",
    freshness: "monthly",
    links: `links:
  internal:
    - url: /docs
      context: "Documentation index"
      type: parent
    - url: /docs/spec
      context: "Full specification"
      type: sibling
  external:
    - url: ${siteConfig.github}
      context: "Example files on GitHub"
      type: source`,
    related: ["/docs/spec", "/docs/headers"],
    body: `# MAKO Examples

Real-world examples of MAKO files showing the protocol in action.

## Product Example (Nike Air Max 90)

Type: product. 245 tokens. Includes actions (add_to_cart, check_availability), semantic links (category, alternatives), media metadata, and structured body with key facts, context, and review summary.

## Article Example

Type: article. Demonstrates summary, key points, author/date metadata, and semantic links to related content.

## Documentation Example (Express.js Middleware)

Type: docs. Shows API documentation with code examples, parameter descriptions, and navigation links to related docs.`,
  },
  "/directory": {
    type: "listing",
    entity: "MAKO Analysis Directory",
    summary: "Public directory of websites analyzed with the MAKO Analyzer. Browse token savings across sites.",
    freshness: "daily",
    links: `links:
  internal:
    - url: /analyzer
      context: "Analyze a new URL"
      type: sibling
    - url: /score
      context: "Audit AI-readiness of a site"
      type: sibling
    - url: /
      context: "MAKO Protocol overview"
      type: parent`,
    related: ["/analyzer", "/score"],
    body: `# MAKO Analysis Directory

Public directory of websites analyzed with the MAKO Analyzer.

## What's Listed

Each entry shows:
- Website URL and domain
- Detected content type and entity
- HTML tokens vs MAKO tokens
- Token savings percentage
- Generated MAKO summary

## How to Add

Analyze any URL with the MAKO Analyzer and mark the result as public. It will appear in this directory automatically.`,
  },
};

function buildMakoResponse(path: string): NextResponse | null {
  // Normalize path: strip locale prefix and trailing slash
  const normalized = path.replace(/^\/(en|es|pt|fr|de|zh|ja)/, "").replace(/\/$/, "") || "/";
  const page = MAKO_PAGES[normalized];
  if (!page) return null;

  const now = new Date().toISOString().split("T")[0];
  const tokens = Math.ceil(page.body.length / 4);

  // Build frontmatter
  const parts: string[] = [
    `mako: "1.0"`,
    `type: ${page.type}`,
    `entity: "${page.entity}"`,
    `updated: ${now}`,
    `tokens: ${tokens}`,
    `language: en`,
    `canonical: "${BASE}${normalized === "/" ? "" : normalized}"`,
    `summary: "${page.summary}"`,
    `freshness: ${page.freshness}`,
  ];

  // Actions (only for pages with real API endpoints)
  if (page.actions) {
    parts.push(page.actions);
  }

  // Links (structured internal/external)
  parts.push(page.links);

  // Related pages
  if (page.related.length > 0) {
    parts.push(`related:\n${page.related.map((r) => `  - ${r}`).join("\n")}`);
  }

  const frontmatter = parts.join("\n");
  const makoContent = `---\n${frontmatter}\n---\n\n${page.body}\n`;

  // Collect action names for X-Mako-Actions header
  const actionNames = page.actions
    ? (page.actions.match(/- name: (\S+)/g) || []).map((m) => m.replace("- name: ", ""))
    : [];

  // Simple ETag from content hash
  const etag = `"mako-${Buffer.from(makoContent).length.toString(36)}"`;

  const headers: Record<string, string> = {
    // MUST
    "Content-Type": "text/mako+markdown; charset=utf-8",
    "X-Mako-Version": "1.0",
    "X-Mako-Type": page.type,
    "X-Mako-Tokens": String(tokens),
    "X-Mako-Lang": "en",
    "Vary": "Accept",
    // SHOULD
    "ETag": etag,
    "Cache-Control": "public, max-age=3600",
    "Last-Modified": new Date().toUTCString(),
    "Content-Location": `${BASE}${normalized === "/" ? "" : normalized}`,
  };

  // MAY
  if (actionNames.length > 0) {
    headers["X-Mako-Actions"] = actionNames.join(", ");
  }

  return new NextResponse(makoContent, { status: 200, headers });
}

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "/";
  const response = buildMakoResponse(path);
  if (!response) {
    return NextResponse.json({ error: "No MAKO content for this path" }, { status: 404 });
  }
  return response;
}
