'use client';

import { Fragment } from 'react';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/page-header';
import { CodeBlock } from '@/components/code-block';
import { FadeIn } from '@/components/fade-in';

const CODE_WITHOUT: Record<string, { filename: string; code: string }> = {
  discovery: {
    filename: 'No discovery mechanism',
    code: `# How does an agent know if a site has
# AI-optimized content?

GET / HTTP/1.1
Accept: text/html

HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 187429

# No signal for AI-optimized content
# No capability declaration
# Agent must download and parse HTML
# to understand anything about the site`,
  },
  prefilter: {
    filename: 'HEAD returns no semantic info',
    code: `HEAD /products/running-shoes HTTP/1.1
Host: example.com
Accept: text/html

HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 187429
Last-Modified: Mon, 10 Feb 2026 09:00:00 GMT

# Agent knows: it's HTML, 187 KB
# Agent does NOT know:
#   - What type of content (product? blog?)
#   - How many tokens to process
#   - What language
#   - What entity this page is about
# Must download full page to decide relevance`,
  },
  content: {
    filename: 'Raw HTML content',
    code: `<div class="product-page">
  <nav><!-- 800 tokens --></nav>
  <div class="sidebar"><!-- 600 tokens --></div>
  <div class="main-content">
    <h1>Running Shoes Pro</h1>
    <span class="price">$129.99</span>
    <p>Lightweight performance shoe...</p>
  </div>
  <div class="recommendations"><!-- 900 tokens --></div>
  <footer><!-- 500 tokens --></footer>
  <!-- 1,325 tokens of actual content
       buried in 4,125 tokens total -->
</div>`,
  },
  navigation: {
    filename: 'HTML link crawling',
    code: `# Agent finds 127 links on the page:
<a href="/">Home</a>
<a href="/about">About</a>
<a href="/cart">Cart (3)</a>
<a href="/products/running-shoes?color=red">Red</a>
<a href="/products/running-shoes?color=blue">Blue</a>
<a href="/privacy">Privacy Policy</a>
<a href="/terms">Terms of Service</a>
<!-- ...120 more links -->

# No context on which links matter
# Agent must guess or crawl them all`,
  },
  action: {
    filename: 'Hidden form actions',
    code: `<!-- Actions buried in JavaScript -->
<form id="add-to-cart"
      action="/api/cart"
      method="POST">
  <input type="hidden" name="id" value="SKU-1234">
  <input type="hidden" name="csrf" value="...">
  <button onclick="addToCart(event)">
    Add to Cart
  </button>
</form>

<!-- Agent cannot discover or invoke this
     without executing JavaScript -->`,
  },
  cache: {
    filename: 'No conditional requests',
    code: `# Every visit downloads the full page

GET /products/running-shoes HTTP/1.1
Accept: text/html

HTTP/1.1 200 OK
Content-Length: 187429

# Same content, downloaded again
# 187 KB transferred
# 4,125 tokens re-processed
# No way to check "has it changed?"`,
  },
};

const CODE_WITH: Record<string, { filename: string; code: string }> = {
  discovery: {
    filename: '3 discovery mechanisms',
    code: `# 1. Site-level: /.well-known/mako
GET /.well-known/mako HTTP/1.1

{ "mako": "1.0" }

# 2. Page-level: HTML <link> element
<link rel="alternate" type="text/mako+markdown">

# 3. Embedded: HTML <script> element
<script type="text/mako+markdown" id="mako">`,
  },
  prefilter: {
    filename: 'HEAD with MAKO headers',
    code: `HEAD /products/running-shoes HTTP/1.1
Host: example.com
Accept: text/mako+markdown

HTTP/1.1 200 OK

# MUST — required for valid MAKO response
Content-Type: text/mako+markdown
X-Mako-Version: 1.0
X-Mako-Type: product
X-Mako-Tokens: 245
X-Mako-Lang: en
Vary: Accept

# SHOULD — standard HTTP caching & context
ETag: "mako-a1b2c3"
Cache-Control: public, max-age=3600
Last-Modified: Sat, 15 Feb 2026 10:00:00 GMT
Content-Location: /products/running-shoes

# MAY — advanced agent capabilities
X-Mako-Actions: add_to_cart, check_availability

# 0 bytes transferred
# Agent knows: product, 245 tokens, en`,
  },
  content: {
    filename: 'MAKO response (245 tokens)',
    code: `GET /products/running-shoes HTTP/1.1
Accept: text/mako+markdown

HTTP/1.1 200 OK
Content-Type: text/mako+markdown

---
mako: "1.0"
type: product
entity: Running Shoes Pro
tokens: 245
language: en
updated: 2026-02-15T10:00:00Z
summary: >-
  Lightweight running shoe with responsive
  cushioning. $129.99 at Example Store.
---

# Running Shoes Pro

Lightweight performance running shoe with
responsive ZoomX cushioning and breathable
mesh upper.

**Price:** $129.99
**Sizes:** 7-13
**Colors:** Black, White, Red

# Also available via HTML <script> embedding
# without content negotiation`,
  },
  navigation: {
    filename: 'Semantic links in frontmatter',
    code: `# Links section in MAKO frontmatter:
links:
  internal:
    - url: /products/running-socks
      context: Matching performance socks
    - url: /products/insoles-pro
      context: Compatible custom insoles
    - url: /guides/choosing-running-shoes
      context: Buying guide for runners
  external:
    - url: https://example.com/reviews
      context: Independent review (4.8/5)

# 5 links with purpose vs 127 blind links`,
  },
  action: {
    filename: 'Declared actions in frontmatter',
    code: `# Actions section in MAKO frontmatter:
actions:
  - name: add_to_cart
    description: Add to shopping cart
    endpoint: /api/cart
    method: POST
    params:
      sku: "SHOE-PRO-001"
      quantity: 1
  - name: check_availability
    description: Check stock by zip code
    endpoint: /api/stock?sku=SHOE-PRO-001
  - name: notify_restock
    description: Get notified when back in stock
    endpoint: /api/notify

# Machine-readable, no JS required`,
  },
  cache: {
    filename: 'Conditional GET → 304',
    code: `GET /products/running-shoes HTTP/1.1
Accept: text/mako+markdown
If-None-Match: "a1b2c3"

HTTP/1.1 304 Not Modified
ETag: "a1b2c3"
Cache-Control: public, max-age=3600

# 0 bytes transferred
# 0 tokens processed
# Agent confirms: content unchanged
# Saved: 245 tokens + full round-trip`,
  },
};

