import { apiClient } from '@/lib/api-client';
import type {
  Dispute,
  DisputeKPIs,
  DisputeReply,
  DisputeStatus,
  DisputeTab,
  DisputeTabCounts,
} from './dispute.types';

function filterByTab(disputes: Dispute[], tab: DisputeTab): Dispute[] {
  switch (tab) {
    case 'all':
      return disputes;
    case 'open':
      return disputes.filter((d) => d._uiStatus === 'open');
    case 'in_review':
      return disputes.filter((d) => d._uiStatus === 'in_review');
    case 'resolved':
      return disputes.filter((d) => d._uiStatus === 'resolved');
    case 'escalated':
      return disputes.filter((d) => d._isEscalated);
    default:
      return disputes;
  }
}

export const disputeService = {
  async listDisputes(tab: DisputeTab, search?: string): Promise<Dispute[]> {
    try {
      const { data } = await apiClient.get('/admin/disputes', {
        params: { status: tab, search },
      });
      return data.data ?? data;
    } catch {
      return [];
    }
  },

  async getDisputeDetail(id: string): Promise<Dispute> {
    const { data } = await apiClient.get(`/admin/disputes/${id}`);
    return data;
  },

  async replyToDispute(id: string, message: string): Promise<DisputeReply> {
    const { data } = await apiClient.post(`/admin/disputes/${id}/reply`, { message });
    return data;
  },

  async updateDisputeStatus(id: string, status: DisputeStatus): Promise<void> {
    await apiClient.patch(`/admin/disputes/${id}/status`, { status });
  },

  async getDisputeStats(): Promise<DisputeKPIs> {
    try {
      const { data } = await apiClient.get('/admin/disputes/stats');
      return data;
    } catch {
      return {
        total: 0,
        open: 0,
        inReview: 0,
        escalated: 0,
        changes: { total: 0, open: 0, inReview: 0, escalated: 0 }
      };
    }
  },

  async getTabCounts(): Promise<DisputeTabCounts> {
    try {
      const { data } = await apiClient.get('/admin/disputes/counts');
      return data;
    } catch {
      return { open: 0, escalated: 0 };
    }
  },
};
