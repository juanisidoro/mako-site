import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/hero';
import { TheShift } from '@/components/the-shift';
import { ProblemProof } from '@/components/problem-proof';
import { WhatIsMako } from '@/components/what-is-mako';
import { HowItWorksSimple } from '@/components/how-it-works-simple';
import { ProtocolPreview } from '@/components/protocol-preview';
import { AudienceImpact } from '@/components/audience-impact';
import { GetStarted } from '@/components/get-started';
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
      <TheShift />
      <ProblemProof />
      <WhatIsMako />
      <HowItWorksSimple />
      <ProtocolPreview />
      <AudienceImpact />
      <GetStarted />
      <Footer />
    </main>
  );
}
