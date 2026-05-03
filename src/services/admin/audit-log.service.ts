import { apiClient } from '@/lib/api-client';
import { mockAuditLogs } from './audit-log.mock';
import type {
  AuditLogFilterParams,
  AuditLogListResponse,
} from './audit-log.types';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const auditLogService = {
  async listAuditLogs(params: AuditLogFilterParams): Promise<AuditLogListResponse> {
    if (DEV_BYPASS) {
      await delay(400);
      let filtered = [...mockAuditLogs];

      if (params.entityType) {
        filtered = filtered.filter((l) => l.entityType === params.entityType);
      }
      if (params.action) {
        filtered = filtered.filter((l) => l.action === params.action);
      }
      if (params.actorId) {
        filtered = filtered.filter((l) => l.actorId === params.actorId);
      }
      if (params.from) {
        const fromDate = new Date(params.from);
        filtered = filtered.filter((l) => new Date(l.createdAt) >= fromDate);
      }
      if (params.to) {
        const toDate = new Date(params.to);
        filtered = filtered.filter((l) => new Date(l.createdAt) <= toDate);
      }
      if (params.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(
          (l) =>
            l._displayId.toLowerCase().includes(s) ||
            l.entityType.toLowerCase().includes(s) ||
            l._actorEmail.toLowerCase().includes(s),
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
    const { data } = await apiClient.get<AuditLogListResponse>('/admin/audit-logs', { params });
    return data;
  },
};
