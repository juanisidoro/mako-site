'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

import type { ScoreResult } from '@/lib/scorer/types';

interface ScoreFormProps {
  onResult: (result: ScoreResult) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  initialUrl?: string;
}

export function ScoreForm({ onResult, loading, setLoading, initialUrl }: ScoreFormProps) {
  const t = useTranslations('score');
  const [url, setUrl] = useState(initialUrl || '');
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState('');
  const autoSubmitted = useRef(false);

  const doSubmit = async (submitUrl: string) => {
    setError('');

    if (!submitUrl.trim()) {
      setError(t('errors.url_required'));
      return;
    }

    try {
      new URL(submitUrl);
    } catch {
      setError(t('errors.invalid_url'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: submitUrl, isPublic }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || t('errors.score_failed'));
      }

      const data = await res.json();
      onResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('errors.score_failed')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await doSubmit(url);
  };

  // Auto-submit when initialUrl is provided
  useEffect(() => {
    if (initialUrl && !autoSubmitted.current) {
      autoSubmitted.current = true;
      setUrl(initialUrl);
      doSubmit(initialUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="score-url-input"
          className="block text-sm font-medium text-slate-300"
        >
          {t('form.url_label')}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="score-url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t('form.url_placeholder')}
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
            {loading ? t('form.scoring') : t('form.score_button')}
          </button>
        </div>
      </div>

      {/* Public toggle — checked by default */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          disabled={loading}
          className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500/25 focus:ring-offset-0"
        />
        <div>
          <span className="text-sm font-medium text-slate-300 group-hover:text-white transition">
            {t('form.public_label')}
          </span>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('form.public_description')}
          </p>
        </div>
      </label>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}
    </form>
  );
}
