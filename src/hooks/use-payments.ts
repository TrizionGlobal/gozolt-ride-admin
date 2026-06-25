'use client';

import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '@/services/admin/payment.service';
import type {
  TransactionFilterParams,
  TransactionListResponse,
  PaymentKpis,
  SettlementListResponse,
} from '@/services/admin/payment.types';

export function useTransactions(params: TransactionFilterParams, enabled: boolean = true) {
  const [data, setData] = useState<TransactionListResponse | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setData(null); 
      const result = await paymentService.listTransactions(params);
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

export function usePaymentKpis() {
  const [kpis, setKpis] = useState<PaymentKpis | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const result = await paymentService.getKpis();
      setKpis(result);
    } catch {
      // KPI fetch failed silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { kpis, loading, refresh: fetch };
}

export function useSettlements(page: number, limit: number, status?: string, search?: string, enabled: boolean = true) {
  const [data, setData] = useState<SettlementListResponse | null>(null);
  const [loading, setLoading] = useState(enabled);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { page, limit };
      if (status && status !== 'ALL') params.status = status;
      if (search) params.search = search;
      const result = await paymentService.listSettlements(params);
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
