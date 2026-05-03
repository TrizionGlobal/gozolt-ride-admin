import { apiClient } from '@/lib/api-client';
import { mockAnalyticsKpis, generateChartData, mockTipAnalytics, generateTipTrend, mockCancellationAnalytics } from './analytics.mock';
import type {
  AnalyticsPeriod,
  AnalyticsData,
  TipAnalytics,
  CancellationAnalytics,
} from './analytics.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function periodToDays(period: AnalyticsPeriod): number {
  switch (period) {
    case '7d': return 7;
    case '30d': return 30;
    case '90d': return 90;
    case '1Y': return 365;
  }
}

export const analyticsService = {
  async getAnalytics(period: AnalyticsPeriod): Promise<AnalyticsData> {
    if (DEV_BYPASS) {
      await delay(400);
      return {
        kpis: { ...mockAnalyticsKpis },
        chartData: generateChartData(periodToDays(period)),
      };
    }
    // Real backend: multiple calls merged
    const { data: rides } = await apiClient.get('/admin/analytics/rides', { params: { period } });
    const { data: revenue } = await apiClient.get('/admin/analytics/revenue', { params: { period } });
    const { data: growth } = await apiClient.get('/admin/analytics/growth', { params: { period } });
    return {
      kpis: {
        totalRides: rides.totalRides,
        revenue: revenue.totalRevenue,
        avgRideValue: revenue.averageFare,
        activeUsers: growth.newUsers,
        changes: { totalRides: 12, revenue: 18, avgRideValue: 12, activeUsers: 12 },
      },
      chartData: [],
    };
  },

  async getTipAnalytics(period: AnalyticsPeriod): Promise<TipAnalytics> {
    if (DEV_BYPASS) {
      await delay(350);
      return {
        ...mockTipAnalytics,
        tipTrend: generateTipTrend(periodToDays(period)),
      };
    }
    const { data } = await apiClient.get('/admin/analytics/tips', { params: { period } });
    return data;
  },

  async getCancellationAnalytics(): Promise<CancellationAnalytics> {
    if (DEV_BYPASS) {
      await delay(350);
      return { ...mockCancellationAnalytics };
    }
    const { data } = await apiClient.get('/admin/analytics/cancellations');
    return data;
  },
};
