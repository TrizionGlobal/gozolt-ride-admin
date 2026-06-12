import { apiClient } from '@/lib/api-client';
import type {
  SurgeZoneItem,
  SurgeHistoryPoint,
  CreateSurgeZonePayload,
  UpdateSurgeZonePayload,
} from './surge.types';

export const surgeService = {
  async listSurgeZones(): Promise<SurgeZoneItem[]> {
    try {
      const { data } = await apiClient.get<SurgeZoneItem[]>('/admin/surge-zones');
      return data;
    } catch {
      return [];
    }
  },

  async getSurgeZone(id: string): Promise<SurgeZoneItem | null> {
    const { data } = await apiClient.get<SurgeZoneItem>(`/admin/surge-zones/${id}`);
    return data;
  },

  async createSurgeZone(payload: CreateSurgeZonePayload): Promise<SurgeZoneItem> {
    const { data } = await apiClient.post<SurgeZoneItem>('/admin/surge-zones', payload);
    return data;
  },

  async updateSurgeZone(id: string, payload: UpdateSurgeZonePayload): Promise<SurgeZoneItem> {
    const { data } = await apiClient.patch<SurgeZoneItem>(`/admin/surge-zones/${id}`, payload);
    return data;
  },

  async deleteSurgeZone(id: string): Promise<void> {
    await apiClient.delete(`/admin/surge-zones/${id}`);
  },

  async getSurgeHistory(_zoneId: string): Promise<SurgeHistoryPoint[]> {
    try {
      const { data } = await apiClient.get<SurgeHistoryPoint[]>(`/admin/surge-zones/${_zoneId}/history`);
      return data;
    } catch {
      return [];
    }
  },
};
