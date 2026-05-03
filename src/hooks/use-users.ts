'use client';

import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services/admin/user.service';
import type { UserFilterParams, UserListResponse, UserKpis } from '@/services/admin/user.types';

export function useUsers(params: UserFilterParams) {
  const [data, setData] = useState<UserListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await userService.listUsers(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [params.status, params.search, params.page, params.limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useUserKpis() {
  const [kpis, setKpis] = useState<UserKpis>({
    totalUsers: 0,
    activeUsers: 0,
    bannedUsers: 0,
    inactiveUsers: 0,
  });

  const refresh = useCallback(() => {
    setKpis(userService.getKpis());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { kpis, refresh };
}
