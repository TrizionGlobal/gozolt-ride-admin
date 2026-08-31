'use client';

import { useRouter } from 'next/navigation';
import { ServerSideTable, type ColumnDef } from '@/components/ui/server-side-table';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import type { PaginatedResponse } from '@/types';
import type { AdminBikeRentalBooking } from '@/hooks/use-admin-bike-rentals';

interface BikeRentalBookingTableProps {
  data: PaginatedResponse<AdminBikeRentalBooking> | undefined | null;
  loading: boolean;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

function formatCustomDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strTime = hours.toString().padStart(2, '0') + ':' + minutes + ' ' + ampm;
  return `${day}-${month}-${year} ${strTime}`;
}

function getStatusBadgeClass(booking: any): string {
  const ext = booking.extensionRequests?.[0];
  if (ext?.status === 'APPROVED') return 'border-[#8B5CF6]/20 bg-[#8B5CF6]/10 text-[#8B5CF6]';
  if (ext?.status === 'CANCELLED') return 'border-[#F97316]/20 bg-[#F97316]/10 text-[#F97316]';
  if (ext?.status === 'REJECTED') return 'border-[#EF4444]/20 bg-[#EF4444]/10 text-[#EF4444]';
  if (booking.status === 'COMPLETED') return 'border-[#22C55E]/20 bg-[#22C55E]/10 text-[#22C55E]';
  if (booking.status === 'ACTIVE') return 'border-[#3B82F6]/20 bg-[#3B82F6]/10 text-[#3B82F6]';
  if (booking.status === 'CONFIRMED') return 'border-[#FACC15]/20 bg-[#FACC15]/10 text-[#FACC15]';
  if (booking.status === 'PENDING_APPROVAL') return 'border-[#F97316]/20 bg-[#F97316]/10 text-[#F97316]';
  if (booking.status === 'CANCELLED' || booking.status === 'REJECTED') return 'border-[#EF4444]/20 bg-[#EF4444]/10 text-[#EF4444]';
  return 'border-[#6B7280]/20 bg-[#6B7280]/10 text-[#6B7280]';
}

function getStatusLabel(booking: any): string {
  const ext = booking.extensionRequests?.[0];
  let status = booking.status || '';
  
  if (ext?.status === 'APPROVED') status = 'Extended';
  else if (ext?.status === 'CANCELLED') status = 'Ext. Cancelled';
  else if (ext?.status === 'REJECTED') status = 'Ext. Rejected';
  else if (booking.status === 'ACTIVE') status = 'On Rent';
  else if (booking.status === 'CANCELLED') status = 'User Cancelled';
  
  return status
    .replace(/_/g, ' ')
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function BikeRentalBookingTable({
  data,
  loading,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: BikeRentalBookingTableProps) {
  const router = useRouter();

  const columns: ColumnDef<AdminBikeRentalBooking>[] = [
    {
      key: 'customer',
      title: 'CUSTOMER',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#2A2A2A] flex items-center justify-center flex-shrink-0">
            <User className="h-4 w-4 text-[#A1A1AA]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">
              {row.user.firstName} {row.user.lastName}
            </span>
            <span className="text-xs text-[#6B7280]">{row.user.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'supplier',
      title: 'SUPPLIER',
      render: (row) => <span className="text-sm text-[#A1A1AA]">{row.supplier?.companyName || 'Unknown'}</span>,
    },
    {
      key: 'bike',
      title: 'VEHICLE',
      render: (row) => <span className="text-sm text-[#A1A1AA]">{row.bike?.name}</span>,
    },
    {
      key: 'dates',
      title: 'DATES',
      render: (row) => (
        <div>
          <div className="text-xs">
            <span className="text-[#71717A]">Pickup: </span>
            <span className="text-white">{formatCustomDate(row.startDate)}</span>
          </div>
          <div className="text-xs mt-1">
            <span className="text-[#71717A]">Return: </span>
            <span className="text-white">{formatCustomDate(row.endDate)}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'total',
      title: 'TOTAL',
      render: (row) => <span className="font-medium text-white">€{row.grandTotal || 0}</span>,
    },
    {
      key: 'status',
      title: 'STATUS',
      className: 'text-center',
      render: (row) => (
        <div className="flex justify-center">
          <Badge variant="outline" className={getStatusBadgeClass(row)}>
            {getStatusLabel(row)}
          </Badge>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'ACTIONS',
      className: 'text-center',
      render: (row) => (
        <div className="flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/bike-rentals/bookings/${row.id}`);
            }}
            className="rounded bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-colors"
          >
            View Details
          </button>
        </div>
      ),
    },
  ];

  return (
    <ServerSideTable<AdminBikeRentalBooking>
      columns={columns}
      data={data?.data ?? []}
      isLoading={loading}
      page={page}
      limit={limit}
      total={data?.meta?.total ?? 0}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      rowKey="id"
      emptyText="No bookings found"
    />
  );
}
