'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ScoreCategory } from '@/lib/scorer/types';

function getCategoryColor(index: number): { bar: string; bg: string } {
  const colors = [
    { bar: 'bg-emerald-500', bg: 'bg-emerald-500/20' },
    { bar: 'bg-sky-500', bg: 'bg-sky-500/20' },
    { bar: 'bg-violet-500', bg: 'bg-violet-500/20' },
    { bar: 'bg-amber-500', bg: 'bg-amber-500/20' },
  ];
  return colors[index % colors.length];
}

interface CategoryBreakdownProps {
  categories: ScoreCategory[];
}

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const t = useTranslations('score');
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {categories.map((cat, i) => {
        const colors = getCategoryColor(i);
        const pct = cat.maxPoints > 0 ? (cat.earned / cat.maxPoints) * 100 : 0;
        const isOpen = expanded === i;

        return (
          <div key={cat.name}>
            {/* Category header bar */}
            <button
              onClick={() => setExpanded(isOpen ? null : i)}
              className="w-full text-left group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition">
                  {cat.name}
                </span>
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
                {cat.checks.map((check) => (
                  <div key={check.id} className="flex items-start gap-2">
                    <span className={`mt-0.5 shrink-0 ${check.passed ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {check.passed ? (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${check.passed ? 'text-slate-300' : 'text-slate-500'}`}>
                          {check.name}
                        </span>
                        <span className="font-mono text-xs text-slate-500">
                          {check.earned}/{check.maxPoints}
                        </span>
                      </div>
                      {check.details && (
                        <p className="text-xs text-slate-600 mt-0.5">{check.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
