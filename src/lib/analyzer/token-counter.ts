/**
 * Approximate token counter for text content.
 *
 * Uses two heuristics and returns the maximum:
 * 1. Word count * 1.3 (average tokens per English word)
 * 2. Character count / 4 (fallback for non-English or dense text)
 */
export function countTokens(text: string): number {
  if (!text || text.trim().length === 0) return 0;

  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordBasedEstimate = Math.ceil(words.length * 1.3);
  const charBasedEstimate = Math.ceil(text.length / 4);

  return Math.max(wordBasedEstimate, charBasedEstimate);
}

/**
 * Count tokens for raw HTML including all tags and attributes.
 * This gives a rough measure of how "heavy" the original HTML is.
 */
export function countHtmlTokens(html: string): number {
  if (!html || html.trim().length === 0) return 0;

  const words = html.trim().split(/\s+/).filter(Boolean);
  const wordBasedEstimate = Math.ceil(words.length * 1.3);
  const charBasedEstimate = Math.ceil(html.length / 4);

  return Math.max(wordBasedEstimate, charBasedEstimate);
}
