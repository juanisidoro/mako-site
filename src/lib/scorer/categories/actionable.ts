import type {
  PageData,
  ScoreCategory,
  ScoreCheck,
  MakoProbeResult,
} from "../types";

export function evaluateActionable(
  page: PageData,
  mako: MakoProbeResult
): ScoreCategory {
  const checks: ScoreCheck[] = [];

  // structured_actions (7 pts) — HTML + MAKO actions
  const actionCount = page.actions.length;
  const makoActionCount = mako.makoActions.length;
  const totalActions = Math.max(actionCount, makoActionCount);
  const actionPoints =
    totalActions >= 3 ? 7 : totalActions >= 2 ? 5 : totalActions >= 1 ? 3 : 0;
  checks.push({
    id: "structured_actions",
    name: "Structured actions",
    maxPoints: 7,
    earned: actionPoints,
    passed: totalActions >= 1,
    details:
      totalActions === 0
        ? "No machine-readable actions detected"
        : `${totalActions} action(s) detected${makoActionCount > 0 ? ` (${makoActionCount} via MAKO)` : ""}`,
  });

  // semantic_links (6 pts) — HTML + MAKO links
  const internalLinks = page.links.internal.length;
  const externalLinks = page.links.external.length;
  const makoLinkCount = mako.makoLinks.length;
  const totalLinks = internalLinks + externalLinks;
  let linkPoints = 0;
  if (makoLinkCount >= 3) {
    linkPoints = 6;
  } else if (makoLinkCount >= 1) {
    linkPoints = 4;
  } else if (totalLinks >= 5) {
    linkPoints = 3;
  } else if (totalLinks >= 2) {
    linkPoints = 2;
  }
  checks.push({
    id: "semantic_links",
    name: "Semantic links",
    maxPoints: 6,
    earned: linkPoints,
    passed: totalLinks >= 2 || makoLinkCount >= 1,
    details:
      makoLinkCount > 0
        ? `${makoLinkCount} MAKO link(s) + ${totalLinks} HTML link(s)`
        : `${internalLinks} internal + ${externalLinks} external links`,
  });

  // action_completeness (5 pts) — MAKO actions with name + description + url
  let completenessPoints = 0;
  let completenessDetails: string | undefined;
  if (makoActionCount > 0) {
    const complete = mako.makoActions.filter(
      (a) => a.name && a.description && a.url
    ).length;
    const ratio = complete / makoActionCount;
    if (ratio >= 0.8) {
      completenessPoints = 5;
    } else if (ratio >= 0.5) {
      completenessPoints = 3;
      completenessDetails = `${complete}/${makoActionCount} MAKO actions are complete (name + description + url)`;
    } else {
      completenessPoints = 1;
      completenessDetails = `Only ${complete}/${makoActionCount} MAKO actions have name, description, and url`;
    }
  } else if (mako.hasMakoVersion) {
    completenessDetails = "No actions defined in MAKO frontmatter";
  } else {
    completenessDetails = "Not applicable (no MAKO support)";
  }
  checks.push({
    id: "action_completeness",
    name: "Action completeness",
    maxPoints: 5,
    earned: completenessPoints,
    passed: completenessPoints >= 3,
    details: completenessDetails,
  });

  // mako_headers_complete (4 pts) — all 7 MAKO headers present
  const headerFields = [
    mako.makoVersion,
    mako.makoType,
    mako.makoLang,
    mako.makoEntity,
    mako.makoTokens,
    mako.makoUpdated,
    mako.makoCanonical,
  ];
  const presentHeaders = headerFields.filter(Boolean).length;
  let headersPoints = 0;
  let headersDetails: string | undefined;
  if (presentHeaders >= 6) {
    headersPoints = 4;
  } else if (presentHeaders >= 4) {
    headersPoints = 3;
    headersDetails = `${presentHeaders}/7 MAKO headers present`;
  } else if (presentHeaders >= 2) {
    headersPoints = 2;
    headersDetails = `Only ${presentHeaders}/7 MAKO headers present`;
  } else if (mako.hasMakoVersion) {
    headersPoints = 1;
    headersDetails = `Only ${presentHeaders}/7 MAKO headers present`;
  } else {
    headersDetails = "Not applicable (no MAKO support)";
  }
  checks.push({
    id: "mako_headers_complete",
    name: "MAKO headers complete",
    maxPoints: 4,
    earned: headersPoints,
    passed: headersPoints >= 3,
    details: headersDetails,
  });

  // clean_extraction (3 pts) — enough extractable content
  const mdLen = page.markdown.length;
  const cleanPoints =
    mdLen >= 500 ? 3 : mdLen >= 200 ? 2 : mdLen >= 50 ? 1 : 0;
  checks.push({
    id: "clean_extraction",
    name: "Clean content extraction",
    maxPoints: 3,
    earned: cleanPoints,
    passed: mdLen >= 200,
    details:
      mdLen < 200
        ? `Only ${mdLen} characters of content extracted`
        : undefined,
  });

  const earned = checks.reduce((sum, c) => sum + c.earned, 0);

  return {
    name: "Actionable",
    key: "actionable",
    question: "Can AI agents interact with you?",
    maxPoints: 25,
    earned,
    checks,
  };
}
