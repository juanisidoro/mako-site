import type { CheerioAPI } from "cheerio";
import type { MakoProbeResult } from "./types";

const PROBE_TIMEOUT = 5000;

/**
 * Runs MAKO-specific HTTP probes (HEAD + GET) and parses the response.
 * Results are shared across Discoverable, Trustworthy, and Actionable categories.
 */
export async function probeMako(
  url: string,
  $: CheerioAPI
): Promise<MakoProbeResult> {
  const result: MakoProbeResult = {
    hasMakoVersion: false,
    makoVersion: null,
    hasCorrectContentType: false,
    getBody: "",
    hasFrontmatter: false,
    summary: "",
    summaryWordCount: 0,
    bodyContent: "",
    bodyContentLength: 0,
    makoTokens: null,
    makoUpdated: null,
    makoType: null,
    makoLang: null,
    makoEntity: null,
    makoCanonical: null,
    etag: null,
    hasLinkTag: false,
    makoActions: [],
    makoLinks: [],
  };

  // Check <link rel="alternate" type="text/mako+markdown"> in HTML
  result.hasLinkTag =
    $('link[rel="alternate"][type="text/mako+markdown"]').length > 0;

  // HEAD probe
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT);
    const headRes = await fetch(url, {
      method: "HEAD",
      headers: { Accept: "text/mako+markdown" },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);
    const version = headRes.headers.get("x-mako-version");
    result.hasMakoVersion = !!version;
    result.makoVersion = version;
  } catch {
    return result;
  }

  // Skip GET if no MAKO version found
  if (!result.hasMakoVersion) return result;

  // GET probe — fetch full MAKO response
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT);
    const getRes = await fetch(url, {
      headers: { Accept: "text/mako+markdown" },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);

    const contentType = getRes.headers.get("content-type") || "";
    result.hasCorrectContentType = contentType.includes("mako");

    // Read all response headers
    result.makoTokens = getRes.headers.get("x-mako-tokens");
    result.makoUpdated = getRes.headers.get("x-mako-updated");
    result.makoType = getRes.headers.get("x-mako-type");
    result.makoLang = getRes.headers.get("x-mako-lang");
    result.makoEntity = getRes.headers.get("x-mako-entity");
    result.makoCanonical = getRes.headers.get("x-mako-canonical");
    result.etag = getRes.headers.get("etag");

    // Read and parse body
    const body = await getRes.text();
    result.getBody = body;

    const normalized = body.replace(/\r\n/g, "\n");
    if (normalized.startsWith("---\n")) {
      const endIdx = normalized.indexOf("\n---\n", 4);
      if (endIdx > 0) {
        result.hasFrontmatter = true;
        const fm = normalized.slice(4, endIdx);
        const bodyAfter = normalized.slice(endIdx + 5).trim();
        result.bodyContent = bodyAfter;
        result.bodyContentLength = bodyAfter.length;

        // Extract summary
        const summaryMatch = fm.match(
          /^summary:\s*["']?(.+?)["']?\s*$/m
        );
        if (summaryMatch) {
          result.summary = summaryMatch[1];
          result.summaryWordCount = summaryMatch[1]
            .split(/\s+/)
            .filter(Boolean).length;
        }

        // Extract actions
        result.makoActions = parseMakoActions(fm);

        // Extract links
        result.makoLinks = parseMakoLinks(fm);
      }
    }
  } catch {
    // GET failed but HEAD succeeded — partial result is fine
  }

  return result;
}

function parseMakoActions(
  fm: string
): { name?: string; description?: string; url?: string }[] {
  const actions: { name?: string; description?: string; url?: string }[] = [];

  // Find the actions: block in frontmatter
  const actionsStart = fm.indexOf("\nactions:");
  if (actionsStart === -1) return actions;

  // Extract lines until next top-level key or end
  const afterActions = fm.slice(actionsStart + 9);
  const lines = afterActions.split("\n");

  let current: { name?: string; description?: string; url?: string } | null =
    null;

  for (const line of lines) {
    // Stop at next top-level key
    if (/^\w/.test(line) && !line.startsWith(" ") && !line.startsWith("-")) {
      break;
    }
    if (/^\s*-\s+name:/.test(line) || /^\s*-\s*$/.test(line)) {
      if (current && (current.name || current.description)) {
        actions.push(current);
      }
      current = {};
    }
    if (current) {
      const nameMatch = line.match(/name:\s*["']?(.+?)["']?\s*$/);
      const descMatch = line.match(/description:\s*["']?(.+?)["']?\s*$/);
      const urlMatch = line.match(/url:\s*["']?(.+?)["']?\s*$/);
      if (nameMatch) current.name = nameMatch[1];
      if (descMatch) current.description = descMatch[1];
      if (urlMatch) current.url = urlMatch[1];
    }
  }
  if (current && (current.name || current.description)) {
    actions.push(current);
  }

  return actions;
}

function parseMakoLinks(fm: string): { url?: string; context?: string }[] {
  const links: { url?: string; context?: string }[] = [];

  // Find internal: block
  const internalStart = fm.indexOf("\n  internal:");
  if (internalStart === -1) return links;

  const afterInternal = fm.slice(internalStart + 12);
  const lines = afterInternal.split("\n");

  let current: { url?: string; context?: string } | null = null;

  for (const line of lines) {
    // Stop at external: or next top-level key
    if (/^\s{0,2}\w/.test(line) && !line.startsWith("    ")) {
      break;
    }
    if (/^\s+-\s+url:/.test(line) || /^\s+-\s*$/.test(line)) {
      if (current && current.url) links.push(current);
      current = {};
    }
    if (current) {
      const urlMatch = line.match(/url:\s*["']?(.+?)["']?\s*$/);
      const ctxMatch = line.match(/context:\s*["']?(.+?)["']?\s*$/);
      if (urlMatch) current.url = urlMatch[1];
      if (ctxMatch) current.context = ctxMatch[1];
    }
  }
  if (current && current.url) links.push(current);

  return links;
}
