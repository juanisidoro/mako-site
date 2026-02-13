import type { CheerioAPI, Cheerio } from "cheerio";
import type { AnyNode } from "domhandler";

export interface LinkItem {
  url: string;
  context: string;
  type?: string;
}

const MAX_INTERNAL_LINKS = 10;
const MAX_EXTERNAL_LINKS = 5;

/** Selectors for areas we should NOT extract links from */
const EXCLUDE_SELECTORS = "nav, footer, aside, header, .sidebar, .menu, .navigation, [role='navigation'], [role='banner'], [role='contentinfo']";

/** Selectors for the main content area where we want to extract links */
const CONTENT_SELECTORS = [
  "main",
  "article",
  '[role="main"]',
  ".content",
  ".post",
  ".entry",
];

export function extractLinks(
  $: CheerioAPI,
  baseUrl: string
): { internal: LinkItem[]; external: LinkItem[] } {
  const internal: LinkItem[] = [];
  const external: LinkItem[] = [];
  const seenUrls = new Set<string>();

  let baseDomain: string;
  try {
    baseDomain = new URL(baseUrl).hostname.replace(/^www\./, "");
  } catch {
    return { internal: [], external: [] };
  }

  // Find main content area
  let $content: Cheerio<AnyNode> = $("body");
  for (const selector of CONTENT_SELECTORS) {
    const found = $(selector);
    if (found.length > 0) {
      $content = found.first();
      break;
    }
  }

  // Remove excluded areas from our search scope
  const $clone = $content.clone();
  $clone.find(EXCLUDE_SELECTORS).remove();

  // Process all links in main content
  $clone.find("a[href]").each((_, el) => {
    if (
      internal.length >= MAX_INTERNAL_LINKS &&
      external.length >= MAX_EXTERNAL_LINKS
    ) {
      return false; // Stop iterating
    }

    const $el = $(el);
    const href = $el.attr("href");
    if (!href) return;

    // Skip anchors, javascript, mailto, tel
    if (
      href.startsWith("#") ||
      href.startsWith("javascript:") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return;
    }

    // Skip non-semantic links (legal, privacy, cookies, terms)
    const hrefLower = href.toLowerCase();
    if (
      /privac|cookie|legal|terms|condiciones|aviso-legal|politica-de/.test(hrefLower) ||
      /policies\.google\.com/.test(hrefLower) ||
      /creativecommons\.org/.test(hrefLower)
    ) {
      return;
    }

    // Resolve relative URLs
    let resolvedUrl: string;
    try {
      resolvedUrl = new URL(href, baseUrl).href;
    } catch {
      return; // Invalid URL
    }

    // Remove fragment
    const urlObj = new URL(resolvedUrl);
    urlObj.hash = "";
    resolvedUrl = urlObj.href;

    // Deduplicate
    if (seenUrls.has(resolvedUrl)) return;
    seenUrls.add(resolvedUrl);

    // Get context
    const context = getContext($, $el);
    if (!context) return; // Skip links without meaningful context

    // Classify as internal or external
    const linkDomain = urlObj.hostname.replace(/^www\./, "");
    const isInternal = linkDomain === baseDomain;

    const linkItem: LinkItem = {
      url: resolvedUrl,
      context,
    };

    if (isInternal && internal.length < MAX_INTERNAL_LINKS) {
      // Use pathname for internal links for cleaner output
      linkItem.url = urlObj.pathname + urlObj.search;
      internal.push(linkItem);
    } else if (!isInternal && external.length < MAX_EXTERNAL_LINKS) {
      external.push(linkItem);
    }
  });

  return { internal, external };
}

function getContext($: CheerioAPI, $el: ReturnType<CheerioAPI>): string {
  // 1. Use link text if meaningful
  const linkText = $el.text().trim().replace(/\s+/g, " ");
  if (linkText && linkText.length > 2 && linkText.length <= 100) {
    return linkText;
  }

  // 2. Try aria-label
  const ariaLabel = $el.attr("aria-label")?.trim();
  if (ariaLabel) return ariaLabel;

  // 3. Try title attribute
  const title = $el.attr("title")?.trim();
  if (title) return title;

  // 4. Try parent heading
  const $heading = $el.closest("h1, h2, h3, h4, h5, h6");
  if ($heading.length > 0) {
    return $heading.text().trim().replace(/\s+/g, " ");
  }

  // 5. Try parent paragraph text (truncated)
  const $parent = $el.closest("p, li, td");
  if ($parent.length > 0) {
    const parentText = $parent.text().trim().replace(/\s+/g, " ");
    if (parentText.length <= 120) return parentText;
    return parentText.slice(0, 117) + "...";
  }

  return "";
}
