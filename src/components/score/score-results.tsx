'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ScoreResult } from '@/lib/scorer/types';
import { ScoreCard } from './score-card';
import { CategoryBreakdown } from './category-breakdown';
import { ScoreRecommendations } from './score-recommendations';
import { ShareButtons } from './share-buttons';

type Tab = 'score' | 'details' | 'share';

interface ScoreResultsProps {
  result: ScoreResult;
}

export function ScoreResults({ result }: ScoreResultsProps) {
  const t = useTranslations('score');
  const [activeTab, setActiveTab] = useState<Tab>('score');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'score', label: t('tabs.score') },
    { key: 'details', label: t('tabs.details') },
    { key: 'share', label: t('tabs.share') },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-slate-800 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition relative ${
              activeTab === tab.key
                ? 'text-white'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'score' && (
        <div className="space-y-8">
          <ScoreCard result={result} />
          <CategoryBreakdown categories={result.categories} />
        </div>
      )}

      {activeTab === 'details' && (
        <ScoreRecommendations recommendations={result.recommendations} />
      )}

      {activeTab === 'share' && (
        <ShareButtons result={result} />
      )}
    </div>
  );
}
