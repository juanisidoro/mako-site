'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { siteConfig } from '@/config/site';
import { CopyButton } from './copy-button';
import { FadeIn } from './fade-in';

export function GetStarted() {
  const t = useTranslations('get_started');
  const router = useRouter();
  const locale = useLocale();
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
    } catch {
      return;
    }
    router.push(`/${locale}/score?url=${encodeURIComponent(trimmed)}`);
  };

  return (
    <section className="border-t border-slate-800/50">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-10 sm:px-10">
          {/* Header */}
          <FadeIn>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                {t('title')}
              </h2>
              <p className="mt-2 text-lg text-emerald-400/80">
                {t('title_2')}
              </p>
              <p className="mt-3 text-slate-400">
                {t('subtitle')}
              </p>
            </div>
          </FadeIn>

          {/* Ecosystem cards */}
          <FadeIn delay={200}>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* WordPress */}
              <a
                href={siteConfig.githubWp}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-slate-700/50 bg-slate-900/40 p-5 transition hover:border-emerald-500/30 hover:bg-slate-900/60"
              >
                <h3 className="text-base font-semibold text-white">{t('wp_title')}</h3>
                <p className="mt-1.5 text-sm text-slate-400">{t('wp_desc')}</p>
              </a>

              {/* JS SDK */}
              <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-5">
                <h3 className="text-base font-semibold text-white">{t('sdk_title')}</h3>
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-950/60 px-3 py-2">
                  <code className="font-mono text-xs text-emerald-400">{t('sdk_install')}</code>
                  <CopyButton text={t('sdk_install')} />
                </div>
              </div>

              {/* CLI */}
              <a
                href="https://www.npmjs.com/package/@mako-spec/cli"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-slate-700/50 bg-slate-900/40 p-5 transition hover:border-emerald-500/30 hover:bg-slate-900/60"
              >
                <h3 className="text-base font-semibold text-white">{t('cli_title')}</h3>
                <p className="mt-1.5 text-sm text-slate-400">{t('cli_desc')}</p>
              </a>

              {/* Spec */}
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-slate-700/50 bg-slate-900/40 p-5 transition hover:border-emerald-500/30 hover:bg-slate-900/60"
              >
                <h3 className="text-base font-semibold text-white">{t('spec_title')}</h3>
                <p className="mt-1.5 text-sm text-slate-400">{t('spec_desc')}</p>
              </a>
            </div>
          </FadeIn>

          {/* Score inline */}
          <FadeIn delay={400}>
            <div className="mt-10 border-t border-emerald-500/10 pt-8">
              <p className="text-center text-sm font-medium text-slate-300">
                {t('score_title')}
              </p>
              <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row max-w-lg mx-auto">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={t('score_placeholder')}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
                >
                  {t('score_button')}
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
