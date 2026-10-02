import { apiClient } from '@/lib/api-client';
import { QuickServicePricingRule, UpdateQuickServicePricingDto } from './quick-services-pricing.types';

export const quickServicesPricingService = {
  async getAllPricingRules(): Promise<QuickServicePricingRule[]> {
    const { data } = await apiClient.get('/quick-services/pricing-rules');
    return data;
  },

  async updatePricingRule(serviceKey: string, payload: UpdateQuickServicePricingDto): Promise<QuickServicePricingRule> {
    const { data } = await apiClient.post(`/quick-services/admin/pricing-rules/${serviceKey}`, payload);
    return data;
  }
};
