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
