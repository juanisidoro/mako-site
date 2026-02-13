import { extractPageData } from "./extract";
import { buildMakoFile } from "./mako-builder";
import { countTokens } from "./token-counter";
import { saveAnalysis } from "@/lib/db";
import type { AnalysisResult } from "@/lib/db";

export type { AnalysisResult } from "@/lib/db";

export async function analyzeUrl(
  url: string,
  isPublic: boolean
): Promise<AnalysisResult> {
  const page = await extractPageData(url);

  // Build MAKO file + headers
  const { content: makoContent, headers } = buildMakoFile({
    markdown: page.markdown,
    contentType: page.contentType,
    entity: page.entity,
    summary: page.summary,
    actions: page.actions,
    links: page.links,
    language: page.language,
    url: page.finalUrl,
  });

  // Count MAKO tokens
  const makoTokens = countTokens(makoContent);

  // Calculate savings percentage
  const savingsPercent =
    page.htmlTokens > 0
      ? Math.round(((page.htmlTokens - makoTokens) / page.htmlTokens) * 10000) / 100
      : 0;

  // Extract domain from URL
  let domain: string;
  try {
    domain = new URL(page.finalUrl).hostname;
  } catch {
    domain = "unknown";
  }

  const result: AnalysisResult = {
    url: page.finalUrl,
    domain,
    htmlTokens: page.htmlTokens,
    makoTokens,
    savingsPercent,
    contentType: page.contentType,
    entity: page.entity,
    summary: page.summary,
    makoContent,
    headers,
    isPublic,
    createdAt: new Date().toISOString(),
  };

  // Save to DB
  try {
    const id = await saveAnalysis(result);
    if (id) {
      result.id = id;
    }
  } catch (error) {
    console.error("[analyzer] Failed to save analysis to DB:", error);
  }

  return result;
}
