'use client';

import { Check, X, Settings } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AdminRoleBadge } from './admin-role-badge';
import type { AdminUser } from '@/services/admin/settings.types';
import { toast } from 'sonner';

interface AdminUserRowProps {
  user: AdminUser;
}

function getInitials(firstName: string, lastName: string): string {
  const f = firstName ? firstName.charAt(0) : '';
  const l = lastName ? lastName.charAt(0) : '';
  return `${f}${l}`.toUpperCase() || 'SA';
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function AdminUserRow({ user }: AdminUserRowProps) {
  return (
    <TableRow className="border-b border-[#2A2A2A] hover:bg-[#1A1A1A]">
      {/* Name + Avatar */}
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-xs font-medium text-white">
            {getInitials(user.firstName, user.lastName)}
          </div>
          <span className="text-sm text-white">
            {user.firstName} {user.lastName}
          </span>
        </div>
      </TableCell>

      {/* Email */}
      <TableCell className="text-sm text-[#9CA3AF]">{user.email}</TableCell>

      {/* Role */}
      <TableCell>
        <AdminRoleBadge role={user._adminRole} />
      </TableCell>

      {/* 2FA */}
      <TableCell>
        {user.totpEnabled ? (
          <Check className="h-4 w-4 text-[#22C55E]" />
        ) : (
          <X className="h-4 w-4 text-[#EF4444]" />
        )}
      </TableCell>

      {/* Last Login */}
      <TableCell className="text-sm text-[#9CA3AF]">{formatDate(user._lastLogin)}</TableCell>

      {/* Actions */}
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toast.info('User management coming soon')}
          className="h-8 w-8 p-0 text-[#6B7280] hover:text-white hover:bg-[#1A1A1A]"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
