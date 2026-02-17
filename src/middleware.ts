import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const accept = request.headers.get('accept') || '';

  // MAKO content negotiation: if Accept header includes text/mako+markdown,
  // rewrite to the MAKO API route with the original path
  if (accept.includes('text/mako+markdown')) {
    const path = request.nextUrl.pathname;
    const url = request.nextUrl.clone();
    url.pathname = '/api/mako';
    url.searchParams.set('path', path);
    return NextResponse.rewrite(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(how-it-works|analyzer|score|directory)', '/(en|es|pt|fr|de|zh|ja)/:path*'],
};
