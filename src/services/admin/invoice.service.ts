import { apiClient } from '@/lib/api-client';
import type {
  InvoiceListItem,
  InvoiceFilterParams,
  InvoiceListResponse,
  InvoiceKpis,
} from './invoice.types';

export const invoiceService = {
  async listInvoices(params: InvoiceFilterParams): Promise<InvoiceListResponse> {
    try {
      const { data } = await apiClient.get<InvoiceListResponse>('/admin/invoices', { params });
      return data;
    } catch {
      return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1 } };
    }
  },

  async getInvoiceDetail(id: string): Promise<InvoiceListItem> {
    const { data } = await apiClient.get<InvoiceListItem>(`/admin/invoices/${id}`);
    return data;
  },

  async markAsPaid(id: string): Promise<InvoiceListItem> {
    const { data } = await apiClient.patch<InvoiceListItem>(`/admin/invoices/${id}/mark-paid`);
    return data;
  },

  async getKpis(): Promise<InvoiceKpis> {
    try {
      const { data } = await apiClient.get<InvoiceKpis>('/admin/invoices/kpis');
      return data;
    } catch {
      return { totalInvoiced: 0, paid: 0, pending: 0, tipPassThrough: 0 };
    }
  },
};
