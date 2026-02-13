import type { PageData, ScoreCategory, ScoreCheck } from "../types";

export function evaluateContentStructure(page: PageData): ScoreCategory {
  const checks: ScoreCheck[] = [];

  // has_h1 (5 pts) — Exactly one h1
  const h1Count = page.$("h1").length;
  checks.push({
    id: "has_h1",
    name: "Has single H1",
    maxPoints: 5,
    earned: h1Count === 1 ? 5 : 0,
    passed: h1Count === 1,
    details: h1Count === 0
      ? "No H1 heading found"
      : h1Count > 1
        ? `Found ${h1Count} H1 headings (should be exactly 1)`
        : undefined,
  });

  // has_h2_sections (5 pts) — At least 2 h2s
  const h2Count = page.$("h2").length;
  checks.push({
    id: "has_h2_sections",
    name: "Has H2 sections",
    maxPoints: 5,
    earned: h2Count >= 2 ? 5 : 0,
    passed: h2Count >= 2,
    details: h2Count < 2
      ? `Only ${h2Count} H2 heading(s) found (need at least 2)`
      : undefined,
  });

  // heading_hierarchy (3 pts) — No skipped levels
  const headingLevels: number[] = [];
  page.$("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const tag = (el as unknown as { tagName: string }).tagName;
    headingLevels.push(parseInt(tag.charAt(1)));
  });
  let hierarchyValid = true;
  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] - headingLevels[i - 1] > 1) {
      hierarchyValid = false;
      break;
    }
  }
  checks.push({
    id: "heading_hierarchy",
    name: "Proper heading hierarchy",
    maxPoints: 3,
    earned: hierarchyValid ? 3 : 0,
    passed: hierarchyValid,
    details: !hierarchyValid
      ? "Heading levels are skipped (e.g., H1 followed by H3)"
      : undefined,
  });

  // semantic_html (5 pts) — Uses article/main/section
  const hasArticle = page.$("article").length > 0;
  const hasMain = page.$("main").length > 0;
  const hasSection = page.$("section").length > 0;
  const semanticCount = [hasArticle, hasMain, hasSection].filter(Boolean).length;
  const semanticPoints = semanticCount >= 2 ? 5 : semanticCount === 1 ? 3 : 0;
  checks.push({
    id: "semantic_html",
    name: "Uses semantic HTML",
    maxPoints: 5,
    earned: semanticPoints,
    passed: semanticCount >= 1,
    details: semanticCount === 0
      ? "No <article>, <main>, or <section> elements found"
      : undefined,
  });

  // content_noise_ratio (4 pts) — markdown/html ratio
  const ratio = page.html.length > 0 ? page.markdown.length / page.html.length : 0;
  const noisePoints = ratio >= 0.3 ? 4 : ratio >= 0.15 ? 2 : 0;
  checks.push({
    id: "content_noise_ratio",
    name: "Good content-to-noise ratio",
    maxPoints: 4,
    earned: noisePoints,
    passed: ratio >= 0.15,
    details: ratio < 0.15
      ? `Content ratio is ${(ratio * 100).toFixed(1)}% (too much noise/boilerplate)`
      : undefined,
  });

  // clean_extraction (3 pts) — Markdown >= 200 chars
  const cleanExtraction = page.markdown.length >= 200;
  checks.push({
    id: "clean_extraction",
    name: "Clean content extraction",
    maxPoints: 3,
    earned: cleanExtraction ? 3 : 0,
    passed: cleanExtraction,
    details: !cleanExtraction
      ? `Extracted only ${page.markdown.length} characters of content`
      : undefined,
  });

  const earned = checks.reduce((sum, c) => sum + c.earned, 0);

  return {
    name: "Content Structure",
    maxPoints: 25,
    earned,
    checks,
  };
}
