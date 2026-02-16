'use client';

import type { ScoreResult } from '@/lib/scorer/types';
import { ScoreGauge } from './score-gauge';

const CATEGORY_COLORS: Record<string, { bar: string; text: string }> = {
  discoverable: { bar: 'bg-emerald-500', text: 'text-emerald-400' },
  readable: { bar: 'bg-sky-500', text: 'text-sky-400' },
  trustworthy: { bar: 'bg-violet-500', text: 'text-violet-400' },
  actionable: { bar: 'bg-amber-500', text: 'text-amber-400' },
};

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
      <div className="flex justify-center mb-2">
        <ScoreGauge score={result.totalScore} grade={result.grade} size={160} />
      </div>

      {/* Grade title */}
      <p className="text-center text-sm font-medium text-slate-300 mb-1">
        {result.gradeInfo.title}
      </p>

      {/* Entity */}
      <p className="text-center text-xs text-slate-500 mb-6 truncate">
        &ldquo;{result.entity}&rdquo;
      </p>

      {/* Category bars — DTRA */}
      <div className="space-y-3 mb-6">
        {result.categories.map((cat) => {
          const pct = cat.maxPoints > 0 ? (cat.earned / cat.maxPoints) * 100 : 0;
          const colors = CATEGORY_COLORS[cat.key] || { bar: 'bg-slate-500', text: 'text-slate-400' };
          return (
            <div key={cat.key} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colors.bar}`}
                    style={{ width: `${Math.max(pct, 3)}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between w-40 shrink-0">
                <span className="text-xs text-slate-400">{cat.name}</span>
                <span className="font-mono text-xs text-slate-500">
                  {cat.earned}/{cat.maxPoints}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conformance level badge */}
      {result.conformanceLevel && (
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
            L{result.conformanceLevel.level} — {result.conformanceLevel.name}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        <span className="text-[10px] text-slate-600">makospec.vercel.app/score</span>
        <span className="text-[10px] text-slate-600">Powered by MAKO</span>
      </div>
    </div>
  );
}
