import { useTranslations } from 'next-intl';
import { FadeIn } from './fade-in';

const stepIcons = [
  // HEAD request icon
  <svg key="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25" />
  </svg>,
  // Check relevance icon
  <svg key="2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
  </svg>,
  // GET content icon
  <svg key="3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>,
];

export function HowItWorks() {
  const t = useTranslations('how_it_works');

  const steps = [
    { title: t('step1_title'), desc: t('step1_desc'), code: t('step1_code') },
    { title: t('step2_title'), desc: t('step2_desc'), code: t('step2_code') },
    { title: t('step3_title'), desc: t('step3_desc'), code: t('step3_code') },
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

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {steps.map((step, i) => (
            <FadeIn key={i} delay={i * 150}>
              <div className="group relative rounded-xl border border-slate-800 bg-slate-900/30 p-6 transition hover:border-emerald-500/30 hover:bg-slate-900/50">
                {/* Step number */}
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 transition group-hover:bg-emerald-500/20">
                  {stepIcons[i]}
                </div>

                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.desc}</p>

                {/* Code snippet */}
                <div className="mt-4 rounded-lg bg-slate-950/60 border border-slate-800/50 px-4 py-3">
                  <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap break-all">
                    {step.code}
                  </pre>
                </div>

                {/* Connector line (desktop only) */}
                {i < 2 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 w-8 border-t border-dashed border-slate-700" />
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
