import { apiClient } from '@/lib/api-client';
import { mockPricingRules } from './pricing.mock';
import type { PricingRule, UpdatePricingPayload } from './pricing.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const pricingService = {
  async getPricingRules(): Promise<PricingRule[]> {
    if (DEV_BYPASS) {
      await delay(400);
      return mockPricingRules;
    }
    const { data } = await apiClient.get<PricingRule[]>('/admin/pricing');
    return data;
  },

  async getPricingRule(id: string): Promise<PricingRule> {
    if (DEV_BYPASS) {
      await delay(300);
      const rule = mockPricingRules.find((r) => r.id === id);
      if (!rule) throw new Error('Pricing rule not found');
      return rule;
    }
    const { data } = await apiClient.get<PricingRule>(`/admin/pricing/${id}`);
    return data;
  },

  async updatePricingRule(id: string, payload: UpdatePricingPayload): Promise<PricingRule> {
    if (DEV_BYPASS) {
      await delay(500);
      const rule = mockPricingRules.find((r) => r.id === id);
      if (!rule) throw new Error('Pricing rule not found');
      Object.assign(rule, payload, { updatedAt: new Date().toISOString() });
      return { ...rule };
    }
    const { data } = await apiClient.patch<PricingRule>(`/admin/pricing/${id}`, payload);
    return data;
  },
};
