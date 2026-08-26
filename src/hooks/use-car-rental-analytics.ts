import { useState, useEffect, useCallback } from 'react';
import { carRentalAnalyticsService, type CarRentalAnalyticsData } from '@/services/admin/car-rental-analytics.service';

export function useCarRentalAnalytics() {
  const [data, setData] = useState<CarRentalAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await carRentalAnalyticsService.getAnalytics();
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, loading, refresh: fetchAnalytics };
}
