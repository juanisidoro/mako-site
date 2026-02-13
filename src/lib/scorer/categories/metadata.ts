import type { PageData, ScoreCategory, ScoreCheck } from "../types";

export function evaluateMetadata(page: PageData): ScoreCategory {
  const checks: ScoreCheck[] = [];

  // has_json_ld (6 pts)
  const jsonLdScripts = page.$('script[type="application/ld+json"]');
  const hasJsonLd = jsonLdScripts.length > 0;
  checks.push({
    id: "has_json_ld",
    name: "Has JSON-LD structured data",
    maxPoints: 6,
    earned: hasJsonLd ? 6 : 0,
    passed: hasJsonLd,
    details: !hasJsonLd
      ? "No JSON-LD structured data found"
      : undefined,
  });

  // has_og_tags (5 pts) — og:title, og:description, og:type, og:image (1.25 each)
  const ogTags = ["og:title", "og:description", "og:type", "og:image"];
  let ogFound = 0;
  for (const tag of ogTags) {
    const content = page.$(`meta[property="${tag}"]`).attr("content")?.trim();
    if (content && content.length > 0) ogFound++;
  }
  const ogPoints = Math.round((ogFound * 1.25) * 100) / 100;
  checks.push({
    id: "has_og_tags",
    name: "Has Open Graph tags",
    maxPoints: 5,
    earned: Math.round(ogPoints),
    passed: ogFound >= 2,
    details: ogFound < 4
      ? `Found ${ogFound}/4 OG tags (${ogTags.filter(tag => {
          const content = page.$(`meta[property="${tag}"]`).attr("content")?.trim();
          return !content;
        }).join(", ")} missing)`
      : undefined,
  });

  // has_meta_description (4 pts)
  const metaDesc = page.$('meta[name="description"]').attr("content")?.trim();
  const hasMetaDesc = !!metaDesc && metaDesc.length > 0;
  checks.push({
    id: "has_meta_description",
    name: "Has meta description",
    maxPoints: 4,
    earned: hasMetaDesc ? 4 : 0,
    passed: hasMetaDesc,
    details: !hasMetaDesc
      ? "No <meta name=\"description\"> found"
      : undefined,
  });

  // has_canonical (3 pts)
  const canonical = page.$('link[rel="canonical"]').attr("href")?.trim();
  const hasCanonical = !!canonical && canonical.length > 0;
  checks.push({
    id: "has_canonical",
    name: "Has canonical URL",
    maxPoints: 3,
    earned: hasCanonical ? 3 : 0,
    passed: hasCanonical,
    details: !hasCanonical
      ? "No <link rel=\"canonical\"> found"
      : undefined,
  });

  // has_lang (3 pts)
  const lang = page.$("html").attr("lang")?.trim();
  const hasLang = !!lang && lang.length > 0;
  checks.push({
    id: "has_lang",
    name: "Has language attribute",
    maxPoints: 3,
    earned: hasLang ? 3 : 0,
    passed: hasLang,
    details: !hasLang
      ? "No lang attribute on <html> element"
      : undefined,
  });

  // has_title (2 pts)
  const titleText = page.$("title").first().text().trim();
  const hasTitle = titleText.length >= 5;
  checks.push({
    id: "has_title",
    name: "Has meaningful title",
    maxPoints: 2,
    earned: hasTitle ? 2 : 0,
    passed: hasTitle,
    details: !hasTitle
      ? titleText.length === 0 ? "No <title> tag found" : "Title is too short (< 5 characters)"
      : undefined,
  });

  // schema_depth (2 pts) — JSON-LD with 5+ properties
  let schemaDepth = false;
  jsonLdScripts.each((_, el) => {
    if (schemaDepth) return;
    try {
      const text = page.$(el).html();
      if (!text) return;
      const data = JSON.parse(text);
      const items = Array.isArray(data) ? data : data["@graph"] ? data["@graph"] : [data];
      for (const item of items) {
        if (Object.keys(item).length >= 5) {
          schemaDepth = true;
          return;
        }
      }
    } catch {
      // Invalid JSON-LD
    }
  });
  checks.push({
    id: "schema_depth",
    name: "Rich structured data",
    maxPoints: 2,
    earned: schemaDepth ? 2 : 0,
    passed: schemaDepth,
    details: !schemaDepth
      ? "JSON-LD data has fewer than 5 properties"
      : undefined,
  });

  const earned = checks.reduce((sum, c) => sum + c.earned, 0);

  return {
    name: "Metadata & Structured Data",
    maxPoints: 25,
    earned,
    checks,
  };
}
