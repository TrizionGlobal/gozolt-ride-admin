'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AdminUserRow } from './admin-user-row';
import type { AdminUser } from '@/services/admin/settings.types';

interface AdminUsersTableProps {
  users: AdminUser[];
  loading: boolean;
}

export function AdminUsersTable({ users, loading }: AdminUsersTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full bg-[#1A1A1A]" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-[#6B7280] text-sm">
        No admin users found
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#2A2A2A] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#2A2A2A] hover:bg-transparent bg-[#0A0A0A]">
            <TableHead className="text-[#9CA3AF] text-xs font-medium">NAME</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">EMAIL</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">ROLE</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">2FA</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">LAST LOGIN</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <AdminUserRow key={user.id} user={user} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
