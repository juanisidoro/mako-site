'use client';

import { useTranslations } from 'next-intl';
import { useRef, useEffect, useState } from 'react';

function AnimatedStat({ target, suffix = '' }: { target: number; suffix?: string }) {
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

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

interface StatsBannerProps {
  stats: {
    total: number;
    avgSavings: number;
    domains: number;
  };
}

export function StatsBanner({ stats }: StatsBannerProps) {
  const t = useTranslations('directory');

  const items = [
    {
      label: t('stats.total_analyses'),
      value: stats.total,
      suffix: '',
    },
    {
      label: t('stats.avg_savings'),
      value: Math.round(stats.avgSavings),
      suffix: '%',
    },
    {
      label: t('stats.unique_domains'),
      value: stats.domains,
      suffix: '',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 text-center hover:border-emerald-500/30 transition"
        >
          <p className="text-3xl font-bold text-emerald-400 font-mono">
            <AnimatedStat target={item.value} suffix={item.suffix} />
          </p>
          <p className="mt-2 text-sm text-slate-400">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
