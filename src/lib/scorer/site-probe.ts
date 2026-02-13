import type { CheerioAPI } from "cheerio";
import type { SiteProbe, SiteProbeUrl } from "./types";

const PROBE_TIMEOUT = 5000;
const MAX_URLS = 10;

/**
 * Extracts first-level navigation URLs from the site and probes each for MAKO headers.
 * This gives a site-wide view of MAKO adoption beyond just the scored page.
 */
export async function probeSite(
  $: CheerioAPI,
  finalUrl: string
): Promise<SiteProbe> {
  let origin: string;
  let baseDomain: string;
  try {
    const u = new URL(finalUrl);
    origin = u.origin;
    baseDomain = u.hostname.replace(/^www\./, "");
  } catch {
    return { urls: [], makoCount: 0, totalChecked: 0, adoptionPct: 0 };
  }

  // Collect internal URLs from nav, header, and main links
  const urls = extractSiteUrls($, origin, baseDomain);

  if (urls.length === 0) {
    return { urls: [], makoCount: 0, totalChecked: 0, adoptionPct: 0 };
  }

  // Probe all URLs in parallel
  const results = await Promise.allSettled(
    urls.map((url) => probeUrl(url, origin))
  );

  const probed: SiteProbeUrl[] = results.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    return {
      url: urls[i],
      path: safePath(urls[i]),
      hasMako: false,
      error: "Request failed",
    };
  });

  const makoCount = probed.filter((p) => p.hasMako).length;

  return {
    urls: probed,
    makoCount,
    totalChecked: probed.length,
    adoptionPct:
      probed.length > 0 ? Math.round((makoCount / probed.length) * 100) : 0,
  };
}

function extractSiteUrls(
  $: CheerioAPI,
  origin: string,
  baseDomain: string
): string[] {
  const seen = new Set<string>();
  const urls: string[] = [];

  // Priority: nav links, then header links, then top-level <a> tags
  const selectors = [
    "nav a[href]",
    "header a[href]",
    '[role="navigation"] a[href]',
    "main a[href]",
    "article a[href]",
  ];

  for (const selector of selectors) {
    $(selector).each((_, el) => {
      if (urls.length >= MAX_URLS) return false;

      const href = $(el).attr("href");
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

      // Skip non-page resources
      if (/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|pdf)(\?|$)/i.test(href)) {
        return;
      }

      // Resolve URL
      let resolved: string;
      try {
        resolved = new URL(href, origin).href;
      } catch {
        return;
      }

      // Only same-domain
      const resolvedDomain = new URL(resolved).hostname.replace(/^www\./, "");
      if (resolvedDomain !== baseDomain) return;

      // Remove fragment and trailing slash for dedup
      const u = new URL(resolved);
      u.hash = "";
      const normalized = u.href.replace(/\/$/, "");

      // Skip the homepage itself and already-seen URLs
      const originNorm = origin.replace(/\/$/, "");
      if (normalized === originNorm) return;
      if (seen.has(normalized)) return;

      seen.add(normalized);
      urls.push(u.href);
    });
  }

  return urls.slice(0, MAX_URLS);
}

async function probeUrl(
  url: string,
  origin: string
): Promise<SiteProbeUrl> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT);

  try {
    const res = await fetch(url, {
      method: "HEAD",
      headers: { Accept: "text/mako+markdown" },
      signal: controller.signal,
      redirect: "follow",
    });

    const makoVersion = res.headers.get("x-mako-version");
    const makoTokens = res.headers.get("x-mako-tokens");
    const makoType = res.headers.get("x-mako-type");

    return {
      url,
      path: safePath(url),
      hasMako: !!makoVersion,
      makoVersion: makoVersion || undefined,
      makoTokens: makoTokens ? parseInt(makoTokens, 10) : undefined,
      makoType: makoType || undefined,
    };
  } catch {
    return {
      url,
      path: safePath(url),
      hasMako: false,
      error: "Timeout or connection error",
    };
  } finally {
    clearTimeout(timeout);
  }
}

function safePath(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}
