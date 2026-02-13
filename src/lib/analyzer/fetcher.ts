import { z } from "zod";

const MAX_HTML_BYTES = 1_000_000; // 1MB
const FETCH_TIMEOUT_MS = 15_000;
const MIN_BODY_LENGTH = 500;
const USER_AGENT = "MAKO-Analyzer/1.0";

const urlSchema = z.string().url().refine(
  (val) => {
    try {
      const u = new URL(val);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  },
  { message: "URL must use http or https protocol" }
);

/**
 * Block private/internal IP ranges and local domains to prevent SSRF attacks.
 */
function isBlockedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();

  // Block local domains
  if (
    lower === "localhost" ||
    lower.endsWith(".local") ||
    lower.endsWith(".internal")
  ) {
    return true;
  }

  // Block IPv6 loopback and private ranges
  if (lower === "::1" || lower === "[::1]") return true;
  if (lower.startsWith("fc00:") || lower.startsWith("fe80:")) return true;
  if (lower.startsWith("[fc00:") || lower.startsWith("[fe80:")) return true;

  // Block private IPv4 ranges
  const ipv4Match = lower.match(
    /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
  );
  if (ipv4Match) {
    const [, a, b] = ipv4Match.map(Number);
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 127) return true; // 127.0.0.0/8
    if (a === 0) return true; // 0.0.0.0/8
    if (a === 169 && b === 254) return true; // 169.254.0.0/16
  }

  return false;
}

export async function fetchUrl(
  url: string
): Promise<{ html: string; finalUrl: string; statusCode: number }> {
  // Validate URL format
  const parseResult = urlSchema.safeParse(url);
  if (!parseResult.success) {
    throw new Error(`Invalid URL: ${parseResult.error.issues[0]?.message}`);
  }

  const parsed = new URL(url);

  // SSRF protection
  if (isBlockedHost(parsed.hostname)) {
    throw new Error("Access to private/internal addresses is not allowed");
  }

  // Try direct fetch first
  try {
    const result = await doFetch(url);
    if (result.html.length >= MIN_BODY_LENGTH) {
      return result;
    }
    // Body too small, try Jina fallback
  } catch {
    // Direct fetch failed, try Jina fallback
  }

  // Fallback to Jina Reader
  try {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const result = await doFetch(jinaUrl);
    return {
      html: result.html,
      finalUrl: url, // Keep original URL as the canonical one
      statusCode: result.statusCode,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch URL (both direct and Jina fallback failed): ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

async function doFetch(
  url: string
): Promise<{ html: string; finalUrl: string; statusCode: number }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    let html = await response.text();

    // Truncate to 1MB
    if (html.length > MAX_HTML_BYTES) {
      html = html.slice(0, MAX_HTML_BYTES);
    }

    return {
      html,
      finalUrl: response.url || url,
      statusCode: response.status,
    };
  } finally {
    clearTimeout(timeout);
  }
}
