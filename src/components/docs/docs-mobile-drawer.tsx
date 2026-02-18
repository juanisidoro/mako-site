'use client';

import { useState, useEffect } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config/site';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const NAV_ITEMS = [
  { slug: 'spec', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { slug: 'cef', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { slug: 'headers', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { slug: 'examples', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
] as const;

export function DocsMobileDrawer({ headings = [] }: { headings?: TocItem[] }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'nav' | 'toc'>('nav');
  const pathname = usePathname();
  const t = useTranslations('docs');

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const hasHeadings = headings.length > 0;

  return (
    <>
      {/* Floating button — visible below lg (no sidebar, no TOC) */}
      <button
        onClick={() => { setTab('nav'); setOpen(true); }}
        className="fixed bottom-5 right-5 z-40 flex lg:hidden h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-lg backdrop-blur-sm transition-all hover:bg-emerald-500/25 hover:scale-105"
        aria-label={t('on_this_page')}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>

      {/* lg to xl: sidebar visible but TOC hidden — show TOC-only button */}
      {hasHeadings && (
        <button
          onClick={() => { setTab('toc'); setOpen(true); }}
          className="fixed bottom-5 right-5 z-40 hidden lg:flex xl:hidden h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-lg backdrop-blur-sm transition-all hover:bg-emerald-500/25 hover:scale-105"
          aria-label={t('on_this_page')}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 10h16M4 14h10M4 18h7" />
          </svg>
        </button>
      )}

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '65vh' }}
      >
        <div className="rounded-t-2xl border-t border-slate-700/50 bg-[#0c1220] shadow-2xl flex flex-col" style={{ maxHeight: '65vh' }}>
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-slate-600" />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-4 pb-3">
            <button
              onClick={() => setTab('nav')}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                tab === 'nav'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('nav_reference')}
            </button>
            {hasHeadings && (
              <button
                onClick={() => setTab('toc')}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                  tab === 'toc'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('on_this_page')}
              </button>
            )}
          </div>

          {/* Content */}
          <div className="overflow-y-auto px-4 pb-6 flex-1">
            {tab === 'nav' ? (
              <nav className="space-y-1">
                <Link
                  href="/docs"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
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

                {NAV_ITEMS.map(({ slug, icon }) => {
                  const isActive = pathname.includes(`/docs/${slug}`);
                  return (
                    <Link
                      key={slug}
                      href={`/docs/${slug}`}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
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

                <div className="pt-3 mt-3 border-t border-slate-800/50">
                  <a
                    href={siteConfig.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    {t('nav_github')}
                    <span className="text-slate-600">↗</span>
                  </a>
                </div>
              </nav>
            ) : (
              <nav className="space-y-0.5">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                      heading.level === 3 ? 'pl-6' : ''
                    } text-slate-400 hover:text-white hover:bg-slate-800/50`}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
