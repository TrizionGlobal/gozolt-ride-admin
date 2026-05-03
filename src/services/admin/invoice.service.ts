import { apiClient } from '@/lib/api-client';
import { mockInvoices, mockInvoiceKpis } from './invoice.mock';
import type {
  InvoiceListItem,
  InvoiceFilterParams,
  InvoiceListResponse,
  InvoiceKpis,
} from './invoice.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// In-memory mutable copy for dev bypass state mutations
let mutableInvoices = [...mockInvoices];

function filterAndPaginate(params: InvoiceFilterParams): InvoiceListResponse {
  let filtered = [...mutableInvoices];

  if (params.status) {
    filtered = filtered.filter((inv) => inv.status === params.status);
  }

  if (params.supplierId) {
    filtered = filtered.filter((inv) => inv.supplierId === params.supplierId);
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.supplierName.toLowerCase().includes(q),
    );
  }

  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return { data, meta: { total, page, limit, totalPages } };
}

export const invoiceService = {
  async listInvoices(params: InvoiceFilterParams): Promise<InvoiceListResponse> {
    if (DEV_BYPASS) {
      await delay(400);
      return filterAndPaginate(params);
    }
    const { data } = await apiClient.get<InvoiceListResponse>('/admin/invoices', { params });
    return data;
  },

  async getInvoiceDetail(id: string): Promise<InvoiceListItem> {
    if (DEV_BYPASS) {
      await delay(300);
      const invoice = mutableInvoices.find((inv) => inv.id === id);
      if (!invoice) throw new Error('Invoice not found');
      return { ...invoice };
    }
    const { data } = await apiClient.get<InvoiceListItem>(`/admin/invoices/${id}`);
    return data;
  },

  async markAsPaid(id: string): Promise<InvoiceListItem> {
    if (DEV_BYPASS) {
      await delay(500);
      const idx = mutableInvoices.findIndex((inv) => inv.id === id);
      if (idx === -1) throw new Error('Invoice not found');
      mutableInvoices[idx] = {
        ...mutableInvoices[idx],
        status: 'PAID',
        issuedAt: mutableInvoices[idx].issuedAt || new Date().toISOString(),
      };
      return mutableInvoices[idx];
    }
    const { data } = await apiClient.patch<InvoiceListItem>(`/admin/invoices/${id}/mark-paid`);
    return data;
  },

  async getKpis(): Promise<InvoiceKpis> {
    if (DEV_BYPASS) {
      await delay(300);
      return { ...mockInvoiceKpis };
    }
    const { data } = await apiClient.get<InvoiceKpis>('/admin/invoices/kpis');
    return data;
  },
};
