import { NextRequest, NextResponse } from 'next/server';
import { encrypt } from './utils/string';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname, search } = request.nextUrl;

  // Check if the current path is under /dashboard
  if (pathname.startsWith('/dashboard')) {
    // If no token cookie exists, redirect to /auth with encrypted callback
    if (!token) {
      const callbackUrl = pathname + search;
      const encryptedCallback = await encrypt(callbackUrl);
      const authUrl = new URL('/auth', request.url);
      authUrl.searchParams.set('redirect', encryptedCallback);
      return NextResponse.redirect(authUrl);
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*'
};
