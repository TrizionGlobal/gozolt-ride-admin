'use client';

import { useState, useEffect, useCallback } from 'react';
import { VehicleType } from '@/types';
import { pricingService } from '@/services/admin/pricing.service';
import type { PricingRule, UpdatePricingPayload } from '@/services/admin/pricing.types';

export function usePricing() {
  const [rule, setRule] = useState<PricingRule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPricing = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rules = await pricingService.getPricingRules();
      // Show STANDARD vehicle type by default
      const standard = rules.find((r) => r.vehicleType === VehicleType.STANDARD) ?? rules[0] ?? null;
      setRule(standard);
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
      if (!rule) return;
      try {
        setSaving(true);
        const updated = await pricingService.updatePricingRule(rule.id, payload);
        setRule(updated);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update pricing rule');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [rule],
  );

  return { rule, loading, error, saving, updateRule, refetch: fetchPricing };
}
