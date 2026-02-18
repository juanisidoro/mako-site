import { useTranslations } from 'next-intl';
import { FadeIn } from './fade-in';

const effects = [
  {
    key: 'visibility',
    color: 'border-amber-500/20 bg-amber-500/5',
    accent: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
  },
  {
    key: 'simplicity',
    color: 'border-emerald-500/20 bg-emerald-500/5',
    accent: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
  },
  {
    key: 'determinism',
    color: 'border-sky-500/20 bg-sky-500/5',
    accent: 'text-sky-400',
    iconBg: 'bg-sky-500/10',
  },
] as const;

export function AudienceImpact() {
  const t = useTranslations('audience_impact');

  return (
    <section id="features" className="relative border-t border-slate-800/50">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-4 text-slate-400">{t('subtitle')}</p>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {effects.map((effect, i) => (
            <FadeIn key={effect.key} delay={i * 120}>
              <div className={`flex flex-col h-full rounded-xl border ${effect.color} p-6`}>
                <h3 className={`text-lg font-semibold ${effect.accent}`}>
                  {t(`${effect.key}_title`)}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                  {t(`${effect.key}_desc`)}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
