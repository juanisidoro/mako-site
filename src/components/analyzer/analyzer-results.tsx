'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { TokenComparison } from './token-comparison';
import { MakoPreview } from './mako-preview';
import { HeadersPreview } from './headers-preview';

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

type Tab = 'overview' | 'mako' | 'headers';

export function AnalyzerResults({ result }: { result: AnalysisResult }) {
  const t = useTranslations('analyzer');
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: t('results.overview_tab') },
    { key: 'mako', label: t('results.mako_tab') },
    { key: 'headers', label: t('results.headers_tab') },
  ];

  return (
    <div className="space-y-6">
      {/* URL display */}
      <div className="flex items-center gap-2 text-sm text-slate-400 truncate">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4 shrink-0 text-emerald-400"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
        <span className="truncate">{result.url}</span>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-slate-800/50">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-4 py-2.5 text-sm font-medium transition ${
              activeTab === tab.key
                ? 'text-emerald-400'
                : 'text-slate-400 hover:text-white'
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
      <div>
        {activeTab === 'overview' && (
          <TokenComparison
            htmlTokens={result.htmlTokens}
            makoTokens={result.makoTokens}
            savingsPercent={result.savingsPercent}
            contentType={result.contentType}
            entity={result.entity}
            summary={result.summary}
          />
        )}
        {activeTab === 'mako' && (
          <MakoPreview makoContent={result.makoContent} />
        )}
        {activeTab === 'headers' && (
          <HeadersPreview headers={result.headers} />
        )}
      </div>
    </div>
  );
}
