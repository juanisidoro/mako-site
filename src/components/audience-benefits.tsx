import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { FadeIn } from './fade-in';

const audienceKeys = ['business', 'developer', 'ai_builder'] as const;

const tagColors: Record<string, string> = {
  business: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  developer: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  ai_builder: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
};

const ctaColors: Record<string, string> = {
  business: 'bg-amber-500 text-slate-950 hover:bg-amber-400 hover:shadow-amber-500/20',
  developer: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-emerald-500/20',
  ai_builder: 'bg-sky-500 text-slate-950 hover:bg-sky-400 hover:shadow-sky-500/20',
};

export function AudienceBenefits() {
  const t = useTranslations('audience');

  const links: Record<string, string> = {
    business: '/score',
    developer: siteConfig.github,
    ai_builder: siteConfig.npm,
  };

  const isExternal: Record<string, boolean> = {
    business: false,
    developer: true,
    ai_builder: true,
  };

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
          {audienceKeys.map((key, i) => (
            <FadeIn key={key} delay={i * 120}>
              <div className="group flex flex-col h-full rounded-xl border border-slate-800 bg-slate-900/30 p-6 transition hover:border-slate-700 hover:bg-slate-900/50">
                <span className={`inline-flex self-start rounded-full border px-3 py-1 text-xs font-medium ${tagColors[key]}`}>
                  {t(`${key}.tag`)}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {t(`${key}.title`)}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                  {t(`${key}.description`)}
                </p>
                {isExternal[key] ? (
                  <a
                    href={links[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-6 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition hover:shadow-lg ${ctaColors[key]}`}
                  >
                    {t(`${key}.cta`)}
                  </a>
                ) : (
                  <Link
                    href={links[key]}
                    className={`mt-6 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition hover:shadow-lg ${ctaColors[key]}`}
                  >
                    {t(`${key}.cta`)}
                  </Link>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
