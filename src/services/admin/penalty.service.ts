import { apiClient } from '@/lib/api-client';
import { mockPenalties } from './penalty.mock';
import type {
  PenaltyTransaction,
  PenaltyKPIs,
  PenaltyFilterParams,
  PenaltyListResponse,
} from './penalty.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const penaltyService = {
  async listPenalties(params: PenaltyFilterParams): Promise<PenaltyListResponse> {
    if (DEV_BYPASS) {
      await delay(400);
      let filtered = [...mockPenalties];

      if (params.type) {
        filtered = filtered.filter((p) => p.type === params.type);
      }
      if (params.entityType) {
        filtered = filtered.filter((p) => p.entityType === params.entityType);
      }
      if (params.status) {
        filtered = filtered.filter((p) => p.status === params.status);
      }
      if (params.from) {
        const fromDate = new Date(params.from);
        filtered = filtered.filter((p) => new Date(p.createdAt) >= fromDate);
      }
      if (params.to) {
        const toDate = new Date(params.to);
        filtered = filtered.filter((p) => new Date(p.createdAt) <= toDate);
      }

      const page = params.page ?? 1;
      const limit = params.limit ?? 20;
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const data = filtered.slice(start, start + limit);

      return { data, meta: { total, page, limit, totalPages } };
    }
    const { data } = await apiClient.get<PenaltyListResponse>('/admin/penalties', { params });
    return data;
  },

  async voidPenalty(id: string): Promise<PenaltyTransaction> {
    if (DEV_BYPASS) {
      await delay(500);
      const penalty = mockPenalties.find((p) => p.id === id);
      if (!penalty) throw new Error('Penalty not found');
      penalty.status = 'VOIDED';
      penalty.voidedAt = new Date().toISOString();
      penalty.voidedBy = 'admin-uuid-001';
      return { ...penalty };
    }
    const { data } = await apiClient.patch<PenaltyTransaction>(`/admin/penalties/${id}/void`);
    return data;
  },

  async getPenaltyKPIs(): Promise<PenaltyKPIs> {
    if (DEV_BYPASS) {
      await delay(300);
      return {
        pending: 14,
        applied: 13,
        voided: 16,
        paid: 31,
      };
    }
    const { data } = await apiClient.get<PenaltyKPIs>('/admin/penalties/stats');
    return data;
  },
};
