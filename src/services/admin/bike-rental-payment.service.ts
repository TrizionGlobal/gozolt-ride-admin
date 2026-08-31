import { apiClient } from '@/lib/api-client';
import type {
  PaymentKpis,
  SettlementListResponse,
  TriggerPayoutPayload,
} from './payment.types';

export const bikeRentalPaymentService = {
  async listSettlements(params: { page?: number; limit?: number; status?: string; search?: string }): Promise<SettlementListResponse> {
    try {
      const { data } = await apiClient.get<SettlementListResponse>('/admin/bike-rentals/payments/settlements', { params });
      return data;
    } catch {
      return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1 } };
    }
  },

  async getKpis(): Promise<PaymentKpis> {
    try {
      const { data } = await apiClient.get<PaymentKpis>('/admin/bike-rentals/payments/kpis');
      return data;
    } catch {
      return {
        todayRevenue: 0,
        pendingPayoutsAmount: 0,
        pendingSuppliersCount: 0,
        completedPayoutsAmount: 0,
        completedSuppliersCount: 0,
        overduePayoutsAmount: 0,
        overdueSuppliersCount: 0,
      };
    }
  },

  async triggerPayout(payload: TriggerPayoutPayload): Promise<{ id: string; status: string }> {
    const { data } = await apiClient.post<{ id: string; status: string }>('/admin/payouts', {
      ...payload,
      module: 'RENTAL',
    });
    return data;
  },
};
