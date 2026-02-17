import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { HowItWorksPage } from '@/components/how-it-works/how-it-works-page';
import { Footer } from '@/components/footer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'how_it_works_page' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function HowItWorksRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Suspense>
        <HowItWorksPage />
      </Suspense>
      <Footer />
    </main>
  );
}
