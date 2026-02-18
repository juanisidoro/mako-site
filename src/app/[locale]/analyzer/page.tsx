import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { generateAlternates } from '@/lib/metadata';
import { siteConfig } from '@/config/site';
import { AnalyzerClient } from '@/components/analyzer/analyzer-client';
import { Footer } from '@/components/footer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'analyzer' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    alternates: generateAlternates(locale, '/analyzer'),
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      url: `${siteConfig.baseUrl}/${locale}/analyzer`,
      siteName: siteConfig.name,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: t('meta_title'),
      description: t('meta_description'),
    },
  };
}

export default async function AnalyzerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <AnalyzerClient />
      <Footer />
    </main>
  );
}
