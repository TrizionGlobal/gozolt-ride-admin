'use client';

import { useState, useEffect, useCallback } from 'react';
import { documentService } from '@/services/admin/document.service';
import type {
  DocumentFilterParams,
  DocumentListResponse,
  DocumentKpis,
  DocumentDetail,
} from '@/services/admin/document.types';

export function useDocuments(params: DocumentFilterParams) {
  const [data, setData] = useState<DocumentListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await documentService.listDocuments(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [params.status, params.entityType, params.documentType, params.search, params.page, params.limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useDocumentDetail(id: string | null) {
  const [detail, setDetail] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!id) {
      setDetail(null);
      return;
    }
    try {
      setLoading(true);
      const result = await documentService.getDocumentDetail(id);
      setDetail(result);
    } catch {
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { detail, loading, refetch: fetch };
}

export function useDocumentKpis(entityType?: string) {
  const [kpis, setKpis] = useState<DocumentKpis>({
    pendingReview: 0,
    approved: 0,
    rejected: 0,
    expiringSoon: 0,
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await documentService.getKpis(entityType);
      setKpis(data);
    } finally {
      setLoading(false);
    }
  }, [entityType]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { kpis, loading, refresh };
}
