'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { exportToCSV } from '@/lib/export-csv';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserTableRow } from './user-table-row';
import { UserDetailDrawer } from './user-detail-drawer';
import type { UserListResponse } from '@/services/admin/user.types';

interface UserTableProps {
  data: UserListResponse | null;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onBan: (id: string) => void;
  onForceLogout: (id: string) => void;
  onRefetch: () => void;
}

export function UserTable({
  data,
  loading,
  page,
  onPageChange,
  onBan,
  onForceLogout,
  onRefetch,
}: UserTableProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleViewDetail = (id: string) => {
    setSelectedUserId(id);
    setDrawerOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full bg-[#1A1A1A]" />
        ))}
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-[#6B7280]">No users found</p>
        <p className="text-xs text-[#4B5563] mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  const { meta } = data;
  const start = (meta.page - 1) * meta.limit + 1;
  const end = Math.min(meta.page * meta.limit, meta.total);

  const handleExport = () => {
    const rows = data.data.map((u) => ({
      name: [u.firstName, u.lastName].filter(Boolean).join(' '),
      phone: u.phone ?? '',
      rides: u._count?.rides ?? 0,
      rating: u.avgRating ?? 0,
      status: u.status,
      date: u.createdAt,
    }));
    exportToCSV(rows, [
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'rides', label: 'Rides' },
      { key: 'rating', label: 'Rating' },
      { key: 'status', label: 'Status' },
      { key: 'date', label: 'Date' },
    ], 'users');
  };

  return (
    <div>
      <div className="flex items-center justify-end px-4 py-2 border-b border-[#2A2A2A]">
        <button
          onClick={handleExport}
          className="border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-1.5 rounded-lg text-xs text-[#9CA3AF] hover:bg-[#1A1A1A] hover:text-white flex items-center gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#2A2A2A] hover:bg-transparent">
            <TableHead className="text-[#9CA3AF] text-xs font-medium">ID</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">User</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Status</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Rating</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Rides</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Spent</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Payments</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Last Ride</TableHead>
            <TableHead className="text-[#9CA3AF] text-xs font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onBan={onBan}
              onForceLogout={onForceLogout}
              onRefetch={onRefetch}
              onViewDetail={handleViewDetail}
            />
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#2A2A2A] px-4 py-3 mt-2">
          <p className="text-xs text-[#6B7280]">
            Showing {start}-{end} of {meta.total} users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="h-8 text-xs text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] disabled:opacity-40"
            >
              <ChevronLeft className="mr-1 h-3 w-3" />
              Previous
            </Button>
            <span className="text-xs text-[#6B7280]">
              Page {meta.page} of {meta.totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => onPageChange(page + 1)}
              className="h-8 text-xs text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] disabled:opacity-40"
            >
              Next
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      <UserDetailDrawer
        userId={selectedUserId}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
