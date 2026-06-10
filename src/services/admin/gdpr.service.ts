import { apiClient } from '@/lib/api-client';
import type {
  DataBreach,
  GdprKpis,
  DataRetentionConfig,
  CookieConsentStats,
  ProcessingRestriction,
  CreateBreachPayload,
  BreachStatus,
} from './gdpr.types';

export const gdprService = {
  async getKpis(): Promise<GdprKpis> {
    try {
      const { data } = await apiClient.get('/admin/gdpr/kpis');
      return data;
    } catch {
      return { openBreaches: 0, pendingDeletions: 0, dataExportsThisMonth: 0, restrictedAccounts: 0 };
    }
  },

  async listBreaches(): Promise<DataBreach[]> {
    try {
      const { data } = await apiClient.get('/admin/gdpr/breaches');
      return data.data ?? data;
    } catch {
      return [];
    }
  },

  async createBreach(payload: CreateBreachPayload): Promise<DataBreach> {
    const { data } = await apiClient.post('/admin/gdpr/breaches', payload);
    return data;
  },

  async updateBreachStatus(id: string, status: BreachStatus): Promise<void> {
    await apiClient.patch(`/admin/gdpr/breaches/${id}/status`, { status });
  },

  async getRetentionConfig(): Promise<DataRetentionConfig> {
    try {
      const { data } = await apiClient.get('/admin/gdpr/retention');
      return data;
    } catch {
      return {
        userPurgeDays: 0,
        supplierPurgeDays: 0,
        financialRetentionYears: 0,
        lastPurgeRun: null,
        nextPurgeRun: '',
        recordsPurged: 0
      };
    }
  },

  async getCookieConsentStats(): Promise<CookieConsentStats> {
    try {
      const { data } = await apiClient.get('/admin/gdpr/cookie-consent');
      return data;
    } catch {
      return { totalSessions: 0, analyticsConsent: 0, marketingConsent: 0, essentialOnly: 0 };
    }
  },

  async listProcessingRestrictions(): Promise<ProcessingRestriction[]> {
    try {
      const { data } = await apiClient.get('/admin/gdpr/restrictions');
      return data.data ?? data;
    } catch {
      return [];
    }
  },
};
