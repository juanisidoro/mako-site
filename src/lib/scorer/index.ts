import crypto from "crypto";
import { extractPageData } from "@/lib/analyzer/extract";
import { probeMako } from "./mako-probe";
import { evaluateDiscoverable } from "./categories/discoverable";
import { evaluateReadable } from "./categories/readable";
import { evaluateTrustworthy } from "./categories/trustworthy";
import { evaluateActionable } from "./categories/actionable";
import { probeSite } from "./site-probe";
import { getGrade, getGradeInfo, getConformanceLevel } from "./types";
import type { ScoreResult, ScoreCategory, ScoreRecommendation } from "./types";
import { saveScore } from "@/lib/db";

function generateShareHash(): string {
  return crypto.randomBytes(6).toString("base64url").slice(0, 8);
}

export type {
  ScoreResult,
  ScoreCategory,
  ScoreCheck,
  ScoreRecommendation,
  Grade,
  GradeInfo,
  ConformanceLevel,
  MakoProbeResult,
  MakoAction,
  MakoLink,
  PageData,
  SiteProbe,
  SiteProbeUrl,
} from "./types";

export async function scoreUrl(
  url: string,
  isPublic: boolean
): Promise<ScoreResult> {
  const page = await extractPageData(url);

  // Run MAKO probe once — shared across categories
  const makoProbe = await probeMako(page.finalUrl, page.$);

  // Evaluate sync categories
  const readable = evaluateReadable(page);
  const actionable = evaluateActionable(page, makoProbe);

  // Evaluate async categories + site probe in parallel
  const [discoverable, trustworthy, siteProbe] = await Promise.all([
    evaluateDiscoverable(page, makoProbe),
    evaluateTrustworthy(page, makoProbe),
    probeSite(page.$, page.finalUrl),
  ]);

  const categories: ScoreCategory[] = [
    discoverable,
    readable,
    trustworthy,
    actionable,
  ];

  const totalScore = categories.reduce((sum, c) => sum + c.earned, 0);
  const grade = getGrade(totalScore);
  const gradeInfo = getGradeInfo(totalScore);
  const conformanceLevel = getConformanceLevel(totalScore);

  const recommendations = generateRecommendations(categories);

  let domain: string;
  try {
    domain = new URL(page.finalUrl).hostname;
  } catch {
    domain = "unknown";
  }

  const result: ScoreResult = {
    url: page.finalUrl,
    domain,
    entity: page.entity,
    contentType: page.contentType,
    totalScore,
    grade,
    gradeInfo,
    conformanceLevel,
    categories,
    recommendations,
    siteProbe: siteProbe.totalChecked > 0 ? siteProbe : undefined,
    isPublic,
    createdAt: new Date().toISOString(),
  };

  // Save to DB
  const shareHash = generateShareHash();
  try {
    const saved = await saveScore({ ...result, shareHash });
    if (saved) {
      result.id = saved.id;
      result.shareHash = saved.shareHash;
    }
  } catch (error) {
    console.error("[scorer] Failed to save score to DB:", error);
  }

  return result;
}

// ── Recommendations ────────────────────────────────────────────────

const RECOMMENDATION_MAP: Record<
  string,
  { impact: number; message: string; businessMessage: string }
