import type { PaginatedQuery, PaginatedResponse } from '@/types';

export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PAID';

export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  supplierName: string;
  periodStart: string;
  periodEnd: string;
  rideEarnings: number;
  tipPassThrough: number;
  platformCommission: number;
  totalAmount: number;
  status: InvoiceStatus;
  issuedAt: string | null;
  createdAt: string;
}

export interface InvoiceKpis {
  totalInvoiced: number;
  pending: number;
  paid: number;
  tipPassThrough: number;
}

export interface InvoiceFilterParams extends PaginatedQuery {
  status?: InvoiceStatus;
  supplierId?: string;
}

export type InvoiceListResponse = PaginatedResponse<InvoiceListItem>;

export function getInvoiceStatusDisplay(status: InvoiceStatus) {
  const map: Record<InvoiceStatus, { label: string; className: string }> = {
    DRAFT: { label: 'Draft', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
    ISSUED: { label: 'Issued', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    PAID: { label: 'Paid', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  };
  return map[status];
}
