import { apiClient } from '@/lib/api-client';
import type {
  TransactionFilterParams,
  TransactionListResponse,
  TriggerPayoutPayload,
  PaymentKpis,
} from './payment.types';

export const paymentService = {
  async listTransactions(params: TransactionFilterParams): Promise<TransactionListResponse> {
    try {
      // For real backend: merge calls to /admin/payments + /admin/payouts
      const { data } = await apiClient.get<TransactionListResponse>('/admin/payments', { params });
      return data;
    } catch {
      return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1 } };
    }
  },

  async triggerPayout(payload: TriggerPayoutPayload): Promise<{ id: string; status: string }> {
    const { data } = await apiClient.post<{ id: string; status: string }>('/admin/payouts', payload);
    return data;
  },

  async getKpis(): Promise<PaymentKpis> {
    try {
      const { data } = await apiClient.get<PaymentKpis>('/admin/analytics/revenue');
      return data;
    } catch {
      return { todayRevenue: 0, pendingPayouts: 0, thisMonth: 0, refunds30d: 0, tipRevenue30d: 0 };
    }
  },
};
