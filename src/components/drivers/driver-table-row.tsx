'use client';

import { Star } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { DriverStatusBadge } from './driver-status-badge';
import { DriverDocsBadge } from './driver-docs-badge';
import { DriverActionsMenu } from './driver-actions-menu';
import type { DriverListItem } from '@/services/admin/driver.types';

interface DriverTableRowProps {
  driver: DriverListItem;
  onSuspend: (id: string) => void;
  onRefetch: () => void;
  onViewDetail?: (id: string) => void;
}

export function DriverTableRow({ driver, onSuspend, onRefetch, onViewDetail }: DriverTableRowProps) {
  const fullName = `${driver.firstName} ${driver.lastName}`;
  const vehicle = driver.vehicleAssignment?.vehicle;
  const earnings = driver._computed?.totalEarnings ?? 0;
  const docsStatus = driver._computed?.docsStatus ?? 'pending';

  return (
    <TableRow
      className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]/50 transition-colors cursor-pointer"
      onClick={() => onViewDetail?.(driver.id)}
    >
      {/* ID */}
      <TableCell className="text-sm text-[#9CA3AF] font-mono">
        {driver.driverId}
      </TableCell>

      {/* Driver (name + email) */}
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">{fullName}</span>
          <span className="text-xs text-[#6B7280]">{driver.email ?? driver.phone}</span>
        </div>
      </TableCell>

      {/* Supplier */}
      <TableCell className="text-sm text-[#9CA3AF]">
        {driver.supplier.companyName}
      </TableCell>

      {/* Status */}
      <TableCell>
        <DriverStatusBadge status={driver.status} isOnline={driver.isOnline} />
      </TableCell>

      {/* Rating */}
      <TableCell>
        <span className="inline-flex items-center gap-1 text-sm text-white">
          <Star className="h-3.5 w-3.5 fill-[#FACC15] text-[#FACC15]" />
          {driver.avgRating.toFixed(1)}
        </span>
      </TableCell>

      {/* Rides */}
      <TableCell className="text-sm text-[#9CA3AF]">
        {driver.totalRides.toLocaleString()}
      </TableCell>

      {/* Earnings */}
      <TableCell className="text-sm text-white">
        €{earnings.toLocaleString()}
      </TableCell>

      {/* Vehicle */}
      <TableCell className="text-sm text-[#9CA3AF]">
        {vehicle ? `${vehicle.make} ${vehicle.model}` : '—'}
      </TableCell>

      {/* Docs */}
      <TableCell>
        <DriverDocsBadge status={docsStatus} />
      </TableCell>

      {/* Actions */}
      <TableCell>
        <DriverActionsMenu
          driverId={driver.id}
          driverName={fullName}
          status={driver.status}
          supplierName={driver.supplier.companyName}
          onSuspend={() => onSuspend(driver.id)}
          onRefetch={onRefetch}
        />
      </TableCell>
    </TableRow>
  );
}
