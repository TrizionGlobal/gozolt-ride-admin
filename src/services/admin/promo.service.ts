import { apiClient } from '@/lib/api-client';
import { mockPromoCodes } from './promo.mock';
import type { PromoCode, CreatePromoPayload } from './promo.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const promoService = {
  async listPromoCodes(): Promise<PromoCode[]> {
    if (DEV_BYPASS) {
      await delay(400);
      return [...mockPromoCodes];
    }
    const { data } = await apiClient.get('/admin/promo-codes');
    return data.data ?? data;
  },

  async createPromoCode(payload: CreatePromoPayload): Promise<PromoCode> {
    if (DEV_BYPASS) {
      await delay(500);
      const newCode: PromoCode = {
        id: `promo-${Date.now()}`,
        ...payload,
        code: payload.code.toUpperCase(),
        usedCount: 0,
        createdAt: new Date().toISOString(),
      };
      mockPromoCodes.unshift(newCode);
      return newCode;
    }
    const { data } = await apiClient.post<PromoCode>('/admin/promo-codes', payload);
    return data;
  },

  async updatePromoCode(id: string, payload: Partial<CreatePromoPayload>): Promise<PromoCode> {
    if (DEV_BYPASS) {
      await delay(400);
      const code = mockPromoCodes.find((p) => p.id === id);
      if (!code) throw new Error('Promo code not found');
      Object.assign(code, payload);
      return { ...code };
    }
    const { data } = await apiClient.patch<PromoCode>(`/admin/promo-codes/${id}`, payload);
    return data;
  },

  async togglePromoCode(id: string, isActive: boolean): Promise<PromoCode> {
    if (DEV_BYPASS) {
      await delay(400);
      const code = mockPromoCodes.find((p) => p.id === id);
      if (!code) throw new Error('Promo code not found');
      code.isActive = isActive;
      return { ...code };
    }
    const { data } = await apiClient.patch<PromoCode>(`/admin/promo-codes/${id}`, { isActive });
    return data;
  },
};
