import { useTranslations } from 'next-intl';
import { FadeIn } from './fade-in';

export function Problem() {
  const t = useTranslations('problem');

  return (
    <section className="relative border-t border-slate-800/50">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-slate-400 leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
            {/* Traditional site: noisy HTML */}
            <div className="relative rounded-2xl border border-red-500/20 bg-red-500/5 px-8 py-8 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-red-400/70 mb-4">
                {t('stat_traditional_label')}
              </p>
              <div className="text-5xl sm:text-6xl font-bold text-red-400 font-mono tracking-tighter">
                {t('stat_value')}
              </div>
              <p className="mt-3 text-sm text-slate-400 max-w-xs mx-auto">
                {t('stat_label')}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {t('stat_detail')}
              </p>
            </div>

            {/* SPA: empty div */}
            <div className="relative rounded-2xl border border-red-500/20 bg-red-500/5 px-8 py-8 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-red-400/70 mb-4">
                {t('stat_spa_label')}
              </p>
              <div className="text-5xl sm:text-6xl font-bold text-red-400 font-mono tracking-tighter">
                {t('stat_spa_value')}
              </div>
              <p className="mt-3 text-sm text-slate-400 max-w-xs mx-auto">
                {t('stat_spa_detail')}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {t('stat_spa_subdetail')}
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={400}>
          <p className="mt-8 text-center text-sm text-slate-500 max-w-lg mx-auto">
            {t('paradox')}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
