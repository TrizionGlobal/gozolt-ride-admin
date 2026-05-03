import { apiClient } from '@/lib/api-client';
import {
  mockSurgeZones,
  mockSurgeHistory,
} from './surge.mock';
import type {
  SurgeZoneItem,
  SurgeHistoryPoint,
  CreateSurgeZonePayload,
  UpdateSurgeZonePayload,
} from './surge.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

let mutableZones = [...mockSurgeZones];

export const surgeService = {
  async listSurgeZones(): Promise<SurgeZoneItem[]> {
    if (DEV_BYPASS) {
      await delay(400);
      return [...mutableZones];
    }
    const { data } = await apiClient.get<SurgeZoneItem[]>('/admin/surge-zones');
    return data;
  },

  async getSurgeZone(id: string): Promise<SurgeZoneItem | null> {
    if (DEV_BYPASS) {
      await delay(300);
      return mutableZones.find((z) => z.id === id) ?? null;
    }
    const { data } = await apiClient.get<SurgeZoneItem>(`/admin/surge-zones/${id}`);
    return data;
  },

  async createSurgeZone(payload: CreateSurgeZonePayload): Promise<SurgeZoneItem> {
    if (DEV_BYPASS) {
      await delay(500);
      const count = mutableZones.length + 1;
      const newZone: SurgeZoneItem = {
        id: `zone-${Date.now()}`,
        name: payload.name,
        multiplier: payload.multiplier,
        polygon: payload.polygon,
        schedule: null,
        isActive: payload.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _displayId: `Z-${String(count).padStart(3, '0')}`,
        _zoneType: 'standard',
        _color: '#22C55E',
        _rides24h: 0,
        _activeDrivers: 0,
        _rules: { surgeMultiplier: `${payload.multiplier}x`, minDrivers: 3, maxCap: 2.0 },
      };
      mutableZones.push(newZone);
      return newZone;
    }
    const { data } = await apiClient.post<SurgeZoneItem>('/admin/surge-zones', payload);
    return data;
  },

  async updateSurgeZone(id: string, payload: UpdateSurgeZonePayload): Promise<SurgeZoneItem> {
    if (DEV_BYPASS) {
      await delay(400);
      const zone = mutableZones.find((z) => z.id === id);
      if (zone) {
        Object.assign(zone, payload, { updatedAt: new Date().toISOString() });
      }
      return zone!;
    }
    const { data } = await apiClient.patch<SurgeZoneItem>(`/admin/surge-zones/${id}`, payload);
    return data;
  },

  async deleteSurgeZone(id: string): Promise<void> {
    if (DEV_BYPASS) {
      await delay(400);
      const idx = mutableZones.findIndex((z) => z.id === id);
      if (idx > -1) mutableZones.splice(idx, 1);
      return;
    }
    await apiClient.delete(`/admin/surge-zones/${id}`);
  },

  async getSurgeHistory(_zoneId: string): Promise<SurgeHistoryPoint[]> {
    if (DEV_BYPASS) {
      await delay(300);
      return [...mockSurgeHistory];
    }
    // No backend endpoint yet — future addition
    const { data } = await apiClient.get<SurgeHistoryPoint[]>(`/admin/surge-zones/${_zoneId}/history`);
    return data;
  },
};
