import { apiClient } from '@/lib/api-client';
import type {
  AuditLogFilterParams,
  AuditLogListResponse,
} from './audit-log.types';

export const auditLogService = {
  async listAuditLogs(params: AuditLogFilterParams): Promise<AuditLogListResponse> {
    try {
      const { data } = await apiClient.get<AuditLogListResponse>('/admin/audit-logs', { params });
      return data;
    } catch {
      return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 1 } };
    }
  },
};
