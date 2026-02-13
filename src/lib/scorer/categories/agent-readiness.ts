import type { PageData, ScoreCategory, ScoreCheck } from "../types";

const PROBE_TIMEOUT = 3000;

async function probe(url: string, init?: RequestInit): Promise<Response | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT);
  try {
    const res = await fetch(url, {
      ...init,
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

export async function evaluateAgentReadiness(page: PageData): Promise<ScoreCategory> {
  const checks: ScoreCheck[] = [];

  let origin: string;
  try {
    origin = new URL(page.finalUrl).origin;
  } catch {
    origin = new URL(page.url).origin;
  }

  // Run all HTTP probes in parallel
  const [makoRes, llmsTxtRes, robotsRes, sitemapRes, mcpRes] = await Promise.allSettled([
    probe(page.finalUrl, {
      method: "HEAD",
      headers: { Accept: "text/mako+markdown" },
    }),
    probe(`${origin}/llms.txt`),
    probe(`${origin}/robots.txt`),
    probe(`${origin}/sitemap.xml`),
    probe(`${origin}/.well-known/mcp.json`),
  ]);

  // serves_mako (7 pts)
  const makoResponse = makoRes.status === "fulfilled" ? makoRes.value : null;
  const hasMakoVersion = !!makoResponse?.headers.get("x-mako-version");
  checks.push({
    id: "serves_mako",
    name: "Serves MAKO format",
    maxPoints: 7,
    earned: hasMakoVersion ? 7 : 0,
    passed: hasMakoVersion,
    details: !hasMakoVersion
      ? "No X-Mako-Version header in response to MAKO content negotiation"
      : `MAKO v${makoResponse?.headers.get("x-mako-version")}`,
  });

  // has_llms_txt (5 pts)
  const llmsResponse = llmsTxtRes.status === "fulfilled" ? llmsTxtRes.value : null;
  const hasLlmsTxt = !!llmsResponse && llmsResponse.ok;
  checks.push({
    id: "has_llms_txt",
    name: "Has llms.txt",
    maxPoints: 5,
    earned: hasLlmsTxt ? 5 : 0,
    passed: hasLlmsTxt,
    details: !hasLlmsTxt
      ? "No llms.txt file found at site root"
      : undefined,
  });

  // has_robots_txt (4 pts)
  const robotsResponse = robotsRes.status === "fulfilled" ? robotsRes.value : null;
  let robotsPoints = 0;
  let robotsDetails: string | undefined;
  if (robotsResponse && robotsResponse.ok) {
    const body = await robotsResponse.text().catch(() => "");
    const blocksAll = /Disallow:\s*\/\s*$/m.test(body) && /User-agent:\s*\*/m.test(body);
    if (blocksAll) {
      robotsPoints = 1;
      robotsDetails = "robots.txt blocks all crawlers";
    } else {
      robotsPoints = 4;
    }
  } else {
    robotsDetails = "No robots.txt found";
  }
  checks.push({
    id: "has_robots_txt",
    name: "Has robots.txt",
    maxPoints: 4,
    earned: robotsPoints,
    passed: robotsPoints >= 4,
    details: robotsDetails,
  });

  // has_sitemap (4 pts)
  const sitemapResponse = sitemapRes.status === "fulfilled" ? sitemapRes.value : null;
  const hasSitemap = !!sitemapResponse && sitemapResponse.ok;
  checks.push({
    id: "has_sitemap",
    name: "Has sitemap.xml",
    maxPoints: 4,
    earned: hasSitemap ? 4 : 0,
    passed: hasSitemap,
    details: !hasSitemap
      ? "No sitemap.xml found at site root"
      : undefined,
  });

  // has_mcp_endpoint (2 pts)
  const mcpResponse = mcpRes.status === "fulfilled" ? mcpRes.value : null;
  const hasMcp = !!mcpResponse && mcpResponse.ok;
  checks.push({
    id: "has_mcp_endpoint",
    name: "Has MCP endpoint",
    maxPoints: 2,
    earned: hasMcp ? 2 : 0,
    passed: hasMcp,
    details: !hasMcp
      ? "No /.well-known/mcp.json found"
      : undefined,
  });

  // structured_actions (3 pts)
  const actionCount = page.actions.length;
  const actionPoints = actionCount >= 3 ? 3 : actionCount >= 1 ? 2 : 0;
  checks.push({
    id: "structured_actions",
    name: "Has structured actions",
    maxPoints: 3,
    earned: actionPoints,
    passed: actionCount >= 1,
    details: actionCount === 0
      ? "No machine-readable actions detected"
      : `${actionCount} action(s) detected`,
  });

  const earned = checks.reduce((sum, c) => sum + c.earned, 0);

  return {
    name: "Agent Readiness",
    maxPoints: 25,
    earned,
    checks,
  };
}
