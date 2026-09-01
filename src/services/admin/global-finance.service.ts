import { apiClient } from '@/lib/api-client';
import type {
  PaymentKpis,
  SettlementListResponse,
} from './payment.types';

export const globalFinanceService = {
  async listSettlements(params: { page?: number; limit?: number; status?: string; search?: string }): Promise<SettlementListResponse> {
    try {
      const { data } = await apiClient.get<SettlementListResponse>('/admin/global-finance/settlements', { params });
      return data;
    } catch {
      return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1 } };
    }
  },

  async getKpis(): Promise<PaymentKpis> {
    try {
      const { data } = await apiClient.get<PaymentKpis>('/admin/global-finance/kpis');
      return data;
    } catch {
      return { 
        todayRevenue: 0,
        pendingPayoutsAmount: 0,
        completedPayoutsAmount: 0,
        overduePayoutsAmount: 0,
        pendingSuppliersCount: 0,
        completedSuppliersCount: 0,
        overdueSuppliersCount: 0,
      };
    }
  },
};
