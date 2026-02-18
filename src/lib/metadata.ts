import { locales } from '@/i18n/config';
import { siteConfig } from '@/config/site';

export function generateAlternates(locale: string, path: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${siteConfig.baseUrl}/${l}${path}`;
  }
  languages['x-default'] = `${siteConfig.baseUrl}/en${path}`;

  return {
    canonical: `${siteConfig.baseUrl}/${locale}${path}`,
    languages,
    types: {
      'text/mako+markdown': `${siteConfig.baseUrl}/api/mako?path=${path}`,
    },
  };
}
