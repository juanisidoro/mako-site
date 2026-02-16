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
          <div className="mt-12 flex justify-center">
            <div className="relative rounded-2xl border border-red-500/20 bg-red-500/5 px-10 py-8 text-center">
              <div className="text-6xl sm:text-7xl font-bold text-red-400 font-mono tracking-tighter">
                {t('stat_value')}
              </div>
              <p className="mt-3 text-sm text-slate-400 max-w-xs">
                {t('stat_label')}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {t('stat_detail')}
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
