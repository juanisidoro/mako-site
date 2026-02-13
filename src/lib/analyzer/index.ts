import * as cheerio from "cheerio";
import { fetchUrl } from "./fetcher";
import { htmlToMarkdown } from "./html-to-markdown";
import { detectContentType } from "./content-detector";
import { extractEntity } from "./entity-extractor";
import { extractLinks } from "./link-extractor";
import { extractActions } from "./action-extractor";
import { buildMakoFile } from "./mako-builder";
import { countTokens, countHtmlTokens } from "./token-counter";
import { saveAnalysis } from "@/lib/db";
import type { AnalysisResult } from "@/lib/db";

export type { AnalysisResult } from "@/lib/db";

export async function analyzeUrl(
  url: string,
  isPublic: boolean
): Promise<AnalysisResult> {
  // 1. Fetch URL
  const { html, finalUrl } = await fetchUrl(url);

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

  // 9. Detect language from <html lang="">
  const language = $("html").attr("lang")?.split("-")[0]?.trim() || "en";

  // 10. Derive summary from markdown
  const summary = deriveSummary(markdown);

  // 11. Build MAKO file + headers
  const { content: makoContent, headers } = buildMakoFile({
    markdown,
    contentType,
    entity,
    summary,
    actions,
    links,
    language,
    url: finalUrl,
  });

  // 12. Count MAKO tokens
  const makoTokens = countTokens(makoContent);

  // 13. Calculate savings percentage
  const savingsPercent =
    htmlTokens > 0
      ? Math.round(((htmlTokens - makoTokens) / htmlTokens) * 10000) / 100
      : 0;

  // Extract domain from URL
  let domain: string;
  try {
    domain = new URL(finalUrl).hostname;
  } catch {
    domain = "unknown";
  }

  const result: AnalysisResult = {
    url: finalUrl,
    domain,
    htmlTokens,
    makoTokens,
    savingsPercent,
    contentType,
    entity,
    summary,
    makoContent,
    headers,
    isPublic,
    createdAt: new Date().toISOString(),
  };

  // 14. Try save to DB (non-blocking, catch errors)
  saveAnalysis(result).then((id) => {
    if (id) {
      result.id = id;
    }
  }).catch((error) => {
    console.error("[analyzer] Failed to save analysis to DB:", error);
  });

  return result;
}

/**
 * Derive a summary from the first meaningful paragraph of markdown.
 * Max 160 characters.
 */
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
