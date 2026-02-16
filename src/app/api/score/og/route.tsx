import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

function getScoreColor(score: number): string {
  if (score >= 81) return '#22c55e';
  if (score >= 61) return '#06d6a0';
  if (score >= 31) return '#f59e0b';
  return '#ef4444';
}

const CAT_COLORS = ['#06d6a0', '#38bdf8', '#8b5cf6', '#f59e0b'];
const CAT_NAMES = ['Discoverable', 'Readable', 'Trustworthy', 'Actionable'];
const CAT_MAX = [15, 30, 30, 25];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const score = parseInt(searchParams.get('score') || '0');
  const grade = searchParams.get('grade') || 'F';
  const domain = searchParams.get('domain') || 'unknown';
  const entity = searchParams.get('entity') || '';
  const cats = [
    parseInt(searchParams.get('c1') || '0'),
    parseInt(searchParams.get('c2') || '0'),
    parseInt(searchParams.get('c3') || '0'),
    parseInt(searchParams.get('c4') || '0'),
  ];

  const color = getScoreColor(score);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#050a0e',
          backgroundImage:
            'radial-gradient(ellipse at top, rgba(6,214,160,0.08) 0%, transparent 60%)',
          padding: '48px 64px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: 'rgba(6,214,160,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 700,
                color: '#06d6a0',
              }}
            >
              M
            </div>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#ffffff' }}>
              MAKO Score
            </span>
          </div>
          <span style={{ fontSize: 18, color: '#64748b', fontFamily: 'monospace' }}>
            {domain}
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            gap: 64,
          }}
        >
          {/* Gauge */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 200,
              height: 200,
              borderRadius: '50%',
              border: `8px solid ${color}`,
              boxShadow: `0 0 40px ${color}40`,
            }}
          >
            <span
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: color,
                lineHeight: 1,
              }}
            >
              {score}
            </span>
            <span
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: color,
                opacity: 0.8,
              }}
            >
              {grade}
            </span>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 20 }}>
            {/* Entity */}
            {entity && (
              <p
                style={{
                  fontSize: 20,
                  color: '#94a3b8',
                  marginBottom: 8,
                }}
              >
                &ldquo;{entity.length > 50 ? entity.slice(0, 47) + '...' : entity}&rdquo;
              </p>
            )}

            {/* Category bars */}
            {cats.map((catScore, i) => {
              const pct = (catScore / CAT_MAX[i]) * 100;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      flex: 1,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: '#1e293b',
                      overflow: 'hidden',
                      display: 'flex',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.max(pct, 3)}%`,
                        height: '100%',
                        borderRadius: 10,
                        backgroundColor: CAT_COLORS[i],
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: 200,
                    }}
                  >
                    <span style={{ fontSize: 14, color: '#94a3b8' }}>
                      {CAT_NAMES[i]}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        color: '#64748b',
                        fontFamily: 'monospace',
                      }}
                    >
                      {catScore}/{CAT_MAX[i]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #1e293b',
            paddingTop: 20,
            marginTop: 20,
          }}
        >
          <span style={{ fontSize: 14, color: '#475569' }}>
            makospec.vercel.app/score
          </span>
          <span style={{ fontSize: 14, color: '#475569' }}>
            Powered by MAKO
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
