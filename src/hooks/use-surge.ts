'use client';

import { useState, useEffect, useCallback } from 'react';
import { surgeService } from '@/services/admin/surge.service';
import type {
  SurgeZoneItem,
  SurgeHistoryPoint,
  CreateSurgeZonePayload,
  UpdateSurgeZonePayload,
} from '@/services/admin/surge.types';

export function useSurgeZones() {
  const [zones, setZones] = useState<SurgeZoneItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const selectedZone = zones.find((z) => z.id === selectedZoneId) ?? null;

  const loadZones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await surgeService.listSurgeZones();
      setZones(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load surge zones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadZones();
  }, [loadZones]);

  const selectZone = useCallback((id: string | null) => {
    setSelectedZoneId((prev) => (prev === id ? null : id));
  }, []);

  const toggleZone = useCallback(async (id: string) => {
    const zone = zones.find((z) => z.id === id);
    if (!zone) return;
    await surgeService.updateSurgeZone(id, { isActive: !zone.isActive });
    await loadZones();
  }, [zones, loadZones]);

  const updateZone = useCallback(async (id: string, payload: UpdateSurgeZonePayload) => {
    await surgeService.updateSurgeZone(id, payload);
    await loadZones();
  }, [loadZones]);

  const createZone = useCallback(async (payload: CreateSurgeZonePayload) => {
    await surgeService.createSurgeZone(payload);
    await loadZones();
  }, [loadZones]);

  const deleteZone = useCallback(async (id: string) => {
    await surgeService.deleteSurgeZone(id);
    if (selectedZoneId === id) setSelectedZoneId(null);
    await loadZones();
  }, [selectedZoneId, loadZones]);

  return {
    zones,
    loading,
    error,
    selectedZone,
    selectedZoneId,
    selectZone,
    toggleZone,
    updateZone,
    createZone,
    deleteZone,
    refetch: loadZones,
  };
}

export function useSurgeHistory(zoneId: string | null) {
  const [history, setHistory] = useState<SurgeHistoryPoint[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!zoneId) {
      setHistory([]);
      return;
    }
    try {
      setLoading(true);
      const result = await surgeService.getSurgeHistory(zoneId);
      setHistory(result);
    } catch {
      // Fail silently for chart data
    } finally {
      setLoading(false);
    }
  }, [zoneId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { history, loading };
}
