'use client';

import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { exportToCSV } from '@/lib/export-csv';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AuditLogTableRow } from './audit-log-table-row';
import type { AuditLogListResponse } from '@/services/admin/audit-log.types';

interface AuditLogTableProps {
  data: AuditLogListResponse | null;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

export function AuditLogTable({
  data,
  loading,
  page,
  onPageChange,
}: AuditLogTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-[#1A1A1A]" />
        ))}
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-[#6B7280] text-sm">
        No audit logs found
      </div>
    );
  }

  const { meta } = data;
  const start = (meta.page - 1) * meta.limit + 1;
  const end = Math.min(meta.page * meta.limit, meta.total);

  const handleExport = () => {
    const rows = data.data.map((l) => ({
      entity: l.entityType,
      action: l.action,
      user: l._actorEmail,
      date: l.createdAt,
    }));
    exportToCSV(rows, [
      { key: 'entity', label: 'Entity' },
      { key: 'action', label: 'Action' },
      { key: 'user', label: 'User' },
      { key: 'date', label: 'Date' },
    ], 'audit-logs');
  };

  return (
    <div>
      <div className="flex items-center justify-end px-4 py-2 border-b border-[#2A2A2A]">
        <button
          onClick={handleExport}
          className="border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-1.5 rounded-lg text-xs text-[#9CA3AF] hover:bg-[#1A1A1A] hover:text-white flex items-center gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#2A2A2A] hover:bg-transparent">
            <TableHead className="text-[#9CA3AF] text-xs font-medium">ID</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Entity Type</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Action</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Actor</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Timestamp</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((log) => (
            <AuditLogTableRow key={log.id} log={log} />
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#2A2A2A] px-4 py-3 mt-2">
          <p className="text-xs text-[#6B7280]">
            Showing {start}-{end} of {meta.total} logs
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="h-8 text-xs text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] disabled:opacity-40"
            >
              <ChevronLeft className="mr-1 h-3 w-3" />
              Previous
            </Button>
            <span className="text-xs text-[#6B7280]">
              Page {meta.page} of {meta.totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => onPageChange(page + 1)}
              className="h-8 text-xs text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] disabled:opacity-40"
            >
              Next
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
