'use client';

import { useState } from 'react';
import type { ScoreCategory } from '@/lib/scorer/types';

const CATEGORY_COLORS: Record<string, { bar: string; bg: string }> = {
  discoverable: { bar: 'bg-emerald-500', bg: 'bg-emerald-500/20' },
  readable: { bar: 'bg-sky-500', bg: 'bg-sky-500/20' },
  trustworthy: { bar: 'bg-violet-500', bg: 'bg-violet-500/20' },
  actionable: { bar: 'bg-amber-500', bg: 'bg-amber-500/20' },
};

const CATEGORY_INFO: Record<string, { what: string; why: string }> = {
  discoverable: {
    what: 'Checks whether AI agents can find your optimized content: MAKO support, llms.txt, content negotiation, and discovery signals.',
    why: 'If agents can\'t discover your content, nothing else matters. This category ensures your site is visible to the AI web.',
  },
  readable: {
    what: 'Measures how cleanly AI agents can extract and understand your content: signal-to-noise ratio, semantic HTML, headings, and JavaScript dependency.',
    why: 'Most web pages are 90%+ boilerplate. Agents need clean, structured content to generate accurate responses about your business.',
  },
  trustworthy: {
    what: 'Evaluates metadata quality and freshness: JSON-LD, Open Graph, canonical URLs, robots.txt, and MAKO-specific trust signals like summaries and ETags.',
    why: 'Trust signals help agents verify content accuracy, understand context, and decide whether to cite your page in responses.',
  },
  actionable: {
    what: 'Checks whether agents can interact with your content: structured actions, semantic links, MAKO headers completeness, and content extraction quality.',
    why: 'The future of the agent web is transactional. If agents can\'t find your buy, subscribe, or contact actions, you miss conversions.',
  },
};

const CHECK_INFO: Record<string, string> = {
  // Discoverable
  serves_mako: 'MAKO lets agents get your content in ~7% of the tokens of raw HTML — the biggest single improvement.',
  mako_content_negotiation: 'The correct Content-Type header ensures agents parse your response as MAKO, not generic text.',
  mako_link_tag: 'A <link rel="alternate"> tag lets agents discover MAKO support without making an extra HEAD request.',
  has_llms_txt: 'llms.txt tells AI agents what your site offers and how to access it — like robots.txt for LLMs.',
  has_mcp_endpoint: 'Model Context Protocol (MCP) lets agents interact with your service as a structured API.',
  // Readable
  content_signal_ratio: 'Measures how much of your page is actual content vs navigation, ads, and boilerplate markup.',
  no_js_dependency: 'LLMs and crawlers cannot execute JavaScript. If content requires JS, it\'s invisible to AI agents.',
  first_meaningful_content: 'Agents scan the first few hundred characters. If they find only nav/header, they may skip your page.',
  meaningful_headings: 'Descriptive headings let agents do "smart skimming" — understanding structure without reading everything.',
  semantic_html: 'Tags like <main>, <article>, <section> tell agents where the real content lives.',
  has_h1: 'The H1 is the primary signal agents use to understand what a page is about.',
  image_alt_text: 'Without alt text, images are invisible to agents. With it, they understand your visual content.',
  link_quality: 'Links with descriptive text let agents navigate purposefully, not blindly crawl "click here" links.',
  // Trustworthy
  has_json_ld: 'Schema.org in JSON-LD lets agents understand content type (product, article, event) without guessing.',
  has_og_tags: 'Open Graph tags are used by social platforms AND AI agents to preview and classify content.',
  has_meta_description: 'The meta description is the quick summary agents use when they don\'t read the full page.',
  has_canonical: 'Canonical URLs prevent agents from indexing duplicate versions of your content.',
  has_lang: 'The lang attribute tells agents what language your content is in, improving comprehension.',
  has_robots_txt: 'A permissive robots.txt signals that crawlers and AI agents are welcome on your site.',
  has_sitemap: 'Sitemaps help agents discover all your pages without crawling link by link.',
  mako_summary_quality: 'A well-crafted summary (10-30 words, ≤160 chars) is what agents use to describe your business.',
  mako_freshness: 'The X-Mako-Updated header tells agents how recent your content is — stale data loses trust.',
  mako_etag: 'ETags enable efficient caching — agents check if content changed without re-downloading everything.',
  mako_tokens_declared: 'Declared token count lets agents plan their context window budget before downloading.',
  mako_body_quality: 'Enough body content (≥200 chars) ensures agents have substance to work with.',
  // Actionable
  structured_actions: 'Machine-readable actions (buy, subscribe, contact) let agents guide users to conversions.',
  semantic_links: 'MAKO links with context let agents navigate your site with purpose and understanding.',
  action_completeness: 'Complete actions (name + description + url) give agents everything they need to act.',
  mako_headers_complete: 'All 7 MAKO headers provide agents with a complete metadata picture at the HTTP level.',
  clean_extraction: 'At least 200 characters of extractable content ensures agents have enough to generate useful responses.',
};

