'use client';

import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServerSideTable, type ColumnDef } from '@/components/ui/server-side-table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RideStatusBadge } from './ride-status-badge';
import { RideTypeBadge } from './ride-type-badge';
import type { RideListResponse, RideListItem } from '@/services/admin/ride.types';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }) + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

interface RideTableProps {
  data: RideListResponse | null;
  loading: boolean;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function RideTable({
  data,
  loading,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: RideTableProps) {
  const columns: ColumnDef<RideListItem>[] = [
    {
      key: 'date',
      title: 'Date',
      render: (r) => <span className="text-sm text-[#9CA3AF]">{formatDate(r.requestedAt)}</span>,
    },
    {
      key: 'user',
      title: 'User',
      render: (r) => <span className="text-sm text-white whitespace-nowrap">{[r.user.firstName, r.user.lastName].filter(Boolean).join(' ') || '—'}</span>,
    },
    {
      key: 'driver',
      title: 'Driver',
      render: (r) => <span className="text-sm text-white whitespace-nowrap">{r.driver ? `${r.driver.firstName} ${r.driver.lastName}` : '—'}</span>,
    },
    {
      key: 'pickup',
      title: 'Pickup',
      render: (r) => (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm text-[#9CA3AF] max-w-[140px] truncate block cursor-help">{r.pickupAddress}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[300px] text-sm">{r.pickupAddress}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      key: 'dropoff',
      title: 'Dropoff',
      render: (r) => (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm text-[#9CA3AF] max-w-[140px] truncate block cursor-help">{r.dropoffAddress}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[300px] text-sm">{r.dropoffAddress}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (r) => <RideStatusBadge status={r.status} isDisputed={r._isDisputed} />,
    },
    {
      key: 'type',
      title: 'Type',
      render: (r) => <RideTypeBadge type={r.vehicleType} />,
    },
    {
      key: 'fare',
      title: 'Fare',
      render: (r) => <span className="text-sm text-white">&euro;{Number(r.actualFare ?? r.estimatedFare ?? 0).toFixed(2)}</span>,
    },
    {
      key: 'payment',
      title: 'Payment',
      render: (r) => <span className="text-sm text-[#9CA3AF]">{r.driver ? (r.paymentMethod === 'CARD' ? 'Card' : r.paymentMethod === 'CASH' ? 'Cash' : 'Wallet') : '—'}</span>,
    },
    {
      key: 'duration',
      title: 'Duration',
      render: (r) => <span className="text-sm text-[#9CA3AF]">{r.durationMinutes ? `${r.durationMinutes} min` : '—'}</span>,
    },
  ];

  return (
    <div>
      <ServerSideTable
        columns={columns}
        data={data?.data || []}
        isLoading={loading}
        page={page}
        limit={limit}
        total={data?.meta?.total || 0}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
}
