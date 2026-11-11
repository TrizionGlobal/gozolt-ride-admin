import { apiClient } from '@/lib/api-client';
import type { PricingRule, UpdatePricingPayload } from './pricing.types';

export const pricingService = {
  async getPricingRules(): Promise<PricingRule[]> {
    try {
      const { data } = await apiClient.get<PricingRule[]>('/admin/pricing');
      return data;
    } catch (error) {
      console.error('Failed to get pricing rules:', error);
      throw error;
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

  async getVatSettings(): Promise<{ vatPercentage: number; commissionPercentage?: number; updatedAt?: string }> {
    const { data } = await apiClient.get<{ vatPercentage: number; commissionPercentage?: number; updatedAt?: string }>('/admin/pricing-vat');
    return data;
  },

  async updateVatSettings(
    vatPercentage: number,
    commissionPercentage?: number,
  ): Promise<{ vatPercentage: number; commissionPercentage?: number; updatedAt?: string }> {
    const { data } = await apiClient.patch<{ vatPercentage: number; commissionPercentage?: number; updatedAt?: string }>(
      '/admin/pricing-vat',
      { vatPercentage, commissionPercentage },
    );
    return data;
  },
};
