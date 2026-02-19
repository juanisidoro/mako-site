import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { LanguageSwitcher } from './language-switcher';

export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  return (
    <footer className="border-t border-slate-800/50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Internal nav links */}
        <nav className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Footer">
          <Link href="/how-it-works" className="text-sm text-slate-500 transition hover:text-slate-300">
            {nav('how_it_works')}
          </Link>
          <Link href="/analyzer" className="text-sm text-slate-500 transition hover:text-slate-300">
            {nav('analyzer')}
          </Link>
          <Link href="/score" className="text-sm text-slate-500 transition hover:text-slate-300">
            {nav('score')}
          </Link>
          <Link href="/directory" className="text-sm text-slate-500 transition hover:text-slate-300">
            {nav('directory')}
          </Link>
          <Link href="/blog" className="text-sm text-slate-500 transition hover:text-slate-300">
            {nav('blog')}
          </Link>
          <Link href="/docs" className="text-sm text-slate-500 transition hover:text-slate-300">
            {nav('docs')}
          </Link>
        </nav>

        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Logo + info */}
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-bold">
              M
            </div>
            <div className="text-center sm:text-left">
              <span className="font-semibold text-white">{siteConfig.name}</span>
              <span className="ml-2 text-sm text-slate-500">{t('mit')}</span>
            </div>
          </div>

          {/* Links + language */}
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 transition hover:text-white"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-5 w-5">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
            {siteConfig.npm && (
              <a
                href={siteConfig.npm}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition hover:text-white"
                aria-label="npm"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323h13.837v13.286H16.08V8.21h-3.5v10.4H5.13z" />
                </svg>
              </a>
            )}
            <div className="h-5 w-px bg-slate-800" />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
