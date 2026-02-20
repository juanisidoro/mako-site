import type { BlogMeta } from './types';

/** Build the API URL for a dynamically generated blog cover image. */
export function buildCoverUrl(post: BlogMeta): string {
  if (post.cover) return post.cover;
  const params = new URLSearchParams({
    title: post.title,
    tags: post.tags.join(','),
    author: post.author,
    date: post.date,
    time: String(post.readingTime),
  });
  return `/api/blog/cover?${params.toString()}`;
}
