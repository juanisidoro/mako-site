'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/fade-in';
import { AnalyzerForm } from './analyzer-form';
import { AnalyzerResults } from './analyzer-results';

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

export function AnalyzerClient() {
  const t = useTranslations('analyzer');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
      {/* Title section */}
      <FadeIn>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>
      </FadeIn>

      {/* Form */}
      <FadeIn delay={100}>
        <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900/30 p-6 sm:p-8">
          <AnalyzerForm
            onResult={setResult}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      </FadeIn>

      {/* Results */}
      {result && !loading && (
        <FadeIn delay={150}>
          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/30 p-6 sm:p-8">
            <AnalyzerResults result={result} />
          </div>
        </FadeIn>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/30 p-6 sm:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-2/3 rounded bg-slate-800" />
            <div className="flex gap-4">
              <div className="h-8 w-28 rounded bg-slate-800" />
              <div className="h-8 w-28 rounded bg-slate-800" />
              <div className="h-8 w-28 rounded bg-slate-800" />
            </div>
            <div className="space-y-4">
              <div className="h-10 w-full rounded-lg bg-slate-800" />
              <div className="h-10 w-1/3 rounded-lg bg-slate-800" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 rounded-xl bg-slate-800" />
              <div className="h-20 rounded-xl bg-slate-800" />
              <div className="h-20 rounded-xl bg-slate-800" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
