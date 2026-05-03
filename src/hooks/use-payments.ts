'use client';

import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '@/services/admin/payment.service';
import type {
  TransactionFilterParams,
  TransactionListResponse,
  PaymentKpis,
} from '@/services/admin/payment.types';

export function useTransactions(params: TransactionFilterParams) {
  const [data, setData] = useState<TransactionListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await paymentService.listTransactions(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [params.type, params.search, params.page, params.limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
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
