import { useState, useEffect } from 'react';
import { apiClient as adminApi } from '@/lib/api-client';

export interface AdminQuickServiceFilter {
  search?: string;
  customStatus?: string;
  page: number;
  limit: number;
  refreshTrigger?: number;
}

const listCache: Record<string, { data: any[], total: number, timestamp: number }> = {};

export function useAdminQuickServiceBookings(filters: AdminQuickServiceFilter) {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBookings() {
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });
      if (filters.customStatus) {
        queryParams.append('status', filters.customStatus);
      }
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      
      const queryStr = queryParams.toString();
      const cacheKey = `${queryStr}-${filters.refreshTrigger || 0}`;

      const cached = listCache[cacheKey];
      // Use cache if it exists and is less than 5 minutes old
      if (cached && Date.now() - cached.timestamp < 300000) {
        setData(cached.data);
        setTotal(cached.total);
        return;
      }

      setLoading(true);
      try {
        // This hits the Gozolt Backend API
        const response = await adminApi.get(`/quick-services/admin/bookings?${queryStr}`);
        
        if (!response.data || typeof response.data !== 'object' || !response.data.meta) {
          throw new Error('Invalid response format or session expired');
        }

        const newData = response.data.data || [];
        const newTotal = response.data.meta.total || 0;
        
        listCache[cacheKey] = { data: newData, total: newTotal, timestamp: Date.now() };
        
        setData(newData);
        setTotal(newTotal);
      } catch (error) {
        console.error('Error fetching quick service bookings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [filters.page, filters.limit, filters.customStatus, filters.search, filters.refreshTrigger]);

  return { data, total, loading };
}

export async function getQuickServiceBookingDetails(id: string) {
  const res = await adminApi.get(`/quick-services/admin/bookings/${id}`);
  return res.data;
}

export function useActiveSuppliers() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  
  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const response = await adminApi.get('/quick-services/admin/active-suppliers');
        if (response.data && Array.isArray(response.data)) {
          setSuppliers(response.data);
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setSuppliers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    }
    fetchSuppliers();
  }, []);

  return suppliers;
}
