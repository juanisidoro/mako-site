'use client';

import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

const NAV_ITEMS = [
  { slug: 'spec', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { slug: 'cef', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { slug: 'headers', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { slug: 'examples', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
] as const;

export function DocsSidebar() {
  const pathname = usePathname();
  const t = useTranslations('docs');

  return (
    <nav className="w-56 shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-1">
        <Link
          href="/docs"
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            pathname.endsWith('/docs')
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          {t('nav_overview')}
        </Link>

        <div className="pt-2">
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t('nav_reference')}
          </p>
          {NAV_ITEMS.map(({ slug, icon }) => {
            const isActive = pathname.includes(`/docs/${slug}`);
            return (
              <Link
                key={slug}
                href={`/docs/${slug}`}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon} />
                </svg>
                {t(`nav_${slug}`)}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
