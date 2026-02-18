'use client';

import { usePathname } from '@/i18n/routing';
import { siteConfig } from '@/config/site';

export function MakoLinkTag() {
  const pathname = usePathname();
  const href = `${siteConfig.baseUrl}/api/mako?path=${pathname}`;

  return (
    <link
      rel="alternate"
      type="text/mako+markdown"
      href={href}
    />
  );
}
