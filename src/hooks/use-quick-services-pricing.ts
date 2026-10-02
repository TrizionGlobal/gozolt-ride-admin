import { useState, useEffect, useCallback } from 'react';
import { quickServicesPricingService } from '@/services/admin/quick-services-pricing.service';
import { QuickServicePricingRule } from '@/services/admin/quick-services-pricing.types';

export function useQuickServicesPricing() {
  const [data, setData] = useState<QuickServicePricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await quickServicesPricingService.getAllPricingRules();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pricing rules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  return {
    pricingRules: data,
    loading,
    error,
    refetch: fetchRules,
  };
}

