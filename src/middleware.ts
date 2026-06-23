import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/lib/constants';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

const publicPaths = ['/login', '/verify-2fa', '/forgot-password', '/api/auth', '/api/proxy/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths and static files
  if (
    publicPaths.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // In DEV_BYPASS mode, check localStorage-simulated auth via a cookie marker
  if (DEV_BYPASS) {
    const devAuth = request.cookies.get('gozolt-dev-authenticated')?.value;
    if (!devAuth) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Check for auth cookie
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

    if (refreshToken) {
      try {
        const backendResponse = await fetch(`${BACKEND_URL}/v1/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (backendResponse.ok) {
          const data = await backendResponse.json();
          const response = NextResponse.next();

          response.cookies.set(AUTH_COOKIE_NAME, data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 15 * 60,
          });

          response.cookies.set(REFRESH_COOKIE_NAME, data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
          });

          return response;
        } else if (backendResponse.status === 401 || backendResponse.status === 403) {
          const currentPath = request.nextUrl.pathname + request.nextUrl.search;
          const loginUrl = new URL('/login', request.url);
          loginUrl.searchParams.set('redirect', currentPath);
          return NextResponse.redirect(loginUrl);
        } else {
          return NextResponse.next();
        }
      } catch (err) {
        console.error('Middleware token refresh failed:', err);
        return NextResponse.next();
      }
    }

    const currentPath = request.nextUrl.pathname + request.nextUrl.search;
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', currentPath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
