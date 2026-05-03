'use client';

import { useState, useEffect, useCallback } from 'react';
import { auditLogService } from '@/services/admin/audit-log.service';
import type {
  AuditLogFilterParams,
  AuditLogListResponse,
} from '@/services/admin/audit-log.types';

export function useAuditLogs(params: AuditLogFilterParams) {
  const [data, setData] = useState<AuditLogListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await auditLogService.listAuditLogs(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [params.entityType, params.action, params.actorId, params.from, params.to, params.page, params.limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
