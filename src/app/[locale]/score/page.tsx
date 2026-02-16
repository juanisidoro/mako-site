import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ScoreClient } from '@/components/score/score-client';
import { Footer } from '@/components/footer';
import { siteConfig } from '@/config/site';

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: 'score' });

  const score = sp.score ? String(sp.score) : null;
  const grade = sp.grade ? String(sp.grade) : null;
  const domain = sp.domain ? String(sp.domain) : null;

  // Dynamic OG when sharing a specific result
  if (score && grade && domain) {
    const entity = sp.entity ? String(sp.entity) : domain;
    const c1 = sp.c1 ? String(sp.c1) : '0';
    const c2 = sp.c2 ? String(sp.c2) : '0';
    const c3 = sp.c3 ? String(sp.c3) : '0';
    const c4 = sp.c4 ? String(sp.c4) : '0';

    const ogImageUrl = `${siteConfig.baseUrl}/api/score/og?score=${score}&grade=${grade}&domain=${encodeURIComponent(domain)}&entity=${encodeURIComponent(entity)}&c1=${c1}&c2=${c2}&c3=${c3}&c4=${c4}`;

    const title = `${domain} — MAKO Score: ${score}/100 (${grade})`;
    const description = `${domain} scored ${score}/100 on AI-readiness. Check your website's MAKO Score.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: ogImageUrl, width: 1200, height: 630 }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl],
      },
    };
  }

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function ScorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Suspense>
        <ScoreClient />
      </Suspense>
      <Footer />
    </main>
  );
}
