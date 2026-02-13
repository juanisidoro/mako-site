import * as cheerio from "cheerio";
import { fetchUrl } from "./fetcher";
import { htmlToMarkdown } from "./html-to-markdown";
import { detectContentType } from "./content-detector";
import { extractEntity } from "./entity-extractor";
import { extractLinks } from "./link-extractor";
import { extractActions } from "./action-extractor";
import { countHtmlTokens } from "./token-counter";
import type { PageData } from "@/lib/scorer/types";

export type { PageData } from "@/lib/scorer/types";

export async function extractPageData(url: string): Promise<PageData> {
  // 1. Fetch URL
  const { html, finalUrl, usedJinaFallback } = await fetchUrl(url);

  // 2. Count HTML tokens
  const htmlTokens = countHtmlTokens(html);

  // 3. Parse with cheerio
  const $ = cheerio.load(html);

  // 4. Convert to markdown
  const markdown = htmlToMarkdown(html);

  // 5. Detect content type
  const contentType = detectContentType(html, $, markdown);

  // 6. Extract entity
  const entity = extractEntity($);

  // 7. Extract links
  const links = extractLinks($, finalUrl);

  // 8. Extract actions
  const actions = extractActions($);

  // 9. Detect language
  const language = $("html").attr("lang")?.split("-")[0]?.trim() || "en";

  // 10. Derive summary
  const summary = deriveSummary(markdown);

  return {
    url,
    finalUrl,
    html,
    $,
    markdown,
    htmlTokens,
    contentType,
    entity,
    summary,
    links,
    actions,
    language,
    usedJinaFallback,
  };
}

function deriveSummary(markdown: string): string {
  const paragraphs = markdown.split(/\n\n+/);

  for (const p of paragraphs) {
    const cleaned = p
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/[*_`\[\]()]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (cleaned.length >= 20) {
      if (cleaned.length <= 160) return cleaned;
      return cleaned.slice(0, 157) + "...";
    }
  }

  return "";
}
