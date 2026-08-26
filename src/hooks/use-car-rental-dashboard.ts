import { useState, useEffect, useCallback } from 'react';
import { carRentalDashboardService, type CarRentalDashboardStats } from '@/services/admin/car-rental-dashboard.service';

export function useCarRentalDashboard() {
  const [data, setData] = useState<CarRentalDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await carRentalDashboardService.getDashboardStats();
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, loading, refresh: fetchStats };
}
