import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken, refreshToken, user } = body;

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: 'Missing tokens' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, user });

    // Set HTTP-only cookies
    response.cookies.set(AUTH_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