> = {
  // Discoverable
  serves_mako: {
    impact: 10,
    message:
      "Implement MAKO content negotiation with @mako-spec/js middleware or mako-wp plugin.",
    businessMessage:
      "Enable AI agents to read your content directly — this is the single biggest improvement you can make.",
  },
  mako_content_negotiation: {
    impact: 5,
    message:
      "Ensure your server returns Content-Type: text/mako+markdown for MAKO responses.",
    businessMessage:
      "Fix your MAKO setup so AI agents correctly identify your optimized content.",
  },
  mako_link_tag: {
    impact: 3,
    message:
      'Add <link rel="alternate" type="text/mako+markdown"> to your HTML <head>.',
    businessMessage:
      "Help AI agents discover that your site supports optimized content.",
  },
  has_llms_txt: {
    impact: 6,
    message:
      "Add an llms.txt file at your site root describing your site for AI agents.",
    businessMessage:
      "Tell AI assistants what your business does so they can recommend you accurately.",
  },
  has_mcp_endpoint: {
    impact: 2,
    message:
      "Add a /.well-known/mcp.json endpoint for Model Context Protocol integration.",
    businessMessage:
      "Enable advanced AI integrations with your site.",
  },

  // Readable
  content_signal_ratio: {
    impact: 7,
    message:
      "Reduce HTML bloat by removing unnecessary scripts, inline styles, and non-semantic markup.",
    businessMessage:
      "Clean up your page code so AI agents can focus on your actual content, not boilerplate.",
  },
  no_js_dependency: {
    impact: 7,
    message:
      "Serve content as static/SSR HTML. LLM agents and crawlers cannot execute JavaScript.",
    businessMessage:
      "Make your content available without JavaScript — most AI agents can't run scripts.",
  },
  first_meaningful_content: {
    impact: 4,
    message:
      "Ensure the H1 and main content appear within the first 300 characters of the document.",
    businessMessage:
      "Move your main content higher on the page so AI agents find it immediately.",
  },
  meaningful_headings: {
    impact: 4,
    message:
      'Use descriptive headings that summarize section content. Avoid generic headings like "Welcome".',
    businessMessage:
      "Use clear section titles so AI agents understand your page structure.",
  },
  semantic_html: {
    impact: 4,
    message:
      "Use semantic HTML elements: <main>, <article>, <section> to structure content.",
    businessMessage:
      "Use proper HTML structure so AI agents can identify your main content area.",
  },
  has_h1: {
    impact: 3,
    message:
      "Add exactly one H1 heading that describes the page's main topic.",
    businessMessage:
      "Add a clear main heading — it's the first thing AI agents look for.",
  },
  image_alt_text: {
    impact: 2,
    message:
      "Add descriptive alt text to images so AI agents understand visual content.",
    businessMessage:
      "Describe your images in text so AI agents know what they show.",
  },
  link_quality: {
    impact: 2,
    message:
      'Replace generic link text ("click here", "read more") with descriptive labels.',
    businessMessage:
      "Use meaningful link labels so AI agents understand where each link goes.",
  },

  // Trustworthy
  has_json_ld: {
    impact: 8,
    message:
      "Add JSON-LD structured data (Schema.org) with at least 5 properties.",
    businessMessage:
      "Add structured data so AI agents understand exactly what your page is about.",
  },
  has_og_tags: {
    impact: 3,
    message:
      "Add Open Graph tags: og:title, og:description, og:type, og:image.",
    businessMessage:
      "Add social sharing tags — AI agents use them to summarize your content.",
  },
  has_meta_description: {
    impact: 3,
    message:
      'Add a <meta name="description"> with a concise page summary.',
    businessMessage:
      "Add a page description that AI agents can use as a content summary.",
  },
  has_canonical: {
    impact: 2,
    message:
      'Add <link rel="canonical"> to identify the primary URL for this content.',
    businessMessage:
      "Tell AI agents which URL is the official one for this page.",
  },
  has_lang: {
    impact: 2,
    message:
      'Add a lang attribute to <html> (e.g., <html lang="en">).',
    businessMessage:
      "Declare your page language so AI agents respond in the right language.",
  },
  has_robots_txt: {
    impact: 2,
    message:
      "Add a robots.txt that allows AI crawlers to access your content.",
    businessMessage:
      "Allow AI agents to crawl your site by adding a robots.txt file.",
  },
  has_sitemap: {
    impact: 2,
    message:
      "Add a sitemap.xml to help crawlers discover all your pages.",
    businessMessage:
      "Help AI agents find all your important pages with a sitemap.",
  },
  mako_summary_quality: {
    impact: 5,
    message:
      "Add a summary field (10-30 words, ≤160 chars) to your MAKO frontmatter.",
    businessMessage:
      "Write a clear summary in your MAKO file — AI agents use it to describe your business.",
  },
  mako_freshness: {
    impact: 4,
    message:
      "Set X-Mako-Updated header to the content's last modification date.",
    businessMessage:
      "Keep your AI-optimized content up to date — stale data hurts trust.",
  },
  mako_etag: {
    impact: 3,
    message:
      "Add an ETag header to MAKO responses for efficient caching.",
    businessMessage:
      "Enable caching so AI agents can efficiently check for content updates.",
  },
  mako_tokens_declared: {
    impact: 2,
    message:
      "Set X-Mako-Tokens header to declare the token count of your MAKO content.",
    businessMessage:
      "Declare content size so AI agents can plan their token budget.",
  },
  mako_body_quality: {
    impact: 3,
    message:
      "Ensure MAKO body content has at least 200 characters of meaningful markdown.",
    businessMessage:
      "Provide enough content in your MAKO file for AI agents to work with.",
  },

  // Actionable
  structured_actions: {
    impact: 7,
    message:
      "Add machine-readable CTAs/actions. In MAKO, define actions with name, description, and url.",
    businessMessage:
      "Define clear actions (buy, subscribe, contact) so AI agents can guide users to them.",
  },
  semantic_links: {
    impact: 5,
    message:
      "Include semantic links with context in your MAKO frontmatter.",
    businessMessage:
      "Connect your pages with meaningful links so AI agents can navigate your site.",
  },
  action_completeness: {
    impact: 4,
    message:
      "Ensure all MAKO actions have name, description, and url fields.",
    businessMessage:
      "Complete your action definitions so AI agents have all the info they need.",
  },
  mako_headers_complete: {
    impact: 4,
    message:
      "Include all MAKO headers: Version, Type, Lang, Entity, Tokens, Updated, Canonical.",
    businessMessage:
      "Provide complete metadata so AI agents get the full picture of your content.",
  },
  clean_extraction: {
    impact: 2,
    message:
      "Ensure your page has at least 200 characters of extractable content.",
    businessMessage:
      "Add more content to your page — AI agents need substance to work with.",
  },
};

function generateRecommendations(
  categories: ScoreCategory[]
): ScoreRecommendation[] {
  const recommendations: ScoreRecommendation[] = [];

  for (const category of categories) {
    for (const check of category.checks) {
      if (!check.passed) {
        const rec = RECOMMENDATION_MAP[check.id];
        if (rec) {
          recommendations.push({
            check: check.id,
            category: category.key,
            impact: rec.impact,
            message: rec.message,
            businessMessage: rec.businessMessage,
          });
        }
      }
    }
  }

  recommendations.sort((a, b) => b.impact - a.impact);
  return recommendations;
}
