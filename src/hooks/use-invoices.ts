'use client';

import { useState, useEffect, useCallback } from 'react';
import { invoiceService } from '@/services/admin/invoice.service';
import type {
  InvoiceFilterParams,
  InvoiceListResponse,
  InvoiceKpis,
} from '@/services/admin/invoice.types';

export function useInvoices(params: InvoiceFilterParams) {
  const [data, setData] = useState<InvoiceListResponse | null>(null);
  const [kpis, setKpis] = useState<InvoiceKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const listResult = await invoiceService.listInvoices(params);
      setData(listResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, [params.status, params.supplierId, params.search, params.page, params.limit]);

  const fetchKpis = useCallback(async () => {
    try {
      const kpiResult = await invoiceService.getKpis();
      setKpis(kpiResult);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    fetchKpis();
  }, [fetchKpis]);

  const markAsPaid = useCallback(async (id: string) => {
    const result = await invoiceService.markAsPaid(id);
    return result;
  }, []);

  return { 
    data, 
    kpis, 
    loading, 
    error, 
    markAsPaid, 
    refetch: useCallback(() => {
      fetchList();
      fetchKpis();
    }, [fetchList, fetchKpis])
  };
}
