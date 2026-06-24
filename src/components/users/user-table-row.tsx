'use client';

import { Star } from 'lucide-react';
import { VehicleType } from '@/types';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UserStatusBadge } from './user-status-badge';
import type { UserListItem } from '@/services/admin/user.types';

interface UserTableRowProps {
  user: UserListItem;
  onBan: (id: string) => void;
  onForceLogout: (id: string) => void;
  onRefetch: () => void;
  onViewDetail?: (id: string) => void;
}

export function UserTableRow({ user, onBan, onForceLogout, onRefetch, onViewDetail }: UserTableRowProps) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unknown User';
  const totalSpent = user._computed?.totalSpent ?? 0;
  const paymentMethod = user._computed?.paymentMethod ?? 'N/A';
  const lastRideDate = user._computed?.lastRideDate ?? '—';

  return (
    <TableRow
      className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]/50 transition-colors cursor-pointer"
      onClick={() => onViewDetail?.(user.id)}
    >
      {/* User Info */}
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">{fullName}</span>
          <span className="text-xs text-[#6B7280]">
            {user.email || 'No email'}
          </span>
        </div>
      </TableCell>

      {/* Mobile */}
      <TableCell className="text-sm text-[#9CA3AF]">
        {user.phone || '—'}
      </TableCell>

      {/* Status */}
      <TableCell>
        <UserStatusBadge status={user.status} />
      </TableCell>

      {/* Rating */}
      <TableCell>
        <span className="inline-flex items-center gap-1 text-sm text-white">
          <Star className="h-3.5 w-3.5 fill-[#FACC15] text-[#FACC15]" />
          {(user.avgRating ?? 0).toFixed(1)}
        </span>
      </TableCell>

      {/* Rides */}
      <TableCell className="text-sm text-[#9CA3AF]">
        {user._count.rides.toLocaleString()}
      </TableCell>

      {/* Spent */}
      <TableCell className="text-sm text-white">
        &euro;{totalSpent.toLocaleString()}
      </TableCell>

      {/* Payments */}
      <TableCell className="text-sm text-[#9CA3AF]">
        {paymentMethod}
      </TableCell>

      {/* Last Ride */}
      <TableCell className="text-sm text-[#9CA3AF]">
        {lastRideDate}
      </TableCell>

      {/* Actions */}
      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetail?.(user.id)}
          className="h-8 text-xs font-medium text-[#FACC15] border-[#FACC15]/30 bg-[#FACC15]/10 hover:bg-[#FACC15] hover:text-black transition-colors px-3"
        >
          View Details
        </Button>
      </TableCell>
    </TableRow>
  );
}
