import * as cheerio from "cheerio";
import type { AnyNode, Element } from "domhandler";

type CheerioAPI = ReturnType<typeof cheerio.load>;
type CheerioSelection = cheerio.Cheerio<AnyNode>;

/** Selectors for elements that should be completely removed from the DOM */
const REMOVE_SELECTORS = [
  "script",
  "style",
  "nav",
  "footer",
  "header",
  "aside",
  "iframe",
  "noscript",
  "svg",
  "form",
  '[role="navigation"]',
  '[role="banner"]',
  '[role="contentinfo"]',
  '[role="complementary"]',
  ".ad",
  ".ads",
  ".advertisement",
  ".sidebar",
  ".cookie",
  ".popup",
  ".modal",
  '[class*="cookie"]',
  '[class*="consent"]',
  '[id*="cookie"]',
  '[id*="consent"]',
  '[class*="footer"]',
  '[class*="legal"]',
  '[class*="copyright"]',
  '[class*="social-share"]',
  '[class*="share-buttons"]',
  '[class*="newsletter"]',
  '[class*="subscribe"]',
  '[class*="comments"]',
  '[id*="comments"]',
  '[class*="related-posts"]',
  '[class*="breadcrumb"]',
].join(", ");

/** Selectors for main content area, in priority order */
const CONTENT_SELECTORS = [
  "main",
  "article",
  '[role="main"]',
  ".content",
  ".post",
  ".entry",
];

export function htmlToMarkdown(html: string): string {
  const $ = cheerio.load(html);

  // Remove unwanted elements
  $(REMOVE_SELECTORS).remove();

  // Find main content area
  let $content: CheerioSelection | null = null;
  for (const selector of CONTENT_SELECTORS) {
    const found = $(selector);
    if (found.length > 0) {
      $content = found.first();
      break;
    }
  }
  if (!$content) {
    $content = $("body");
  }

  // Convert to markdown
  const markdown = convertElement($, $content);

  // Clean up
  return cleanMarkdown(markdown);
}

function convertElement($: CheerioAPI, $el: CheerioSelection): string {
  const parts: string[] = [];

  $el.contents().each((_, node) => {
    if (node.type === "text") {
      const text = $(node).text();
      parts.push(text);
    } else if (node.type === "tag") {
      const $node = $(node);
      const tagName = (node as Element).tagName?.toLowerCase();
      parts.push(convertTag($, $node, tagName));
    }
  });

  return parts.join("");
}

function convertTag($: CheerioAPI, $el: CheerioSelection, tag: string): string {
  switch (tag) {
    case "h1":
      return `\n\n# ${getInlineText($, $el)}\n\n`;
    case "h2":
      return `\n\n## ${getInlineText($, $el)}\n\n`;
    case "h3":
      return `\n\n### ${getInlineText($, $el)}\n\n`;
    case "h4":
      return `\n\n#### ${getInlineText($, $el)}\n\n`;
    case "h5":
      return `\n\n##### ${getInlineText($, $el)}\n\n`;
    case "h6":
      return `\n\n###### ${getInlineText($, $el)}\n\n`;

    case "p":
      return `\n\n${convertElement($, $el)}\n\n`;

    case "br":
      return "\n";

    case "strong":
    case "b": {
      const text = getInlineText($, $el);
      return text ? `**${text}**` : "";
    }

    case "em":
    case "i": {
      const text = getInlineText($, $el);
      return text ? `*${text}*` : "";
    }

    case "a": {
      const href = $el.attr("href");
      const text = getInlineText($, $el);
      if (!text) return "";
      if (href && !href.startsWith("#") && !href.startsWith("javascript:")) {
        return `[${text}](${href})`;
      }
      return text;
    }

    case "img": {
      const alt = $el.attr("alt");
      const src = $el.attr("src");
      if (alt && src) {
        return `![${alt}](${src})`;
      }
      return "";
    }

    case "ul":
      return `\n\n${convertList($, $el, "ul")}\n\n`;

    case "ol":
      return `\n\n${convertList($, $el, "ol")}\n\n`;

    case "li":
      return convertElement($, $el);

    case "blockquote":
      return `\n\n${convertElement($, $el)
        .trim()
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n")}\n\n`;

    case "pre": {
      const $code = $el.find("code");
      const content = $code.length > 0 ? $code.text() : $el.text();
      const lang = $code.attr("class")?.match(/language-(\w+)/)?.[1] ?? "";
      return `\n\n\`\`\`${lang}\n${content}\n\`\`\`\n\n`;
    }

    case "code": {
      // Inline code (not inside pre)
      if ($el.parent("pre").length === 0) {
        const text = $el.text();
        return text ? `\`${text}\`` : "";
      }
      return $el.text();
    }

    case "table":
      return `\n\n${convertTable($, $el)}\n\n`;

    case "div":
    case "section":
    case "main":
    case "article":
    case "span":
    case "figure":
    case "figcaption":
    case "details":
    case "summary":
      return convertElement($, $el);

    case "hr":
      return "\n\n---\n\n";

    default:
      return convertElement($, $el);
  }
}

