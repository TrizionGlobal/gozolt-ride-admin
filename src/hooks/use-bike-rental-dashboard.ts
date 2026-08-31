import { useState, useEffect, useCallback } from 'react';
import { bikeRentalDashboardService, type BikeRentalDashboardStats } from '@/services/admin/bike-rental-dashboard.service';

export function useBikeRentalDashboard() {
  const [data, setData] = useState<BikeRentalDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bikeRentalDashboardService.getDashboardStats();
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
