'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { siteConfig } from '@/config/site';

export function Header() {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-[#050a0e]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-bold">
            M
          </div>
          <span className="text-sm font-semibold text-white">{siteConfig.name}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 sm:flex">
          <a
            href="#features"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            Features
          </a>
          <Link
            href="/analyzer"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            {t('analyzer')}
          </Link>
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white"
          >
            {t('spec')}
          </a>
          <a
            href={siteConfig.npm}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white"
          >
            {t('npm')}
          </a>
          <a
            href={siteConfig.githubJs}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {t('github')}
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden text-slate-400 hover:text-white"
          aria-label={t('menu')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-slate-800/50 px-6 py-4 sm:hidden">
          <div className="flex flex-col gap-3">
            <a href="#features" className="text-sm text-slate-400" onClick={() => setOpen(false)}>
              Features
            </a>
            <Link
              href="/analyzer"
              className="text-sm text-slate-400"
              onClick={() => setOpen(false)}
            >
              {t('analyzer')}
            </Link>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-400"
            >
              {t('spec')} ↗
            </a>
            <a
              href={siteConfig.npm}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-400"
            >
              {t('npm')} ↗
            </a>
            <a
              href={siteConfig.githubJs}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-400"
            >
              {t('github')} ↗
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
