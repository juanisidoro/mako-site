import { useTranslations } from 'next-intl';
import { FadeIn } from './fade-in';

export function WhatIsMako() {
  const t = useTranslations('what_is_mako');

  return (
    <section className="relative border-t border-slate-800/50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,214,160,0.04)_0%,_transparent_60%)]" />

      <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-base leading-relaxed text-slate-400 sm:text-lg">
              {t('body_1')}
            </p>
          </div>
        </FadeIn>

        {/* Diagram: two audiences, same URL */}
        <FadeIn delay={200}>
          <div className="mt-14 max-w-xl mx-auto">
            <div className="rounded-xl border border-slate-800 bg-[#0a0f1a] overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                </div>
                <span className="ml-2 font-mono text-xs text-slate-500">{t('diagram_title')}</span>
              </div>
              <div className="p-5 font-mono text-sm leading-8">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-400">Browser</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-sky-400">example.com/product</span>
                  <span className="text-slate-600">→</span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">HTML</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-emerald-400">AI Agent</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-sky-400">example.com/product</span>
                  <span className="text-slate-600">→</span>
                  <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-400">MAKO</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={400}>
          <p className="mt-8 text-center text-sm text-slate-500">
            {t('tagline')}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
