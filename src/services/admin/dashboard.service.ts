import { apiClient } from '@/lib/api-client';
import type {
  DashboardKpi,
  RideTrends,
  RevenueTrendPoint,
  AnalyticsFilter,
} from './dashboard.types';
export async function getDashboardKPIs(): Promise<DashboardKpi> {
  try {
    const { data } = await apiClient.get<DashboardKpi>('/admin/dashboard');
    return data;
  } catch {
    return {
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
    };
  }
}

export async function getRideTrends(filter?: AnalyticsFilter): Promise<RideTrends> {
  try {
    const { data } = await apiClient.get<RideTrends>('/analytics/rides/trends', {
      params: filter,
    });
    return data;
  } catch {
    return { totals: [], byVehicleType: [] };
  }
}

export async function getRevenueTrends(filter?: AnalyticsFilter): Promise<RevenueTrendPoint[]> {
  try {
    const { data } = await apiClient.get<RevenueTrendPoint[]>('/analytics/revenue/trends', {
      params: filter,
    });
    return data;
  } catch {
    return [];
  }
}
