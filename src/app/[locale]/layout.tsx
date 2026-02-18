import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { locales } from '@/i18n/config';
import { siteConfig } from '@/config/site';
import { generateAlternates } from '@/lib/metadata';
import { Header } from '@/components/header';
import '../globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

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

  return {
    title: {
      default: t('title'),
      template: '%s | MAKO',
    },
    description: t('description'),
    metadataBase: new URL(siteConfig.baseUrl),
    alternates: generateAlternates(locale, ''),
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
    <html lang={locale} className={`dark ${syne.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <head>
        {siteConfig.googleSiteVerification && (
          <meta name="google-site-verification" content={siteConfig.googleSiteVerification} />
        )}
        <script
          defer
          src="https://analytics.moniisima.com/script.js"
          data-website-id="0bb9b0f2-7272-4b79-aeee-cc0ec74fdd93"
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
