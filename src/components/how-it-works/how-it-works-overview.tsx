'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { FadeIn } from '../fade-in';

const layers = [
  { key: 'discovery', number: 1 },
  { key: 'prefilter', number: 2 },
  { key: 'content', number: 3 },
  { key: 'navigation', number: 4 },
  { key: 'action', number: 5 },
  { key: 'cache', number: 6 },
] as const;

export function HowItWorksOverview() {
  const t = useTranslations('how_it_works');

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

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {layers.map((layer, i) => (
            <FadeIn key={layer.key} delay={i * 100}>
              <div className="group relative rounded-xl border border-slate-800 bg-slate-900/30 p-5 transition hover:border-emerald-500/30 hover:bg-slate-900/50">
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-sm font-bold text-emerald-400 transition group-hover:bg-emerald-500/20">
                  {layer.number}
                </div>
                <h3 className="text-base font-semibold text-white">
                  {t(`layer_${layer.key}_title`)}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                  {t(`layer_${layer.key}_desc`)}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={600}>
          <div className="mt-12 text-center">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20"
            >
              {t('cta_learn_more')}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
