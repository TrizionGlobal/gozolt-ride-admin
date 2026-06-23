'use client';

import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '@/services/admin/settings.service';
import type { PricingRule, UpdatePricingPayload } from '@/services/admin/pricing.types';
import type {
  AdminUser,
  FeeConfig,
} from '@/services/admin/settings.types';

// --- Fare Config Hook ---
export function useFareConfig() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await settingsService.getFareConfig();
      setRules(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const updateRule = useCallback(
    async (id: string, payload: UpdatePricingPayload) => {
      try {
        setSaving(true);
        const updated = await settingsService.updateFareConfig(id, payload);
        setRules((prev) => prev.map((r) => (r.id === id ? updated : r)));
        return true;
      } catch {
        return false;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  return { rules, loading, saving, updateRule, refetch: fetch };
}

// --- Fees Hook ---
export function useFeeConfig() {
  const [fees, setFees] = useState<FeeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await settingsService.getFeeConfig();
      setFees(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const updateFees = useCallback(async (updated: Partial<FeeConfig>) => {
    try {
      setSaving(true);
      const result = await settingsService.updateFeeConfig(updated);
      setFees(result);
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { fees, loading, saving, updateFees };
}

// --- Admin Users Hook ---
export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await settingsService.getAdminUsers();
      setUsers(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { users, loading, refetch: fetch };
}
