import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { locales } from '@/i18n/config';
import { getPost, getPostSlugs } from '@/lib/blog';
import { extractHeadings } from '@/lib/markdown-utils';
import { Link } from '@/i18n/routing';
import { MarkdownRenderer } from '@/components/docs/markdown-renderer';
import { TableOfContents } from '@/components/docs/table-of-contents';
import { BlogPostHeader } from '@/components/blog/blog-post-header';
import { Footer } from '@/components/footer';

export function generateStaticParams() {
  return getPostSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug, locale);
  if (!post) return {};

  // Build localized hreflang alternates
  const languages: Record<string, string> = {};
  for (const l of locales) {
    const lSlug = post.slugsByLocale[l] ?? slug;
    languages[l] = `${siteConfig.baseUrl}/${l}/blog/${lSlug}`;
  }
  languages['x-default'] = `${siteConfig.baseUrl}/en/blog/${post.slugsByLocale.en ?? slug}`;

  const canonical = `${siteConfig.baseUrl}/${locale}/blog/${post.slug}`;

  return {
    title: `${post.title} — MAKO Blog`,
    description: post.description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonical,
      type: post.seo.og_type as 'article',
      ...(post.cover ? { images: [{ url: post.cover }] } : {}),
      siteName: siteConfig.name,
      locale,
      alternateLocale: locales.filter((l) => l !== locale),
      publishedTime: post.date,
      ...(post.updated ? { modifiedTime: post.updated } : {}),
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: post.seo.twitter_card as 'summary_large_image',
      title: post.title,
      description: post.description,
      ...(post.cover ? { images: [post.cover] } : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPost(slug, locale);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: 'blog' });
  const headings = extractHeadings(post.content);

  const canonical = `${siteConfig.baseUrl}/${locale}/blog/${post.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': post.seo.schema,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    ...(post.updated ? { dateModified: post.updated } : {}),
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'MAKO',
      url: siteConfig.baseUrl,
    },
    ...(post.cover ? { image: post.cover } : {}),
    inLanguage: locale,
    mainEntityOfPage: canonical,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-emerald-400 transition-colors mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
            <path fillRule="evenodd" d="M9.78 4.22a.75.75 0 010 1.06L7.06 8l2.72 2.72a.75.75 0 11-1.06 1.06L5.47 8.53a.75.75 0 010-1.06l3.25-3.25a.75.75 0 011.06 0z" clipRule="evenodd" />
          </svg>
          {t('back_to_blog')}
        </Link>

        <div className="flex gap-10">
          <main className="min-w-0 flex-1 max-w-3xl">
            <BlogPostHeader post={post} />
            <div className="prose-blog">
              <MarkdownRenderer content={post.content} />
            </div>
          </main>
          <TableOfContents headings={headings} />
        </div>
      </div>
      <Footer />
    </>
  );
}
