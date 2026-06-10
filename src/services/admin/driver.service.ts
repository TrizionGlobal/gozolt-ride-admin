import { apiClient } from '@/lib/api-client';
import { DriverStatus } from '@/types';
import type {
  DriverListItem,
  DriverDetail,
  DriverDetailExtended,
  DriverFilterParams,
  SuspendDriverPayload,
  DriverListResponse,
  DriverKpis,
} from './driver.types';

export const driverService = {
  async listDrivers(params: DriverFilterParams): Promise<DriverListResponse> {
    try {
      const { data } = await apiClient.get<DriverListResponse>('/admin/drivers', { params });
      return data;
    } catch {
      return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1 } };
    }
  },

  async getDriverDetail(id: string): Promise<DriverDetail> {
    const { data } = await apiClient.get<DriverDetail>(`/admin/drivers/${id}`);
    return data;
  },

  async approveDriver(id: string): Promise<DriverListItem> {
    const { data } = await apiClient.patch<DriverListItem>(`/admin/drivers/${id}/approve`);
    return data;
  },

  async adminApproveDriverDocuments(id: string): Promise<DriverListItem> {
    const { data } = await apiClient.post<DriverListItem>(`/admin/drivers/${id}/admin-approve-documents`);
    return data;
  },

  async suspendDriver(id: string, payload: SuspendDriverPayload): Promise<DriverListItem> {
    const { data } = await apiClient.patch<DriverListItem>(`/admin/drivers/${id}/suspend`, payload);
    return data;
  },

  async activateDriver(id: string): Promise<DriverListItem> {
    const { data } = await apiClient.patch<DriverListItem>(`/admin/drivers/${id}/activate`);
    return data;
  },

  async getDriverDetailExtended(id: string): Promise<DriverDetailExtended> {
    const { data } = await apiClient.get<DriverDetailExtended>(`/admin/drivers/${id}/extended`);
    return data;
  },

  async getKpis(): Promise<DriverKpis> {
    try {
      const { data } = await apiClient.get<DriverKpis>('/admin/drivers/stats');
      return data;
    } catch {
      return { activeDrivers: 0, onlineNow: 0, pendingApproval: 0, suspended: 0 };
    }
  },
};
