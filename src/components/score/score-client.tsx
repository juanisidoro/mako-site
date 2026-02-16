'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { FadeIn } from '@/components/fade-in';
import { ScoreForm } from './score-form';
import { ScoreResults } from './score-results';
import type { ScoreResult } from '@/lib/scorer/types';

export function ScoreClient() {
  const t = useTranslations('score');
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get('url') || undefined;
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
      {/* Title */}
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
          <ScoreForm
            onResult={setResult}
            loading={loading}
            setLoading={setLoading}
            initialUrl={initialUrl}
          />
        </div>
      </FadeIn>

      {/* Results */}
      {result && !loading && (
        <FadeIn delay={150}>
          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/30 p-6 sm:p-8">
            <ScoreResults result={result} />
          </div>
        </FadeIn>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/30 p-6 sm:p-8">
          <div className="animate-pulse space-y-8">
            <div className="flex justify-center">
              <div className="h-40 w-40 rounded-full bg-slate-800" />
            </div>
            <div className="space-y-4">
              <div className="h-3 w-full rounded-full bg-slate-800" />
              <div className="h-3 w-3/4 rounded-full bg-slate-800" />
              <div className="h-3 w-1/2 rounded-full bg-slate-800" />
              <div className="h-3 w-2/3 rounded-full bg-slate-800" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
