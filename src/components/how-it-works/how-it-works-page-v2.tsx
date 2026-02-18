import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { PageHeader } from '@/components/page-header';
import { ProtocolPreview } from '@/components/protocol-preview';
import { FadeIn } from '@/components/fade-in';

const steps = [
  { key: 'request', number: 1 },
  { key: 'respond', number: 2 },
  { key: 'act', number: 3 },
] as const;

export function HowItWorksPageV2() {
  const t = useTranslations('how_it_works_page');

  return (
    <div className="min-h-screen bg-[#050a0e]">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[{ label: t('title') }]}
      />

      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-16">
        {/* Diagram: One page, two audiences */}
        <FadeIn>
          <div className="mx-auto max-w-2xl rounded-xl border border-slate-800 bg-[#0a0f1a] p-6 sm:p-8">
            <p className="mb-5 text-center text-sm font-medium text-slate-400">
              {t('diagram_label')}
            </p>

            <div className="space-y-3 font-mono text-sm">
              {/* Browser row */}
              <div className="flex items-center gap-3 rounded-lg bg-slate-800/40 px-4 py-3">
                <span className="shrink-0 text-slate-400">{t('diagram_browser')}</span>
                <span className="text-slate-600">&rarr;</span>
                <span className="text-slate-300">example.com/product</span>
                <span className="text-slate-600">&rarr;</span>
                <span className="font-semibold text-amber-400">HTML</span>
              </div>

              {/* AI Agent row */}
              <div className="flex items-center gap-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 px-4 py-3">
                <span className="shrink-0 text-emerald-400">{t('diagram_agent')}</span>
                <span className="text-slate-600">&rarr;</span>
                <span className="text-slate-300">example.com/product</span>
                <span className="text-slate-600">&rarr;</span>
                <span className="font-semibold text-emerald-400">MAKO</span>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-slate-500">
              {t('diagram_note')}
            </p>
          </div>
        </FadeIn>

        {/* Three expanded steps */}
        <div className="mt-16 space-y-12 sm:mt-20">
          {steps.map((step, i) => (
            <FadeIn key={step.key} delay={i * 120}>
              <div className="flex gap-5 sm:gap-6">
                {/* Step number */}
                <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-lg font-bold text-emerald-400 sm:h-12 sm:w-12">
                  {step.number}
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-white sm:text-xl">
                    {t(`step_${step.key}_title`)}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">
                    {t(`step_${step.key}_body`)}
                  </p>

                  {/* Bullet points */}
                  <ul className="mt-4 space-y-2">
                    {[1, 2, 3].map((n) => (
                      <li key={n} className="flex items-start gap-2 text-sm text-slate-400">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/50" />
                        {t(`step_${step.key}_point_${n}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* MAKO example (reuse ProtocolPreview) */}
        <div className="mt-16 sm:mt-20">
          <ProtocolPreview />
        </div>

        {/* Dual CTAs */}
        <FadeIn delay={300}>
          <div className="mt-16 flex flex-col items-center gap-4 sm:mt-20 sm:flex-row sm:justify-center">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-3 text-sm font-semibold text-white transition hover:border-emerald-500/30 hover:bg-slate-800"
            >
              {t('cta_spec')}
            </a>
            <Link
              href="/score"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              {t('cta_score')}
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
