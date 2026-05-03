'use client';

import { useState, useEffect, useCallback } from 'react';
import { rewardService } from '@/services/admin/reward.service';
import type { RewardConfig, UpdateRewardConfigPayload } from '@/services/admin/reward.types';

export function useRewards() {
  const [config, setConfig] = useState<RewardConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await rewardService.getRewardConfig();
      setConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reward configuration');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const updateConfig = useCallback(
    async (payload: UpdateRewardConfigPayload) => {
      if (!config) return;
      try {
        setSaving(true);
        const updated = await rewardService.updateRewardConfig(payload);
        setConfig(updated);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update reward configuration');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [config],
  );

  return { config, loading, error, saving, updateConfig, refetch: fetchConfig };
}
