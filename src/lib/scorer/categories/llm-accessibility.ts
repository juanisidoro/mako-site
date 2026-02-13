import type { PageData, ScoreCategory, ScoreCheck } from "../types";

const GENERIC_HEADINGS = /^(welcome|home|untitled|page|header|section|content|main|default|hero|banner|title|heading)$/i;
const BAD_LINK_TEXT = /^(click here|here|read more|more|link|this|learn more|see more|go|view|details|info)$/i;

export function evaluateLlmAccessibility(page: PageData): ScoreCategory {
  const checks: ScoreCheck[] = [];

  // token_efficiency (7 pts) — Token savings ratio
  const htmlTokens = page.htmlTokens;
  const mdTokens = page.markdown.length > 0 ? Math.ceil(page.markdown.split(/\s+/).filter(Boolean).length * 1.3) : 0;
  const savingsRatio = htmlTokens > 0 ? ((htmlTokens - mdTokens) / htmlTokens) * 100 : 0;
  const efficiencyPoints = savingsRatio >= 70 ? 7 : savingsRatio >= 50 ? 5 : savingsRatio >= 30 ? 3 : 0;
  checks.push({
    id: "token_efficiency",
    name: "Token efficiency",
    maxPoints: 7,
    earned: efficiencyPoints,
    passed: savingsRatio >= 30,
    details: savingsRatio < 30
      ? `Token savings ratio is only ${Math.round(savingsRatio)}% (need ≥30%)`
      : `${Math.round(savingsRatio)}% token savings ratio`,
  });

  // meaningful_headings (5 pts) — Headings are descriptive
  const headings: string[] = [];
  page.$("h1, h2, h3").each((_, el) => {
    headings.push(page.$(el).text().trim());
  });
  const totalHeadings = headings.length;
  const genericHeadings = headings.filter(h => GENERIC_HEADINGS.test(h) || h.length < 3);
  const meaningfulRatio = totalHeadings > 0 ? (totalHeadings - genericHeadings.length) / totalHeadings : 0;
  const headingPoints = totalHeadings === 0 ? 0 : meaningfulRatio >= 0.8 ? 5 : meaningfulRatio >= 0.5 ? 3 : 0;
  checks.push({
    id: "meaningful_headings",
    name: "Meaningful headings",
    maxPoints: 5,
    earned: headingPoints,
    passed: meaningfulRatio >= 0.5,
    details: totalHeadings === 0
      ? "No headings found"
      : meaningfulRatio < 0.5
        ? `${genericHeadings.length}/${totalHeadings} headings are generic or too short`
        : undefined,
  });

  // link_quality (4 pts) — Links have descriptive text
  const allLinks: string[] = [];
  page.$("a").each((_, el) => {
    const text = page.$(el).text().trim();
    if (text) allLinks.push(text);
  });
  const badLinks = allLinks.filter(t => BAD_LINK_TEXT.test(t));
  const linkRatio = allLinks.length > 0 ? (allLinks.length - badLinks.length) / allLinks.length : 1;
  const linkPoints = allLinks.length === 0 ? 2 : linkRatio >= 0.9 ? 4 : linkRatio >= 0.7 ? 2 : 0;
  checks.push({
    id: "link_quality",
    name: "Descriptive link text",
    maxPoints: 4,
    earned: linkPoints,
    passed: linkRatio >= 0.7,
    details: linkRatio < 0.7
      ? `${badLinks.length}/${allLinks.length} links have generic text like "click here"`
      : undefined,
  });

  // image_alt_text (4 pts)
  const images = page.$("img");
  let imagesWithAlt = 0;
  let totalImages = 0;
  images.each((_, el) => {
    const src = page.$(el).attr("src") || "";
    // Skip tracking pixels and tiny images
    if (src.includes("pixel") || src.includes("tracking") || src.includes("1x1")) return;
    totalImages++;
    const alt = page.$(el).attr("alt")?.trim();
    if (alt && alt.length > 0) imagesWithAlt++;
  });
  const altRatio = totalImages > 0 ? imagesWithAlt / totalImages : 1;
  const altPoints = totalImages === 0 ? 4 : altRatio >= 0.9 ? 4 : altRatio >= 0.5 ? 2 : 0;
  checks.push({
    id: "image_alt_text",
    name: "Images have alt text",
    maxPoints: 4,
    earned: altPoints,
    passed: altRatio >= 0.5,
    details: totalImages > 0 && altRatio < 0.5
      ? `Only ${imagesWithAlt}/${totalImages} images have alt text`
      : undefined,
  });

  // no_js_dependency (5 pts) — Didn't need Jina fallback
  checks.push({
    id: "no_js_dependency",
    name: "Content without JavaScript",
    maxPoints: 5,
    earned: page.usedJinaFallback ? 0 : 5,
    passed: !page.usedJinaFallback,
    details: page.usedJinaFallback
      ? "Page required JavaScript rendering (Jina fallback used)"
      : undefined,
  });

  const earned = checks.reduce((sum, c) => sum + c.earned, 0);

  return {
    name: "LLM Accessibility",
    maxPoints: 25,
    earned,
    checks,
  };
}
