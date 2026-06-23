'use client';

import { useState, useEffect, useCallback } from 'react';
import { rideService } from '@/services/admin/ride.service';
import type {
  RideListItem,
  RideDetail,
  RideFilterParams,
  RideListResponse,
} from '@/services/admin/ride.types';

export function useRides(params: RideFilterParams | null) {
  const [data, setData] = useState<RideListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!params) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const result = await rideService.listRides(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rides');
    } finally {
      setLoading(false);
    }
  }, [params?.status, params?.disputed, params?.search, params?.page, params?.limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useActiveRides() {
  const [rides, setRides] = useState<RideListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await rideService.listActiveRides();
      setRides(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load active rides');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { rides, loading, error, refetch: fetch };
}

export function useRideDetail(id: string | null) {
  const [detail, setDetail] = useState<RideDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!id) {
      setDetail(null);
      return;
    }
    try {
      setLoading(true);
      const result = await rideService.getRideDetail(id);
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
