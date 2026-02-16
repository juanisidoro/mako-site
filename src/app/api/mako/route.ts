import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

const MAKO_PAGES: Record<string, { type: string; entity: string; summary: string; body: string }> = {
  "/": {
    type: "landing",
    entity: "MAKO Protocol",
    summary: "Open protocol for serving LLM-optimized web content via content negotiation. 93% fewer tokens.",
    body: `# MAKO — Markdown Agent Knowledge Optimization

Open protocol that transforms web pages into optimized Markdown for AI agents.

## What is MAKO?

MAKO defines a content negotiation protocol: when an AI agent sends \`Accept: text/mako+markdown\`, your server responds with a structured, token-efficient Markdown version of the page instead of raw HTML. This reduces token consumption by ~93% while preserving semantic meaning.

## How it works

1. Agent sends \`Accept: text/mako+markdown\` header
2. Server detects the header and returns MAKO content
3. Response includes YAML frontmatter (type, entity, links, actions) + clean Markdown body
4. Agent gets structured, actionable data in ~280 tokens instead of ~4,500

## Key features

- **Content negotiation** — standard HTTP, no new endpoints needed
- **YAML frontmatter** — structured metadata (type, entity, links, actions)
- **10 content types** — product, article, docs, landing, listing, profile, event, recipe, faq, custom
- **~93% token savings** — less cost, faster responses
- **Works alongside** llms.txt, Schema.org, and MCP

## Get started

- Read the spec: ${siteConfig.baseUrl}/en/spec
- Install the SDK: npm install @mako-spec/js
- WordPress plugin: ${siteConfig.githubWp}
- Check your site: ${siteConfig.baseUrl}/en/score`,
  },
  "/analyzer": {
    type: "docs",
    entity: "MAKO Analyzer",
    summary: "Free tool to analyze any URL and generate MAKO-optimized content. See token savings instantly.",
    body: `# MAKO Analyzer

Free tool that analyzes any URL and generates MAKO-optimized content.

## What it does

1. Fetches the target URL
2. Extracts clean content from HTML (strips nav, footer, ads, scripts)
3. Detects content type (product, article, docs, etc.)
4. Generates MAKO file with frontmatter + optimized Markdown
5. Calculates token savings vs raw HTML

## Usage

Enter any URL at ${siteConfig.baseUrl}/en/analyzer to see:
- Original HTML token count
- Generated MAKO token count
- Savings percentage (typically 85-95%)
- The complete MAKO output with frontmatter

## Public directory

All public analyses are listed in the directory at ${siteConfig.baseUrl}/en/directory.`,
  },
  "/score": {
    type: "docs",
    entity: "MAKO Score",
    summary: "AI-readiness audit for any website. Scores 0-100 across Discoverable, Readable, Trustworthy, Actionable.",
    body: `# MAKO Score

AI-readiness audit that scores any website from 0 to 100.

## Categories

- **Discoverable (15 pts)** — Can AI agents find your optimized content?
- **Readable (30 pts)** — Can AI agents understand your content cleanly?
- **Trustworthy (30 pts)** — Can AI agents trust your metadata and freshness?
- **Actionable (25 pts)** — Can AI agents take actions on your site?

## Grades

- A+ (95-100): Agent-first
- A (80-94): Agent-ready
- B (60-79): Optimized for AI
- C (40-59): Accessible but inefficient
- D (20-39): Readable with effort
- F (0-19): Invisible to AI agents

## How to use

Enter any URL at ${siteConfig.baseUrl}/en/score to get:
- Overall score and grade
- Category breakdown with individual checks
- Actionable recommendations sorted by impact
- Site-wide MAKO adoption scan`,
  },
  "/directory": {
    type: "listing",
    entity: "MAKO Analysis Directory",
    summary: "Public directory of websites analyzed with the MAKO Analyzer. Browse token savings across sites.",
    body: `# MAKO Analysis Directory

Public directory of websites analyzed with the MAKO Analyzer.

## What's listed

Each entry shows:
- Website URL and domain
- Detected content type and entity
- HTML tokens vs MAKO tokens
- Token savings percentage

## Browse

View the full directory at ${siteConfig.baseUrl}/en/directory.`,
  },
};

function buildMakoResponse(path: string): NextResponse | null {
  // Normalize path: strip locale prefix if present
  const normalized = path.replace(/^\/(en|es|pt|fr|de|zh|ja)/, "") || "/";
  const page = MAKO_PAGES[normalized];
  if (!page) return null;

  const now = new Date().toISOString().split("T")[0];
  const tokens = Math.ceil(page.body.length / 4);

  const frontmatter = [
    `mako: "1.0"`,
    `type: ${page.type}`,
    `entity: "${page.entity}"`,
    `updated: "${now}"`,
    `tokens: ${tokens}`,
    `language: en`,
    `summary: "${page.summary}"`,
    `links:`,
    `  - url: ${siteConfig.baseUrl}`,
    `    context: MAKO Protocol homepage`,
    `  - url: ${siteConfig.github}`,
    `    context: GitHub repository`,
    `  - url: ${siteConfig.npm}`,
    `    context: npm package`,
    `actions:`,
    `  - name: Check MAKO Score`,
    `    description: Audit your website's AI-readiness`,
    `    url: ${siteConfig.baseUrl}/en/score`,
    `  - name: Try Analyzer`,
    `    description: Generate MAKO content for any URL`,
    `    url: ${siteConfig.baseUrl}/en/analyzer`,
  ].join("\n");

  const makoContent = `---\n${frontmatter}\n---\n\n${page.body}\n`;

  return new NextResponse(makoContent, {
    status: 200,
    headers: {
      "Content-Type": "text/mako+markdown; charset=utf-8",
      "X-Mako-Version": "1.0",
      "X-Mako-Type": page.type,
      "X-Mako-Entity": page.entity,
      "X-Mako-Tokens": String(tokens),
      "X-Mako-Lang": "en",
      "X-Mako-Updated": now,
      "X-Mako-Canonical": `${siteConfig.baseUrl}${normalized}`,
      "Cache-Control": "public, max-age=3600",
      "Vary": "Accept",
    },
  });
}

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "/";
  const response = buildMakoResponse(path);
  if (!response) {
    return NextResponse.json({ error: "No MAKO content for this path" }, { status: 404 });
  }
  return response;
}
