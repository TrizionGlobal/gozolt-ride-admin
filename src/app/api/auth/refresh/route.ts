import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/lib/constants';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  const refreshTokenValue = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

  if (!refreshTokenValue) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  try {
    // Forward the refresh request to the backend
    const backendResponse = await fetch(`${BACKEND_URL}/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshTokenValue }),
    });

    if (!backendResponse.ok) {
      const status = backendResponse.status;
      return NextResponse.json(
        { error: 'Refresh failed' },
        { status: [401, 403].includes(status) ? 401 : status }
      );
    }

    const data = await backendResponse.json();
    const response = NextResponse.json({ success: true });

    // Update cookies with new tokens
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
  } catch {
    return NextResponse.json({ error: 'Refresh failed' }, { status: 500 });
  }
}
