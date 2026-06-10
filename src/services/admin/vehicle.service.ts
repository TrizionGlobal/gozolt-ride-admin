import { apiClient } from '@/lib/api-client';
import { VehicleStatus } from '@/types';
import type {
  VehicleListItem,
  VehicleDetail,
  VehicleFilterParams,
  SuspendVehiclePayload,
  RejectVehiclePayload,
  VehicleListResponse,
  VehicleKpis,
} from './vehicle.types';

export const vehicleService = {
  async listVehicles(params: VehicleFilterParams): Promise<VehicleListResponse> {
    try {
      const { data } = await apiClient.get<VehicleListResponse>('/admin/vehicles', { params });
      return data;
    } catch {
      return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1 } };
    }
  },

  async getVehicleDetail(id: string): Promise<VehicleDetail> {
    const { data } = await apiClient.get<VehicleDetail>(`/admin/vehicles/${id}`);
    return data;
  },

  async approveVehicle(id: string): Promise<VehicleListItem> {
    const { data } = await apiClient.patch<VehicleListItem>(`/admin/vehicles/${id}/approve`);
    return data;
  },

  async rejectVehicle(id: string, payload: RejectVehiclePayload): Promise<VehicleListItem> {
    const { data } = await apiClient.patch<VehicleListItem>(`/admin/vehicles/${id}/reject`, payload);
    return data;
  },

  async suspendVehicle(id: string, payload: SuspendVehiclePayload): Promise<VehicleListItem> {
    const { data } = await apiClient.patch<VehicleListItem>(`/admin/vehicles/${id}/suspend`, payload);
    return data;
  },

  async activateVehicle(id: string): Promise<VehicleListItem> {
    const { data } = await apiClient.patch<VehicleListItem>(`/admin/vehicles/${id}/activate`);
    return data;
  },

  async getKpis(): Promise<VehicleKpis> {
    try {
      const { data } = await apiClient.get<VehicleKpis>('/admin/vehicles/stats');
      return data;
    } catch {
      return {
        totalVehicles: 0,
        activeOnRoad: 0,
        pendingInspection: 0,
        suspended: 0,
      };
    }
  },
};
