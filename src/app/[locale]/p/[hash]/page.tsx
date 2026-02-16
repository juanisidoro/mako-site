import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getScoreByHash } from '@/lib/db';
import { getGradeInfo, getConformanceLevel } from '@/lib/scorer/types';
import type { ScoreResult, ScoreCategory, ScoreRecommendation } from '@/lib/scorer/types';
import { siteConfig } from '@/config/site';
import { PreviewContent } from './preview-content';
import { Footer } from '@/components/footer';

function reconstructResult(row: {
  id?: string;
  shareHash?: string;
  url: string;
  domain: string;
  entity: string;
  contentType: string;
  totalScore: number;
  grade: string;
  categoriesJson: unknown;
  recommendations: unknown;
  isPublic: boolean;
  createdAt: string;
}): ScoreResult {
  const gradeInfo = getGradeInfo(row.totalScore);
  const conformanceLevel = getConformanceLevel(row.totalScore);
  return {
    id: row.id,
    shareHash: row.shareHash,
    url: row.url,
    domain: row.domain,
    entity: row.entity,
    contentType: row.contentType,
    totalScore: row.totalScore,
    grade: gradeInfo.grade,
    gradeInfo,
    conformanceLevel,
    categories: row.categoriesJson as ScoreCategory[],
    recommendations: row.recommendations as ScoreRecommendation[],
    isPublic: row.isPublic,
    createdAt: row.createdAt,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; hash: string }>;
}): Promise<Metadata> {
  const { locale, hash } = await params;
  const row = await getScoreByHash(hash);

  if (!row) {
    return { title: 'Not Found' };
  }

  const t = await getTranslations({ locale, namespace: 'score' });
  const categories = row.categoriesJson as ScoreCategory[];
  const c1 = String(categories[0]?.earned ?? 0);
  const c2 = String(categories[1]?.earned ?? 0);
  const c3 = String(categories[2]?.earned ?? 0);
  const c4 = String(categories[3]?.earned ?? 0);

  const ogImageUrl = `${siteConfig.baseUrl}/api/score/og?score=${row.totalScore}&grade=${row.grade}&domain=${encodeURIComponent(row.domain)}&entity=${encodeURIComponent(row.entity)}&c1=${c1}&c2=${c2}&c3=${c3}&c4=${c4}`;

  const title = `${row.domain} — MAKO Score: ${row.totalScore}/100 (${row.grade})`;
  const description = t.has('share.og_description')
    ? t('share.og_description', { domain: row.domain, score: String(row.totalScore) })
    : `${row.domain} scored ${row.totalScore}/100 on AI-readiness. Check your website's MAKO Score.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'website',
      url: `${siteConfig.baseUrl}/${locale}/p/${hash}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ locale: string; hash: string }>;
}) {
  const { locale, hash } = await params;
  setRequestLocale(locale);

  const row = await getScoreByHash(hash);
  if (!row) notFound();

  const result = reconstructResult(row);

  return (
    <main className="min-h-screen bg-[#0a0f1a]">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <PreviewContent result={result} />
      </div>
      <Footer />
    </main>
  );
}
