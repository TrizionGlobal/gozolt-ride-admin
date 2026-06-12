'use client';

import { useState, useEffect } from 'react';
import { getDashboardKPIs, getRideTrends, getRevenueTrends } from '@/services/admin/dashboard.service';
import type { DashboardKpi, RideTrends, RevenueTrendPoint } from '@/services/admin/dashboard.types';

export function useDashboard() {
  const [kpis, setKpis] = useState<DashboardKpi | null>(null);
  const [rideTrends, setRideTrends] = useState<RideTrends | null>(null);
  const [revenueTrends, setRevenueTrends] = useState<RevenueTrendPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        const [kpiData, rideData, revenueData] = await Promise.all([
          getDashboardKPIs(),
          getRideTrends(),
          getRevenueTrends(),
        ]);
        setKpis(kpiData);
        setRideTrends(rideData);
        setRevenueTrends(revenueData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return {
    kpis,
    rideTrends,
    revenueTrends,
    vehicleTypeBreakdown: [],
    actionRequired: [],
    liveActivity: [],
    isLoading,
    error,
  };
}
