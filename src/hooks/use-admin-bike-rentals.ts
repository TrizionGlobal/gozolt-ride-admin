import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse, PaginatedQuery } from '@/types';

export interface AdminBikeRentalBike {
  id: string;
  supplierId: string;
  name: string;
  category: string;
  pricePerDay: string;
  status: string;
  isApproved: boolean;
  images: string[];
  createdAt: string;
  transmission: string;
  fuelType: string;
  registrationNo?: string;
  year?: number;
  _count?: {
    protectionPackages: number;
  };
  supplier: {
    companyName: string;
  };
}

export interface AdminBikeRentalBooking {
  id: string;
  status: string;
  grandTotal: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  bike: {
    name: string;
    category: string;
    images: string[];
  };
  supplier: {
    companyName: string;
  };
  extensionRequests?: any[];
}

export interface AdminBikeRentalFilter extends PaginatedQuery {
  supplierId?: string;
  status?: string;
  customStatus?: string;
  search?: string;
}

const bikeCache = new Map<string, { data: PaginatedResponse<AdminBikeRentalBike>; timestamp: number }>();
const bookingCache = new Map<string, { data: PaginatedResponse<AdminBikeRentalBooking>; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export function useAdminBikeRentalBikes(params: AdminBikeRentalFilter, skip = false) {
  const [data, setData] = useState<PaginatedResponse<AdminBikeRentalBike> | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const query = new URLSearchParams();
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('limit', params.limit.toString());
      if (params.search) query.append('search', params.search);
      if (params.status && params.status !== 'ALL') query.append('status', params.status);
      if (params.customStatus && params.customStatus !== 'ALL') query.append('customStatus', params.customStatus);

      const queryStr = query.toString();
      if (bikeCache.has(queryStr)) {
        const cached = bikeCache.get(queryStr)!;
        if (Date.now() - cached.timestamp < CACHE_DURATION) {
          setData(cached.data);
          setLoading(false);
          return;
        }
      }

      const response = await apiClient.get<PaginatedResponse<AdminBikeRentalBike>>(`/admin/bike-rentals/bikes?${queryStr}`);
      bikeCache.set(queryStr, { data: response.data, timestamp: Date.now() });
      setData(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to fetch bikes');
    } finally {
      setLoading(false);
    }
  }, [params.page, params.limit, params.search, params.status, params.customStatus]);

  useEffect(() => {
    if (!skip) {
      fetch();
    }
  }, [fetch, skip]);

  return { data, loading: !skip ? loading : false, error, refetch: fetch };
}

export function useAdminBikeRentalBookings(params: AdminBikeRentalFilter, skip = false) {
  const [data, setData] = useState<PaginatedResponse<AdminBikeRentalBooking> | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const query = new URLSearchParams();
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('limit', params.limit.toString());
      if (params.search) query.append('search', params.search);
      if (params.status && params.status !== 'ALL') query.append('status', params.status);
      if (params.customStatus && params.customStatus !== 'ALL') query.append('customStatus', params.customStatus);

      const queryStr = query.toString();
      if (bookingCache.has(queryStr)) {
        const cached = bookingCache.get(queryStr)!;
        if (Date.now() - cached.timestamp < CACHE_DURATION) {
          setData(cached.data);
          setLoading(false);
          return;
        }
      }

      const response = await apiClient.get<PaginatedResponse<AdminBikeRentalBooking>>(`/admin/bike-rentals/bookings?${queryStr}`);
      bookingCache.set(queryStr, { data: response.data, timestamp: Date.now() });
      setData(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [params.page, params.limit, params.search, params.status, params.customStatus]);

  useEffect(() => {
    if (!skip) {
      fetch();
    }
  }, [fetch, skip]);

  return { data, loading: !skip ? loading : false, error, refetch: fetch };
}

export const getBikeRentalBookingDetails = async (id: string): Promise<any> => {
  const { data } = await apiClient.get(`/admin/bike-rentals/bookings/${id}`);
  return data;
};

export interface AdminBikeRentalPayout {
  id: string;
  supplierId: string;
  amount: number;
  status: string;
  module: string;
  periodStart: string;
  periodEnd: string;
  processedAt: string;
  createdAt: string;
  supplier?: {
    companyName: string;
    email: string;
  };
}

export function useAdminBikeRentalPayouts(params: AdminBikeRentalFilter, skip = false) {
  const [data, setData] = useState<PaginatedResponse<AdminBikeRentalPayout> | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const query = new URLSearchParams();
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('limit', params.limit.toString());
      if (params.search) query.append('search', params.search);
      if (params.status && params.status !== 'ALL') query.append('status', params.status);

      const queryStr = query.toString();
      const response = await apiClient.get<PaginatedResponse<AdminBikeRentalPayout>>(`/admin/bike-rentals/payouts?${queryStr}`);
      setData(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to fetch payouts');
    } finally {
      setLoading(false);
    }
  }, [params.page, params.limit, params.search, params.status]);

  useEffect(() => {
    if (!skip) {
      fetch();
    }
  }, [fetch, skip]);

  return { data, loading: !skip ? loading : false, error, refetch: fetch };
}
