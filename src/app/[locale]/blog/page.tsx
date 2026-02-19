import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { generateAlternates } from '@/lib/metadata';
import { getAllPostsMeta } from '@/lib/blog';
import { BlogCard } from '@/components/blog/blog-card';
import { Footer } from '@/components/footer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    alternates: generateAlternates(locale, '/blog'),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'blog' });
  const posts = getAllPostsMeta(locale);

  return (
    <>
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-3 sm:text-4xl">
            {t('title')}
          </h1>
          <p className="text-lg text-slate-400">
            {t('subtitle')}
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-slate-500">{t('no_posts')}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <BlogCard key={post.folder} post={post} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
