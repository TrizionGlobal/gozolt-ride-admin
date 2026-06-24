import { apiClient } from '@/lib/api-client';
import { DocumentStatus } from '@/types';
import type {
  DocumentListItem,
  DocumentDetail,
  DocumentFilterParams,
  ApproveDocumentPayload,
  RejectDocumentPayload,
  DocumentListResponse,
  DocumentKpis,
} from './document.types';


export const documentService = {
  async listDocuments(params: DocumentFilterParams): Promise<DocumentListResponse> {
    try {
      const { data } = await apiClient.get<DocumentListResponse>('/admin/documents', { params });
      return data;
    } catch {
      return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1 } };
    }
  },

  async getDocumentDetail(id: string): Promise<DocumentDetail> {
    const { data } = await apiClient.get<DocumentDetail>(`/admin/documents/${id}`);
    return data;
  },

  async reviewDocument(id: string, payload: { approved: boolean; reason?: string }): Promise<DocumentListItem> {
    const { data } = await apiClient.post<DocumentListItem>(`/admin/documents/${id}/review`, payload);
    return data;
  },

  async sendReminder(id: string): Promise<{ sent: boolean }> {
    const { data } = await apiClient.post<{ sent: boolean }>(`/admin/documents/${id}/reminder`);
    return data;
  },

  getKpis: async (entityType?: string) => {
    try {
      const { data } = await apiClient.get<DocumentKpis>('/admin/documents/kpis', { params: { entityType } });
      return data;
    } catch {
      return { pendingReview: 0, approved: 0, rejected: 0, expiringSoon: 0 };
    }
  },
};
