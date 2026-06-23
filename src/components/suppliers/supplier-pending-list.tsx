'use client';

import { useState } from 'react';
import { Building2, Mail, Phone } from 'lucide-react';
import { ServerSideTable, type ColumnDef } from '@/components/ui/server-side-table';
import { SupplierDetailDrawer } from './supplier-detail-drawer';
import { TIER_DISPLAY } from '@/services/admin/supplier.types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { SupplierListResponse, SupplierListItem } from '@/services/admin/supplier.types';

interface SupplierPendingListProps {
  data: SupplierListResponse | null;
  loading: boolean;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onRefetch: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function SupplierPendingList({
  data,
  loading,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onApprove,
  onReject,
}: SupplierPendingListProps) {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const columns: ColumnDef<SupplierListItem>[] = [
    {
      key: 'company',
      title: 'Company',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-yellow-900/30 border border-yellow-800/50">
            <Building2 className="h-4 w-4 text-[#FACC15]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{row.companyName}</p>
            <p className="text-xs text-[#6B7280] font-mono">{row.vatNumber || '—'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      title: 'Contact',
      render: (row) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
            <Mail className="h-3 w-3 shrink-0" />
            {row.email}
          </div>
          {row.contactPhone && (
            <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
              <Phone className="h-3 w-3 shrink-0" />
              {row.contactPhone}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'tier',
      title: 'Subscription Tier',
      render: (row) => {
        const tier = row.subscription?.tier;
        return tier ? (
          <span className="inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {TIER_DISPLAY[tier]}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium bg-[#2A2A2A] text-[#9CA3AF] border border-[#3A3A3A]">
            Not Subscribed
          </span>
        );
      },
    },
    {
      key: 'submitted',
      title: 'Submitted',
      render: (row) => (
        <span className="text-xs text-[#6B7280]">
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric',
              })
            : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => { setSelectedSupplierId(row.id); setDrawerOpen(true); }}
            variant="ghost"
            className="h-7 px-2 text-xs text-[#9CA3AF] hover:text-white hover:bg-[#2A2A2A]"
          >
            View
          </Button>
          <Button
            size="sm"
            onClick={() => onApprove(row.id)}
            className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700 text-white"
          >
            Approve
          </Button>
          <Button
            size="sm"
            onClick={() => onReject(row.id)}
            className="h-7 px-3 text-xs bg-red-600 hover:bg-red-700 text-white"
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] overflow-hidden">
        <ServerSideTable<SupplierListItem>
          columns={columns}
          data={data?.data ?? []}
          isLoading={loading}
          page={page}
          limit={limit}
          total={data?.meta.total ?? 0}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          rowKey="id"
          emptyText="No pending supplier approvals. New submissions will appear here."
        />
      </div>

      <SupplierDetailDrawer
        supplierId={selectedSupplierId}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  );
}
