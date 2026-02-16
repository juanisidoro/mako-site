'use client';

import { useTranslations, useLocale } from 'next-intl';
import type { ScoreResult } from '@/lib/scorer/types';
import { siteConfig } from '@/config/site';
import { ScoreCard } from '@/components/score/score-card';
import { CategoryBreakdown } from '@/components/score/category-breakdown';

interface PreviewContentProps {
  result: ScoreResult;
}

export function PreviewContent({ result }: PreviewContentProps) {
  const t = useTranslations('score');
  const locale = useLocale();

  const gradeKey = result.grade === 'A+' ? 'A_plus' : result.grade;
  const gradeTitle = t.has(`grades.${gradeKey}.title`) ? t(`grades.${gradeKey}.title`) : result.gradeInfo.title;
  const gradeDescription = t.has(`grades.${gradeKey}.description`) ? t(`grades.${gradeKey}.description`) : result.gradeInfo.description;

  return (
    <div className="space-y-8">
      <ScoreCard result={result} />

      {/* Grade narrative */}
      <div className="rounded-xl border border-slate-700/50 bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-6">
        <div className="flex items-start gap-4">
          <div className={`shrink-0 flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${
            result.totalScore >= 80 ? 'bg-emerald-500/15 text-emerald-400' :
            result.totalScore >= 60 ? 'bg-sky-500/15 text-sky-400' :
            result.totalScore >= 40 ? 'bg-amber-500/15 text-amber-400' :
            'bg-red-500/15 text-red-400'
          }`}>
            {result.grade}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{gradeTitle}</h3>
            <p className="mt-1 text-sm text-slate-400 leading-relaxed">{gradeDescription}</p>
          </div>
        </div>
      </div>

      <CategoryBreakdown categories={result.categories} />

      {/* CTA to score your own */}
      <div className="text-center">
        <a
          href={`/${locale}/score`}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          {t('share.cta_check_yours')}
        </a>
      </div>

      {/* Branding */}
      <p className="text-xs text-slate-600 text-center">
        {t('about')}
      </p>
    </div>
  );
}
