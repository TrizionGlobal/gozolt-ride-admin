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
import { RideTableRow } from './ride-table-row';
import type { RideListResponse } from '@/services/admin/ride.types';

interface RideTableProps {
  data: RideListResponse | null;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

export function RideTable({
  data,
  loading,
  page,
  onPageChange,
}: RideTableProps) {
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
        <p className="text-sm text-[#6B7280]">No rides found</p>
        <p className="text-xs text-[#4B5563] mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  const { meta } = data;
  const start = (meta.page - 1) * meta.limit + 1;
  const end = Math.min(meta.page * meta.limit, meta.total);

  const handleExport = () => {
    const rows = data.data.map((r) => ({
      id: r._displayId,
      passenger: [r.user.firstName, r.user.lastName].filter(Boolean).join(' '),
      driver: r.driver ? `${r.driver.firstName} ${r.driver.lastName}` : '',
      vehicleType: r.vehicleType,
      status: r.status,
      fare: r.actualFare ?? r.estimatedFare,
      tip: r.tip?.amount ?? 0,
      paymentMethod: r.paymentMethod,
      date: r.requestedAt,
    }));
    exportToCSV(rows, [
      { key: 'id', label: 'ID' },
      { key: 'passenger', label: 'Passenger' },
      { key: 'driver', label: 'Driver' },
      { key: 'vehicleType', label: 'Vehicle Type' },
      { key: 'status', label: 'Status' },
      { key: 'fare', label: 'Fare' },
      { key: 'tip', label: 'Tip' },
      { key: 'paymentMethod', label: 'Payment Method' },
      { key: 'date', label: 'Date' },
    ], 'rides');
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
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Ride #</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Date</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">User</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Driver</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Supplier</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Pickup</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Dest</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Status</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Type</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Fare</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Payment</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((ride) => (
            <RideTableRow key={ride.id} ride={ride} />
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#2A2A2A] px-4 py-3 mt-2">
          <p className="text-xs text-[#6B7280]">
            Showing {start}-{end} of {meta.total} rides
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
