import { apiClient } from '@/lib/api-client';
import { UserStatus } from '@/types';
import type {
  UserListItem,
  UserDetail,
  UserFilterParams,
  SuspendUserPayload,
  UserListResponse,
  UserKpis,
} from './user.types';

export const userService = {
  async listUsers(params: UserFilterParams): Promise<UserListResponse> {
    try {
      const { data } = await apiClient.get<UserListResponse>('/admin/users', { params });
      return data;
    } catch {
      return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1 } };
    }
  },

  async getUserDetail(id: string): Promise<UserDetail> {
    const { data } = await apiClient.get<UserDetail>(`/admin/users/${id}`);
    return data;
  },

  async suspendUser(id: string, payload: SuspendUserPayload): Promise<UserListItem> {
    const { data } = await apiClient.patch<UserListItem>(`/admin/users/${id}/suspend`, payload);
    return data;
  },

  async activateUser(id: string): Promise<UserListItem> {
    const { data } = await apiClient.patch<UserListItem>(`/admin/users/${id}/activate`);
    return data;
  },

  async forceLogoutUser(id: string): Promise<{ sessionsDeleted: number }> {
    const { data } = await apiClient.post<{ sessionsDeleted: number }>(`/admin/users/${id}/force-logout`);
    return data;
  },

  async exportUserData(id: string): Promise<Record<string, unknown>> {
    const { data } = await apiClient.get<Record<string, unknown>>(`/admin/users/${id}/export`);
    return data;
  },

  async getKpis(): Promise<UserKpis> {
    try {
      const { data } = await apiClient.get<UserKpis>('/admin/users/stats');
      return data;
    } catch {
      return {
        totalUsers: 0,
        activeUsers: 0,
        bannedUsers: 0,
        inactiveUsers: 0,
      };
    }
  },
};
