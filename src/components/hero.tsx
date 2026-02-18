import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative overflow-hidden min-h-[calc(100svh-53px)] sm:min-h-0 flex flex-col">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(6,214,160,0.07)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(56,189,248,0.05)_0%,_transparent_40%)]" />

      <div className="relative mx-auto max-w-5xl px-6 py-8 flex-1 flex flex-col justify-center sm:flex-none sm:py-0 sm:pt-32 sm:pb-28">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-5 sm:mb-8 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t('badge')}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="gradient-text">{t('title_line1')}</span>
            <br />
            <span className="text-white">{t('title_line2')}</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#get-started"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
              </svg>
              {t('cta_score')}
            </a>
            <Link
              href="/score"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 hover:border-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638l-3.96-3.96a.75.75 0 111.06-1.06l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06l3.96-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
              {t('cta_spec')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
