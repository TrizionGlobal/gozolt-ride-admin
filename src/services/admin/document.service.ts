import { apiClient } from '@/lib/api-client';
import { DocumentStatus } from '@/types';
import { mockDocuments, mockRequirements } from './document.mock';
import type {
  DocumentListItem,
  DocumentDetail,
  DocumentFilterParams,
  ApproveDocumentPayload,
  RejectDocumentPayload,
  DocumentListResponse,
  DocumentKpis,
} from './document.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// In-memory mutable copy for dev bypass state mutations
let mutableDocuments = [...mockDocuments];

function filterAndPaginate(params: DocumentFilterParams): DocumentListResponse {
  let filtered = [...mutableDocuments];

  if (params.status) {
    filtered = filtered.filter((d) => d.status === params.status);
  }

  if (params.entityType) {
    filtered = filtered.filter((d) => d.entity.entityType === params.entityType);
  }

  if (params.documentType) {
    filtered = filtered.filter((d) => d.type === params.documentType);
  }

  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.entity.name.toLowerCase().includes(s) ||
        d.entity.displayId.toLowerCase().includes(s) ||
        d.fileName.toLowerCase().includes(s),
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

export const documentService = {
  async listDocuments(params: DocumentFilterParams): Promise<DocumentListResponse> {
    if (DEV_BYPASS) {
      await delay(400);
      return filterAndPaginate(params);
    }
    const { data } = await apiClient.get<DocumentListResponse>('/admin/documents', { params });
    return data;
  },

  async getDocumentDetail(id: string): Promise<DocumentDetail> {
    if (DEV_BYPASS) {
      await delay(300);
      const doc = mutableDocuments.find((d) => d.id === id);
      if (!doc) throw new Error('Document not found');
      const typeKey = doc.type as string;
      const requirements = mockRequirements[typeKey] ?? mockRequirements.DEFAULT;
      return {
        ...doc,
        requirements,
        adminNotes: null,
      };
    }
    const { data } = await apiClient.get<DocumentDetail>(`/admin/documents/${id}`);
    return data;
  },

  async approveDocument(id: string, payload?: ApproveDocumentPayload): Promise<DocumentListItem> {
    if (DEV_BYPASS) {
      await delay(500);
      const idx = mutableDocuments.findIndex((d) => d.id === id);
      if (idx === -1) throw new Error('Document not found');
      mutableDocuments[idx] = {
        ...mutableDocuments[idx],
        status: DocumentStatus.APPROVED,
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'admin-current',
        updatedAt: new Date().toISOString(),
      };
      return mutableDocuments[idx];
    }
    const { data } = await apiClient.patch<DocumentListItem>(`/admin/documents/${id}/approve`, payload);
    return data;
  },

  async rejectDocument(id: string, payload: RejectDocumentPayload): Promise<DocumentListItem> {
    if (DEV_BYPASS) {
      await delay(500);
      const idx = mutableDocuments.findIndex((d) => d.id === id);
      if (idx === -1) throw new Error('Document not found');
      const fullReason = payload.details?.trim()
        ? `${payload.reason}: ${payload.details.trim()}`
        : payload.reason;
      mutableDocuments[idx] = {
        ...mutableDocuments[idx],
        status: DocumentStatus.REJECTED,
        rejectionReason: fullReason,
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'admin-current',
        updatedAt: new Date().toISOString(),
      };
      return mutableDocuments[idx];
    }
    const { data } = await apiClient.patch<DocumentListItem>(`/admin/documents/${id}/reject`, payload);
    return data;
  },

  async sendReminder(id: string): Promise<{ sent: boolean }> {
    if (DEV_BYPASS) {
      await delay(400);
      return { sent: true };
    }
    const { data } = await apiClient.post<{ sent: boolean }>(`/admin/documents/${id}/reminder`);
    return data;
  },

  getKpis(): DocumentKpis {
    const all = mutableDocuments;
    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return {
      pendingReview: all.filter((d) => d.status === DocumentStatus.PENDING).length,
      approved: all.filter((d) => d.status === DocumentStatus.APPROVED).length,
      rejected: all.filter((d) => d.status === DocumentStatus.REJECTED).length,
      expiringSoon: all.filter(
        (d) =>
          d.status === DocumentStatus.APPROVED &&
          d.expiresAt &&
          new Date(d.expiresAt) <= thirtyDays &&
          new Date(d.expiresAt) > now,
      ).length,
    };
  },
};
