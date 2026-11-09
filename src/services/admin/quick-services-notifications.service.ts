import { apiClient } from '@/lib/api-client';

export interface AdminQuickServiceNotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  data?: {
    module?: string;
    target?: string;
    bookingId?: string;
    serviceCategory?: string;
    serviceTitle?: string;
    userName?: string;
    userPhone?: string;
    location?: string;
    bookingDate?: string;
    totalAmount?: number | string;
    status?: string;
    [key: string]: any;
  };
}

export interface PaginatedAdminQuickServiceNotifications {
  data: AdminQuickServiceNotificationItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const adminQuickServicesNotificationsService = {
  async getNotifications(page = 1, limit = 20): Promise<PaginatedAdminQuickServiceNotifications> {
    try {
      const { data } = await apiClient.get('/admin/quick-services/notifications', {
        params: { page, limit },
      });
      if (data && Array.isArray(data.data)) {
        data.data = data.data.map((item: any) => ({
          ...item,
          isRead: item.read !== undefined ? item.read : (item.isRead ?? false),
        }));
      }
      return data;
    } catch (error) {
      return {
        data: [],
        meta: { total: 0, page: 1, limit, totalPages: 0 },
      };
    }
  },

  async getUnreadCount(): Promise<{ unreadCount: number }> {
    try {
      const { data } = await apiClient.get('/admin/quick-services/notifications/unread-count');
      const count = data?.unreadCount ?? data?.count ?? 0;
      return { unreadCount: Number(count) };
    } catch {
      return { unreadCount: 0 };
    }
  },

  async markRead(ids?: string[]): Promise<void> {
    try {
      await apiClient.patch('/admin/quick-services/notifications/mark-read', { ids });
    } catch (error) {
      console.error('Failed to mark admin quick service notifications as read:', error);
    }
  },
};

