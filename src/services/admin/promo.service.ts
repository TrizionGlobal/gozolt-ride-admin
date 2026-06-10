import { apiClient } from '@/lib/api-client';
import type { PromoCode, CreatePromoPayload } from './promo.types';

export const promoService = {
  async listPromoCodes(): Promise<PromoCode[]> {
    try {
      const { data } = await apiClient.get('/admin/promo-codes');
      return data.data ?? data;
    } catch {
      return [];
    }
  },

  async createPromoCode(payload: CreatePromoPayload): Promise<PromoCode> {
    const { data } = await apiClient.post<PromoCode>('/admin/promo-codes', payload);
    return data;
  },

  async updatePromoCode(id: string, payload: Partial<CreatePromoPayload>): Promise<PromoCode> {
    const { data } = await apiClient.patch<PromoCode>(`/admin/promo-codes/${id}`, payload);
    return data;
  },

  async togglePromoCode(id: string, isActive: boolean): Promise<PromoCode> {
    const { data } = await apiClient.patch<PromoCode>(`/admin/promo-codes/${id}`, { isActive });
    return data;
  },
};
