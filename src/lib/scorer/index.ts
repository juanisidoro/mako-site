import { extractPageData } from "@/lib/analyzer/extract";
import { evaluateContentStructure } from "./categories/content-structure";
import { evaluateMetadata } from "./categories/metadata";
import { evaluateLlmAccessibility } from "./categories/llm-accessibility";
import { evaluateAgentReadiness } from "./categories/agent-readiness";
import { getGrade } from "./types";
import type { ScoreResult, ScoreCategory, ScoreRecommendation } from "./types";
import { saveScore } from "@/lib/db";

export type { ScoreResult, ScoreCategory, ScoreCheck, ScoreRecommendation, Grade, PageData } from "./types";

export async function scoreUrl(url: string, isPublic: boolean): Promise<ScoreResult> {
  const page = await extractPageData(url);

  // Evaluate synchronous categories
  const contentStructure = evaluateContentStructure(page);
  const metadata = evaluateMetadata(page);
  const llmAccessibility = evaluateLlmAccessibility(page);

  // Evaluate async category (HTTP probes)
  const agentReadiness = await evaluateAgentReadiness(page);

  const categories: ScoreCategory[] = [
    contentStructure,
    metadata,
    llmAccessibility,
    agentReadiness,
  ];

  const totalScore = categories.reduce((sum, c) => sum + c.earned, 0);
  const grade = getGrade(totalScore);

  // Generate recommendations from failed checks
  const recommendations = generateRecommendations(categories, page);

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
    categories,
    recommendations,
    isPublic,
    createdAt: new Date().toISOString(),
  };

  // Save to DB
  try {
    const id = await saveScore(result);
    if (id) {
      result.id = id;
    }
  } catch (error) {
    console.error("[scorer] Failed to save score to DB:", error);
  }

  return result;
}

const RECOMMENDATION_MAP: Record<string, { impact: number; message: string }> = {
  serves_mako: {
    impact: 10,
    message: "Adopt the MAKO protocol to serve LLM-optimized content. Install @mako-spec/js and add MAKO content negotiation to your server.",
  },
  has_llms_txt: {
    impact: 8,
    message: "Add an llms.txt file to your site root describing your site for AI agents. See llmstxt.org for the format.",
  },
  has_json_ld: {
    impact: 8,
    message: "Add JSON-LD structured data (Schema.org) to help AI agents understand your content semantically.",
  },
  token_efficiency: {
    impact: 7,
    message: "Reduce HTML bloat by removing unnecessary scripts, inline styles, and non-semantic markup. Clean HTML means better LLM comprehension.",
  },
  no_js_dependency: {
    impact: 7,
    message: "Serve content as static HTML instead of requiring JavaScript rendering. LLMs and crawlers can't execute JS.",
  },
  has_h1: {
    impact: 6,
    message: "Add exactly one H1 heading that clearly describes your page's main topic.",
  },
  semantic_html: {
    impact: 6,
    message: "Use semantic HTML elements like <main>, <article>, and <section> to structure your content for better AI parsing.",
  },
  has_og_tags: {
    impact: 5,
    message: "Add Open Graph meta tags (og:title, og:description, og:type, og:image) for better content discovery.",
  },
  has_meta_description: {
    impact: 5,
    message: "Add a <meta name=\"description\"> tag with a concise summary of your page content.",
  },
  meaningful_headings: {
    impact: 5,
    message: "Use descriptive headings that summarize each section's content. Avoid generic headings like 'Welcome' or 'Home'.",
  },
  has_h2_sections: {
    impact: 4,
    message: "Break your content into sections with H2 headings for better structure and scannability.",
  },
  image_alt_text: {
    impact: 4,
    message: "Add descriptive alt text to all images so AI agents can understand visual content.",
  },
  link_quality: {
    impact: 4,
    message: "Replace generic link text like 'click here' with descriptive labels that explain where the link goes.",
  },
  has_robots_txt: {
    impact: 4,
    message: "Add a robots.txt file that allows AI crawlers to access your content.",
  },
  has_sitemap: {
    impact: 4,
    message: "Add a sitemap.xml to help crawlers and AI agents discover all your pages.",
  },
  has_canonical: {
    impact: 3,
    message: "Add a <link rel=\"canonical\"> to help AI agents identify the primary URL for your content.",
  },
  has_lang: {
    impact: 3,
    message: "Add a lang attribute to your <html> element (e.g., <html lang=\"en\">) to declare the content language.",
  },
  heading_hierarchy: {
    impact: 3,
    message: "Fix your heading hierarchy — don't skip levels (e.g., H1 → H3 without H2).",
  },
  structured_actions: {
    impact: 3,
    message: "Add clear call-to-action buttons so AI agents can detect available actions on your page.",
  },
  has_title: {
    impact: 2,
    message: "Add a meaningful <title> tag (at least 5 characters) that describes your page.",
  },
  schema_depth: {
    impact: 2,
    message: "Enrich your JSON-LD with more properties (at least 5) for deeper AI understanding.",
  },
  content_noise_ratio: {
    impact: 2,
    message: "Reduce non-content elements (ads, trackers, excessive navigation) to improve the content-to-noise ratio.",
  },
  clean_extraction: {
    impact: 2,
    message: "Ensure your page has at least 200 characters of meaningful content for proper analysis.",
  },
  has_mcp_endpoint: {
    impact: 2,
    message: "Add a /.well-known/mcp.json endpoint to enable Model Context Protocol (MCP) integration.",
  },
};

function generateRecommendations(
  categories: ScoreCategory[],
  page: ScoreRecommendationContext,
): ScoreRecommendation[] {
  const recommendations: ScoreRecommendation[] = [];

  for (const category of categories) {
    for (const check of category.checks) {
      if (!check.passed) {
        const rec = RECOMMENDATION_MAP[check.id];
        if (rec) {
          recommendations.push({
            check: check.id,
            impact: rec.impact,
            message: rec.message,
          });
        }
      }
    }
  }

  // Sort by impact (highest first)
  recommendations.sort((a, b) => b.impact - a.impact);

  // Always add MAKO CTA at the end if not already serving MAKO
  const servesMako = categories
    .flatMap((c) => c.checks)
    .find((c) => c.id === "serves_mako");
  if (servesMako && !servesMako.passed) {
    // serves_mako recommendation is already included above, ensure it's last or prominent
  }

  return recommendations;
}

// Minimal type for the context param — avoids importing CheerioAPI in the recommendation logic
type ScoreRecommendationContext = { actions: { length: number } };
