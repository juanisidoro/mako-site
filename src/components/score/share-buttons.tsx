'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ScoreResult } from '@/lib/scorer/types';
import { siteConfig } from '@/config/site';

interface ShareButtonsProps {
  result: ScoreResult;
}

export function ShareButtons({ result }: ShareButtonsProps) {
  const t = useTranslations('score');
  const [copied, setCopied] = useState<string | null>(null);

  const scoreUrl = `${siteConfig.baseUrl}/score`;
  const ogUrl = `${siteConfig.baseUrl}/api/score/og?score=${result.totalScore}&grade=${result.grade}&domain=${encodeURIComponent(result.domain)}&entity=${encodeURIComponent(result.entity)}&c1=${result.categories[0]?.earned ?? 0}&c2=${result.categories[1]?.earned ?? 0}&c3=${result.categories[2]?.earned ?? 0}&c4=${result.categories[3]?.earned ?? 0}`;
  const badgeUrl = `${siteConfig.baseUrl}/api/score/badge?url=${encodeURIComponent(result.url)}`;

  const tweetText = `My website ${result.domain} scored ${result.totalScore}/100 on AI-readiness! Grade: ${result.grade}\n\nCheck your site's MAKO Score:`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(scoreUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(scoreUrl)}`;

  const badgeEmbed = `<a href="${scoreUrl}"><img src="${badgeUrl}" alt="MAKO Score: ${result.totalScore}/100" /></a>`;

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <div className="space-y-6">
      {/* Social share */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-300">{t('share.social')}</p>
        <div className="flex gap-3">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm text-white transition hover:bg-slate-700"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter / X
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm text-white transition hover:bg-slate-700"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
        </div>
      </div>

      {/* Download OG image */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-300">{t('share.download')}</p>
        <a
          href={ogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-700 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {t('share.download_png')}
        </a>
      </div>

      {/* Embed badge */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-300">{t('share.embed')}</p>
        <div className="relative">
          <pre className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-xs text-slate-400 overflow-x-auto">
            {badgeEmbed}
          </pre>
          <button
            onClick={() => copyToClipboard(badgeEmbed, 'badge')}
            className="absolute right-2 top-2 rounded-md bg-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:bg-slate-600"
          >
            {copied === 'badge' ? t('share.copied') : t('share.copy')}
          </button>
        </div>
      </div>
    </div>
  );
}
