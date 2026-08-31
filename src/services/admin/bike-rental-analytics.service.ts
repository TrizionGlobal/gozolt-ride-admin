import { apiClient } from '@/lib/api-client';

export interface BikeRentalAnalyticsData {
  overview: {
    grossPaidRevenue: number;
    totalRefundedAmount: number;
    netSupplierEarnings: number;
    totalBookings: number;
    completedBookings: number;
    averageRentalDuration: number;
    completionRate: number;
    averageBookingValue: number;
  };
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    bookings: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    revenue: number;
  }>;
  topSuppliers: Array<{
    name: string;
    totalRevenue: number;
    completedBookings: number;
  }>;
}

export const bikeRentalAnalyticsService = {
  async getAnalytics(): Promise<BikeRentalAnalyticsData> {
    try {
      const { data } = await apiClient.get<BikeRentalAnalyticsData>('/admin/bike-rentals/analytics');
      return data;
    } catch {
      return {
        overview: {
          grossPaidRevenue: 0,
          totalRefundedAmount: 0,
          netSupplierEarnings: 0,
          totalBookings: 0,
          completedBookings: 0,
          averageRentalDuration: 0,
          completionRate: 0,
          averageBookingValue: 0,
        },
        monthlyRevenue: [],
        categoryBreakdown: [],
        topSuppliers: [],
      };
    }
  },
};
