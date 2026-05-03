'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PenaltyTableRow } from './penalty-table-row';
import type { PenaltyListResponse } from '@/services/admin/penalty.types';

interface PenaltyTableProps {
  data: PenaltyListResponse | null;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

export function PenaltyTable({ data, loading, page, onPageChange }: PenaltyTableProps) {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-[#1A1A1A]" />
        ))}
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-[#6B7280] text-sm">
        No penalties found
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
            <TableHead className="text-[#9CA3AF] text-xs font-medium">ID</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Type</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Entity</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Entity ID</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Name</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Status</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Amount</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((penalty) => (
            <PenaltyTableRow key={penalty.id} penalty={penalty} />
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#2A2A2A] px-4 py-3 mt-2">
          <p className="text-xs text-[#6B7280]">
            Showing {start}-{end} of {meta.total} penalties
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
