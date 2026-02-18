import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getDocPage, getDocSlugs } from '@/lib/docs';
import { MarkdownRenderer } from '@/components/docs/markdown-renderer';
import { TableOfContents } from '@/components/docs/table-of-contents';
import { Footer } from '@/components/footer';

export function generateStaticParams() {
  return getDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocPage(slug);
  if (!doc) return {};

  return {
    title: `${doc.title} — MAKO Docs`,
    description: doc.description,
  };
}

export default async function DocSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const doc = getDocPage(slug);
  if (!doc) notFound();

  return (
    <>
      <div className="flex gap-10">
        <main className="min-w-0 flex-1 max-w-3xl">
          <MarkdownRenderer content={doc.content} />
        </main>
        <TableOfContents headings={doc.headings} />
      </div>
      <Footer />
    </>
  );
}
