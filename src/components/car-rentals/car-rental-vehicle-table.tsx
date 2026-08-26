'use client';

import { ServerSideTable, type ColumnDef } from '@/components/ui/server-side-table';
import { Badge } from '@/components/ui/badge';
import { formatStatusLabel } from '@/lib/utils';
import type { PaginatedResponse } from '@/types';
import type { AdminCarRentalVehicle } from '@/hooks/use-admin-car-rentals';

interface CarRentalVehicleTableProps {
  data: PaginatedResponse<AdminCarRentalVehicle> | undefined | null;
  loading: boolean;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const columns: ColumnDef<AdminCarRentalVehicle>[] = [
  {
    key: 'vehicle',
    title: 'VEHICLE',
    render: (row) => (
      <div className="flex items-center gap-3">
        {row.images && row.images.length > 0 ? (
          <img src={row.images[0]} alt={row.name} className="h-10 w-16 object-cover rounded-md border border-[#2A2A2A]" />
        ) : (
          <div className="h-10 w-16 bg-[#2A2A2A] rounded-md flex items-center justify-center">
            <span className="text-xs text-[#6B7280]">No Img</span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-medium text-white">{row.name}</span>
          <span className="text-[10px] text-[#A1A1AA] font-medium tracking-wide uppercase mt-0.5">
            {row.transmission} &bull; {row.fuelType}
          </span>
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
    key: 'reg',
    title: 'REG & YEAR',
    render: (row) => (
      <div className="flex flex-col">
        <span className="text-[#A1A1AA] text-sm font-medium">{row.registrationNo || '-'}</span>
        <span className="text-[#6B7280] text-xs">{row.year || '-'}</span>
      </div>
    ),
  },
  {
    key: 'category',
    title: 'CATEGORY',
    render: (row) => (
      <Badge variant="outline" className="border-[#2A2A2A] bg-[#141414] text-[#A1A1AA] uppercase tracking-wider text-[10px] font-semibold">
        {row.category.replace('_', ' ')}
      </Badge>
    ),
  },
  {
    key: 'price',
    title: 'DAILY PRICE',
    render: (row) => <span className="text-white font-medium">€{row.pricePerDay}</span>,
  },
  {
    key: 'packages',
    title: 'PACKAGES',
    className: 'text-center',
    render: (row) => (
      <div className="flex justify-center">
        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2A2A2A] text-xs font-medium text-[#A1A1AA]">
          {row._count?.protectionPackages || 0}
        </div>
      </div>
    ),
  },
  {
    key: 'addons',
    title: 'ADD-ONS',
    className: 'text-center',
    render: (row) => (
      <div className="flex justify-center">
        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2A2A2A] text-xs font-medium text-[#A1A1AA]">
          {row._count?.addons || 0}
        </div>
      </div>
    ),
  },
  {
    key: 'status',
    title: 'STATUS',
    className: 'text-center',
    render: (row) => (
      <div className="flex justify-center">
        <Badge
          variant="outline"
          className={
            row.status === 'AVAILABLE'
              ? 'border-[#22C55E]/20 bg-[#22C55E]/10 text-[#22C55E]'
              : row.status === 'ON_RENT'
              ? 'border-[#3B82F6]/20 bg-[#3B82F6]/10 text-[#3B82F6]'
              : 'border-[#EF4444]/20 bg-[#EF4444]/10 text-[#EF4444]'
          }
        >
          {formatStatusLabel(row.status)}
        </Badge>
      </div>
    ),
  },
];

export function CarRentalVehicleTable({
  data,
  loading,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: CarRentalVehicleTableProps) {
  return (
    <ServerSideTable<AdminCarRentalVehicle>
      columns={columns}
      data={data?.data ?? []}
      isLoading={loading}
      page={page}
      limit={limit}
      total={data?.meta?.total ?? 0}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      rowKey="id"
      emptyText="No vehicles found"
    />
  );
}
