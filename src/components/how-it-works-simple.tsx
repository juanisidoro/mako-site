import { useTranslations } from 'next-intl';
import { FadeIn } from './fade-in';

const steps = [
  { key: 'request', number: 1 },
  { key: 'respond', number: 2 },
  { key: 'act', number: 3 },
] as const;

export function HowItWorksSimple() {
  const t = useTranslations('how_it_works_simple');

  return (
    <section className="relative border-t border-slate-800/50">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t('title')}
            </h2>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <FadeIn key={step.key} delay={i * 150}>
              <div className="relative text-center">
                {/* Step number */}
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-lg font-bold text-emerald-400">
                  {step.number}
                </div>

                {/* Connector line (desktop only, between steps) */}
                {i < steps.length - 1 && (
                  <div className="absolute top-6 left-[calc(50%+28px)] hidden w-[calc(100%-56px)] border-t border-dashed border-slate-700 sm:block" />
                )}

                <h3 className="text-base font-semibold text-white">
                  {t(`step_${step.key}_title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {t(`step_${step.key}_desc`)}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={500}>
          <p className="mt-12 text-center text-sm text-slate-500">
            {t('tagline')}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
