import { apiClient } from '@/lib/api-client';
import type {
  AnalyticsPeriod,
  AnalyticsData,
  TipAnalytics,
  CancellationAnalytics,
} from './analytics.types';

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
    try {
      // Real backend: multiple calls merged
      const [ridesRes, revenueRes, growthRes] = await Promise.allSettled([
        apiClient.get('/admin/analytics/rides', { params: { period } }),
        apiClient.get('/admin/analytics/revenue', { params: { period } }),
        apiClient.get('/admin/analytics/growth', { params: { period } })
      ]);

      const rides = ridesRes.status === 'fulfilled' ? ridesRes.value.data : { totalRides: 0 };
      const revenue = revenueRes.status === 'fulfilled' ? revenueRes.value.data : { totalRevenue: 0, averageFare: 0 };
      const growth = growthRes.status === 'fulfilled' ? growthRes.value.data : { newUsers: 0 };

      return {
        kpis: {
          totalRides: rides.totalRides || 0,
          revenue: revenue.totalRevenue || 0,
          avgRideValue: revenue.averageFare || 0,
          activeUsers: growth.newUsers || 0,
          changes: { totalRides: 0, revenue: 0, avgRideValue: 0, activeUsers: 0 },
        },
        chartData: [],
      };
    } catch {
      return {
        kpis: { totalRides: 0, revenue: 0, avgRideValue: 0, activeUsers: 0, changes: { totalRides: 0, revenue: 0, avgRideValue: 0, activeUsers: 0 } },
        chartData: [],
      };
    }
  },

  async getTipAnalytics(period: AnalyticsPeriod): Promise<TipAnalytics> {
    try {
      const { data } = await apiClient.get('/admin/analytics/tips', { params: { period } });
      return data;
    } catch {
      return { totalTips: 0, totalTipAmount: 0, avgTipPerRide: 0, tipRate: 0, tipTrend: [] };
    }
  },

  async getCancellationAnalytics(): Promise<CancellationAnalytics> {
    try {
      const { data } = await apiClient.get('/admin/analytics/cancellations');
      return data;
    } catch {
      return {
        totalCancellations: 0,
        cancellationRate: 0,
        byReason: [],
        byActor: [],
      };
    }
  },
};
