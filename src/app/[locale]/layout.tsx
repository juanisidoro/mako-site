import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { locales } from '@/i18n/config';
import { siteConfig } from '@/config/site';
import { Header } from '@/components/header';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${siteConfig.baseUrl}/${l}`;
  }
  languages['x-default'] = `${siteConfig.baseUrl}/en`;

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(siteConfig.baseUrl),
    alternates: {
      canonical: `${siteConfig.baseUrl}/${locale}`,
      languages,
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${siteConfig.baseUrl}/${locale}`,
      siteName: siteConfig.name,
      locale: locale,
      alternateLocale: locales.filter((l) => l !== locale),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    icons: {
      icon: '/favicon.svg',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'meta' });

  const sameAs = [siteConfig.github];
  if (siteConfig.npm) sameAs.push(siteConfig.npm);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': siteConfig.jsonLd.type,
        '@id': `${siteConfig.baseUrl}/#app`,
        name: siteConfig.name,
        description: t('description'),
        url: siteConfig.baseUrl,
        applicationCategory: siteConfig.jsonLd.applicationCategory,
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        license: siteConfig.jsonLd.license,
        codeRepository: siteConfig.github,
        programmingLanguage: siteConfig.jsonLd.programmingLanguage,
        sameAs,
      },
      {
        '@type': 'SoftwareSourceCode',
        '@id': `${siteConfig.baseUrl}/#source`,
        name: siteConfig.name,
        description: t('description'),
        codeRepository: siteConfig.github,
        url: siteConfig.github,
        programmingLanguage: {
          '@type': 'ComputerLanguage',
          name: siteConfig.jsonLd.programmingLanguage,
        },
        runtimePlatform: 'Node.js',
        license: siteConfig.jsonLd.license,
        targetProduct: { '@id': `${siteConfig.baseUrl}/#app` },
      },
    ],
  };

  return (
    <html lang={locale} className="dark">
      <head>
        {siteConfig.googleSiteVerification && (
          <meta name="google-site-verification" content={siteConfig.googleSiteVerification} />
        )}
        <script
          defer
          src="https://analytics.moniisima.com/script.js"
          data-website-id="0bb9b0f2-7272-4b79-aeee-cc0ec74fdd93"
        />
        <link
          rel="alternate"
          type="text/mako+markdown"
          href={`${siteConfig.baseUrl}/api/mako?path=/${locale}`}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
