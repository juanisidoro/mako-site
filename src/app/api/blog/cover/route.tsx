import { ImageResponse } from 'next/og';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const SECRET = process.env.COVER_HMAC_SECRET || 'mako-cover-k7x9p2';

/** Verify HMAC-SHA256 signature using Web Crypto (Edge-compatible). */
async function verifySignature(
  title: string,
  tags: string,
  author: string,
  date: string,
  time: string,
  sig: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const payload = [title, tags, author, date, time].join('|');
  const signed = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const hex = Array.from(new Uint8Array(signed))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
  return hex === sig;
}

// ---------------------------------------------------------------------------
// Theme definitions — each tag maps to a distinct visual style
// ---------------------------------------------------------------------------

interface Theme {
  accent: string;
  gradient: string;
  icon: string;
  label: string;
}

const THEMES: Record<string, Theme> = {
  announcement: {
    accent: '#06d6a0',
    gradient:
      'radial-gradient(ellipse at 20% 20%, rgba(6,214,160,0.20) 0%, transparent 55%)',
    icon: '✦',
    label: 'Announcement',
  },
  checklist: {
    accent: '#8b5cf6',
    gradient:
      'radial-gradient(ellipse at 80% 30%, rgba(139,92,246,0.16) 0%, transparent 55%)',
    icon: '✓',
    label: 'Checklist',
  },
  mcp: {
    accent: '#ec4899',
    gradient:
      'radial-gradient(ellipse at 50% 0%, rgba(236,72,153,0.16) 0%, transparent 55%)',
    icon: '⚡',
    label: 'MCP',
  },
  guide: {
    accent: '#38bdf8',
    gradient:
      'radial-gradient(ellipse at 30% 80%, rgba(56,189,248,0.15) 0%, transparent 55%)',
    icon: '>_',
    label: 'Guide',
  },
  education: {
    accent: '#f59e0b',
    gradient:
      'radial-gradient(ellipse at 70% 70%, rgba(245,158,11,0.14) 0%, transparent 55%)',
    icon: '?',
    label: 'Deep Dive',
  },
  protocol: {
    accent: '#14b8a6',
    gradient:
      'radial-gradient(ellipse at 50% 50%, rgba(20,184,166,0.13) 0%, transparent 55%)',
    icon: '{ }',
    label: 'Protocol',
  },
  default: {
    accent: '#06d6a0',
    gradient:
      'radial-gradient(ellipse at 50% 0%, rgba(6,214,160,0.12) 0%, transparent 60%)',
    icon: 'M',
    label: 'Blog',
  },
};

/** Priority-ordered tag matching — first match wins */
function resolveTheme(tags: string[]): Theme {
  const t = new Set(tags.map((s) => s.toLowerCase()));
  if (t.has('announcement')) return THEMES.announcement;
  if (t.has('checklist')) return THEMES.checklist;
  if (t.has('mcp') || t.has('webmcp')) return THEMES.mcp;
  if (t.has('guide')) return THEMES.guide;
  if (t.has('education')) return THEMES.education;
  if (t.has('protocol')) return THEMES.protocol;
  return THEMES.default;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// GET /api/blog/cover?title=...&tags=...&author=...&date=...&time=3
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get('title') || 'MAKO Blog';
  const tagsRaw = searchParams.get('tags') || '';
  const author = searchParams.get('author') || '';
  const date = searchParams.get('date') || '';
  const readingTime = searchParams.get('time') || '';
  const sig = searchParams.get('sig') || '';

  // Verify HMAC signature — reject unsigned requests
  if (searchParams.get('title')) {
    const valid = await verifySignature(title, tagsRaw, author, date, readingTime, sig);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }
  }

  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()) : [];
  const theme = resolveTheme(tags);
  const displayTitle =
    title.length > 90 ? title.slice(0, 87) + '...' : title;

  // No data at all → generic fallback
  if (!searchParams.get('title')) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#050a0e',
            backgroundImage:
              'radial-gradient(ellipse at top, rgba(6,214,160,0.12) 0%, transparent 60%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 14,
                backgroundColor: 'rgba(6,214,160,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 34,
                fontWeight: 700,
                color: '#06d6a0',
              }}
            >
              M
            </div>
            <span
              style={{ fontSize: 48, fontWeight: 700, color: '#fafafa' }}
            >
              MAKO Blog
            </span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          backgroundColor: '#050a0e',
          backgroundImage: theme.gradient,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            backgroundColor: theme.accent,
          }}
        />

        {/* Decorative background icon */}
        <div
          style={{
            position: 'absolute',
            right: -20,
            bottom: -60,
            fontSize: 280,
            fontWeight: 700,
            color: theme.accent,
            opacity: 0.04,
            lineHeight: 1,
          }}
        >
          {theme.icon}
        </div>

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '48px 64px 40px 48px',
            width: '100%',
            height: '100%',
          }}
        >
          {/* Header: brand + theme label */}
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
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  backgroundColor: 'rgba(6,214,160,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#06d6a0',
                }}
              >
                M
              </div>
              <span
                style={{ fontSize: 20, fontWeight: 600, color: '#64748b' }}
              >
                MAKO Blog
              </span>
            </div>

            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: theme.accent,
                backgroundColor: `${theme.accent}18`,
                padding: '5px 16px',
                borderRadius: 20,
                border: `1px solid ${theme.accent}30`,
              }}
            >
              {theme.label}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: displayTitle.length > 60 ? 38 : 46,
              fontWeight: 700,
              color: '#f8fafc',
              lineHeight: 1.25,
              letterSpacing: '-0.025em',
              maxWidth: 950,
              display: 'flex',
              flex: 1,
            }}
          >
            {displayTitle}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 14,
                    color: '#94a3b8',
                    backgroundColor: 'rgba(30,41,59,0.8)',
                    padding: '5px 14px',
                    borderRadius: 14,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(30,41,59,0.8)',
              paddingTop: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {author && (
                <>
                  <span
                    style={{
                      fontSize: 15,
                      color: '#94a3b8',
                      fontWeight: 500,
                    }}
                  >
                    {author}
                  </span>
                  <span style={{ fontSize: 15, color: '#475569' }}>·</span>
                </>
              )}
              {date && (
                <>
                  <span style={{ fontSize: 15, color: '#64748b' }}>
                    {formatDate(date)}
                  </span>
                  <span style={{ fontSize: 15, color: '#475569' }}>·</span>
                </>
              )}
              {readingTime && (
                <span style={{ fontSize: 15, color: '#64748b' }}>
                  {readingTime} min read
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: 13,
                color: '#475569',
                fontFamily: 'monospace',
              }}
            >
              makospec.vercel.app
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
  );
}
