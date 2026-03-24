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

  const response = intlMiddleware(request);

  // Crawl budget optimization: mark _rsc prefetch URLs as noindex
  // to prevent Google from wasting crawl budget on RSC flight data
  if (request.nextUrl.searchParams.has('_rsc')) {
    response.headers.set('X-Robots-Tag', 'noindex');
  }

  return response;
}

export const config = {
  matcher: ['/', '/(en|es|pt|fr|de|zh|ja)/:path*'],
};
