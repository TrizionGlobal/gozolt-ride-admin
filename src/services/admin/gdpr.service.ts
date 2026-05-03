import { apiClient } from '@/lib/api-client';
import {
  mockBreaches,
  mockGdprKpis,
  mockRetentionConfig,
  mockCookieConsentStats,
  mockProcessingRestrictions,
} from './gdpr.mock';
import type {
  DataBreach,
  GdprKpis,
  DataRetentionConfig,
  CookieConsentStats,
  ProcessingRestriction,
  CreateBreachPayload,
  BreachStatus,
} from './gdpr.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const gdprService = {
  async getKpis(): Promise<GdprKpis> {
    if (DEV_BYPASS) {
      await delay(400);
      return { ...mockGdprKpis };
    }
    const { data } = await apiClient.get('/admin/gdpr/kpis');
    return data;
  },

  async listBreaches(): Promise<DataBreach[]> {
    if (DEV_BYPASS) {
      await delay(450);
      return [...mockBreaches];
    }
    const { data } = await apiClient.get('/admin/gdpr/breaches');
    return data.data ?? data;
  },

  async createBreach(payload: CreateBreachPayload): Promise<DataBreach> {
    if (DEV_BYPASS) {
      await delay(500);
      const newBreach: DataBreach = {
        id: `breach-${Date.now()}`,
        reportedBy: 'admin-uuid-001',
        reporterName: 'Admin',
        description: payload.description,
        affectedUsers: payload.affectedUsers,
        dataTypes: payload.dataTypes,
        severity: payload.severity,
        status: 'REPORTED',
        mitigationSteps: null,
        notifiedDpaAt: null,
        reportedAt: new Date().toISOString(),
        resolvedAt: null,
      };
      mockBreaches.unshift(newBreach);
      return newBreach;
    }
    const { data } = await apiClient.post('/admin/gdpr/breaches', payload);
    return data;
  },

  async updateBreachStatus(id: string, status: BreachStatus): Promise<void> {
    if (DEV_BYPASS) {
      await delay(400);
      const breach = mockBreaches.find((b) => b.id === id);
      if (breach) {
        breach.status = status;
        if (status === 'RESOLVED') {
          breach.resolvedAt = new Date().toISOString();
        }
      }
      return;
    }
    await apiClient.patch(`/admin/gdpr/breaches/${id}/status`, { status });
  },

  async getRetentionConfig(): Promise<DataRetentionConfig> {
    if (DEV_BYPASS) {
      await delay(400);
      return { ...mockRetentionConfig };
    }
    const { data } = await apiClient.get('/admin/gdpr/retention');
    return data;
  },

  async getCookieConsentStats(): Promise<CookieConsentStats> {
    if (DEV_BYPASS) {
      await delay(450);
      return { ...mockCookieConsentStats };
    }
    const { data } = await apiClient.get('/admin/gdpr/cookie-consent');
    return data;
  },

  async listProcessingRestrictions(): Promise<ProcessingRestriction[]> {
    if (DEV_BYPASS) {
      await delay(400);
      return [...mockProcessingRestrictions];
    }
    const { data } = await apiClient.get('/admin/gdpr/restrictions');
    return data.data ?? data;
  },
};
