import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { siteConfig } from '@/config/site';
import { getAllPostsMeta } from '@/lib/blog';

// Static routes
const routes = [
  '',
  '/how-it-works',
  '/analyzer',
  '/score',
  '/directory',
  '/blog',
  '/docs',
  '/docs/spec',
  '/docs/cef',
  '/docs/headers',
  '/docs/examples',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${siteConfig.baseUrl}/${locale}${route}`,
      lastModified: new Date('2026-02-19'),
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteConfig.baseUrl}/${l}${route}`])
        ),
      },
    }))
  );

  // Blog posts with localized slugs
  const posts = getAllPostsMeta('en');
  const blogEntries = posts.flatMap((post) =>
    locales.map((locale) => {
      const slug = post.slugsByLocale[locale] ?? post.folder;
      return {
        url: `${siteConfig.baseUrl}/${locale}/blog/${slug}`,
        lastModified: new Date(post.updated ?? post.date),
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l,
              `${siteConfig.baseUrl}/${l}/blog/${post.slugsByLocale[l] ?? post.folder}`,
            ])
          ),
        },
      };
    })
  );

  return [...staticEntries, ...blogEntries];
}
