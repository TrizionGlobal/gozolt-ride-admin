import { apiClient } from '@/lib/api-client';
import type {
  TransactionFilterParams,
  TransactionListResponse,
  TriggerPayoutPayload,
  PaymentKpis,
  SettledBalanceResponse,
} from './payment.types';

export const paymentService = {
  async listTransactions(params: TransactionFilterParams): Promise<TransactionListResponse> {
    try {
      const { data } = await apiClient.get<TransactionListResponse>('/admin/payments', { params });
      return data;
    } catch {
      return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1 } };
    }
  },

  async listSettlements(params: { page?: number; limit?: number }): Promise<import('./payment.types').SettlementListResponse> {
    try {
      const { data } = await apiClient.get<import('./payment.types').SettlementListResponse>('/admin/payments/all/settlements', { params });
      return data;
    } catch {
      return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1 } };
    }
  },

  async triggerPayout(payload: TriggerPayoutPayload): Promise<{ id: string; status: string }> {
    const { data } = await apiClient.post<{ id: string; status: string }>('/admin/payouts', payload);
    return data;
  },

  async notifySupplierBankDetails(supplierId: string): Promise<void> {
    await apiClient.post('/admin/payouts/notify-bank-details', { supplierId });
  },

  async getSettledBalance(supplierId: string, module?: 'CAB' | 'RENTAL'): Promise<SettledBalanceResponse> {
    const { data } = await apiClient.get<SettledBalanceResponse>(`/admin/suppliers/${supplierId}/settled-balance`, {
      params: module ? { module } : undefined,
    });
    return data;
  },

  async getKpis(): Promise<PaymentKpis> {
    try {
      const { data } = await apiClient.get<PaymentKpis>('/admin/payments/kpis');
      return data;
    } catch {
      return { 
        todayRevenue: 0, 
        pendingPayoutsAmount: 0, 
        pendingSuppliersCount: 0, 
        completedPayoutsAmount: 0, 
        completedSuppliersCount: 0, 
        overduePayoutsAmount: 0, 
        overdueSuppliersCount: 0 
      };
    }
  },
};