interface CategoryBreakdownProps {
  categories: ScoreCategory[];
}

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState<number | null>(null);
  const [showCheckInfo, setShowCheckInfo] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {categories.map((cat, i) => {
        const colors = CATEGORY_COLORS[cat.key] || { bar: 'bg-slate-500', bg: 'bg-slate-500/20' };
        const pct = cat.maxPoints > 0 ? (cat.earned / cat.maxPoints) * 100 : 0;
        const isOpen = expanded === i;
        const info = CATEGORY_INFO[cat.key];
        const isInfoOpen = showInfo === i;

        return (
          <div key={cat.key}>
            {/* Category header */}
            <div className="flex items-center gap-2 mb-1.5">
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="flex-1 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-slate-600 italic hidden sm:inline">
                      {cat.question}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-slate-400">
                      {cat.earned}/{cat.maxPoints}
                    </span>
                    <svg
                      className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              {/* Info button */}
              {info && (
                <button
                  onClick={() => setShowInfo(isInfoOpen ? null : i)}
                  className={`shrink-0 flex items-center justify-center h-5 w-5 rounded-full border text-[10px] font-bold transition ${
                    isInfoOpen
                      ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                      : 'border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500'
                  }`}
                  aria-label="Info"
                >
                  i
                </button>
              )}
            </div>

            {/* Category info tooltip */}
            {isInfoOpen && info && (
              <div className="mb-3 rounded-lg border border-slate-700/50 bg-slate-800/50 p-3 text-xs space-y-1.5">
                <p className="text-slate-300"><span className="text-emerald-400 font-medium">What it measures:</span> {info.what}</p>
                <p className="text-slate-300"><span className="text-amber-400 font-medium">Why it matters:</span> {info.why}</p>
              </div>
            )}

            <button
              onClick={() => setExpanded(isOpen ? null : i)}
              className="w-full"
            >
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full bar-animate ${colors.bar}`}
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
              </div>
            </button>

            {/* Expanded checks */}
            {isOpen && (
              <div className="mt-3 ml-1 space-y-2 border-l-2 border-slate-800 pl-4">
                {cat.checks.map((check) => {
                  const checkInfo = CHECK_INFO[check.id];
                  const isCheckInfoOpen = showCheckInfo === check.id;

                  return (
                    <div key={check.id} className="flex items-start gap-2">
                      <span className={`mt-0.5 shrink-0 ${check.passed ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {check.passed ? (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm ${check.passed ? 'text-slate-300' : 'text-slate-500'}`}>
                              {check.name}
                            </span>
                            {checkInfo && (
                              <button
                                onClick={() => setShowCheckInfo(isCheckInfoOpen ? null : check.id)}
                                className={`shrink-0 flex items-center justify-center h-4 w-4 rounded-full border text-[9px] font-bold transition ${
                                  isCheckInfoOpen
                                    ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                                    : 'border-slate-700 text-slate-600 hover:text-slate-400 hover:border-slate-500'
                                }`}
                                aria-label="Info"
                              >
                                i
                              </button>
                            )}
                          </div>
                          <span className="font-mono text-xs text-slate-500">
                            {check.earned}/{check.maxPoints}
                          </span>
                        </div>
                        {check.details && (
                          <p className="text-xs text-slate-600 mt-0.5">{check.details}</p>
                        )}
                        {isCheckInfoOpen && checkInfo && (
                          <p className="text-xs text-slate-400 mt-1 pl-0.5 border-l-2 border-emerald-500/30 ml-0.5 pl-2">
                            {checkInfo}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
