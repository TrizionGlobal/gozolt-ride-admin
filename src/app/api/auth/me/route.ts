import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/constants';
import { jwtVerify } from 'jose';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const userCookie = request.cookies.get('gozolt-user')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // In production, verify the JWT and extract user data
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'fallback-secret');
    const { payload } = await jwtVerify(token, secret);
    
    let user = {
      id: payload.sub,
      email: payload.email || '',
      firstName: payload.firstName || 'System',
      lastName: payload.lastName || 'Admin',
      role: payload.role,
    };

    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        user = { ...user, ...parsedUser };
      } catch (e) {
        // Ignore JSON parse errors
      }
    }

    return NextResponse.json({ user });
  } catch {
    // If JWT verification fails (e.g., mock token), return 401
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
