import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/hero';
import { Problem } from '@/components/problem';
import { Benchmark } from '@/components/benchmark';
import { AudienceBenefits } from '@/components/audience-benefits';
import { Comparison } from '@/components/comparison';
import { ScoreInline } from '@/components/score-inline';
import { HowItWorks } from '@/components/how-it-works';
import { ProtocolPreview } from '@/components/protocol-preview';
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
      <Problem />
      <Benchmark />
      <AudienceBenefits />
      <Comparison />
      <ScoreInline />
      <HowItWorks />
      <ProtocolPreview />
      <Ecosystem />
      <CtaSection />
      <Footer />
    </main>
  );
}
