import type {
  PageData,
  ScoreCategory,
  ScoreCheck,
  MakoProbeResult,
} from "../types";

const PROBE_TIMEOUT = 5000;

async function probe(url: string): Promise<Response | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
    });
    return res;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function probeSitemap(
  origin: string
): Promise<{ found: boolean; details?: string }> {
  const paths = [
    "/sitemap.xml",
    "/sitemap_index.xml",
    "/sitemap/sitemap-index.xml",
    "/wp-sitemap.xml",
  ];
  for (const path of paths) {
    const res = await probe(`${origin}${path}`);
    if (res && res.ok) {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("xml") || ct.includes("text/")) {
        if (path !== "/sitemap.xml") {
          return { found: true, details: `Found at ${path}` };
        }
        return { found: true };
      }
    }
  }
  return { found: false };
}

export async function evaluateTrustworthy(
  page: PageData,
  mako: MakoProbeResult
): Promise<ScoreCategory> {
  const checks: ScoreCheck[] = [];

  let origin: string;
  try {
    origin = new URL(page.finalUrl).origin;
  } catch {
    origin = new URL(page.url).origin;
  }

  // Run HTTP probes in parallel
  const [robotsRes, sitemapResult] = await Promise.allSettled([
    probe(`${origin}/robots.txt`),
    probeSitemap(origin),
  ]);

  // has_json_ld (4 pts) — with depth bonus
  const jsonLdScripts = page.$('script[type="application/ld+json"]');
  const hasJsonLd = jsonLdScripts.length > 0;
  let schemaDepth = false;
  jsonLdScripts.each((_, el) => {
    if (schemaDepth) return;
    try {
      const text = page.$(el).html();
      if (!text) return;
      const data = JSON.parse(text);
      const items = Array.isArray(data)
        ? data
        : data["@graph"]
          ? data["@graph"]
          : [data];
      for (const item of items) {
        if (Object.keys(item).length >= 5) {
          schemaDepth = true;
          return;
        }
      }
    } catch {
      /* invalid JSON-LD */
    }
  });
  checks.push({
    id: "has_json_ld",
    name: "JSON-LD structured data",
    maxPoints: 4,
    earned: hasJsonLd ? (schemaDepth ? 4 : 2) : 0,
    passed: hasJsonLd,
    details: !hasJsonLd
      ? "No JSON-LD structured data found"
      : !schemaDepth
        ? "JSON-LD present but lacks depth (fewer than 5 properties)"
        : undefined,
  });

  // has_og_tags (2 pts)
  const ogTags = ["og:title", "og:description", "og:type", "og:image"];
  let ogFound = 0;
  for (const tag of ogTags) {
    const content = page.$(`meta[property="${tag}"]`).attr("content")?.trim();
    if (content && content.length > 0) ogFound++;
  }
  const ogPoints = ogFound >= 3 ? 2 : ogFound >= 2 ? 1 : 0;
  checks.push({
    id: "has_og_tags",
    name: "Open Graph tags",
    maxPoints: 2,
    earned: ogPoints,
    passed: ogFound >= 2,
    details:
      ogFound < 2
        ? `Only ${ogFound}/4 Open Graph tags found`
        : ogFound < 4
          ? `${ogFound}/4 Open Graph tags`
          : undefined,
  });

  // has_meta_description (2 pts)
  const metaDesc = page
    .$('meta[name="description"]')
    .attr("content")
    ?.trim();
  const hasMetaDesc = !!metaDesc && metaDesc.length > 0;
  checks.push({
    id: "has_meta_description",
    name: "Meta description",
    maxPoints: 2,
    earned: hasMetaDesc ? 2 : 0,
    passed: hasMetaDesc,
    details: !hasMetaDesc
      ? 'No <meta name="description"> found'
      : undefined,
  });

  // has_canonical (2 pts)
  const canonical = page.$('link[rel="canonical"]').attr("href")?.trim();
  const hasCanonical = !!canonical && canonical.length > 0;
  checks.push({
    id: "has_canonical",
    name: "Canonical URL",
    maxPoints: 2,
    earned: hasCanonical ? 2 : 0,
    passed: hasCanonical,
    details: !hasCanonical
      ? 'No <link rel="canonical"> found'
      : undefined,
  });

  // has_lang (2 pts)
  const lang = page.$("html").attr("lang")?.trim();
  const hasLang = !!lang && lang.length > 0;
  checks.push({
    id: "has_lang",
    name: "Language attribute",
    maxPoints: 2,
    earned: hasLang ? 2 : 0,
    passed: hasLang,
    details: !hasLang
      ? "No lang attribute on <html> element"
      : undefined,
  });

  // has_robots_txt (2 pts)
  const robotsResponse =
    robotsRes.status === "fulfilled" ? robotsRes.value : null;
  let robotsPoints = 0;
  let robotsDetails: string | undefined;
  if (robotsResponse && robotsResponse.ok) {
    const body = await robotsResponse.text().catch(() => "");
    const blocksAll =
      /Disallow:\s*\/\s*$/m.test(body) && /User-agent:\s*\*/m.test(body);
    if (blocksAll) {
      robotsPoints = 0;
      robotsDetails = "robots.txt blocks all crawlers";
    } else {
      robotsPoints = 2;
    }
  } else {
    robotsDetails = "No robots.txt found";
  }
  checks.push({
    id: "has_robots_txt",
    name: "robots.txt",
    maxPoints: 2,
    earned: robotsPoints,
    passed: robotsPoints >= 2,
    details: robotsDetails,
  });

  // has_sitemap (2 pts)
  const sitemap =
    sitemapResult.status === "fulfilled" ? sitemapResult.value : null;
  const hasSitemap = sitemap?.found ?? false;
  checks.push({
    id: "has_sitemap",
    name: "Sitemap",
    maxPoints: 2,
    earned: hasSitemap ? 2 : 0,
    passed: hasSitemap,
    details: !hasSitemap ? "No sitemap.xml found" : sitemap?.details,
  });

  // ── MAKO-specific trustworthiness checks ──

  // mako_summary_quality (4 pts)
  let summaryPoints = 0;
  let summaryDetails: string | undefined;
  if (mako.hasFrontmatter && mako.summary) {
    const wordCount = mako.summaryWordCount;
    if (wordCount >= 10 && mako.summary.length <= 160) {
      summaryPoints = 4;
    } else if (wordCount >= 5) {
      summaryPoints = 2;
      summaryDetails =
        mako.summary.length > 160
          ? `MAKO summary exceeds 160 chars (${mako.summary.length})`
          : "MAKO summary is too short (fewer than 10 words)";
    }
  } else if (mako.hasMakoVersion) {
    summaryDetails = "MAKO response has no summary in frontmatter";
  } else {
    summaryDetails = "Not applicable (no MAKO support)";
  }
  checks.push({
    id: "mako_summary_quality",
    name: "MAKO summary quality",
    maxPoints: 4,
    earned: summaryPoints,
    passed: summaryPoints >= 2,
    details: summaryDetails,
  });

  // mako_freshness (3 pts)
  let freshnessPoints = 0;
  let freshnessDetails: string | undefined;
  if (mako.makoUpdated) {
    const updated = new Date(mako.makoUpdated);
    const daysSince =
      (Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24);
    if (!isNaN(daysSince)) {
      if (daysSince <= 30) {
        freshnessPoints = 3;
      } else if (daysSince <= 90) {
        freshnessPoints = 2;
        freshnessDetails = `MAKO content updated ${Math.round(daysSince)} days ago`;
      } else {
        freshnessPoints = 1;
        freshnessDetails = `MAKO content is ${Math.round(daysSince)} days old`;
      }
    }
  } else if (mako.hasMakoVersion) {
    freshnessDetails = "No X-Mako-Updated header found";
  } else {
    freshnessDetails = "Not applicable (no MAKO support)";
  }
  checks.push({
    id: "mako_freshness",
    name: "MAKO freshness",
    maxPoints: 3,
    earned: freshnessPoints,
    passed: freshnessPoints >= 2,
    details: freshnessDetails,
  });

  // mako_etag (3 pts)
  const hasEtag = !!mako.etag;
  checks.push({
    id: "mako_etag",
    name: "MAKO caching (ETag)",
    maxPoints: 3,
    earned: hasEtag ? 3 : 0,
    passed: hasEtag,
    details: !hasEtag
      ? mako.hasMakoVersion
        ? "No ETag header in MAKO response"
        : "Not applicable (no MAKO support)"
      : undefined,
  });

  // mako_tokens_declared (2 pts)
  const hasTokens = !!mako.makoTokens;
  checks.push({
    id: "mako_tokens_declared",
    name: "MAKO tokens declared",
    maxPoints: 2,
    earned: hasTokens ? 2 : 0,
    passed: hasTokens,
    details: !hasTokens
      ? mako.hasMakoVersion
        ? "No X-Mako-Tokens header found"
        : "Not applicable (no MAKO support)"
      : `${mako.makoTokens} tokens declared`,
  });

  // mako_body_quality (2 pts)
  let bodyPoints = 0;
  let bodyDetails: string | undefined;
  if (mako.hasFrontmatter && mako.bodyContent) {
    const bodyLen = mako.bodyContentLength;
    if (bodyLen >= 200) {
      bodyPoints = 2;
    } else if (bodyLen >= 50) {
      bodyPoints = 1;
      bodyDetails = `MAKO body is short (${bodyLen} chars)`;
    } else {
      bodyDetails = `MAKO body too short (${bodyLen} chars)`;
    }
  } else if (mako.hasMakoVersion) {
    bodyDetails = "No body content in MAKO response";
  } else {
    bodyDetails = "Not applicable (no MAKO support)";
  }
  checks.push({
    id: "mako_body_quality",
    name: "MAKO body quality",
    maxPoints: 2,
    earned: bodyPoints,
    passed: bodyPoints >= 1,
    details: bodyDetails,
  });

  const earned = checks.reduce((sum, c) => sum + c.earned, 0);

  return {
    name: "Trustworthy",
    key: "trustworthy",
    question: "Can AI agents trust your data?",
    maxPoints: 30,
    earned,
    checks,
  };
}
