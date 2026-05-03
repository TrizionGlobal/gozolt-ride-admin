import { apiClient } from '@/lib/api-client';
import {
  mockAllTransactions,
  mockPaymentKpis,
} from './payment.mock';
import type {
  TransactionFilterParams,
  TransactionListResponse,
  TriggerPayoutPayload,
  PaymentKpis,
} from './payment.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function filterAndPaginate(params: TransactionFilterParams): TransactionListResponse {
  let filtered = [...mockAllTransactions];

  if (params.type) {
    filtered = filtered.filter((t) => t.type === params.type);
  }

  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.id.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s) ||
        t.supplier.toLowerCase().includes(s),
    );
  }

  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return { data, meta: { total, page, limit, totalPages } };
}

export const paymentService = {
  async listTransactions(params: TransactionFilterParams): Promise<TransactionListResponse> {
    if (DEV_BYPASS) {
      await delay(400);
      return filterAndPaginate(params);
    }
    // For real backend: merge calls to /admin/payments + /admin/payouts
    const { data } = await apiClient.get<TransactionListResponse>('/admin/payments', { params });
    return data;
  },

  async triggerPayout(payload: TriggerPayoutPayload): Promise<{ id: string; status: string }> {
    if (DEV_BYPASS) {
      await delay(600);
      return {
        id: `payout-${Date.now()}`,
        status: 'PROCESSING',
      };
    }
    const { data } = await apiClient.post<{ id: string; status: string }>('/admin/payouts', payload);
    return data;
  },

  async getKpis(): Promise<PaymentKpis> {
    if (DEV_BYPASS) {
      await delay(300);
      return { ...mockPaymentKpis };
    }
    const { data } = await apiClient.get<PaymentKpis>('/admin/analytics/revenue');
    return data;
  },
};
