import type { PageData, ScoreCategory, ScoreCheck, MakoProbeResult } from "../types";

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

export async function evaluateDiscoverable(
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
  const [llmsTxtRes, mcpRes] = await Promise.allSettled([
    probe(`${origin}/llms.txt`),
    probe(`${origin}/.well-known/mcp.json`),
  ]);

  // serves_mako (5 pts)
  checks.push({
    id: "serves_mako",
    name: "Serves MAKO format",
    maxPoints: 5,
    earned: mako.hasMakoVersion ? 5 : 0,
    passed: mako.hasMakoVersion,
    details: mako.hasMakoVersion
      ? `MAKO v${mako.makoVersion}`
      : "No X-Mako-Version header found when requesting with Accept: text/mako+markdown",
  });

  // mako_content_negotiation (3 pts)
  const cnPassed = mako.hasCorrectContentType;
  checks.push({
    id: "mako_content_negotiation",
    name: "Correct MAKO content type",
    maxPoints: 3,
    earned: cnPassed ? 3 : 0,
    passed: cnPassed,
    details: mako.hasMakoVersion && !cnPassed
      ? "MAKO response doesn't return text/mako+markdown content type"
      : !mako.hasMakoVersion
        ? "Not applicable (no MAKO support)"
        : undefined,
  });

  // mako_link_tag (2 pts)
  checks.push({
    id: "mako_link_tag",
    name: "MAKO discovery link tag",
    maxPoints: 2,
    earned: mako.hasLinkTag ? 2 : 0,
    passed: mako.hasLinkTag,
    details: !mako.hasLinkTag
      ? 'No <link rel="alternate" type="text/mako+markdown"> in HTML'
      : undefined,
  });

  // has_llms_txt (3 pts)
  const llmsResponse = llmsTxtRes.status === "fulfilled" ? llmsTxtRes.value : null;
  const hasLlmsTxt = !!llmsResponse && llmsResponse.ok;
  checks.push({
    id: "has_llms_txt",
    name: "Has llms.txt",
    maxPoints: 3,
    earned: hasLlmsTxt ? 3 : 0,
    passed: hasLlmsTxt,
    details: !hasLlmsTxt ? "No llms.txt file found at site root" : undefined,
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
    details: !hasMcp ? "No /.well-known/mcp.json found" : undefined,
  });

  const earned = checks.reduce((sum, c) => sum + c.earned, 0);

  return {
    name: "Discoverable",
    key: "discoverable",
    question: "Can AI agents find you?",
    maxPoints: 15,
    earned,
    checks,
  };
}
