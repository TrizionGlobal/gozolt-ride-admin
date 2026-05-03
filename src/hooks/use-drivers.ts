'use client';

import { useState, useEffect, useCallback } from 'react';
import { driverService } from '@/services/admin/driver.service';
import type { DriverFilterParams, DriverListResponse, DriverKpis } from '@/services/admin/driver.types';

export function useDrivers(params: DriverFilterParams) {
  const [data, setData] = useState<DriverListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await driverService.listDrivers(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load drivers');
    } finally {
      setLoading(false);
    }
  }, [params.status, params.search, params.page, params.limit, params.supplierId, params.onlineOnly]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useDriverKpis() {
  const [kpis, setKpis] = useState<DriverKpis>({ activeDrivers: 0, onlineNow: 0, pendingApproval: 0, suspended: 0 });

  const refresh = useCallback(() => {
    setKpis(driverService.getKpis());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { kpis, refresh };
}
