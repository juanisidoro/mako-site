'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FadeIn } from './fade-in';

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 1000;
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

export function ProblemProof() {
  const t = useTranslations('problem_proof');

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

        {/* Two cards: noise vs void */}
        <FadeIn delay={200}>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
            {/* Content-rich sites */}
            <div className="relative rounded-2xl border border-red-500/20 bg-red-500/5 px-8 py-8 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-red-400/70 mb-4">
                {t('card_traditional_label')}
              </p>
              <div className="text-5xl sm:text-6xl font-bold text-red-400 font-mono tracking-tighter">
                {t('card_traditional_value')}
              </div>
              <p className="mt-3 text-sm text-slate-400 max-w-xs mx-auto">
                {t('card_traditional_detail')}
              </p>
            </div>

            {/* JavaScript apps */}
            <div className="relative rounded-2xl border border-red-500/20 bg-red-500/5 px-8 py-8 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-red-400/70 mb-4">
                {t('card_spa_label')}
              </p>
              <div className="text-5xl sm:text-6xl font-bold text-red-400 font-mono tracking-tighter">
                {t('card_spa_value')}
              </div>
              <p className="mt-3 text-sm text-slate-400 max-w-xs mx-auto">
                {t('card_spa_detail')}
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Resolution text */}
        <FadeIn delay={300}>
          <p className="mt-10 text-center text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('resolution')}
          </p>
        </FadeIn>

        {/* Token proof — secondary, understated */}
        <FadeIn delay={400}>
          <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-bold text-slate-400">
                <AnimatedNumber target={4125} />
              </span>
              <span className="text-xs text-slate-500">{t('tokens_html')}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 text-emerald-500 shrink-0">
              <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L8.22 4.03a.75.75 0 011.06-1.06l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06-1.06l3.22-3.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
            </svg>
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-bold text-emerald-400">
                <AnimatedNumber target={276} />
              </span>
              <span className="text-xs text-slate-500">{t('tokens_mako')}</span>
            </div>
            <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <AnimatedNumber target={93} suffix="%" /> {t('fewer')}
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
