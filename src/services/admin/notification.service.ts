import { apiClient } from '@/lib/api-client';
import type {
  NotificationCampaign,
  NotificationStats,
  CreateCampaignPayload,
  ChannelTab,
} from './notification.types';

export const notificationService = {
  async listCampaigns(tab?: ChannelTab, search?: string): Promise<NotificationCampaign[]> {
    try {
      const params: any = { search };
      if (tab === 'scheduled') {
        params.status = 'SCHEDULED';
      } else if (tab && tab !== 'all') {
        params.channel = tab.toUpperCase();
      }
      
      const { data } = await apiClient.get('/admin/notifications/campaigns', {
        params,
      });
      return data.data ?? data;
    } catch {
      return [];
    }
  },

  async createCampaign(payload: CreateCampaignPayload): Promise<NotificationCampaign> {
    const { data } = await apiClient.post('/admin/notifications/campaigns', payload);
    if (!payload.scheduledAt) {
      await apiClient.post(`/admin/notifications/campaigns/${data.id}/send`);
    }
    return data;
  },

  async deleteCampaign(id: string): Promise<void> {
    await apiClient.delete(`/admin/notifications/campaigns/${id}`);
  },

  async duplicateCampaign(id: string): Promise<NotificationCampaign> {
    const { data } = await apiClient.post(`/admin/notifications/campaigns/${id}/duplicate`);
    return data;
  },

  async getNotificationStats(): Promise<NotificationStats> {
    try {
      const { data } = await apiClient.get('/admin/notifications/stats');
      return data;
    } catch {
      return { sentToday: 0, pushDeliveryRate: 0, emailOpenRate: 0, scheduledCount: 0 };
    }
  },
};
