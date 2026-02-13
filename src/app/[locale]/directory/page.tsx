import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { FadeIn } from '@/components/fade-in';
import { AnalysisList } from '@/components/directory/analysis-list';
import { Footer } from '@/components/footer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'directory' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function DirectoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <DirectoryContent />
      <Footer />
    </main>
  );
}

async function DirectoryContent() {
  const t = await getTranslations('directory');

  return (
    <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
      {/* Title section */}
      <FadeIn>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>
      </FadeIn>

      {/* Content */}
      <FadeIn delay={100}>
        <div className="mt-12">
          <AnalysisList />
        </div>
      </FadeIn>
    </div>
  );
}
