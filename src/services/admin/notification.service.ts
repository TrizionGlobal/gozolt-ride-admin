import { apiClient } from '@/lib/api-client';
import { mockCampaigns, mockNotificationStats } from './notification.mock';
import type {
  NotificationCampaign,
  NotificationStats,
  CreateCampaignPayload,
  ChannelTab,
} from './notification.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function filterByChannel(campaigns: NotificationCampaign[], tab: ChannelTab): NotificationCampaign[] {
  switch (tab) {
    case 'all':
      return campaigns;
    case 'push':
      return campaigns.filter((c) => c.channels.includes('PUSH'));
    case 'email':
      return campaigns.filter((c) => c.channels.includes('EMAIL'));
    case 'sms':
      return campaigns.filter((c) => c.channels.includes('SMS'));
    case 'in_app':
      return campaigns.filter((c) => c.channels.includes('IN_APP'));
    case 'scheduled':
      return campaigns.filter((c) => c.status === 'SCHEDULED');
    default:
      return campaigns;
  }
}

export const notificationService = {
  async listCampaigns(tab?: ChannelTab, search?: string): Promise<NotificationCampaign[]> {
    if (DEV_BYPASS) {
      await delay(400);
      let filtered = [...mockCampaigns];
      if (tab && tab !== 'all') filtered = filterByChannel(filtered, tab);
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((c) => c.title.toLowerCase().includes(q));
      }
      return filtered;
    }
    const { data } = await apiClient.get('/admin/notifications/campaigns', {
      params: { channel: tab, search },
    });
    return data.data ?? data;
  },

  async createCampaign(payload: CreateCampaignPayload): Promise<NotificationCampaign> {
    if (DEV_BYPASS) {
      await delay(500);
      const newCampaign: NotificationCampaign = {
        id: `camp-${Date.now()}`,
        title: payload.title,
        body: payload.body,
        type: payload.type,
        channels: payload.channels,
        targetAudience: payload.targetAudience,
        targetUserIds: payload.targetUserIds || [],
        targetRoles: [],
        status: payload.scheduledAt ? 'SCHEDULED' : 'SENT',
        scheduledAt: payload.scheduledAt,
        sentAt: payload.scheduledAt ? null : new Date().toISOString(),
        sentCount: payload.scheduledAt ? 0 : 284,
        deliveredCount: payload.scheduledAt ? 0 : 271,
        openedCount: payload.scheduledAt ? 0 : 198,
        failedCount: payload.scheduledAt ? 0 : 13,
        data: null,
        createdBy: 'admin-uuid-001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockCampaigns.unshift(newCampaign);
      return newCampaign;
    }
    const { data } = await apiClient.post('/admin/notifications/campaigns', payload);
    if (!payload.scheduledAt) {
      await apiClient.post(`/admin/notifications/campaigns/${data.id}/send`);
    }
    return data;
  },

  async deleteCampaign(id: string): Promise<void> {
    if (DEV_BYPASS) {
      await delay(400);
      const idx = mockCampaigns.findIndex((c) => c.id === id);
      if (idx !== -1) mockCampaigns.splice(idx, 1);
      return;
    }
    await apiClient.delete(`/admin/notifications/campaigns/${id}`);
  },

  async duplicateCampaign(id: string): Promise<NotificationCampaign> {
    if (DEV_BYPASS) {
      await delay(400);
      const original = mockCampaigns.find((c) => c.id === id);
      if (!original) throw new Error('Not found');
      const copy: NotificationCampaign = {
        ...original,
        id: `camp-${Date.now()}`,
        title: `Copy of: ${original.title}`,
        status: 'DRAFT',
        sentAt: null,
        sentCount: 0,
        deliveredCount: 0,
        openedCount: 0,
        failedCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockCampaigns.unshift(copy);
      return copy;
    }
    const { data } = await apiClient.post(`/admin/notifications/campaigns/${id}/duplicate`);
    return data;
  },

  async getNotificationStats(): Promise<NotificationStats> {
    if (DEV_BYPASS) {
      await delay(200);
      return { ...mockNotificationStats };
    }
    const { data } = await apiClient.get('/admin/notifications/stats');
    return data;
  },
};
