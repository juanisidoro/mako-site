'use client';

import { useTranslations } from 'next-intl';
import type { ScoreRecommendation } from '@/lib/scorer/types';

function getImpactColor(impact: number): string {
  if (impact >= 8) return 'text-red-400 bg-red-500/10 border-red-500/20';
  if (impact >= 5) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
}

function getImpactLabel(impact: number): string {
  if (impact >= 8) return 'High';
  if (impact >= 5) return 'Medium';
  return 'Low';
}

interface ScoreRecommendationsProps {
  recommendations: ScoreRecommendation[];
}

export function ScoreRecommendations({ recommendations }: ScoreRecommendationsProps) {
  const t = useTranslations('score');

  if (recommendations.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
        <div className="text-2xl mb-2">&#10024;</div>
        <p className="text-emerald-400 font-medium">{t('recommendations.perfect')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">{t('recommendations.subtitle')}</p>
      {recommendations.map((rec, i) => (
        <div
          key={rec.check}
          className="flex gap-3 rounded-lg border border-slate-800 bg-slate-900/30 p-4"
        >
          <div className="shrink-0 mt-0.5">
            <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase border ${getImpactColor(rec.impact)}`}>
              {getImpactLabel(rec.impact)}
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{rec.message}</p>
        </div>
      ))}
    </div>
  );
}
