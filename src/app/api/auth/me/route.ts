import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/constants';
import { jwtVerify } from 'jose';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // In production, verify the JWT and extract user data
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'fallback-secret');
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      user: {
        id: payload.sub,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role,
      },
    });
  } catch {
    // If JWT verification fails (e.g., mock token), return 401
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
