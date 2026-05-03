'use client';

import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/services/admin/notification.service';
import type {
  NotificationCampaign,
  NotificationStats,
  CreateCampaignPayload,
  ChannelTab,
} from '@/services/admin/notification.types';

export function useCampaigns(tab: ChannelTab, search: string) {
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notificationService.listCampaigns(tab, search || undefined);
      setCampaigns(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [tab, search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const createCampaign = useCallback(
    async (payload: CreateCampaignPayload) => {
      const result = await notificationService.createCampaign(payload);
      await fetch();
      return result;
    },
    [fetch],
  );

  const deleteCampaign = useCallback(
    async (id: string) => {
      await notificationService.deleteCampaign(id);
      await fetch();
    },
    [fetch],
  );

  const duplicateCampaign = useCallback(
    async (id: string) => {
      const result = await notificationService.duplicateCampaign(id);
      await fetch();
      return result;
    },
    [fetch],
  );

  return { campaigns, loading, createCampaign, deleteCampaign, duplicateCampaign, refetch: fetch };
}

export function useNotificationStats() {
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await notificationService.getNotificationStats();
        setStats(data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { stats, loading };
}
