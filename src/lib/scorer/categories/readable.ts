import type { PageData, ScoreCategory, ScoreCheck } from "../types";

const GENERIC_HEADINGS =
  /^(welcome|home|untitled|page|header|section|content|main|default|hero|banner|title|heading)$/i;
const BAD_LINK_TEXT =
  /^(click here|here|read more|more|link|this|learn more|see more|go|view|details|info)$/i;

export function evaluateReadable(page: PageData): ScoreCategory {
  const checks: ScoreCheck[] = [];

  // content_signal_ratio (7 pts) — main content vs full page text
  const textContent = page.markdown.replace(/\s+/g, " ").trim();
  const htmlText = page.html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const ratio = htmlText.length > 0 ? textContent.length / htmlText.length : 0;
  const signalPoints =
    ratio >= 0.5 ? 7 : ratio >= 0.35 ? 5 : ratio >= 0.2 ? 3 : 0;
  checks.push({
    id: "content_signal_ratio",
    name: "Content signal ratio",
    maxPoints: 7,
    earned: signalPoints,
    passed: ratio >= 0.2,
    details:
      ratio < 0.2
        ? `Content signal ratio is ${(ratio * 100).toFixed(0)}% — too much boilerplate`
        : `${(ratio * 100).toFixed(0)}% content signal ratio`,
  });

  // no_js_dependency (5 pts) — didn't need Jina fallback
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

  // first_meaningful_content (4 pts) — real content appears early
  const first500 = page.markdown.slice(0, 500);
  const meaningfulLines = first500.split("\n").filter((line) => {
    const trimmed = line.trim();
    return (
      trimmed.length > 30 &&
      !trimmed.startsWith("#") &&
      !trimmed.startsWith("![") &&
      !trimmed.startsWith("|")
    );
  });
  const hasEarlyContent = meaningfulLines.length >= 1;
  const firstH1Match = page.markdown.match(/^# .+/m);
  const h1Position = firstH1Match
    ? page.markdown.indexOf(firstH1Match[0])
    : -1;
  const h1EarlyEnough = h1Position >= 0 && h1Position < 300;
  const fmcPoints =
    hasEarlyContent && h1EarlyEnough ? 4 : hasEarlyContent || h1EarlyEnough ? 2 : 0;
  checks.push({
    id: "first_meaningful_content",
    name: "First meaningful content",
    maxPoints: 4,
    earned: fmcPoints,
    passed: fmcPoints >= 2,
    details:
      fmcPoints < 2
        ? "Main content doesn't appear early enough — too much navigation or boilerplate before real content"
        : undefined,
  });

  // meaningful_headings (4 pts) — headings are descriptive
  const headings: string[] = [];
  page.$("h1, h2, h3").each((_, el) => {
    headings.push(page.$(el).text().trim());
  });
  const totalHeadings = headings.length;
  const genericHeadings = headings.filter(
    (h) => GENERIC_HEADINGS.test(h) || h.length < 3
  );
  const meaningfulRatio =
    totalHeadings > 0
      ? (totalHeadings - genericHeadings.length) / totalHeadings
      : 0;
  const headingPoints =
    totalHeadings === 0
      ? 0
      : meaningfulRatio >= 0.8
        ? 4
        : meaningfulRatio >= 0.5
          ? 2
          : 0;
  checks.push({
    id: "meaningful_headings",
    name: "Meaningful headings",
    maxPoints: 4,
    earned: headingPoints,
    passed: meaningfulRatio >= 0.5,
    details:
      totalHeadings === 0
        ? "No headings found"
        : meaningfulRatio < 0.5
          ? `${genericHeadings.length}/${totalHeadings} headings are generic or too short`
          : undefined,
  });

  // semantic_html (4 pts) — uses article/main/section
  const hasArticle = page.$("article").length > 0;
  const hasMain = page.$("main").length > 0;
  const hasSection = page.$("section").length > 0;
  const semanticCount = [hasArticle, hasMain, hasSection].filter(
    Boolean
  ).length;
  const semanticPoints =
    semanticCount >= 2 ? 4 : semanticCount === 1 ? 2 : 0;
  checks.push({
    id: "semantic_html",
    name: "Semantic HTML structure",
    maxPoints: 4,
    earned: semanticPoints,
    passed: semanticCount >= 1,
    details:
      semanticCount === 0
        ? "No <article>, <main>, or <section> elements found"
        : undefined,
  });

  // has_h1 (2 pts) — exactly one h1
  const h1Count = page.$("h1").length;
  checks.push({
    id: "has_h1",
    name: "Has single H1",
    maxPoints: 2,
    earned: h1Count === 1 ? 2 : 0,
    passed: h1Count === 1,
    details:
      h1Count === 0
        ? "No H1 heading found"
        : h1Count > 1
          ? `Found ${h1Count} H1 headings (should be exactly 1)`
          : undefined,
  });

  // image_alt_text (2 pts)
  let imagesWithAlt = 0;
  let totalImages = 0;
  page.$("img").each((_, el) => {
    const src = page.$(el).attr("src") || "";
    if (
      src.includes("pixel") ||
      src.includes("tracking") ||
      src.includes("1x1")
    )
      return;
    totalImages++;
    const alt = page.$(el).attr("alt")?.trim();
    if (alt && alt.length > 0) imagesWithAlt++;
  });
  const altRatio = totalImages > 0 ? imagesWithAlt / totalImages : 1;
  const altPoints =
    totalImages === 0 ? 2 : altRatio >= 0.8 ? 2 : altRatio >= 0.5 ? 1 : 0;
  checks.push({
    id: "image_alt_text",
    name: "Images have alt text",
    maxPoints: 2,
    earned: altPoints,
    passed: altRatio >= 0.5,
    details:
      totalImages > 0 && altRatio < 0.5
        ? `Only ${imagesWithAlt}/${totalImages} images have alt text`
        : undefined,
  });

  // link_quality (2 pts) — descriptive link text
  const allLinks: string[] = [];
  page.$("a").each((_, el) => {
    const text = page.$(el).text().trim();
    if (text) allLinks.push(text);
  });
  const badLinks = allLinks.filter((t) => BAD_LINK_TEXT.test(t));
  const linkRatio =
    allLinks.length > 0
      ? (allLinks.length - badLinks.length) / allLinks.length
      : 1;
  const linkPoints =
    allLinks.length === 0 ? 1 : linkRatio >= 0.9 ? 2 : linkRatio >= 0.7 ? 1 : 0;
  checks.push({
    id: "link_quality",
    name: "Descriptive link text",
    maxPoints: 2,
    earned: linkPoints,
    passed: linkRatio >= 0.7,
    details:
      linkRatio < 0.7
        ? `${badLinks.length}/${allLinks.length} links have generic text like "click here"`
        : undefined,
  });

  const earned = checks.reduce((sum, c) => sum + c.earned, 0);

  return {
    name: "Readable",
    key: "readable",
    question: "Can AI agents understand you?",
    maxPoints: 30,
    earned,
    checks,
  };
}
