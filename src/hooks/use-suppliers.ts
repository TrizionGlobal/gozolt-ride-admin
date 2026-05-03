'use client';

import { useState, useEffect, useCallback } from 'react';
import { supplierService } from '@/services/admin/supplier.service';
import type { SupplierFilterParams, SupplierListResponse, SupplierDocument } from '@/services/admin/supplier.types';

export function useSuppliers(params: SupplierFilterParams) {
  const [data, setData] = useState<SupplierListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await supplierService.listSuppliers(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  }, [params.status, params.search, params.page, params.limit, params.tier]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useSupplierDocuments(supplierId: string | null) {
  const [documents, setDocuments] = useState<SupplierDocument[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supplierId) {
      setDocuments([]);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const docs = await supplierService.getSupplierDocuments(supplierId!);
        if (!cancelled) setDocuments(docs);
      } catch {
        if (!cancelled) setDocuments([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [supplierId]);

  return { documents, loading };
}
