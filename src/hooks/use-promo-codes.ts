'use client';

import { useState, useEffect, useCallback } from 'react';
import { promoService } from '@/services/admin/promo.service';
import type { PromoCode, CreatePromoPayload } from '@/services/admin/promo.types';

export function usePromoCodes() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCodes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await promoService.listPromoCodes();
      setCodes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load promo codes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const createCode = useCallback(async (payload: CreatePromoPayload) => {
    const created = await promoService.createPromoCode(payload);
    setCodes((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateCode = useCallback(async (id: string, payload: Partial<CreatePromoPayload>) => {
    const updated = await promoService.updatePromoCode(id, payload);
    setCodes((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }, []);

  const toggleCode = useCallback(async (id: string, isActive: boolean) => {
    const updated = await promoService.togglePromoCode(id, isActive);
    setCodes((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }, []);

  return { codes, loading, error, createCode, updateCode, toggleCode, refetch: fetchCodes };
}
