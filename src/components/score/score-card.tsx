'use client';

import type { ScoreResult } from '@/lib/scorer/types';
import { ScoreGauge } from './score-gauge';

function getCategoryBarColor(index: number): string {
  const colors = ['bg-emerald-500', 'bg-sky-500', 'bg-violet-500', 'bg-amber-500'];
  return colors[index % colors.length];
}

const CATEGORY_SHORT_NAMES = ['Content', 'Metadata', 'LLM Access', 'Agent Ready'];

interface ScoreCardProps {
  result: ScoreResult;
}

export function ScoreCard({ result }: ScoreCardProps) {
  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-900 to-[#0a0f1a] p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
            M
          </div>
          <span className="text-sm font-semibold text-white">MAKO Score</span>
        </div>
        <span className="text-xs text-slate-500 font-mono">{result.domain}</span>
      </div>

      {/* Gauge */}
      <div className="flex justify-center mb-4">
        <ScoreGauge score={result.totalScore} grade={result.grade} size={160} />
      </div>

      {/* Entity */}
      <p className="text-center text-sm text-slate-400 mb-6 truncate">
        &ldquo;{result.entity}&rdquo;
      </p>

      {/* Category bars */}
      <div className="space-y-3 mb-6">
        {result.categories.map((cat, i) => {
          const pct = cat.maxPoints > 0 ? (cat.earned / cat.maxPoints) * 100 : 0;
          return (
            <div key={cat.name} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getCategoryBarColor(i)}`}
                    style={{ width: `${Math.max(pct, 3)}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between w-36 shrink-0">
                <span className="text-xs text-slate-400">{CATEGORY_SHORT_NAMES[i]}</span>
                <span className="font-mono text-xs text-slate-500">
                  {cat.earned}/{cat.maxPoints}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        <span className="text-[10px] text-slate-600">makospec.vercel.app/score</span>
        <span className="text-[10px] text-slate-600">Powered by MAKO</span>
      </div>
    </div>
  );
}
