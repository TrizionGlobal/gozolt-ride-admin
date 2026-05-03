import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/constants';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const DEV_COOKIE_NAME = 'gozolt-dev-authenticated';

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string | string[] }> }
): Promise<NextResponse> {
  const { path } = await params;
  const backendPath = Array.isArray(path) ? path.join('/') : path;

  // Read the JWT access token from cookies
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const devAuthenticated = request.cookies.get(DEV_COOKIE_NAME)?.value;

  // Require authentication (allow dev bypass)
  if (!token && !devAuthenticated) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Build the backend URL with query string
  const queryString = request.nextUrl.search;
  const backendUrl = `${BACKEND_URL}/v1/${backendPath}${queryString}`;

  // Build headers for the backend request
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Forward content-type from the original request
  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers['content-type'] = contentType;
  }

  // Determine if the method supports a request body
  const method = request.method;
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);

  // Build fetch options
  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (hasBody) {
    fetchOptions.body = await request.arrayBuffer();
  }

  try {
    const backendResponse = await fetch(backendUrl, fetchOptions);

    // Read the response body
    const responseBody = await backendResponse.arrayBuffer();

    // Build response headers
    const responseHeaders = new Headers();
    const backendContentType = backendResponse.headers.get('content-type');
    if (backendContentType) {
      responseHeaders.set('content-type', backendContentType);
    }

    return new NextResponse(responseBody, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`Proxy error for ${method} /v1/${backendPath}:`, error);
    return NextResponse.json(
      { error: 'Backend service unavailable' },
      { status: 502 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string | string[] }> }
) {
  return handler(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string | string[] }> }
) {
  return handler(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string | string[] }> }
) {
  return handler(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string | string[] }> }
) {
  return handler(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string | string[] }> }
) {
  return handler(request, context);
}
