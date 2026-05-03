'use client';

import { useState } from 'react';
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
import { SupplierTableRow } from './supplier-table-row';
import { SupplierDetailDrawer } from './supplier-detail-drawer';
import type { SupplierListResponse } from '@/services/admin/supplier.types';

interface SupplierTableProps {
  data: SupplierListResponse | null;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onRefetch: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSuspend: (id: string) => void;
}

export function SupplierTable({
  data,
  loading,
  page,
  onPageChange,
  onRefetch,
  onApprove,
  onReject,
  onSuspend,
}: SupplierTableProps) {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleViewDetail = (id: string) => {
    setSelectedSupplierId(id);
    setDrawerOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-[#1A1A1A]" />
        ))}
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-[#6B7280]">No suppliers found</p>
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
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Company</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Reg #</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Tier</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Status</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Vehicles</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Drivers</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Revenue</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((supplier) => (
            <SupplierTableRow
              key={supplier.id}
              supplier={supplier}
              onRefetch={onRefetch}
              onApprove={onApprove}
              onReject={onReject}
              onSuspend={onSuspend}
              onViewDetail={handleViewDetail}
            />
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#2A2A2A] px-4 py-3 mt-2">
          <p className="text-xs text-[#6B7280]">
            Showing {start}-{end} of {meta.total} suppliers
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

      <SupplierDetailDrawer
        supplierId={selectedSupplierId}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
