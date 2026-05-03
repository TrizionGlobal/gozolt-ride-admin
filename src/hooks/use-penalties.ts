'use client';

import { useState, useEffect, useCallback } from 'react';
import { penaltyService } from '@/services/admin/penalty.service';
import type {
  PenaltyFilterParams,
  PenaltyListResponse,
  PenaltyKPIs,
} from '@/services/admin/penalty.types';

export function usePenalties(params: PenaltyFilterParams) {
  const [data, setData] = useState<PenaltyListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await penaltyService.listPenalties(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load penalties');
    } finally {
      setLoading(false);
    }
  }, [params.type, params.entityType, params.status, params.from, params.to, params.page, params.limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function usePenaltyKPIs() {
  const [kpis, setKpis] = useState<PenaltyKPIs | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const result = await penaltyService.getPenaltyKPIs();
      setKpis(result);
    } catch {
      // Silently fail for KPIs
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { kpis, loading, refresh: fetch };
}
