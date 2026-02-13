import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config/site';

export function CtaSection() {
  const t = useTranslations('cta');

  return (
    <section className="border-t border-slate-800/50">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-8 py-10">
          <h2 className="text-2xl font-bold text-white">
            {t('title')}
          </h2>
          <p className="mt-3 text-slate-400">
            {t('description')}
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              {t('primary_button')}
            </a>
            <a
              href={siteConfig.npm}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 hover:border-slate-600"
            >
              {t('secondary_button')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
