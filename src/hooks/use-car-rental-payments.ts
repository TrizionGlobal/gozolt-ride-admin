'use client';

import { useState, useEffect, useCallback } from 'react';
import { carRentalPaymentService } from '@/services/admin/car-rental-payment.service';
import type { PaymentKpis, SettlementListResponse } from '@/services/admin/payment.types';

export function useCarRentalPaymentKpis() {
  const [kpis, setKpis] = useState<PaymentKpis | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const result = await carRentalPaymentService.getKpis();
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

export function useCarRentalSettlements(
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
      const result = await carRentalPaymentService.listSettlements(params);
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
