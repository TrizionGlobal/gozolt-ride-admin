'use client';

import { useState, useEffect, useCallback } from 'react';
import { vehicleService } from '@/services/admin/vehicle.service';
import type { VehicleFilterParams, VehicleListResponse, VehicleKpis } from '@/services/admin/vehicle.types';

export function useVehicles(params: VehicleFilterParams) {
  const [data, setData] = useState<VehicleListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await vehicleService.listVehicles(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, [params.status, params.type, params.search, params.page, params.limit, params.supplierId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useVehicleKpis() {
  const [kpis, setKpis] = useState<VehicleKpis>({
    totalVehicles: 0,
    activeOnRoad: 0,
    pendingInspection: 0,
    suspended: 0,
  });

  const refresh = useCallback(async () => {
    try {
      const data = await vehicleService.getKpis();
      setKpis(data);
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { kpis, refresh };
}
