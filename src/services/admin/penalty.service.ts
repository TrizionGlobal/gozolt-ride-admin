import { apiClient } from '@/lib/api-client';
import type {
  PenaltyTransaction,
  PenaltyKPIs,
  PenaltyFilterParams,
  PenaltyListResponse,
} from './penalty.types';

export const penaltyService = {
  async listPenalties(params: PenaltyFilterParams): Promise<PenaltyListResponse> {
    try {
      const { data } = await apiClient.get<PenaltyListResponse>('/admin/penalties', { params });
      return data;
    } catch {
      return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1 } };
    }
  },

  async voidPenalty(id: string): Promise<PenaltyTransaction> {
    const { data } = await apiClient.patch<PenaltyTransaction>(`/admin/penalties/${id}/void`);
    return data;
  },

  async getPenaltyKPIs(): Promise<PenaltyKPIs> {
    try {
      const { data } = await apiClient.get<PenaltyKPIs>('/admin/penalties/stats');
      return data;
    } catch {
      return { pending: 0, applied: 0, voided: 0, paid: 0 };
    }
  },
};
