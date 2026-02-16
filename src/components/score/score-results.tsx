'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ScoreResult } from '@/lib/scorer/types';
import { ScoreCard } from './score-card';
import { CategoryBreakdown } from './category-breakdown';
import { SiteProbeResults } from './site-probe-results';
import { ScoreRecommendations } from './score-recommendations';
import { ShareButtons } from './share-buttons';

type Tab = 'business' | 'developer' | 'share';

interface ScoreResultsProps {
  result: ScoreResult;
}

export function ScoreResults({ result }: ScoreResultsProps) {
  const t = useTranslations('score');
  const [activeTab, setActiveTab] = useState<Tab>('business');

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: 'business',
      label: t('tabs.business'),
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
        </svg>
      ),
    },
    {
      key: 'developer',
      label: t('tabs.developer'),
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      ),
    },
    {
      key: 'share',
      label: t('tabs.share'),
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-slate-800 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition relative ${
              activeTab === tab.key
                ? 'text-white'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Business view */}
      {activeTab === 'business' && (
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
                <h3 className="text-lg font-semibold text-white">
                  {result.gradeInfo.title}
                </h3>
                <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                  {result.gradeInfo.description}
                </p>
              </div>
            </div>

            {/* Conformance level */}
            {result.conformanceLevel && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  {result.conformanceLevel.badge === 'star' && (
                    <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  )}
                  {result.conformanceLevel.badge === 'check' && (
                    <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {result.conformanceLevel.badge === 'search' && (
                    <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                  {result.conformanceLevel.badge === 'circle' && (
                    <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-sm font-semibold text-emerald-400">
                    Level {result.conformanceLevel.level}: {result.conformanceLevel.name}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Business recommendations — top 5 */}
          {result.recommendations.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">
                {t('business.top_actions')}
              </h3>
              <ScoreRecommendations
                recommendations={result.recommendations.slice(0, 5)}
                mode="business"
              />
            </div>
          )}

          {/* MAKO CTA */}
          {!result.categories[0]?.checks.find(c => c.id === 'serves_mako')?.passed && (
            <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-transparent p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 text-sm font-bold">
                  M
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {t('business.mako_cta_title')}
                  </h4>
                  <p className="mt-1 text-sm text-slate-400">
                    {t('business.mako_cta_desc')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Developer view */}
      {activeTab === 'developer' && (
        <div className="space-y-8">
          <ScoreCard result={result} />

          {/* Framing text */}
          <p className="text-xs text-slate-500 text-center italic">
            {t('about')}
          </p>

          <CategoryBreakdown categories={result.categories} />

          {result.siteProbe && (
            <SiteProbeResults probe={result.siteProbe} domain={result.domain} />
          )}

          {result.recommendations.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">
                {t('developer.all_recommendations')}
              </h3>
              <ScoreRecommendations
                recommendations={result.recommendations}
                mode="developer"
              />
            </div>
          )}
        </div>
      )}

      {/* Share view */}
      {activeTab === 'share' && (
        <ShareButtons result={result} />
      )}
    </div>
  );
}
