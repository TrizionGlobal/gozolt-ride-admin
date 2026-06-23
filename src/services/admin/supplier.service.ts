import { apiClient } from '@/lib/api-client';
import type {
  SupplierListItem,
  SupplierDetail,
  SupplierDocument,
  SupplierFilterParams,
  RejectSupplierPayload,
  SuspendSupplierPayload,
  ChangeCommissionPayload,
  SupplierListResponse,
} from './supplier.types';

export const supplierService = {
  async listSuppliers(params: SupplierFilterParams): Promise<SupplierListResponse> {
    try {
      const { data } = await apiClient.get<SupplierListResponse>('/admin/suppliers', { params });
      return data;
    } catch {
      return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1 } };
    }
  },

  async getSupplierDetail(id: string): Promise<SupplierDetail> {
    const { data } = await apiClient.get<SupplierDetail>(`/admin/suppliers/${id}`);
    return data;
  },

  async getSupplierDocuments(supplierId: string): Promise<SupplierDocument[]> {
    try {
      const { data } = await apiClient.get<{ data: SupplierDocument[] }>(
        `/admin/documents?entityId=${supplierId}&entityType=SUPPLIER`,
      );
      return Array.isArray(data) ? data : (data?.data ?? []);
    } catch {
      return [];
    }
  },

  async approveSupplier(id: string): Promise<SupplierListItem> {
    const { data } = await apiClient.patch<SupplierListItem>(`/admin/suppliers/${id}/approve`);
    return data;
  },

  async rejectSupplier(id: string, payload: RejectSupplierPayload): Promise<SupplierListItem> {
    const { data } = await apiClient.patch<SupplierListItem>(`/admin/suppliers/${id}/reject`, payload);
    return data;
  },

  async suspendSupplier(id: string, payload: SuspendSupplierPayload): Promise<SupplierListItem> {
    const { data } = await apiClient.patch<SupplierListItem>(`/admin/suppliers/${id}/suspend`, payload);
    return data;
  },

  async activateSupplier(id: string): Promise<SupplierListItem> {
    const { data } = await apiClient.patch<SupplierListItem>(`/admin/suppliers/${id}/activate`);
    return data;
  },

  async changeCommission(id: string, payload: ChangeCommissionPayload): Promise<SupplierListItem> {
    const { data } = await apiClient.patch<SupplierListItem>(`/admin/suppliers/${id}/commission`, payload);
    return data;
  },
};
