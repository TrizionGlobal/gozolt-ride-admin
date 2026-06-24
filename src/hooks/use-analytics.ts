'use client';

import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '@/services/admin/analytics.service';
import type { DateRange, AnalyticsData } from '@/services/admin/analytics.types';

export function useAnalytics(range: DateRange) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyticsService.getAnalytics(range);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
