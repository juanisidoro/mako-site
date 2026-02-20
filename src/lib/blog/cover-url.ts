import type { BlogMeta } from './types';

const CJK_LOCALES = new Set(['zh', 'ja']);

/** Return the cover image URL for a blog post (static pre-generated PNG). */
export function buildCoverUrl(post: BlogMeta): string {
  if (post.cover) return post.cover;
  const slug = CJK_LOCALES.has(post.locale) ? post.folder : post.slug;
  return `/covers/${slug}.png`;
}
