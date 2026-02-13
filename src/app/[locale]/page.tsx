import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/hero';
import { HowItWorks } from '@/components/how-it-works';
import { Benchmark } from '@/components/benchmark';
import { ProtocolPreview } from '@/components/protocol-preview';
import { Features } from '@/components/features';
import { Ecosystem } from '@/components/ecosystem';
import { CtaSection } from '@/components/cta-section';
import { Footer } from '@/components/footer';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <HowItWorks />
      <Benchmark />
      <ProtocolPreview />
      <Features />
      <Ecosystem />
      <CtaSection />
      <Footer />
    </main>
  );
}
