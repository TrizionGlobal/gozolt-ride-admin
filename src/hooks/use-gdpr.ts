'use client';

import { useState, useEffect, useCallback } from 'react';
import { gdprService } from '@/services/admin/gdpr.service';
import type {
  DataBreach,
  GdprKpis,
  DataRetentionConfig,
  CookieConsentStats,
  ProcessingRestriction,
  CreateBreachPayload,
  BreachStatus,
} from '@/services/admin/gdpr.types';

export function useGdpr() {
  const [kpis, setKpis] = useState<GdprKpis | null>(null);
  const [breaches, setBreaches] = useState<DataBreach[]>([]);
  const [retentionConfig, setRetentionConfig] = useState<DataRetentionConfig | null>(null);
  const [cookieStats, setCookieStats] = useState<CookieConsentStats | null>(null);
  const [restrictions, setRestrictions] = useState<ProcessingRestriction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [kpiData, breachData, retentionData, cookieData, restrictionData] =
        await Promise.all([
          gdprService.getKpis(),
          gdprService.listBreaches(),
          gdprService.getRetentionConfig(),
          gdprService.getCookieConsentStats(),
          gdprService.listProcessingRestrictions(),
        ]);
      setKpis(kpiData);
      setBreaches(breachData);
      setRetentionConfig(retentionData);
      setCookieStats(cookieData);
      setRestrictions(restrictionData);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createBreach = useCallback(
    async (payload: CreateBreachPayload) => {
      const result = await gdprService.createBreach(payload);
      await fetchAll();
      return result;
    },
    [fetchAll],
  );

  const updateBreachStatus = useCallback(
    async (id: string, status: BreachStatus) => {
      await gdprService.updateBreachStatus(id, status);
      await fetchAll();
    },
    [fetchAll],
  );

  return {
    kpis,
    breaches,
    retentionConfig,
    cookieStats,
    restrictions,
    loading,
    createBreach,
    updateBreachStatus,
  };
}
