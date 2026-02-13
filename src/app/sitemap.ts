import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { siteConfig } from '@/config/site';

// Add new routes here as you create pages
const routes = [
  '',
  '/analyzer',
  '/score',
  '/directory',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${siteConfig.baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteConfig.baseUrl}/${l}${route}`])
        ),
      },
    }))
  );
}
