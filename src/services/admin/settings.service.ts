import { apiClient } from '@/lib/api-client';
import {
  mockAdminUsers,
  mockSystemConfig,
  mockLanguageConfig,
  mockIntegrations,
  mockFeeConfig,
} from './settings.mock';
import type {
  AdminUser,
  SystemConfigItem,
  LanguageConfig,
  Integration,
  FeeConfig,
} from './settings.types';
import type { PricingRule, UpdatePricingPayload } from './pricing.types';
import { mockPricingRules } from './pricing.mock';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const settingsService = {
  // --- Fare Config (reuses pricing rules) ---
  async getFareConfig(): Promise<PricingRule[]> {
    if (DEV_BYPASS) {
      await delay(400);
      return mockPricingRules;
    }
    const { data } = await apiClient.get<PricingRule[]>('/admin/pricing');
    return data;
  },

  async updateFareConfig(id: string, payload: UpdatePricingPayload): Promise<PricingRule> {
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

  // --- Fees ---
  async getFeeConfig(): Promise<FeeConfig> {
    if (DEV_BYPASS) {
      await delay(300);
      return { ...mockFeeConfig };
    }
    const { data } = await apiClient.get<PricingRule[]>('/admin/pricing');
    const standard = data.find((r) => r.vehicleType === 'STANDARD') ?? data[0];
    return {
      bookingFee: standard.bookingFee,
      cancellationFee: standard.cancellationFee,
      waitTimeFeePerMin: standard.waitTimeFeePerMin,
      minimumFare: standard.minimumFare,
      _scheduledPremium: 1.50,
    };
  },

  async updateFeeConfig(fees: Partial<FeeConfig>): Promise<FeeConfig> {
    if (DEV_BYPASS) {
      await delay(500);
      Object.assign(mockFeeConfig, fees);
      return { ...mockFeeConfig };
    }
    // In production, update the STANDARD pricing rule
    const { data: rules } = await apiClient.get<PricingRule[]>('/admin/pricing');
    const standard = rules.find((r) => r.vehicleType === 'STANDARD') ?? rules[0];
    await apiClient.patch(`/admin/pricing/${standard.id}`, fees);
    return { ...mockFeeConfig, ...fees };
  },

  // --- Admin Users ---
  async getAdminUsers(): Promise<AdminUser[]> {
    if (DEV_BYPASS) {
      await delay(400);
      return [...mockAdminUsers];
    }
    const { data } = await apiClient.get<AdminUser[]>('/admin/users?role=ADMIN');
    return data;
  },

  // --- System Config ---
  async getSystemConfig(): Promise<SystemConfigItem[]> {
    if (DEV_BYPASS) {
      await delay(300);
      return mockSystemConfig.map((s) => ({ ...s }));
    }
    const { data } = await apiClient.get<SystemConfigItem[]>('/admin/settings');
    return data;
  },

  async updateSystemSetting(key: string, value: string | boolean): Promise<SystemConfigItem> {
    if (DEV_BYPASS) {
      await delay(400);
      const item = mockSystemConfig.find((s) => s.key === key);
      if (!item) throw new Error('Setting not found');
      item.value = value;
      return { ...item };
    }
    const { data } = await apiClient.put<SystemConfigItem>(`/admin/settings/${key}`, { value });
    return data;
  },

  // --- Language ---
  async getLanguageConfig(): Promise<LanguageConfig> {
    if (DEV_BYPASS) {
      await delay(300);
      return { ...mockLanguageConfig };
    }
    const { data } = await apiClient.get<LanguageConfig>('/admin/settings/language_config');
    return data;
  },

  async updateLanguageConfig(config: LanguageConfig): Promise<LanguageConfig> {
    if (DEV_BYPASS) {
      await delay(400);
      Object.assign(mockLanguageConfig, config);
      return { ...mockLanguageConfig };
    }
    const { data } = await apiClient.put<LanguageConfig>('/admin/settings/language_config', config);
    return data;
  },

  // --- Integrations ---
  async getIntegrations(): Promise<Integration[]> {
    if (DEV_BYPASS) {
      await delay(400);
      return mockIntegrations.map((i) => ({ ...i }));
    }
    const { data } = await apiClient.get<Integration[]>('/admin/settings/integrations_config');
    return data;
  },

  async testIntegration(id: string): Promise<{ success: boolean }> {
    if (DEV_BYPASS) {
      await delay(1000);
      return { success: true };
    }
    const { data } = await apiClient.post<{ success: boolean }>(
      `/admin/settings/integrations/${id}/test`,
    );
    return data;
  },
};