const LAYERS = [
  'discovery',
  'prefilter',
  'content',
  'navigation',
  'action',
  'cache',
] as const;

export function HowItWorksPage() {
  const t = useTranslations('how_it_works_page');

  return (
    <div className="min-h-screen bg-[#050a0e]">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ label: t('title') }]}
      />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Layer navigation */}
        <nav className="mb-12 rounded-xl border border-slate-800 bg-slate-900/30 p-4 sm:p-6">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:justify-center">
            {LAYERS.map((layer, i) => (
              <Fragment key={layer}>
                <a
                  href={`#${layer}`}
                  className="group flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2 transition hover:bg-emerald-500/10 sm:px-3"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-xs font-bold text-emerald-400 transition group-hover:bg-emerald-500/20">
                    {i + 1}
                  </span>
                  <span className="text-xs font-medium text-slate-300 transition group-hover:text-white sm:text-sm">
                    {t(`layer_${layer}.title`)}
                  </span>
                </a>
                {i < LAYERS.length - 1 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-3.5 w-3.5 shrink-0 text-slate-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </Fragment>
            ))}
          </div>
        </nav>

        {LAYERS.map((layer, i) => (
          <FadeIn key={layer}>
            <section id={layer} className="mb-16 scroll-mt-24 sm:mb-20">
              {/* Layer header */}
              <div className="mb-5 sm:mb-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-sm font-bold text-emerald-400 sm:h-9 sm:w-9">
                    {i + 1}
                  </span>
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    {t(`layer_${layer}.title`)}
                  </h2>
                </div>
                <p className="text-sm italic text-emerald-400/80">
                  {t(`layer_${layer}.question`)}
                </p>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed sm:text-base">
                  {t(`layer_${layer}.description`)}
                </p>
              </div>

              {/* Comparison grid */}
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Without MAKO */}
                <div className="min-w-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
                    <span className="text-xs font-medium uppercase tracking-wider text-red-400">
                      {t('without_mako')}
                    </span>
                  </div>
                  <CodeBlock
                    code={CODE_WITHOUT[layer].code}
                    filename={CODE_WITHOUT[layer].filename}
                  />
                </div>

                {/* With MAKO */}
                <div className="min-w-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                      {t('with_mako')}
                    </span>
                  </div>
                  <CodeBlock
                    code={CODE_WITH[layer].code}
                    filename={CODE_WITH[layer].filename}
                  />
                </div>
              </div>
            </section>
          </FadeIn>
        ))}

        {/* RFC 2119 Annex */}
        <FadeIn>
          <section className="mt-4 rounded-xl border border-slate-800 bg-slate-900/30 p-4 sm:mt-8 sm:p-8">
            <h2 className="text-2xl font-bold text-white">{t('annex_title')}</h2>
            <p className="mt-2 text-slate-400">{t('annex_subtitle')}</p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="pb-3 pr-6 font-medium text-slate-300">
                      {t('annex_classification')}
                    </th>
                    <th className="pb-3 pr-6 font-medium text-slate-300">
                      {t('annex_rfc_keyword')}
                    </th>
                    <th className="pb-3 font-medium text-slate-300">
                      {t('annex_headers')}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-slate-400">
                  <tr className="border-b border-slate-800">
                    <td className="py-3 pr-6 font-medium text-emerald-400">
                      {t('annex_required')}
                    </td>
                    <td className="py-3 pr-6">
                      <code className="text-xs text-slate-300">MUST</code>
                    </td>
                    <td className="py-3">
                      <code className="text-xs text-slate-300">
                        Content-Type, X-Mako-Version, X-Mako-Tokens, X-Mako-Type, X-Mako-Lang, Vary
                      </code>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 pr-6 font-medium text-yellow-400">
                      {t('annex_recommended')}
                    </td>
                    <td className="py-3 pr-6">
                      <code className="text-xs text-slate-300">SHOULD</code>
                    </td>
                    <td className="py-3">
                      <code className="text-xs text-slate-300">
                        ETag, Cache-Control, Last-Modified, Content-Location
                      </code>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-6 font-medium text-slate-500">
                      {t('annex_optional')}
                    </td>
                    <td className="py-3 pr-6">
                      <code className="text-xs text-slate-300">MAY</code>
                    </td>
                    <td className="py-3">
                      <code className="text-xs text-slate-300">
                        X-Mako-Actions, X-Mako-Embedding, X-Mako-Embedding-Model, X-Mako-Embedding-Dim
                      </code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
