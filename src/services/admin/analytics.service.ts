import { apiClient } from '@/lib/api-client';
import type {
  DateRange,
  AnalyticsData,
  CancellationAnalytics,
} from './analytics.types';

export const analyticsService = {
  async getAnalytics(range: DateRange): Promise<AnalyticsData> {
    try {
      const { data } = await apiClient.get<AnalyticsData>('/admin/analytics', { params: { from: range.from, to: range.to } });
      return data;
    } catch {
      return {
        kpis: { totalRides: 0, revenue: 0, avgRideValue: 0, activeUsers: 0, changes: { totalRides: 0, revenue: 0, avgRideValue: 0, activeUsers: 0 } },
        chartData: [],
        cancellations: { totalCancellations: 0, cancellationRate: 0, byReason: [], byActor: [] }
      };
    }
  },



  async getCancellationAnalytics(range: DateRange): Promise<CancellationAnalytics> {
    try {
      const data = await this.getAnalytics(range);
      return data.cancellations;
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
