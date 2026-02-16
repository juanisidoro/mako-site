'use client';

import { useTranslations } from 'next-intl';
import type { ScoreRecommendation } from '@/lib/scorer/types';

function getImpactColor(impact: number): string {
  if (impact >= 8) return 'text-red-400 bg-red-500/10 border-red-500/20';
  if (impact >= 5) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
}

const CATEGORY_LABEL_COLORS: Record<string, string> = {
  discoverable: 'text-emerald-400/70 bg-emerald-500/5',
  readable: 'text-sky-400/70 bg-sky-500/5',
  trustworthy: 'text-violet-400/70 bg-violet-500/5',
  actionable: 'text-amber-400/70 bg-amber-500/5',
};

interface ScoreRecommendationsProps {
  recommendations: ScoreRecommendation[];
  mode: 'business' | 'developer';
}

export function ScoreRecommendations({ recommendations, mode }: ScoreRecommendationsProps) {
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
      {mode === 'developer' && (
        <p className="text-sm text-slate-500">{t('recommendations.subtitle')}</p>
      )}
      {recommendations.map((rec) => {
        const catColor = CATEGORY_LABEL_COLORS[rec.category] || 'text-slate-400/70 bg-slate-500/5';
        const impactLabel = rec.impact >= 8
          ? t('impact.high')
          : rec.impact >= 5
            ? t('impact.medium')
            : t('impact.low');
        const catLabel = t.has(`categories.${rec.category}.name`)
          ? t(`categories.${rec.category}.name`)
          : rec.category;

        // Use translated recommendation if available, fallback to API-returned message
        const message = mode === 'business'
          ? (t.has(`rec.${rec.check}.businessMessage`) ? t(`rec.${rec.check}.businessMessage`) : rec.businessMessage)
          : (t.has(`rec.${rec.check}.message`) ? t(`rec.${rec.check}.message`) : rec.message);

        return (
          <div
            key={rec.check}
            className="flex gap-3 rounded-lg border border-slate-800 bg-slate-900/30 p-4"
          >
            <div className="shrink-0 mt-0.5 flex flex-col items-center gap-1.5">
              <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase border ${getImpactColor(rec.impact)}`}>
                {impactLabel}
              </span>
              {mode === 'developer' && (
                <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${catColor}`}>
                  {catLabel}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-300 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
