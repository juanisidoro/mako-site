import type { CheerioAPI } from "cheerio";

const MAX_ENTITY_LENGTH = 100;

export function extractEntity($: CheerioAPI): string {
  // 1. Try JSON-LD structured data
  const jsonLdEntity = extractFromJsonLd($);
  if (jsonLdEntity) return truncate(jsonLdEntity);

  // 2. Try first h1
  const h1Text = $("h1").first().text().trim();
  if (h1Text) return truncate(h1Text);

  // 3. Try og:title
  const ogTitle = $('meta[property="og:title"]').attr("content")?.trim();
  if (ogTitle) return truncate(ogTitle);

  // 4. Try <title> tag (cleaned)
  const titleText = $("title").first().text().trim();
  if (titleText) return truncate(cleanTitle(titleText));

  return "Unknown";
}

function extractFromJsonLd($: CheerioAPI): string | null {
  let result: string | null = null;

  $('script[type="application/ld+json"]').each((_, el) => {
    if (result) return; // Already found one

    try {
      const text = $(el).html();
      if (!text) return;

      const data = JSON.parse(text);

      // Handle @graph arrays
      const items = Array.isArray(data)
        ? data
        : data["@graph"]
          ? data["@graph"]
          : [data];

      for (const item of items) {
        if (item.name && typeof item.name === "string") {
          result = item.name.trim();
          return;
        }
        if (item.headline && typeof item.headline === "string") {
          result = item.headline.trim();
          return;
        }
      }
    } catch {
      // Invalid JSON-LD, skip
    }
  });

  return result;
}

/**
 * Clean title by removing common site name suffixes.
 * e.g. "Product Name | Store" -> "Product Name"
 * e.g. "Product Name - Company" -> "Product Name"
 */
function cleanTitle(title: string): string {
  // Remove patterns like " | Site Name", " - Site Name", " :: Site Name"
  const cleaned = title.replace(/\s*[|\-\u2013\u2014:]{1,2}\s*[^|\-\u2013\u2014:]+$/, "");
  return cleaned.trim() || title.trim();
}

function truncate(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= MAX_ENTITY_LENGTH) return cleaned;
  return cleaned.slice(0, MAX_ENTITY_LENGTH - 3).trim() + "...";
}
