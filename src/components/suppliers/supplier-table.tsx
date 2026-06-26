'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { ServerSideTable, type ColumnDef } from '@/components/ui/server-side-table';
import { SupplierStatusBadge } from './supplier-status-badge';
import { SupplierActionsMenu } from './supplier-actions-menu';
import { SupplierDetailDrawer } from './supplier-detail-drawer';
import { TIER_DISPLAY, TIER_COLORS } from '@/services/admin/supplier.types';
import { supplierService } from '@/services/admin/supplier.service';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { SupplierListResponse, SupplierListItem } from '@/services/admin/supplier.types';

interface SupplierTableProps {
  data: SupplierListResponse | null;
  loading: boolean;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onRefetch: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSuspend: (id: string) => void;
  onChangeCommission?: (id: string) => void;
}

export function SupplierTable({
  data,
  loading,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onRefetch,
  onApprove,
  onReject,
  onSuspend,
  onChangeCommission,
}: SupplierTableProps) {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [updatingBankDetailsId, setUpdatingBankDetailsId] = useState<string | null>(null);

  const handleViewDetail = (id: string) => {
    setSelectedSupplierId(id);
    setDrawerOpen(true);
  };

  const columns: ColumnDef<SupplierListItem>[] = [
    {
      key: 'company',
      title: 'Company',
      render: (row) => (
        <span className="text-sm font-medium text-white">{row.companyName}</span>
      ),
    },
    {
      key: 'reg',
      title: 'VAT Number',
      render: (row) => (
        <span className="text-sm text-[#9CA3AF] font-mono">{row.vatNumber || '—'}</span>
      ),
    },
    {
      key: 'tier',
      title: 'Subscription Tier',
      render: (row) => {
        const tier = row.subscription?.tier;
        return tier ? (
          <span className={cn('inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium', TIER_COLORS[tier])}>
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
      key: 'status',
      title: 'Status',
      render: (row) => <SupplierStatusBadge status={row.status} />,
    },
    {
      key: 'vehicles',
      title: 'Vehicles',
      render: (row) => <span className="text-sm text-[#9CA3AF]">{row._count.vehicles}</span>,
    },
    {
      key: 'drivers',
      title: 'Drivers',
      render: (row) => <span className="text-sm text-[#9CA3AF]">{row._count.drivers}</span>,
    },
    {
      key: 'revenue',
      title: 'Revenue',
      render: (row) => (
        <span className="text-sm text-white">€{(row.totalRevenue ?? 0).toLocaleString()}</span>
      ),
    },
    {
      key: 'editBankDetails',
      title: 'Edit Bank Details',
      render: (row) => {
        const isUpdating = updatingBankDetailsId === row.id;
        const handleToggleBankDetails = async (checked: boolean) => {
          setUpdatingBankDetailsId(row.id);
          try {
            await supplierService.toggleBankDetailsPermission(row.id, checked);
            toast.success(checked ? 'Bank edit enabled' : 'Bank edit disabled');
            onRefetch();
          } catch {
            toast.error('Failed to update permission');
          } finally {
            setUpdatingBankDetailsId(null);
          }
        };
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={row.editBankDetails}
              onCheckedChange={handleToggleBankDetails}
              disabled={isUpdating}
              aria-label="Toggle bank details edit"
            />
            {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-[#9CA3AF]" />}
          </div>
        );
      },
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (row) => {
        const handleActivate = async () => {
          try {
            await supplierService.activateSupplier(row.id);
            toast.success(`${row.companyName} activated successfully`);
            onRefetch();
          } catch {
            toast.error('Failed to activate supplier');
          }
        };
        return (
          <SupplierActionsMenu
            status={row.status}
            onView={() => handleViewDetail(row.id)}
            onApprove={() => onApprove(row.id)}
            onReject={() => onReject(row.id)}
            onSuspend={() => onSuspend(row.id)}
            onActivate={handleActivate}
            onChangeCommission={onChangeCommission ? () => onChangeCommission(row.id) : undefined}
          />
        );
      },
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
          emptyText="No suppliers found. Try adjusting your filters."
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
