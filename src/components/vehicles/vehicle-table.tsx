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
import { VehicleTableRow } from './vehicle-table-row';
import type { VehicleListResponse } from '@/services/admin/vehicle.types';

interface VehicleTableProps {
  data: VehicleListResponse | null;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onSuspend: (id: string) => void;
  onReject: (id: string) => void;
  onRefetch: () => void;
}

export function VehicleTable({
  data,
  loading,
  page,
  onPageChange,
  onSuspend,
  onReject,
  onRefetch,
}: VehicleTableProps) {
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
        <p className="text-sm text-[#6B7280]">No vehicles found</p>
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
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Plate</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Vehicle</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Type</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Driver</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Supplier</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Status</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Fuel</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((vehicle) => (
            <VehicleTableRow
              key={vehicle.id}
              vehicle={vehicle}
              onSuspend={onSuspend}
              onReject={onReject}
              onRefetch={onRefetch}
            />
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#2A2A2A] px-4 py-3 mt-2">
          <p className="text-xs text-[#6B7280]">
            Showing {start}-{end} of {meta.total} vehicles
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
