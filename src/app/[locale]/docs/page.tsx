import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { Footer } from '@/components/footer';
import { DocsMobileDrawer } from '@/components/docs/docs-mobile-drawer';

const CARDS = [
  {
    slug: 'spec',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    badge: 'v0.1.0',
  },
  {
    slug: 'cef',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    badge: 'v0.1.0',
  },
  {
    slug: 'headers',
    icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    badge: null,
  },
  {
    slug: 'examples',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    badge: null,
  },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'docs' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function DocsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'docs' });

  return (
    <>
      <main className="max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-slate-400 mb-8">{t('subtitle')}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          {CARDS.map(({ slug, icon, badge }) => (
            <Link
              key={slug}
              href={`/docs/${slug}`}
              className="group rounded-xl border border-slate-800 bg-card p-5 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/5"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={icon} />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {t(`card_${slug}_title`)}
                  </h2>
                  {badge && (
                    <span className="inline-block mt-1 text-xs text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                      {badge}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t(`card_${slug}_desc`)}
              </p>
            </Link>
          ))}
        </div>
      </main>
      <DocsMobileDrawer />
      <Footer />
    </>
  );
}
