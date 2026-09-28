'use client';

import { useState, useEffect, useCallback } from 'react';
import { bikeRentalPaymentService } from '@/services/admin/bike-rental-payment.service';
import type { PaymentKpis, SettlementListResponse } from '@/services/admin/payment.types';

export function useBikeRentalPaymentKpis() {
  const [kpis, setKpis] = useState<PaymentKpis | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const result = await bikeRentalPaymentService.getKpis();
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

export function useBikeRentalSettlements(
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
      const result = await bikeRentalPaymentService.listSettlements(params);
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

export function useBikeRentalTransactions(params: any, enabled: boolean = true) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setData(null); 
      const result = await bikeRentalPaymentService.listTransactions(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [params.type, params.search, params.page, params.limit, params.status]);

  useEffect(() => {
    if (enabled) {
      fetch();
    }
  }, [fetch, enabled]);

  return { data, loading: enabled ? loading : false, error, refetch: fetch };
}
