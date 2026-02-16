'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 1200;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}

export function Benchmark() {
  const t = useTranslations('benchmark');

  const bars = [
    { label: t('html_label'), tokens: 4125, percent: 100, color: 'bg-slate-600' },
    { label: t('cf_label'), tokens: 1690, percent: 41, color: 'bg-slate-500' },
    { label: t('mako_label'), tokens: 276, percent: 6.7, color: 'bg-emerald-500' },
  ];

  return (
    <section className="relative border-t border-slate-800/50">
      {/* Subtle glow behind */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,214,160,0.04)_0%,_transparent_60%)]" />

      <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-slate-400">{t('subtitle')}</p>
        </div>

        {/* Before / After cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {/* Before */}
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
            <p className="text-sm font-medium text-red-400 uppercase tracking-wider">{t('before_title')}</p>
            <div className="mt-3 text-4xl sm:text-5xl font-bold text-red-400 font-mono">{t('before_size')}</div>
            <p className="mt-2 text-sm text-slate-500">{t('before_tokens')}</p>
          </div>
          {/* After */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
            <p className="text-sm font-medium text-emerald-400 uppercase tracking-wider">{t('after_title')}</p>
            <div className="mt-3 text-4xl sm:text-5xl font-bold text-emerald-400 font-mono">{t('after_size')}</div>
            <p className="mt-2 text-sm text-slate-500">{t('after_tokens')}</p>
          </div>
        </div>

        {/* Big number — connecting result */}
        <div className="mt-12 flex flex-col items-center">
          <div className="text-7xl sm:text-8xl lg:text-9xl font-bold gradient-text tracking-tighter">
            <AnimatedNumber target={93} suffix="%" />
          </div>
          <p className="mt-2 text-lg text-slate-400">{t('result_label')}</p>
        </div>

        {/* Bars */}
        <div className="mt-16 space-y-6">
          {bars.map((bar, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-32 sm:w-40 text-right">
                <span className={`text-sm font-medium ${i === 2 ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {bar.label}
                </span>
              </div>
              <div className="flex-1 h-10 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-lg bar-animate ${bar.color} ${i === 2 ? 'pulse-glow' : ''}`}
                  style={{ width: `${bar.percent}%` }}
                />
              </div>
              <div className="w-20 sm:w-24">
                <span className={`font-mono text-sm font-semibold ${i === 2 ? 'text-emerald-400' : 'text-slate-300'}`}>
                  <AnimatedNumber target={bar.tokens} />
                </span>
                <span className="text-xs text-slate-500 ml-1">tok</span>
              </div>
            </div>
          ))}
        </div>

        {/* CEF stat */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 px-6 py-3">
            <span className="text-2xl font-bold text-sky-400 font-mono">
              <AnimatedNumber target={470} />
            </span>
            <span className="text-sm text-slate-400">{t('embedding_label')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
