import { apiClient } from '@/lib/api-client';
import type {
  AdminUser,
  FeeConfig,
} from './settings.types';
import type { PricingRule, UpdatePricingPayload } from './pricing.types';

export const settingsService = {
  // --- Fare Config (reuses pricing rules) ---
  async getFareConfig(): Promise<PricingRule[]> {
    try {
      const { data } = await apiClient.get<PricingRule[]>('/admin/pricing');
      return data;
    } catch {
      return [];
    }
  },

  async updateFareConfig(id: string, payload: UpdatePricingPayload): Promise<PricingRule> {
    const { data } = await apiClient.patch<PricingRule>(`/admin/pricing/${id}`, payload);
    return data;
  },

  // --- Fees ---
  async getFeeConfig(): Promise<FeeConfig> {
    try {
      const { data } = await apiClient.get<PricingRule[]>('/admin/pricing');
      const standard = data.find((r) => r.vehicleType === 'STANDARD') ?? data[0];
      return {
        bookingFee: standard?.bookingFee ?? 0,
        cancellationFee: standard?.cancellationFee ?? 0,
        waitTimeFeePerMin: standard?.waitTimeFeePerMin ?? 0,
        minimumFare: standard?.minimumFare ?? 0,
        _scheduledPremium: 1.50,
      };
    } catch {
      return {
        bookingFee: 0,
        cancellationFee: 0,
        waitTimeFeePerMin: 0,
        minimumFare: 0,
        _scheduledPremium: 1.50,
      };
    }
  },

  async updateFeeConfig(fees: Partial<FeeConfig>): Promise<FeeConfig> {
    // In production, update the STANDARD pricing rule
    const { data: rules } = await apiClient.get<PricingRule[]>('/admin/pricing');
    const standard = rules.find((r) => r.vehicleType === 'STANDARD') ?? rules[0];
    await apiClient.patch(`/admin/pricing/${standard.id}`, fees);
    return fees as FeeConfig;
  },

  // --- Admin Users ---
  async getAdminUsers(): Promise<AdminUser[]> {
    try {
      const { data } = await apiClient.get<{ data: AdminUser[] }>('/admin/users?role=ADMIN');
      return data.data || [];
    } catch {
      return [];
    }
  },
};
