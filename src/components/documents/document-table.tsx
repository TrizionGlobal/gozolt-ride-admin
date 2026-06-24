'use client';

import { Eye, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentStatusBadge } from './document-status-badge';
import { getDocumentTypeDisplay } from '@/services/admin/document.types';
import type { DocumentListResponse, DocumentListItem } from '@/services/admin/document.types';
import { ServerSideTable, type ColumnDef } from '@/components/ui/server-side-table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DocumentTableProps {
  data: DocumentListResponse | null;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  variant: 'pending' | 'approved' | 'rejected' | 'expired';
  onApprove?: (doc: DocumentListItem) => void;
  onReject?: (doc: DocumentListItem) => void;
  approvingId?: string | null;
}

export function DocumentTable({
  data,
  loading,
  page,
  onPageChange,
  variant,
  onApprove,
  onReject,
  approvingId,
}: DocumentTableProps) {
  const meta = data?.meta || { total: 0, limit: 20, page: 1, totalPages: 1 };
  const items = data?.data || [];

  const columns: ColumnDef<DocumentListItem>[] = [
    {
      key: 'document',
      title: 'Document',
      render: (doc) => (
        <div>
          <p className="text-sm font-medium text-white">
            {getDocumentTypeDisplay(doc.type)}
          </p>
        </div>
      ),
    },
    {
      key: 'entity',
      title: 'Supplier',
      render: (doc) => (
        <div className="flex flex-col gap-1">
          <p className="text-sm text-white">{doc.entity?.name !== 'Unknown Entity' ? doc.entity?.name : 'Supplier'}</p>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (doc) => <DocumentStatusBadge status={doc.status} />,
    },
    {
      key: 'submitted',
      title: 'Submitted',
      render: (doc) => (
        <span className="text-sm text-[#9CA3AF]">
          {new Date(doc.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </span>
      ),
    },
  ];

  if (variant !== 'pending') {
    columns.push({
      key: 'reviewed',
      title: 'Reviewed',
      render: (doc) => (
        <span className="text-sm text-[#9CA3AF]">
          {doc.reviewedAt
            ? new Date(doc.reviewedAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : '—'}
        </span>
      ),
    });
  }

  if (variant === 'rejected') {
    columns.push({
      key: 'reason',
      title: 'Reason',
      render: (doc) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm text-red-400 max-w-[200px] truncate cursor-default">
                {doc.rejectionReason ?? '—'}
              </p>
            </TooltipTrigger>
            {doc.rejectionReason && (
              <TooltipContent className="max-w-xs break-words bg-[#1A1A1A] text-white border-[#2A2A2A]">
                <p>{doc.rejectionReason}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      ),
    });
  }

  columns.push({
    key: 'actions',
    title: <span className="block text-center">Actions</span>,
    className: 'text-center',
    render: (doc) => (
      <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A]"
          onClick={() => window.open(doc.fileUrl, '_blank')}
          title="View Document"
        >
          <Eye className="h-4 w-4" />
        </Button>
        {variant === 'pending' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              disabled={approvingId === doc.id}
              className="h-8 px-3 text-green-500 hover:bg-green-500/10 hover:text-green-400"
              onClick={(e) => {
                e.stopPropagation();
                onApprove?.(doc);
              }}
            >
              {approvingId === doc.id ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Approving...
                </>
              ) : (
                'Approve'
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-red-500 hover:bg-red-500/10 hover:text-red-400"
              onClick={(e) => {
                e.stopPropagation();
                onReject?.(doc);
              }}
            >
              Reject
            </Button>
          </>
        )}
      </div>
    ),
  });

  return (
    <ServerSideTable
      columns={columns}
      data={items}
      isLoading={loading}
      page={meta.page}
      limit={meta.limit}
      total={meta.total}
      onPageChange={onPageChange}
      onLimitChange={() => {}} // Not currently supported in DocumentTable API
      rowKey="id"
      emptyText={
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-[#6B7280]">No {variant} documents found</p>
          <p className="text-xs text-[#4B5563] mt-1">Try adjusting your filters</p>
        </div>
      }
    />
  );
}
