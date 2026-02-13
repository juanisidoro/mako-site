import type { CheerioAPI } from "cheerio";

type ContentType =
  | "product"
  | "article"
  | "docs"
  | "landing"
  | "listing"
  | "profile"
  | "event"
  | "recipe"
  | "faq"
  | "custom";

interface Signal {
  type: ContentType;
  weight: number;
  test: (html: string, $: CheerioAPI, markdown: string) => boolean;
}

const signals: Signal[] = [
  // ── Product signals ────────────────────────────────
  {
    type: "product",
    weight: 3,
    test: (html) => /og:type["']\s*content=["']product/i.test(html),
  },
  {
    type: "product",
    weight: 3,
    test: (html) =>
      /schema\.org\/Product/i.test(html) ||
      /"@type"\s*:\s*"Product"/i.test(html),
  },
  {
    type: "product",
    weight: 2,
    test: (_, $) => $(".price, [class*='price'], [data-price]").length > 0,
  },
  {
    type: "product",
    weight: 2,
    test: (html) =>
      /\$\d+[\d,.]*|\€\d+[\d,.]*|USD\s*\d+|price/i.test(html),
  },
  {
    type: "product",
    weight: 2,
    test: (_, $) =>
      $("button, a")
        .filter(
          (_, el) => /add\s*to\s*cart|buy\s*now|purchase/i.test($(el).text())
        )
        .length > 0,
  },

  // ── Article signals ────────────────────────────────
  {
    type: "article",
    weight: 3,
    test: (html) => /og:type["']\s*content=["']article/i.test(html),
  },
  {
    type: "article",
    weight: 3,
    test: (html) =>
      /schema\.org\/Article|schema\.org\/NewsArticle|schema\.org\/BlogPosting/i.test(
        html
      ) ||
      /"@type"\s*:\s*"(Article|NewsArticle|BlogPosting)"/i.test(html),
  },
  {
    type: "article",
    weight: 2,
    test: (_, $) => $("article").length > 0,
  },
  {
    type: "article",
    weight: 1,
    test: (_, $) =>
      $(".post, .blog-post, .entry-content, .article-content").length > 0,
  },
  {
    type: "article",
    weight: 1,
    test: (_, $) =>
      $('time, [datetime], meta[property="article:published_time"]').length > 0,
  },

  // ── Docs signals ───────────────────────────────────
  {
    type: "docs",
    weight: 3,
    test: (html) =>
      /\/(docs|api|reference|guide|manual|documentation)\//i.test(html),
  },
  {
    type: "docs",
    weight: 2,
    test: (_, $) => $("pre code, code").length >= 3,
  },
  {
    type: "docs",
    weight: 1,
    test: (_, $) => $("pre").length >= 2,
  },
  {
    type: "docs",
    weight: 1,
    test: (_, __, markdown) => (markdown.match(/```/g) || []).length >= 4,
  },

  // ── Landing page signals ──────────────────────────
  {
    type: "landing",
    weight: 2,
    test: (_, $) =>
      $(".hero, [class*='hero'], [class*='banner']").length > 0,
  },
  {
    type: "landing",
    weight: 2,
    test: (_, $) =>
      $(".cta, [class*='cta'], .call-to-action").length > 0,
  },
  {
    type: "landing",
    weight: 2,
    test: (_, $) =>
      $("[class*='pricing'], .pricing-table, .plans").length > 0,
  },
  {
    type: "landing",
    weight: 1,
    test: (_, $) => {
      const headings = $("h1, h2, h3").length;
      return headings <= 5 && headings >= 1;
    },
  },

  // ── Listing signals ───────────────────────────────
  {
    type: "listing",
    weight: 2,
    test: (_, $) =>
      $(".product-list, .product-grid, [class*='listing'], .results").length >
      0,
  },
  {
    type: "listing",
    weight: 2,
    test: (_, $) =>
      $(".pagination, [class*='paginat'], nav[aria-label*='page']").length > 0,
  },
  {
    type: "listing",
    weight: 1,
    test: (_, $) => {
      // Many repeated similar structures suggest a listing
      const cards = $(
        ".card, .item, .product, [class*='card'], [class*='item']"
      );
      return cards.length >= 5;
    },
  },

  // ── Profile signals ───────────────────────────────
  {
    type: "profile",
    weight: 3,
    test: (html) =>
      /schema\.org\/Person|schema\.org\/Organization/i.test(html) ||
      /"@type"\s*:\s*"(Person|Organization)"/i.test(html),
  },
  {
    type: "profile",
    weight: 1,
    test: (_, $) =>
      $(".about, .bio, .profile, [class*='profile'], [class*='author']")
        .length > 0,
  },

  // ── Event signals ─────────────────────────────────
  {
    type: "event",
    weight: 3,
    test: (html) =>
      /schema\.org\/Event/i.test(html) ||
      /"@type"\s*:\s*"Event"/i.test(html),
  },
  {
    type: "event",
    weight: 2,
    test: (_, $) =>
      $("button, a")
        .filter((_, el) => /register|rsvp|attend|tickets/i.test($(el).text()))
        .length > 0,
  },
  {
    type: "event",
    weight: 1,
    test: (html) =>
      /venue|location|when|date.*time|registration/i.test(html),
  },

  // ── Recipe signals ────────────────────────────────
  {
    type: "recipe",
    weight: 3,
    test: (html) =>
      /schema\.org\/Recipe/i.test(html) ||
      /"@type"\s*:\s*"Recipe"/i.test(html),
  },
  {
    type: "recipe",
    weight: 2,
    test: (_, $) =>
      $("[class*='ingredient'], [class*='recipe'], .ingredients").length > 0,
  },
  {
    type: "recipe",
    weight: 1,
    test: (_, __, markdown) =>
      /ingredients|instructions|prep\s*time|cook\s*time|servings/i.test(
        markdown
      ),
  },

  // ── FAQ signals ───────────────────────────────────
  {
    type: "faq",
    weight: 3,
    test: (html) =>
      /schema\.org\/FAQPage/i.test(html) ||
      /"@type"\s*:\s*"FAQPage"/i.test(html),
  },
  {
    type: "faq",
    weight: 2,
    test: (_, $) =>
      $("[class*='accordion'], [class*='faq'], .question").length >= 3,
  },
  {
    type: "faq",
    weight: 1,
    test: (_, __, markdown) => {
      const questions = markdown.match(/\?/g) || [];
      return questions.length >= 5;
    },
  },
];

export function detectContentType(
  html: string,
  $: CheerioAPI,
  markdown: string
): ContentType {
  const scores: Record<ContentType, number> = {
    product: 0,
    article: 0,
    docs: 0,
    landing: 0,
    listing: 0,
    profile: 0,
    event: 0,
    recipe: 0,
    faq: 0,
    custom: 0,
  };

  for (const signal of signals) {
    try {
      if (signal.test(html, $, markdown)) {
        scores[signal.type] += signal.weight;
      }
    } catch {
      // Ignore signal evaluation errors
    }
  }

  // Find highest scoring type
  let bestType: ContentType = "custom";
  let bestScore = 0;

  for (const [type, score] of Object.entries(scores) as [
    ContentType,
    number,
  ][]) {
    if (score > bestScore) {
      bestScore = score;
      bestType = type;
    }
  }

  // Only return a type if it has a meaningful score, otherwise default to custom
  return bestScore >= 2 ? bestType : "custom";
}
