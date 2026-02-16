'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ScoreCategory } from '@/lib/scorer/types';

const CATEGORY_COLORS: Record<string, { bar: string; bg: string }> = {
  discoverable: { bar: 'bg-emerald-500', bg: 'bg-emerald-500/20' },
  readable: { bar: 'bg-sky-500', bg: 'bg-sky-500/20' },
  trustworthy: { bar: 'bg-violet-500', bg: 'bg-violet-500/20' },
  actionable: { bar: 'bg-amber-500', bg: 'bg-amber-500/20' },
};

interface CategoryBreakdownProps {
  categories: ScoreCategory[];
}

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const t = useTranslations('score');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState<number | null>(null);
  const [showCheckInfo, setShowCheckInfo] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {categories.map((cat, i) => {
        const colors = CATEGORY_COLORS[cat.key] || { bar: 'bg-slate-500', bg: 'bg-slate-500/20' };
        const pct = cat.maxPoints > 0 ? (cat.earned / cat.maxPoints) * 100 : 0;
        const isOpen = expanded === i;
        const isInfoOpen = showInfo === i;

        const catName = t(`categories.${cat.key}.name`);
        const catQuestion = t(`categories.${cat.key}.question`);
        const catInfoWhat = t(`categories.${cat.key}.info_what`);
        const catInfoWhy = t(`categories.${cat.key}.info_why`);

        return (
          <div key={cat.key}>
            {/* Category header */}
            <div className="flex items-center gap-2 mb-1.5">
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="flex-1 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition">
                      {catName}
                    </span>
                    <span className="text-[10px] text-slate-600 italic hidden sm:inline">
                      {catQuestion}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-slate-400">
                      {cat.earned}/{cat.maxPoints}
                    </span>
                    <svg
                      className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              {/* Info button */}
              <button
                onClick={() => setShowInfo(isInfoOpen ? null : i)}
                className={`shrink-0 flex items-center justify-center h-5 w-5 rounded-full border text-[10px] font-bold transition ${
                  isInfoOpen
                    ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                    : 'border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500'
                }`}
                aria-label="Info"
              >
                i
              </button>
            </div>

            {/* Category info tooltip */}
            {isInfoOpen && (
              <div className="mb-3 rounded-lg border border-slate-700/50 bg-slate-800/50 p-3 text-xs space-y-1.5">
                <p className="text-slate-300"><span className="text-emerald-400 font-medium">{t('categories.discoverable.name') ? '' : ''}{/* What it measures / Why it matters labels */}</span></p>
                <p className="text-slate-300"><span className="text-emerald-400 font-medium">{'▸ '}</span>{catInfoWhat}</p>
                <p className="text-slate-300"><span className="text-amber-400 font-medium">{'▸ '}</span>{catInfoWhy}</p>
              </div>
            )}

            <button
              onClick={() => setExpanded(isOpen ? null : i)}
              className="w-full"
            >
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full bar-animate ${colors.bar}`}
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
              </div>
            </button>

            {/* Expanded checks */}
            {isOpen && (
              <div className="mt-3 ml-1 space-y-2 border-l-2 border-slate-800 pl-4">
                {cat.checks.map((check) => {
                  const isCheckInfoOpen = showCheckInfo === check.id;
                  const isNotApplicable = check.details?.includes('Not applicable') || check.details?.includes('not applicable');
                  const checkName = t.has(`checks.${check.id}.name`) ? t(`checks.${check.id}.name`) : check.name;
                  const checkInfo = t.has(`checks.${check.id}.info`) ? t(`checks.${check.id}.info`) : null;

                  return (
                    <div key={check.id} className="flex items-start gap-2">
                      <span className={`mt-0.5 shrink-0 ${
                        check.passed
                          ? 'text-emerald-400'
                          : isNotApplicable
                            ? 'text-slate-600'
                            : 'text-slate-600'
                      }`}>
                        {check.passed ? (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : isNotApplicable ? (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
                            <line x1="7" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm ${
                              check.passed
                                ? 'text-slate-300'
                                : isNotApplicable
                                  ? 'text-slate-600'
                                  : 'text-slate-500'
                            }`}>
                              {checkName}
                            </span>
                            {checkInfo && (
                              <button
                                onClick={() => setShowCheckInfo(isCheckInfoOpen ? null : check.id)}
                                className={`shrink-0 flex items-center justify-center h-4 w-4 rounded-full border text-[9px] font-bold transition ${
                                  isCheckInfoOpen
                                    ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                                    : 'border-slate-700 text-slate-600 hover:text-slate-400 hover:border-slate-500'
                                }`}
                                aria-label="Info"
                              >
                                i
                              </button>
                            )}
                          </div>
                          <span className="font-mono text-xs text-slate-500">
                            {check.earned}/{check.maxPoints}
                          </span>
                        </div>
                        {check.details && (
                          <p className={`text-xs mt-0.5 ${isNotApplicable ? 'text-slate-700' : 'text-slate-600'}`}>
                            {check.details}
                          </p>
                        )}
                        {isCheckInfoOpen && checkInfo && (
                          <p className="text-xs text-slate-400 mt-1 pl-0.5 border-l-2 border-emerald-500/30 ml-0.5 pl-2">
                            {checkInfo}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
