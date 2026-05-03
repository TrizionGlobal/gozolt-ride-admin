'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ProcessingRestriction } from '@/services/admin/gdpr.types';

interface ProcessingRestrictionsTableProps {
  restrictions: ProcessingRestriction[];
  loading: boolean;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function ProcessingRestrictionsTable({
  restrictions,
  loading,
}: ProcessingRestrictionsTableProps) {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-[#1A1A1A]" />
        ))}
      </div>
    );
  }

  if (restrictions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-[#6B7280] text-sm">
        No processing restrictions found
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#2A2A2A] hover:bg-transparent">
            <TableHead className="text-[#9CA3AF] text-xs font-medium">User</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Restricted Date</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {restrictions.map((restriction) => (
            <TableRow
              key={restriction.userId}
              className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A] transition-colors"
            >
              <TableCell className="text-white text-sm font-medium">
                {restriction.userName}
              </TableCell>
              <TableCell className="text-[#9CA3AF] text-sm">
                {formatDate(restriction.restrictedAt)}
              </TableCell>
              <TableCell className="text-[#9CA3AF] text-sm max-w-md">
                {restriction.reason}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
