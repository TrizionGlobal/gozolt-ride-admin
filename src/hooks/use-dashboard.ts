'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDashboardAll } from '@/services/admin/dashboard.service';
import type { DashboardAllResponse } from '@/services/admin/dashboard.types';

export function useDashboard() {
  const [data, setData] = useState<DashboardAllResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async (showSkeleton = true) => {
    try {
      if (showSkeleton) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      const allData = await getDashboardAll();
      setData(allData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  const refresh = useCallback(() => {
    return fetchDashboardData(false);
  }, [fetchDashboardData]);

  return {
    kpis: data?.kpis || null,
    rideTrends: data?.rideTrends || null,
    revenueTrends: data?.revenueTrends || null,
    vehicleTypeBreakdown: data?.vehicleTypeBreakdown || [],
    actionRequired: data?.actionRequired || [],
    liveActivity: data?.liveActivity || [],
    peakHours: data?.peakHours || null,
    isLoading,
    isRefreshing,
    error,
    refresh,
  };
}
