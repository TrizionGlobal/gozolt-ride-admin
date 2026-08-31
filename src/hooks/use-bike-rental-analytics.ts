import { useState, useEffect, useCallback } from 'react';
import { bikeRentalAnalyticsService, type BikeRentalAnalyticsData } from '@/services/admin/bike-rental-analytics.service';

export function useBikeRentalAnalytics() {
  const [data, setData] = useState<BikeRentalAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bikeRentalAnalyticsService.getAnalytics();
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
