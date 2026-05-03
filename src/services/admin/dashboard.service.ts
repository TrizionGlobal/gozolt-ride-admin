import { apiClient } from '@/lib/api-client';
import { dashboardMockData } from './dashboard.mock';
import type {
  DashboardKpi,
  RideTrends,
  RevenueTrendPoint,
  AnalyticsFilter,
} from './dashboard.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

export async function getDashboardKPIs(): Promise<DashboardKpi> {
  if (DEV_BYPASS) {
    await new Promise((r) => setTimeout(r, 500));
    return dashboardMockData.kpis;
  }
  const { data } = await apiClient.get<DashboardKpi>('/admin/dashboard');
  return data;
}

export async function getRideTrends(filter?: AnalyticsFilter): Promise<RideTrends> {
  if (DEV_BYPASS) {
    await new Promise((r) => setTimeout(r, 400));
    return dashboardMockData.rideTrends;
  }
  const { data } = await apiClient.get<RideTrends>('/analytics/rides/trends', {
    params: filter,
  });
  return data;
}

export async function getRevenueTrends(filter?: AnalyticsFilter): Promise<RevenueTrendPoint[]> {
  if (DEV_BYPASS) {
    await new Promise((r) => setTimeout(r, 400));
    return dashboardMockData.revenueTrends;
  }
  const { data } = await apiClient.get<RevenueTrendPoint[]>('/analytics/revenue/trends', {
    params: filter,
  });
  return data;
}
