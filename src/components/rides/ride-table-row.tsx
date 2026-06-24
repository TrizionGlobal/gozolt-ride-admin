'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { RideStatusBadge } from './ride-status-badge';
import { RideTypeBadge } from './ride-type-badge';
import type { RideListItem } from '@/services/admin/ride.types';

interface RideTableRowProps {
  ride: RideListItem;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }) + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function RideTableRow({ ride }: RideTableRowProps) {
  const userName = [ride.user.firstName, ride.user.lastName].filter(Boolean).join(' ') || '—';
  const driverName = ride.driver
    ? `${ride.driver.firstName} ${ride.driver.lastName}`
    : '—';
  const supplierName = ride._supplierName ?? '—';
  const fare = Number(ride.actualFare ?? ride.estimatedFare ?? 0);
  const payment = ride.driver ? (ride.paymentMethod === 'CARD' ? 'Card' : ride.paymentMethod === 'CASH' ? 'Cash' : 'Wallet') : '—';
  const duration = ride.durationMinutes ? `${ride.durationMinutes} min` : '—';

  return (
    <TableRow className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]/50">
      <TableCell>
        <span className="text-sm font-bold text-[#FACC15] font-mono">{ride._displayId}</span>
      </TableCell>
      <TableCell className="text-sm text-[#9CA3AF]">
        {formatDate(ride.requestedAt)}
      </TableCell>
      <TableCell className="text-sm text-white">{userName}</TableCell>
      <TableCell className="text-sm text-white">{driverName}</TableCell>
      <TableCell className="text-sm text-[#9CA3AF]">{supplierName}</TableCell>
      <TableCell className="text-sm text-[#9CA3AF] max-w-[140px] truncate">
        {ride.pickupAddress}
      </TableCell>
      <TableCell className="text-sm text-[#9CA3AF] max-w-[140px] truncate">
        {ride.dropoffAddress}
      </TableCell>
      <TableCell>
        <RideStatusBadge status={ride.status} isDisputed={ride._isDisputed} />
      </TableCell>
      <TableCell>
        <RideTypeBadge type={ride.vehicleType} />
      </TableCell>
      <TableCell className="text-sm text-white">&euro;{fare.toFixed(2)}</TableCell>
      <TableCell className="text-sm text-[#9CA3AF]">{payment}</TableCell>
      <TableCell className="text-sm text-[#9CA3AF]">{duration}</TableCell>
      <TableCell className="text-center">
        <button className="text-[#38BDF8] hover:text-[#7DD3FC] transition-colors p-1">
          <Eye className="h-4 w-4" />
        </button>
      </TableCell>
    </TableRow>
  );
}
