'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { SupplierPendingCard } from './supplier-pending-card';
import type { SupplierListResponse } from '@/services/admin/supplier.types';

interface SupplierPendingListProps {
  data: SupplierListResponse | null;
  loading: boolean;
  onRefetch: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function SupplierPendingList({
  data,
  loading,
  onRefetch: _onRefetch,
  onApprove,
  onReject,
}: SupplierPendingListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full bg-[#1A1A1A]" />
        ))}
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-[#6B7280]">No pending supplier approvals</p>
        <p className="text-xs text-[#4B5563] mt-1">New submissions will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.data.map((supplier) => (
        <SupplierPendingCard
          key={supplier.id}
          supplier={supplier}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </div>
  );
}
