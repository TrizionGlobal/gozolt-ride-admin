'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DocumentStatusBadge } from './document-status-badge';
import { DocumentEntityBadge } from './document-entity-badge';
import { getDocumentTypeDisplay } from '@/services/admin/document.types';
import type { DocumentListResponse } from '@/services/admin/document.types';

interface DocumentTableProps {
  data: DocumentListResponse | null;
  loading: boolean;
  page: number;
  variant: 'approved' | 'rejected';
  onRowClick?: (id: string) => void;
}

export function DocumentTable({
  data,
  loading,
  page,
  onPageChange,
  variant,
  onRowClick,
}: DocumentTableProps) {
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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-[#6B7280]">No {variant} documents found</p>
        <p className="text-xs text-[#4B5563] mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  const { meta } = data;
  const start = (meta.page - 1) * meta.limit + 1;
  const end = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#2A2A2A] hover:bg-transparent">
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Document</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Entity</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Type</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Status</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Submitted</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Reviewed</TableHead>
            {variant === 'rejected' && (
              <TableHead className="text-[#9CA3AF] text-xs font-medium">Reason</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((doc) => (
            <TableRow
              key={doc.id}
              onClick={() => onRowClick?.(doc.id)}
              className={`border-b border-[#2A2A2A] ${onRowClick ? 'cursor-pointer hover:bg-[#1A1A1A]/50' : 'hover:bg-[#1A1A1A]/50'}`}
            >
              <TableCell>
                <div>
                  <p className="text-sm font-medium text-white">
                    {getDocumentTypeDisplay(doc.type)}
                  </p>
                  <p className="text-xs text-[#6B7280]">{doc.fileName}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-white">{doc.entity?.name || 'Unknown Entity'}</p>
                    <p className="text-xs text-[#6B7280]">{doc.entity?.displayId || (doc as any).entityId || 'N/A'}</p>
                  </div>
                  <DocumentEntityBadge entityType={doc.entity?.entityType || (doc as any).entityType || 'driver'} />
                </div>
              </TableCell>
              <TableCell>
                <DocumentEntityBadge entityType={doc.entity?.entityType || (doc as any).entityType || 'driver'} />
              </TableCell>
              <TableCell>
                <DocumentStatusBadge status={doc.status} />
              </TableCell>
              <TableCell className="text-sm text-[#9CA3AF]">
                {new Date(doc.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </TableCell>
              <TableCell className="text-sm text-[#9CA3AF]">
                {doc.reviewedAt
                  ? new Date(doc.reviewedAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '—'}
              </TableCell>
              {variant === 'rejected' && (
                <TableCell>
                  <p className="text-sm text-red-400 max-w-[200px] truncate">
                    {doc.rejectionReason ?? '—'}
                  </p>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#2A2A2A] px-4 py-3 mt-2">
          <p className="text-xs text-[#6B7280]">
            Showing {start}-{end} of {meta.total} documents
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
