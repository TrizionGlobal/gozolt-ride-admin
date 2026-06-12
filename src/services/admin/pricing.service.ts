import { apiClient } from '@/lib/api-client';
import type { PricingRule, UpdatePricingPayload } from './pricing.types';

export const pricingService = {
  async getPricingRules(): Promise<PricingRule[]> {
    try {
      const { data } = await apiClient.get<PricingRule[]>('/admin/pricing');
      return data;
    } catch {
      return [];
    }
  },

  async getPricingRule(id: string): Promise<PricingRule> {
    const { data } = await apiClient.get<PricingRule>(`/admin/pricing/${id}`);
    return data;
  },

  async updatePricingRule(id: string, payload: UpdatePricingPayload): Promise<PricingRule> {
    const { data } = await apiClient.patch<PricingRule>(`/admin/pricing/${id}`, payload);
    return data;
  },
};
