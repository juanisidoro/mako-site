import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const runtime = 'edge';
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#050a0e',
          backgroundImage:
            'radial-gradient(ellipse at top, rgba(6,214,160,0.12) 0%, transparent 60%)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 16,
            backgroundColor: 'rgba(6,214,160,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            fontWeight: 700,
            color: '#06d6a0',
            marginBottom: 24,
          }}
        >
          M
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#fafafa',
            letterSpacing: '-0.02em',
            marginBottom: 8,
          }}
        >
          {siteConfig.name}
        </div>

        <div
          style={{
            fontSize: 28,
            color: '#06d6a0',
            marginBottom: 16,
          }}
        >
          {siteConfig.tagline}
        </div>

        <div
          style={{
            fontSize: 20,
            color: '#94a3b8',
          }}
        >
          93% fewer tokens for AI agents
        </div>
      </div>
    ),
    { ...size }
  );
}
