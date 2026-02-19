/** Estimate reading time in minutes (avg 200 words/min) */
export function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export interface SlugIndex {
  /** "locale:slug" → folder name */
  [key: string]: string;
}

/**
 * Build an inverse index from "locale:slug" → folder name.
 * Used to resolve localized slugs back to the source folder.
 */
export function buildSlugIndex(
  folders: string[],
  getSlugsByLocale: (folder: string) => Record<string, string>
): SlugIndex {
  const index: SlugIndex = {};
  for (const folder of folders) {
    const slugs = getSlugsByLocale(folder);
    for (const [locale, slug] of Object.entries(slugs)) {
      index[`${locale}:${slug}`] = folder;
    }
  }
  return index;
}
