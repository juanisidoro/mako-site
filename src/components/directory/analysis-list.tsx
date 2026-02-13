'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ContentTypeBadge } from '@/components/analyzer/content-type-badge';
import { StatsBanner } from './stats-banner';

interface AnalysisResult {
  id?: string;
  url: string;
  domain: string;
  htmlTokens: number;
  makoTokens: number;
  savingsPercent: number;
  contentType: string;
  entity: string;
  summary: string;
  makoContent: string;
  headers: Record<string, string>;
  isPublic: boolean;
  createdAt: string;
}

interface Stats {
  total: number;
  avgSavings: number;
  domains: number;
}

export function AnalysisList() {
  const t = useTranslations('directory');
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, avgSavings: 0, domains: 0 });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const limit = 12;

  const fetchAnalyses = useCallback(
    async (pageNum: number) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/analyses?page=${pageNum}&limit=${limit}`
        );
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        if (pageNum === 1) {
          setAnalyses(data.analyses);
        } else {
          setAnalyses((prev) => [...prev, ...data.analyses]);
        }

        setStats(data.stats);
        setHasMore(data.analyses.length === limit);
      } catch {
        // Silent fail - show empty state
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchAnalyses(1);
  }, [fetchAnalyses]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchAnalyses(nextPage);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-10">
      {/* Stats */}
      <StatsBanner stats={stats} />

      {/* Loading state */}
      {loading && analyses.length === 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-slate-800 bg-slate-900/30 p-5"
            >
              <div className="h-4 w-2/3 rounded bg-slate-800" />
              <div className="mt-3 h-3 w-1/2 rounded bg-slate-800" />
              <div className="mt-4 flex gap-2">
                <div className="h-5 w-16 rounded-full bg-slate-800" />
                <div className="h-5 w-12 rounded bg-slate-800" />
              </div>
              <div className="mt-4 h-3 w-1/3 rounded bg-slate-800" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && analyses.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-12 text-center">
          <p className="text-slate-400">{t('list.no_results')}</p>
        </div>
      )}

      {/* Analysis cards grid */}
      {analyses.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {analyses.map((analysis, i) => (
            <div
              key={analysis.id ?? i}
              className="group rounded-xl border border-slate-800 bg-slate-900/30 p-5 transition hover:border-emerald-500/30"
            >
              {/* Domain */}
              <p className="font-semibold text-white truncate">{analysis.domain}</p>

              {/* Entity */}
              <p className="mt-1 text-sm text-slate-400 truncate">{analysis.entity}</p>

              {/* Badge + savings */}
              <div className="mt-3 flex items-center gap-2">
                <ContentTypeBadge contentType={analysis.contentType} />
                <span className="text-sm font-semibold text-emerald-400 font-mono">
                  {Math.round(analysis.savingsPercent)}%
                </span>
                <span className="text-xs text-slate-500">
                  {t('list.tokens_saved')}
                </span>
              </div>

              {/* Date */}
              <p className="mt-3 text-xs text-slate-500">
                {t('list.analyzed_on')} {formatDate(analysis.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Load more button */}
      {hasMore && analyses.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            {loading && (
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {t('list.load_more')}
          </button>
        </div>
      )}
    </div>
  );
}
