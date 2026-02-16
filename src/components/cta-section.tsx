import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config/site';
import { CopyButton } from './copy-button';

export function CtaSection() {
  const t = useTranslations('cta');

  return (
    <section className="border-t border-slate-800/50">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-10 sm:px-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {t('title')}
            </h2>
            <p className="mt-3 text-slate-400">
              {t('description')}
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {/* WordPress */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-5 text-center">
              <h3 className="text-lg font-semibold text-white">{t('wp_title')}</h3>
              <p className="mt-2 text-sm text-slate-400">{t('wp_description')}</p>
              <a
                href={siteConfig.githubWp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
              >
                {t('wp_button')}
              </a>
            </div>

            {/* Developer */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-5 text-center">
              <h3 className="text-lg font-semibold text-white">{t('dev_title')}</h3>
              <p className="mt-2 text-sm text-slate-400">{t('dev_description')}</p>
              <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-slate-700/50 bg-slate-950/60 px-4 py-2.5">
                <code className="font-mono text-xs text-emerald-400">{t('dev_install')}</code>
                <CopyButton text={t('dev_install')} />
              </div>
            </div>

            {/* AI Builder */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-5 text-center">
              <h3 className="text-lg font-semibold text-white">{t('ai_title')}</h3>
              <p className="mt-2 text-sm text-slate-400">{t('ai_description')}</p>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-800/50 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 hover:border-slate-500"
              >
                {t('ai_button')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
