import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse, PaginatedQuery } from '@/types';

export interface AdminCarRentalVehicle {
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
    addons: number;
    protectionPackages: number;
  };
  supplier: {
    companyName: string;
  };
}

export interface AdminCarRentalBooking {
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
  vehicle: {
    name: string;
    category: string;
    images: string[];
  };
  supplier: {
    companyName: string;
  };
  extensionRequests?: any[];
}

export interface AdminCarRentalFilter extends PaginatedQuery {
  supplierId?: string;
  status?: string;
  customStatus?: string;
  search?: string;
}

const vehicleCache = new Map<string, { data: PaginatedResponse<AdminCarRentalVehicle>; timestamp: number }>();
const bookingCache = new Map<string, { data: PaginatedResponse<AdminCarRentalBooking>; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export function useAdminCarRentalVehicles(params: AdminCarRentalFilter, skip = false) {
  const [data, setData] = useState<PaginatedResponse<AdminCarRentalVehicle> | null>(null);
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
      if (vehicleCache.has(queryStr)) {
        const cached = vehicleCache.get(queryStr)!;
        if (Date.now() - cached.timestamp < CACHE_DURATION) {
          setData(cached.data);
          setLoading(false);
          return;
        }
      }

      const response = await apiClient.get<PaginatedResponse<AdminCarRentalVehicle>>(`/admin/car-rentals/vehicles?${queryStr}`);
      vehicleCache.set(queryStr, { data: response.data, timestamp: Date.now() });
      setData(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to fetch vehicles');
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

export function useAdminCarRentalBookings(params: AdminCarRentalFilter, skip = false) {
  const [data, setData] = useState<PaginatedResponse<AdminCarRentalBooking> | null>(null);
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

      const response = await apiClient.get<PaginatedResponse<AdminCarRentalBooking>>(`/admin/car-rentals/bookings?${queryStr}`);
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

export const getCarRentalBookingDetails = async (id: string): Promise<any> => {
  const { data } = await apiClient.get(`/admin/car-rentals/bookings/${id}`);
  return data;
};

export interface AdminCarRentalPayout {
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

export function useAdminCarRentalPayouts(params: AdminCarRentalFilter, skip = false) {
  const [data, setData] = useState<PaginatedResponse<AdminCarRentalPayout> | null>(null);
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
      const response = await apiClient.get<PaginatedResponse<AdminCarRentalPayout>>(`/admin/car-rentals/payouts?${queryStr}`);
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