function getInlineText($: CheerioAPI, $el: CheerioSelection): string {
  return $el.text().replace(/\s+/g, " ").trim();
}

function convertList(
  $: CheerioAPI,
  $el: CheerioSelection,
  type: "ul" | "ol"
): string {
  const items: string[] = [];
  let counter = 1;

  $el.children("li").each((_, li) => {
    const $li = $(li);
    const text = convertElement($, $li).trim();
    if (!text) return;

    const prefix = type === "ol" ? `${counter}. ` : "- ";
    items.push(`${prefix}${text}`);
    counter++;
  });

  return items.join("\n");
}

function convertTable($: CheerioAPI, $el: CheerioSelection): string {
  const rows: string[][] = [];

  // Extract header rows
  $el.find("thead tr, tr").each((_, tr) => {
    const cells: string[] = [];
    $(tr)
      .find("th, td")
      .each((_, cell) => {
        cells.push(getInlineText($, $(cell)));
      });
    if (cells.length > 0) {
      rows.push(cells);
    }
  });

  if (rows.length === 0) return "";

  // Determine column count
  const colCount = Math.max(...rows.map((r) => r.length));

  // Normalize rows to same column count
  const normalized = rows.map((row) => {
    while (row.length < colCount) row.push("");
    return row;
  });

  // Build markdown table
  const lines: string[] = [];
  lines.push("| " + normalized[0].join(" | ") + " |");
  lines.push("| " + normalized[0].map(() => "---").join(" | ") + " |");

  for (let i = 1; i < normalized.length; i++) {
    lines.push("| " + normalized[i].join(" | ") + " |");
  }

  return lines.join("\n");
}

/** Patterns that indicate footer/boilerplate text to remove */
const BOILERPLATE_PATTERNS = [
  /^.*(?:all rights reserved|todos los derechos|© ?\d{4}|copyright \d{4}).*$/gim,
  /^.*(?:política de cookies|cookie policy|politica de privacidad|privacy policy).*$/gim,
  /^.*(?:aceptar y cerrar|accept and close|declinar|decline).*$/gim,
  /^.*(?:utilizamos cookies|we use cookies|usamos cookies).*$/gim,
  /^(?:legal|contacto|contact)\s*$/gim,
  /^(?:para los curiosos|te impulsamos al crecimiento)\s*$/gim,
];

function cleanMarkdown(text: string): string {
  let cleaned = text
    // Normalize line endings
    .replace(/\r\n/g, "\n")
    // Normalize unicode whitespace
    .replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, " ")
    // Remove zero-width characters
    .replace(/[\u200B-\u200D\uFEFF]/g, "");

  // Remove boilerplate lines
  for (const pattern of BOILERPLATE_PATTERNS) {
    cleaned = cleaned.replace(pattern, "");
  }

  // Process lines
  const lines = cleaned.split("\n").map((line) => line.trimEnd());

  // Remove duplicate consecutive lines
  const deduped: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    const lastTrimmed = deduped[deduped.length - 1]?.trim();
    if (trimmed && trimmed === lastTrimmed) continue;
    deduped.push(line);
  }

  return (
    deduped
      .join("\n")
      // Collapse 3+ newlines to 2
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}
