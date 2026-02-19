import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import matter from 'gray-matter';
import { locales, defaultLocale } from '@/i18n/config';
import type { BlogConfig, BlogMeta, BlogPost } from './types';
import { estimateReadingTime, buildSlugIndex, type SlugIndex } from './utils';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function readConfig(folder: string): BlogConfig | null {
  const configPath = path.join(BLOG_DIR, folder, 'config.yaml');
  if (!fs.existsSync(configPath)) return null;
  const raw = fs.readFileSync(configPath, 'utf-8');
  const config = yaml.load(raw) as BlogConfig;
  // Defaults
  config.draft = config.draft ?? false;
  config.seo = config.seo ?? { schema: 'BlogPosting', og_type: 'article', twitter_card: 'summary_large_image' };
  config.slugs = config.slugs ?? {};
  config.tags = config.tags ?? [];
  return config;
}

function readMarkdown(folder: string, locale: string): { title: string; description: string; content: string } | null {
  // Try requested locale, fallback to default
  const tryLocales = locale === defaultLocale ? [locale] : [locale, defaultLocale];
  for (const loc of tryLocales) {
    const mdPath = path.join(BLOG_DIR, folder, `${loc}.md`);
    if (fs.existsSync(mdPath)) {
      const raw = fs.readFileSync(mdPath, 'utf-8');
      const { data, content } = matter(raw);
      return {
        title: data.title ?? folder,
        description: data.description ?? '',
        content: content.trim(),
      };
    }
  }
  return null;
}

/** Get the slug for a given locale, falling back to the folder name */
function getSlugForLocale(config: BlogConfig, folder: string, locale: string): string {
  return config.slugs[locale] ?? folder;
}

/** Build the full slugsByLocale map (all locales) */
function buildSlugsByLocale(config: BlogConfig, folder: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const locale of locales) {
    map[locale] = getSlugForLocale(config, folder, locale);
  }
  return map;
}

// ---------------------------------------------------------------------------
// Cached slug index (built once per process)
// ---------------------------------------------------------------------------

let cachedIndex: SlugIndex | null = null;
let cachedFolders: string[] | null = null;

function getFolders(): string[] {
  if (cachedFolders) return cachedFolders;
  if (!fs.existsSync(BLOG_DIR)) {
    cachedFolders = [];
    return cachedFolders;
  }
  cachedFolders = fs
    .readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  return cachedFolders;
}

function getIndex(): SlugIndex {
  if (cachedIndex) return cachedIndex;
  const folders = getFolders();
  cachedIndex = buildSlugIndex(folders, (folder) => {
    const config = readConfig(folder);
    if (!config) return {};
    return buildSlugsByLocale(config, folder);
  });
  return cachedIndex;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Resolve a localized slug to its folder name */
export function resolveSlug(slug: string, locale: string): string | null {
  const index = getIndex();
  return index[`${locale}:${slug}`] ?? index[`${defaultLocale}:${slug}`] ?? null;
}

/** Get all post metadata for a locale, sorted by date descending */
export function getAllPostsMeta(locale: string): BlogMeta[] {
  const folders = getFolders();
  const posts: BlogMeta[] = [];

  for (const folder of folders) {
    const config = readConfig(folder);
    if (!config || config.draft) continue;

    const md = readMarkdown(folder, locale);
    if (!md) continue;

    const slugsByLocale = buildSlugsByLocale(config, folder);

    posts.push({
      folder,
      slug: slugsByLocale[locale] ?? folder,
      title: md.title,
      description: md.description,
      date: config.date,
      updated: config.updated,
      author: config.author,
      tags: config.tags,
      cover: config.cover,
      readingTime: estimateReadingTime(md.content),
      locale,
      seo: config.seo,
      slugsByLocale,
    });
  }

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

/** Get a full blog post by slug and locale */
export function getPost(slug: string, locale: string): BlogPost | null {
  const folder = resolveSlug(slug, locale);
  if (!folder) return null;

  const config = readConfig(folder);
  if (!config || config.draft) return null;

  const md = readMarkdown(folder, locale);
  if (!md) return null;

  const slugsByLocale = buildSlugsByLocale(config, folder);

  return {
    folder,
    slug: slugsByLocale[locale] ?? folder,
    title: md.title,
    description: md.description,
    date: config.date,
    updated: config.updated,
    author: config.author,
    tags: config.tags,
    cover: config.cover,
    readingTime: estimateReadingTime(md.content),
    locale,
    seo: config.seo,
    slugsByLocale,
    content: md.content,
  };
}

/** Get all possible slug params for generateStaticParams */
export function getPostSlugs(): { slug: string }[] {
  const index = getIndex();
  const slugs = new Set<string>();
  for (const key of Object.keys(index)) {
    const slug = key.split(':')[1];
    slugs.add(slug);
  }
  return Array.from(slugs).map((slug) => ({ slug }));
}
