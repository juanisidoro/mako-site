import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config/site';
import { FadeIn } from './fade-in';

export function Ecosystem() {
  const t = useTranslations('ecosystem');

  const items = [
    {
      key: 'spec',
      href: siteConfig.github,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
    {
      key: 'js',
      href: siteConfig.npm,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      ),
    },
    {
      key: 'cli',
      href: '#',
      badge: t('cli_badge'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative border-t border-slate-800/50">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-4 text-slate-400">{t('subtitle')}</p>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {items.map((item, i) => (
            <FadeIn key={item.key} delay={i * 120}>
              <a
                href={item.href}
                target={item.badge ? undefined : '_blank'}
                rel={item.badge ? undefined : 'noopener noreferrer'}
                className={`group block rounded-xl border border-slate-800 bg-slate-900/30 p-6 transition hover:border-emerald-500/30 hover:bg-slate-900/50 ${item.badge ? 'pointer-events-none opacity-60' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex rounded-lg bg-emerald-500/10 p-2.5 text-emerald-400">
                    {item.icon}
                  </div>
                  {item.badge && (
                    <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs text-slate-400">
                      {item.badge}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {t(`${item.key}_title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {t(`${item.key}_desc`)}
                </p>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
