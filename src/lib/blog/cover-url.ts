import crypto from 'crypto';
import type { BlogMeta } from './types';

const SECRET = process.env.COVER_HMAC_SECRET || 'mako-cover-k7x9p2';

/** Build a canonical payload string from post data for HMAC signing. */
function buildPayload(
  title: string,
  tags: string,
  author: string,
  date: string,
  time: string,
): string {
  return [title, tags, author, date, time].join('|');
}

/** Compute HMAC-SHA256 signature (first 16 hex chars). */
function sign(payload: string): string {
  return crypto
    .createHmac('sha256', SECRET)
    .update(payload)
    .digest('hex')
    .slice(0, 16);
}

/** Build the API URL for a dynamically generated blog cover image. */
export function buildCoverUrl(post: BlogMeta): string {
  if (post.cover) return post.cover;
  const tags = post.tags.join(',');
  const time = String(post.readingTime);
  const sig = sign(buildPayload(post.title, tags, post.author, post.date, time));
  const params = new URLSearchParams({
    title: post.title,
    tags,
    author: post.author,
    date: post.date,
    time,
    sig,
  });
  return `/api/blog/cover?${params.toString()}`;
}
