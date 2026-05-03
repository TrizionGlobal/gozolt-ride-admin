import { apiClient } from '@/lib/api-client';
import { mockDisputes, mockDisputeKPIs, mockTabCounts } from './dispute.mock';
import type {
  Dispute,
  DisputeKPIs,
  DisputeReply,
  DisputeStatus,
  DisputeTab,
  DisputeTabCounts,
} from './dispute.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

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
    if (DEV_BYPASS) {
      await delay(400);
      let filtered = [...mockDisputes];
      if (tab !== 'all') filtered = filterByTab(filtered, tab);
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (d) =>
            d._displayId.toLowerCase().includes(q) ||
            d._userName.toLowerCase().includes(q) ||
            d.subject.toLowerCase().includes(q),
        );
      }
      return filtered;
    }
    const { data } = await apiClient.get('/admin/disputes', {
      params: { status: tab, search },
    });
    return data.data ?? data;
  },

  async getDisputeDetail(id: string): Promise<Dispute> {
    if (DEV_BYPASS) {
      await delay(300);
      const dispute = mockDisputes.find((d) => d.id === id);
      if (!dispute) throw new Error('Dispute not found');
      return { ...dispute };
    }
    const { data } = await apiClient.get(`/admin/disputes/${id}`);
    return data;
  },

  async replyToDispute(id: string, message: string): Promise<DisputeReply> {
    if (DEV_BYPASS) {
      await delay(500);
      const newReply: DisputeReply = {
        id: `reply-${Date.now()}`,
        authorName: 'Admin',
        authorRole: 'ADMIN',
        message,
        createdAt: new Date().toISOString(),
      };
      const dispute = mockDisputes.find((d) => d.id === id);
      if (dispute) {
        dispute._replies.push(newReply);
        dispute._replyCount++;
      }
      return newReply;
    }
    const { data } = await apiClient.post(`/admin/disputes/${id}/reply`, { message });
    return data;
  },

  async updateDisputeStatus(id: string, status: DisputeStatus): Promise<void> {
    if (DEV_BYPASS) {
      await delay(400);
      const dispute = mockDisputes.find((d) => d.id === id);
      if (dispute) {
        dispute._uiStatus = status;
        if (status === 'resolved') {
          dispute.status = 'RESOLVED';
          dispute.resolvedAt = new Date().toISOString();
        } else if (status === 'escalated') {
          dispute._isEscalated = true;
        } else if (status === 'in_review') {
          dispute.status = 'IN_PROGRESS';
        } else if (status === 'closed') {
          dispute.status = 'CLOSED';
        }
        dispute.updatedAt = new Date().toISOString();
      }
      return;
    }
    await apiClient.patch(`/admin/disputes/${id}/status`, { status });
  },

  async getDisputeStats(): Promise<DisputeKPIs> {
    if (DEV_BYPASS) {
      await delay(200);
      return { ...mockDisputeKPIs };
    }
    const { data } = await apiClient.get('/admin/disputes/stats');
    return data;
  },

  async getTabCounts(): Promise<DisputeTabCounts> {
    if (DEV_BYPASS) {
      await delay(200);
      return { ...mockTabCounts };
    }
    const { data } = await apiClient.get('/admin/disputes/counts');
    return data;
  },
};
