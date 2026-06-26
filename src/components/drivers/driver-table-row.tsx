'use client';

import { Star } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { DriverStatusBadge } from './driver-status-badge';
import { DriverActionsMenu } from './driver-actions-menu';
import type { DriverListItem } from '@/services/admin/driver.types';
import { cn } from '@/lib/utils';

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

  return (
    <TableRow
      className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]/50 transition-colors"
    >

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
        <DriverStatusBadge status={driver.status} isOnline={driver.isOnline} hasVehicle={!!vehicle} />
      </TableCell>

      {/* Rating */}
      <TableCell>
        <span className="inline-flex items-center gap-1 text-sm text-white">
          <Star className="h-3.5 w-3.5 fill-[#FACC15] text-[#FACC15]" />
          {Number(driver.avgRating || 0).toFixed(1)}
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
        {vehicle ? (
          `${vehicle.make} ${vehicle.model}`
        ) : (
          <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2 py-0.5 text-[11px] font-medium text-blue-400 border border-blue-500/30">
            Not Assigned
          </span>
        )}
      </TableCell>

      {/* Supplier Approved */}
      <TableCell className="text-center">
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium',
            driver.supplierStatus === 'Pending' || driver.supplierStatus === 'Waiting'
              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
              : driver.supplierStatus === 'Rejected' || driver.supplierStatus === 'Suspended'
              ? 'bg-red-500/20 text-red-400 border-red-500/30'
              : 'bg-green-500/20 text-green-400 border-green-500/30'
          )}
        >
          {driver.supplierStatus}
        </span>
      </TableCell>

      {/* Admin Approved */}
      <TableCell className="text-center">
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium',
            driver.adminStatus === 'Pending' || driver.adminStatus === 'Waiting'
              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
              : driver.adminStatus === 'Rejected' || driver.adminStatus === 'Suspended'
              ? 'bg-red-500/20 text-red-400 border-red-500/30'
              : 'bg-green-500/20 text-green-400 border-green-500/30'
          )}
        >
          {driver.adminStatus}
        </span>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <DriverActionsMenu
            driverId={driver.id}
            driverName={fullName}
            status={driver.status}
            supplierName={driver.supplier.companyName}
            onSuspend={() => onSuspend(driver.id)}
            onRefetch={onRefetch}
            onViewDetail={() => onViewDetail?.(driver.id)}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
