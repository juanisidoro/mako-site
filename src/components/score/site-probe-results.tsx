'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { SiteProbe } from '@/lib/scorer/types';

interface SiteProbeResultsProps {
  probe: SiteProbe;
  domain: string;
}

export function SiteProbeResults({ probe, domain }: SiteProbeResultsProps) {
  const t = useTranslations('score');
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-800/30 transition"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white">
              {t('site_scan.title')}
            </p>
            <p className="text-xs text-slate-500">
              {t('site_scan.checked', { count: probe.totalChecked, domain })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Adoption pill */}
          <div className={`rounded-full px-3 py-1 text-xs font-semibold ${
            probe.adoptionPct === 100
              ? 'bg-emerald-500/15 text-emerald-400'
              : probe.adoptionPct > 0
                ? 'bg-amber-500/15 text-amber-400'
                : 'bg-slate-700/50 text-slate-500'
          }`}>
            {probe.makoCount}/{probe.totalChecked} MAKO
          </div>

          <svg
            className={`h-4 w-4 text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Description */}
      <div className="px-4 sm:px-5 pb-3 -mt-1">
        <p className="text-xs text-slate-600">
          {t('site_scan.description')}
        </p>
      </div>

      {/* Expanded URL list */}
      {expanded && (
        <div className="border-t border-slate-800">
          {/* Adoption bar */}
          <div className="px-4 sm:px-5 py-3 bg-slate-900/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-500">{t('site_scan.adoption')}</span>
              <span className="text-xs font-mono text-slate-400">{probe.adoptionPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  probe.adoptionPct === 100
                    ? 'bg-emerald-500'
                    : probe.adoptionPct > 0
                      ? 'bg-amber-500'
                      : 'bg-slate-700'
                }`}
                style={{ width: `${Math.max(probe.adoptionPct, 2)}%` }}
              />
            </div>
          </div>

          {/* URL list */}
          <div className="divide-y divide-slate-800/50">
            {probe.urls.map((item) => (
              <div key={item.url} className="flex items-center justify-between px-4 sm:px-5 py-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Status icon */}
                  <span className={`shrink-0 ${item.hasMako ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {item.hasMako ? (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>

                  {/* Path */}
                  <span className={`text-sm font-mono truncate ${item.hasMako ? 'text-slate-300' : 'text-slate-500'}`}>
                    {item.path}
                  </span>
                </div>

                {/* MAKO details */}
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {item.hasMako && item.makoTokens && (
                    <span className="text-xs text-emerald-400/70 font-mono">
                      ~{item.makoTokens} tok
                    </span>
                  )}
                  {item.hasMako && item.makoVersion && (
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-mono text-emerald-400">
                      v{item.makoVersion}
                    </span>
                  )}
                  {item.hasMako && item.makoType && (
                    <span className="rounded bg-slate-700/50 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                      {item.makoType}
                    </span>
                  )}
                  {item.error && (
                    <span className="text-[10px] text-slate-600">
                      {item.error}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          {probe.makoCount === 0 && (
            <div className="px-4 sm:px-5 py-3 bg-slate-900/30 border-t border-slate-800">
              <p className="text-xs text-slate-500">
                {t('site_scan.no_mako')}
              </p>
            </div>
          )}
          {probe.makoCount > 0 && probe.makoCount < probe.totalChecked && (
            <div className="px-4 sm:px-5 py-3 bg-slate-900/30 border-t border-slate-800">
              <p className="text-xs text-slate-500">
                {t('site_scan.partial_mako', { count: probe.makoCount, total: probe.totalChecked })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
