'use client';

import { Star } from 'lucide-react';
import { VehicleType } from '@/types';
import { TableCell, TableRow } from '@/components/ui/table';
import { UserStatusBadge } from './user-status-badge';
import { UserActionsMenu } from './user-actions-menu';
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
      {/* ID */}
      <TableCell className="text-sm text-[#9CA3AF] font-mono">
        {user.displayId}
      </TableCell>

      {/* User Info */}
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">{fullName}</span>
          <span className="text-xs text-[#6B7280]">
            {user.email} &middot; {user.phone || 'No phone'}
          </span>
        </div>
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
      <TableCell>
        <UserActionsMenu
          userId={user.id}
          userName={fullName}
          displayId={user.displayId}
          status={user.status}
          onBan={() => onBan(user.id)}
          onForceLogout={() => onForceLogout(user.id)}
          onRefetch={onRefetch}
        />
      </TableCell>
    </TableRow>
  );
}
