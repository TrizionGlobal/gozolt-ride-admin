'use client';

import { useState, useEffect, useCallback } from 'react';
import { globalFinanceService } from '@/services/admin/global-finance.service';
import type { PaymentKpis, SettlementListResponse } from '@/services/admin/payment.types';

export function useGlobalPaymentKpis() {
  const [kpis, setKpis] = useState<PaymentKpis | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const result = await globalFinanceService.getKpis();
      setKpis(result);
    } catch {
      // Failed silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { kpis, loading, refresh: fetch };
}

export function useGlobalSettlements(
  page: number,
  limit: number,
  status?: string,
  search?: string,
  enabled: boolean = true
) {
  const [data, setData] = useState<SettlementListResponse | null>(null);
  const [loading, setLoading] = useState(enabled);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { page, limit };
      if (status && status !== 'ALL') params.status = status;
      if (search) params.search = search;
      const result = await globalFinanceService.listSettlements(params);
      setData(result);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, search]);

  useEffect(() => {
    if (enabled) {
      fetch();
    }
  }, [fetch, enabled]);

  return { data, loading: enabled ? loading : false, refetch: fetch };
}

export function useGlobalPayouts(params: { page?: number; limit?: number; search?: string; status?: string; module?: string }, skip = false) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(!skip);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('limit', params.limit.toString());
      if (params.search) query.append('search', params.search);
      if (params.status && params.status !== 'ALL') query.append('status', params.status);

      const { data: responseData } = await (await import('@/lib/api-client')).apiClient.get(`/admin/payouts?${query.toString()}`);
      setData(responseData);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [params.page, params.limit, params.search, params.status]);

  useEffect(() => {
    if (!skip) fetch();
  }, [fetch, skip]);

  return { data, loading, refetch: fetch };
}
