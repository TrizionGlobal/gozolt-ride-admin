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

  // Allow unauthenticated requests for specific paths like login/register
  const isPublicRoute = backendPath.startsWith('auth/admin/login') || backendPath.startsWith('auth/refresh');

  // Require authentication (allow dev bypass)
  if (!isPublicRoute && !token && !devAuthenticated) {
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


    // INTERCEPT: If the frontend requests /admin/dashboard/all, aggregate the individual APIs
    if (backendPath === 'admin/dashboard/all') {
      const [
        kpisRes,
        rideTrendsRes,
        revenueTrendsRes,
        driverStatsRes,
        ridesRes,
        paymentsRes,
        documentsRes,
        peakHoursRes,
      ] = await Promise.all([
        fetch(`${BACKEND_URL}/v1/admin/dashboard${queryString}`, fetchOptions),
        fetch(`${BACKEND_URL}/v1/analytics/rides/trends${queryString}`, fetchOptions),
        fetch(`${BACKEND_URL}/v1/analytics/revenue/trends${queryString}`, fetchOptions),
        fetch(`${BACKEND_URL}/v1/admin/drivers/stats`, fetchOptions),
        fetch(`${BACKEND_URL}/v1/admin/rides?limit=10`, fetchOptions),
        fetch(`${BACKEND_URL}/v1/admin/payments?limit=10`, fetchOptions),
        fetch(`${BACKEND_URL}/v1/admin/documents?limit=10`, fetchOptions),
        fetch(`${BACKEND_URL}/v1/analytics/peak-hours${queryString}`, fetchOptions),
      ]);

      const kpis = kpisRes.ok ? await kpisRes.json() : {
        activeRides: 0, onlineDrivers: 0, totalUsers: 0, totalSuppliers: 0,
        totalDrivers: 0, todayRevenue: 0, todayRides: 0, pendingDocuments: 0,
        pendingSupplierApprovals: 0, tipRevenue: 0,
      };
      
      const rideTrends = rideTrendsRes.ok ? await rideTrendsRes.json() : { totals: [], byVehicleType: [] };
      const revenueTrends = revenueTrendsRes.ok ? await revenueTrendsRes.json() : [];

      const driverStats = driverStatsRes.ok ? await driverStatsRes.json() : {
        activeDrivers: 0, onlineNow: 0, pendingApproval: 0, suspended: 0,
      };

      const ridesData = ridesRes.ok ? await ridesRes.json() : { data: [] };
      const paymentsData = paymentsRes.ok ? await paymentsRes.json() : { data: [] };
      const documentsData = documentsRes.ok ? await documentsRes.json() : { data: [] };
      const peakHours = peakHoursRes.ok ? await peakHoursRes.json() : { byHour: [], byHourAndDay: [] };

      // Helper for formatting time relatively
      const formatActivityTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      };

      // Map rides to activity
      const rideActivities = (ridesData.data || []).map((ride: any) => {
        const userName = ride.user ? `${ride.user.firstName} ${ride.user.lastName}` : 'Rider';
        const driverName = ride.driver ? `${ride.driver.firstName} ${ride.driver.lastName}` : '';
        let msg = `New ride requested by ${userName}`;
        if (ride.status === 'COMPLETED') {
          msg = `Ride completed by ${driverName || 'Driver'}. Fare: €${Number(ride.actualFare || 0).toFixed(2)}`;
        } else if (ride.status === 'ACCEPTED') {
          msg = `Ride accepted by ${driverName || 'Driver'}`;
        } else if (ride.status === 'CANCELLED') {
          msg = `Ride cancelled by ${userName}`;
        } else if (ride.status === 'IN_PROGRESS') {
          msg = `Ride in progress to ${ride.dropoffAddress?.split(',')[0] || 'destination'}`;
        }
        return {
          id: `ride-${ride.id}`,
          message: msg,
          timestamp: formatActivityTime(ride.createdAt),
          type: 'ride' as const,
          rawTime: new Date(ride.createdAt).getTime(),
        };
      });

      // Map payments to activity
      const paymentActivities = (paymentsData.data || []).map((payment: any) => {
        const userName = payment.user ? `${payment.user.firstName} ${payment.user.lastName}` : 'User';
        const msg = `Payment of €${Number(payment.amount).toFixed(2)} ${payment.status?.toLowerCase()} via ${payment.method} for ${userName}`;
        return {
          id: `payment-${payment.id}`,
          message: msg,
          timestamp: formatActivityTime(payment.createdAt),
          type: 'payment' as const,
          rawTime: new Date(payment.createdAt).getTime(),
        };
      });

      // Map documents to activity
      const documentActivities = (documentsData.data || []).map((doc: any) => {
        const entityType = doc.entityType?.toLowerCase() || 'driver';
        const docName = doc.type?.replace(/_/g, ' ')?.toLowerCase() || 'document';
        const msg = `New ${docName} uploaded by ${entityType}`;
        return {
          id: `doc-${doc.id}`,
          message: msg,
          timestamp: formatActivityTime(doc.createdAt),
          type: 'document' as const,
          rawTime: new Date(doc.createdAt).getTime(),
        };
      });

      // Combine and sort
      const liveActivity = [
        ...rideActivities,
        ...paymentActivities,
        ...documentActivities,
      ]
        .sort((a, b) => b.rawTime - a.rawTime)
        .slice(0, 5);

      // Build action required list
      const actionRequired = [
        {
          label: 'Pending Documents',
          count: kpis.pendingDocuments || 0,
          color: '#EF4444',
        },
        {
          label: 'Supplier Approvals',
          count: kpis.pendingSupplierApprovals || 0,
          color: '#F59E0B',
        },
        {
          label: 'Driver Approvals',
          count: driverStats.pendingApproval || 0,
          color: '#3B82F6',
        },
      ];

      // Calculate dynamic vehicle breakdown from rideTrends.byVehicleType
      let vehicleTypeBreakdown: any[] = [];
      if (rideTrends && Array.isArray(rideTrends.byVehicleType)) {
        const counts: Record<string, number> = {
          GO: 0,
          STANDARD: 0,
          COMFORT: 0,
          GREEN: 0,
          PRIME: 0,
          PREMIUM_XL: 0,
          VAN: 0,
          CHAUFFEUR: 0
        };
        let totalCount = 0;
        
        rideTrends.byVehicleType.forEach((item: any) => {
          const vType = (item.vehicleType || item.type)?.toUpperCase();
          if (vType && vType in counts) {
            counts[vType] = (counts[vType] || 0) + (item.count || 0);
            totalCount += (item.count || 0);
          }
        });
        
        vehicleTypeBreakdown = Object.entries(counts).map(([type, count]) => ({
          type,
          count,
          percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
        }));
      }

      const data = {
        kpis,
        rideTrends,
        revenueTrends,
        vehicleTypeBreakdown,
        actionRequired,
        liveActivity,
        peakHours,
      };

      return NextResponse.json(data);
    }

    // STANDARD PROXY BEHAVIOR
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
