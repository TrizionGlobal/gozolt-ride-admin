import { apiClient } from '@/lib/api-client';
import type { DashboardAllResponse, AnalyticsFilter } from './dashboard.types';

export async function getDashboardAll(filter?: AnalyticsFilter): Promise<DashboardAllResponse> {
  try {
    const { data } = await apiClient.get<DashboardAllResponse>('/admin/dashboard/all', {
      params: filter,
    });
    return data;
  } catch {
    // Return mock data fallback if backend endpoint isn't ready or fails
    return {
      kpis: {
        activeRides: 0,
        onlineDrivers: 0,
        totalUsers: 0,
        totalSuppliers: 0,
        totalDrivers: 0,
        todayRevenue: 0,
        todayRides: 0,
        pendingDocuments: 0,
        pendingSupplierApprovals: 0,
        tipRevenue: 0,
      },
      rideTrends: { totals: [], byVehicleType: [] },
      revenueTrends: [],
      vehicleTypeBreakdown: [],
      actionRequired: [],
      liveActivity: [],
    };
  }
}
