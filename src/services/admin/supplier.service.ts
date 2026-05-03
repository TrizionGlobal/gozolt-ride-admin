import { apiClient } from '@/lib/api-client';
import { SupplierStatus } from '@/types';
import { mockSuppliers, mockSupplierDocuments, mockSupplierRevenue, mockSupplierTipSummary, mockSupplierRevenueSummary } from './supplier.mock';
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

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// In-memory mutable copy for dev bypass state mutations
let mutableSuppliers = [...mockSuppliers];

function filterAndPaginate(
  params: SupplierFilterParams,
): SupplierListResponse {
  let filtered = [...mutableSuppliers];

  if (params.status) {
    filtered = filtered.filter((s) => s.status === params.status);
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.companyName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q),
    );
  }

  if (params.tier) {
    filtered = filtered.filter((s) => s.subscription?.tier === params.tier);
  }

  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return { data, meta: { total, page, limit, totalPages } };
}

export const supplierService = {
  async listSuppliers(params: SupplierFilterParams): Promise<SupplierListResponse> {
    if (DEV_BYPASS) {
      await delay(400);
      return filterAndPaginate(params);
    }
    const { data } = await apiClient.get<SupplierListResponse>('/admin/suppliers', { params });
    return data;
  },

  async getSupplierDetail(id: string): Promise<SupplierDetail> {
    if (DEV_BYPASS) {
      await delay(300);
      const supplier = mutableSuppliers.find((s) => s.id === id);
      if (!supplier) throw new Error('Supplier not found');
      return {
        ...supplier,
        subscription: supplier.subscription
          ? {
              id: `sub-${id}`,
              tier: supplier.subscription.tier,
              maxVehicles: 25,
              maxDrivers: 50,
              stripePriceId: null,
              stripeSubId: null,
              currentPeriodEnd: null,
            }
          : null,
        tipSummary: mockSupplierTipSummary,
        revenueSummary: mockSupplierRevenueSummary,
        _count: { ...supplier._count, payouts: 12 },
      };
    }
    const { data } = await apiClient.get<SupplierDetail>(`/admin/suppliers/${id}`);
    return data;
  },

  async getSupplierDocuments(supplierId: string): Promise<SupplierDocument[]> {
    if (DEV_BYPASS) {
      await delay(200);
      return mockSupplierDocuments[supplierId] || [];
    }
    const { data } = await apiClient.get<SupplierDocument[]>(
      `/admin/documents?entityId=${supplierId}&entityType=SUPPLIER`,
    );
    return data;
  },

  async approveSupplier(id: string): Promise<SupplierListItem> {
    if (DEV_BYPASS) {
      await delay(500);
      const idx = mutableSuppliers.findIndex((s) => s.id === id);
      if (idx === -1) throw new Error('Supplier not found');
      mutableSuppliers[idx] = {
        ...mutableSuppliers[idx],
        status: SupplierStatus.ACTIVE,
        emailVerified: true,
        updatedAt: new Date().toISOString(),
      };
      return mutableSuppliers[idx];
    }
    const { data } = await apiClient.patch<SupplierListItem>(`/admin/suppliers/${id}/approve`);
    return data;
  },

  async rejectSupplier(id: string, payload: RejectSupplierPayload): Promise<SupplierListItem> {
    if (DEV_BYPASS) {
      await delay(500);
      const idx = mutableSuppliers.findIndex((s) => s.id === id);
      if (idx === -1) throw new Error('Supplier not found');
      mutableSuppliers[idx] = {
        ...mutableSuppliers[idx],
        status: SupplierStatus.REJECTED,
        updatedAt: new Date().toISOString(),
      };
      return mutableSuppliers[idx];
    }
    const { data } = await apiClient.patch<SupplierListItem>(`/admin/suppliers/${id}/reject`, payload);
    return data;
  },

  async suspendSupplier(id: string, payload: SuspendSupplierPayload): Promise<SupplierListItem> {
    if (DEV_BYPASS) {
      await delay(500);
      const idx = mutableSuppliers.findIndex((s) => s.id === id);
      if (idx === -1) throw new Error('Supplier not found');
      mutableSuppliers[idx] = {
        ...mutableSuppliers[idx],
        status: SupplierStatus.SUSPENDED,
        updatedAt: new Date().toISOString(),
      };
      return mutableSuppliers[idx];
    }
    const { data } = await apiClient.patch<SupplierListItem>(`/admin/suppliers/${id}/suspend`, payload);
    return data;
  },

  async activateSupplier(id: string): Promise<SupplierListItem> {
    if (DEV_BYPASS) {
      await delay(500);
      const idx = mutableSuppliers.findIndex((s) => s.id === id);
      if (idx === -1) throw new Error('Supplier not found');
      mutableSuppliers[idx] = {
        ...mutableSuppliers[idx],
        status: SupplierStatus.ACTIVE,
        updatedAt: new Date().toISOString(),
      };
      return mutableSuppliers[idx];
    }
    const { data } = await apiClient.patch<SupplierListItem>(`/admin/suppliers/${id}/activate`);
    return data;
  },

  async changeCommission(id: string, payload: ChangeCommissionPayload): Promise<SupplierListItem> {
    if (DEV_BYPASS) {
      await delay(400);
      const idx = mutableSuppliers.findIndex((s) => s.id === id);
      if (idx === -1) throw new Error('Supplier not found');
      mutableSuppliers[idx] = {
        ...mutableSuppliers[idx],
        commissionRate: payload.commissionRate,
        updatedAt: new Date().toISOString(),
      };
      return mutableSuppliers[idx];
    }
    const { data } = await apiClient.patch<SupplierListItem>(`/admin/suppliers/${id}/commission`, payload);
    return data;
  },

  getRevenue(id: string): number {
    return mockSupplierRevenue[id] ?? 0;
  },
};
