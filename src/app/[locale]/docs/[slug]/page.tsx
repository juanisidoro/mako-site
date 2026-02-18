import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { generateAlternates } from '@/lib/metadata';
import { getDocPage, getDocSlugs } from '@/lib/docs';
import { MarkdownRenderer } from '@/components/docs/markdown-renderer';
import { TableOfContents } from '@/components/docs/table-of-contents';
import { DocsMobileDrawer } from '@/components/docs/docs-mobile-drawer';
import { Footer } from '@/components/footer';

export function generateStaticParams() {
  return getDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const doc = getDocPage(slug);
  if (!doc) return {};

  return {
    title: `${doc.title} — MAKO Docs`,
    description: doc.description,
    alternates: generateAlternates(locale, `/docs/${slug}`),
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
      <DocsMobileDrawer headings={doc.headings} />
      <Footer />
    </>
  );
}
