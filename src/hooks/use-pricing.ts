'use client';

import { useState, useEffect, useCallback } from 'react';
import { VehicleType } from '@/types';
import { pricingService } from '@/services/admin/pricing.service';
import type { PricingRule, UpdatePricingPayload } from '@/services/admin/pricing.types';

export function usePricing() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [selectedType, setSelectedType] = useState<VehicleType>(VehicleType.STANDARD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPricing = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedRules = await pricingService.getPricingRules();
      setRules(fetchedRules);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pricing rules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  const updateRule = useCallback(
    async (payload: UpdatePricingPayload) => {
      const rule = rules.find((r) => r.vehicleType === selectedType);
      if (!rule) return false;
      try {
        setSaving(true);
        const updated = await pricingService.updatePricingRule(rule.id, payload);
        setRules((prev) => prev.map((r) => (r.id === rule.id ? updated : r)));
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update pricing rule');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [rules, selectedType],
  );

  return { rules, selectedType, setSelectedType, loading, error, saving, updateRule, refetch: fetchPricing };
}
