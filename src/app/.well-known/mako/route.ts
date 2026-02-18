import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { mako: '1.0' },
    {
      headers: {
        'Cache-Control': 'public, max-age=86400',
      },
    }
  );
}
