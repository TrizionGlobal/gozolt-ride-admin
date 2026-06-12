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
import { DriverTableRow } from './driver-table-row';
import { DriverDetailDrawer } from './driver-detail-drawer';
import type { DriverListResponse } from '@/services/admin/driver.types';

interface DriverTableProps {
  data: DriverListResponse | null;
  loading: boolean;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSuspend: (id: string) => void;
  onRefetch: () => void;
}

export function DriverTable({
  data,
  loading,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onSuspend,
  onRefetch,
}: DriverTableProps) {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleViewDetail = (id: string) => {
    setSelectedDriverId(id);
    setDrawerOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-[#1A1A1A]" />
        ))}
      </div>
    );
  }

  const driversList = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 20, total: 0, totalPages: 0 };

  if (driversList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-[#6B7280]">No drivers found</p>
        <p className="text-xs text-[#4B5563] mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  const start = (meta.page - 1) * meta.limit + 1;
  const end = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#2A2A2A] hover:bg-transparent">
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Driver</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Supplier</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Driver Status</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Rating</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Rides</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Earnings</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Vehicle</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium text-center">Supplier Status</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium text-center">Admin Status</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {driversList.map((driver) => (
            <DriverTableRow
              key={driver.id}
              driver={driver}
              onSuspend={onSuspend}
              onRefetch={onRefetch}
              onViewDetail={handleViewDetail}
            />
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {meta.total > 0 && (
        <div className="flex items-center justify-between border-t border-[#2A2A2A] px-4 py-3 mt-2">
          <div className="flex items-center gap-4">
            <p className="text-xs text-[#6B7280]">
              Showing {start}-{end} of {meta.total} drivers
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6B7280]">Rows per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  onLimitChange(Number(e.target.value));
                  onPageChange(1);
                }}
                className="appearance-none rounded-md border border-[#3F3F46] bg-[#0A0A0A] py-1 pl-2 pr-6 text-xs text-white focus:border-[#FACC15] focus:outline-none"
              >
                <option value={20} className="bg-[#111111] text-white">20</option>
                <option value={50} className="bg-[#111111] text-white">50</option>
                <option value={100} className="bg-[#111111] text-white">100</option>
                <option value={200} className="bg-[#111111] text-white">200</option>
                <option value={500} className="bg-[#111111] text-white">500</option>
              </select>
            </div>
          </div>
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

      <DriverDetailDrawer
        driverId={selectedDriverId}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
