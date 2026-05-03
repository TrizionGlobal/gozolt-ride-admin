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
import { PaymentTableRow } from './payment-table-row';
import type { TransactionListResponse } from '@/services/admin/payment.types';

interface PaymentTableProps {
  data: TransactionListResponse | null;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

export function PaymentTable({
  data,
  loading,
  page,
  onPageChange,
}: PaymentTableProps) {
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
        <p className="text-sm text-[#6B7280]">No transactions found</p>
        <p className="text-xs text-[#4B5563] mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  const { meta } = data;
  const start = (meta.page - 1) * meta.limit + 1;
  const end = Math.min(meta.page * meta.limit, meta.total);

  const handleExport = () => {
    const rows = data.data.map((t) => ({
      id: t.id,
      type: t.type,
      description: t.description,
      amount: t.amount,
      commission: t.commission,
      status: t.status,
      date: t.date,
    }));
    exportToCSV(rows, [
      { key: 'id', label: 'ID' },
      { key: 'type', label: 'Type' },
      { key: 'description', label: 'Description' },
      { key: 'amount', label: 'Amount' },
      { key: 'commission', label: 'Commission' },
      { key: 'status', label: 'Status' },
      { key: 'date', label: 'Date' },
    ], 'payments');
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
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Type</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Description</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Amount</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Status</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Method</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Supplier</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Commission</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((txn) => (
            <PaymentTableRow key={txn._rawId} txn={txn} />
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#2A2A2A] px-4 py-3 mt-2">
          <p className="text-xs text-[#6B7280]">
            Showing {start}-{end} of {meta.total} transactions
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
