'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ContentTypeBadge } from './content-type-badge';

function useAnimatedNumber(target: number) {
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

  return { value, ref };
}

interface TokenComparisonProps {
  htmlTokens: number;
  makoTokens: number;
  savingsPercent: number;
  contentType: string;
  entity: string;
  summary: string;
}

export function TokenComparison({
  htmlTokens,
  makoTokens,
  savingsPercent,
  contentType,
  entity,
  summary,
}: TokenComparisonProps) {
  const t = useTranslations('analyzer');
  const htmlCount = useAnimatedNumber(htmlTokens);
  const makoCount = useAnimatedNumber(makoTokens);
  const savingsCount = useAnimatedNumber(Math.round(savingsPercent));

  const makoBarPercent = htmlTokens > 0 ? (makoTokens / htmlTokens) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Big savings number */}
      <div className="text-center">
        <div className="text-6xl sm:text-7xl font-bold gradient-text tracking-tighter">
          <span ref={savingsCount.ref}>{savingsCount.value}%</span>
        </div>
        <p className="mt-2 text-lg text-slate-400">{t('results.savings')}</p>
      </div>

      {/* Token bars */}
      <div className="space-y-5">
        {/* HTML bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">
              {t('results.html_tokens')}
            </span>
            <span className="font-mono text-sm font-semibold text-slate-300" ref={htmlCount.ref}>
              {htmlCount.value.toLocaleString()}
            </span>
          </div>
          <div className="h-10 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
            <div
              className="h-full rounded-lg bar-animate bg-orange-500/80"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* MAKO bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-400">
              {t('results.mako_tokens')}
            </span>
            <span className="font-mono text-sm font-semibold text-emerald-400" ref={makoCount.ref}>
              {makoCount.value.toLocaleString()}
            </span>
          </div>
          <div className="h-10 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
            <div
              className="h-full rounded-lg bar-animate bg-emerald-500 pulse-glow"
              style={{ width: `${Math.max(makoBarPercent, 3)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Content type */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
            {t('results.content_type')}
          </p>
          <ContentTypeBadge contentType={contentType} />
        </div>

        {/* Entity */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
            {t('results.entity')}
          </p>
          <p className="text-sm font-medium text-white truncate">{entity}</p>
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 sm:col-span-1">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
            {t('results.summary')}
          </p>
          <p className="text-sm text-slate-300 line-clamp-3">{summary}</p>
        </div>
      </div>
    </div>
  );
}
