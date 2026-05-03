'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SupplierStatus } from '@/types';
import { useSuppliers } from '@/hooks/use-suppliers';
import { SupplierTabs, type SupplierTab } from '@/components/suppliers/supplier-tabs';
import { SupplierTable } from '@/components/suppliers/supplier-table';
import { SupplierPendingList } from '@/components/suppliers/supplier-pending-list';
import { SupplierApprovalChecklist } from '@/components/suppliers/supplier-approval-checklist';
import { SupplierRejectModal } from '@/components/suppliers/supplier-reject-modal';
import { SupplierSuspendModal } from '@/components/suppliers/supplier-suspend-modal';
import type { SupplierFilterParams, SupplierListItem } from '@/services/admin/supplier.types';

const TAB_STATUS_MAP: Record<SupplierTab, SupplierStatus | undefined> = {
  all: undefined,
  pending: SupplierStatus.PENDING_VERIFICATION,
  approved: SupplierStatus.ACTIVE,
  suspended: SupplierStatus.SUSPENDED,
};

export default function SupplierManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab state from URL
  const tabParam = (searchParams.get('tab') as SupplierTab) || 'all';
  const activeTab = (['all', 'pending', 'approved', 'suspended'].includes(tabParam)
    ? tabParam
    : 'all') as SupplierTab;
  const [page, setPage] = useState(1);

  // Modal state
  const [approveModal, setApproveModal] = useState<{ open: boolean; supplier: SupplierListItem | null }>({
    open: false,
    supplier: null,
  });
  const [rejectModal, setRejectModal] = useState<{ open: boolean; supplier: SupplierListItem | null }>({
    open: false,
    supplier: null,
  });
  const [suspendModal, setSuspendModal] = useState<{ open: boolean; supplier: SupplierListItem | null }>({
    open: false,
    supplier: null,
  });

  // Build filter params
  const params: SupplierFilterParams = useMemo(
    () => ({
      status: TAB_STATUS_MAP[activeTab],
      page,
      limit: 20,
    }),
    [activeTab, page],
  );

  // Also fetch pending count separately
  const pendingParams: SupplierFilterParams = useMemo(
    () => ({ status: SupplierStatus.PENDING_VERIFICATION, page: 1, limit: 100 }),
    [],
  );

  const { data, loading, refetch } = useSuppliers(params);
  const { data: pendingData } = useSuppliers(pendingParams);
  const pendingCount = pendingData?.meta.total ?? 0;

  const handleTabChange = useCallback(
    (tab: SupplierTab) => {
      setPage(1);
      const newParams = new URLSearchParams();
      if (tab !== 'all') newParams.set('tab', tab);
      router.push(`/supplier-management${newParams.toString() ? `?${newParams.toString()}` : ''}`);
    },
    [router],
  );

  // Find supplier by id from current data
  const findSupplier = useCallback(
    (id: string): SupplierListItem | null => {
      return data?.data.find((s) => s.id === id) ?? pendingData?.data.find((s) => s.id === id) ?? null;
    },
    [data, pendingData],
  );

  const handleApprove = useCallback(
    (id: string) => {
      const supplier = findSupplier(id);
      if (supplier) setApproveModal({ open: true, supplier });
    },
    [findSupplier],
  );

  const handleReject = useCallback(
    (id: string) => {
      const supplier = findSupplier(id);
      if (supplier) setRejectModal({ open: true, supplier });
    },
    [findSupplier],
  );

  const handleSuspend = useCallback(
    (id: string) => {
      const supplier = findSupplier(id);
      if (supplier) setSuspendModal({ open: true, supplier });
    },
    [findSupplier],
  );

  const handleMutationSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Supplier Management</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Approval workflow &amp; supplier oversight
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#22C55E]/10 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-xs font-medium text-[#22C55E]">System Online</span>
        </div>
      </div>

      {/* Tabs */}
      <SupplierTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        pendingCount={pendingCount}
      />

      {/* Content */}
      <div>
        {activeTab === 'pending' ? (
          <SupplierPendingList
            data={data}
            loading={loading}
            onRefetch={refetch}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ) : (
          <SupplierTable
            data={data}
            loading={loading}
            page={page}
            onPageChange={setPage}
            onRefetch={refetch}
            onApprove={handleApprove}
            onReject={handleReject}
            onSuspend={handleSuspend}
          />
        )}
      </div>

      {/* Modals */}
      {approveModal.supplier && (
        <SupplierApprovalChecklist
          open={approveModal.open}
          onOpenChange={(open) => setApproveModal((prev) => ({ ...prev, open }))}
          supplierId={approveModal.supplier.id}
          supplierName={approveModal.supplier.companyName}
          onSuccess={handleMutationSuccess}
        />
      )}

      {rejectModal.supplier && (
        <SupplierRejectModal
          open={rejectModal.open}
          onOpenChange={(open) => setRejectModal((prev) => ({ ...prev, open }))}
          supplierId={rejectModal.supplier.id}
          supplierName={rejectModal.supplier.companyName}
          onSuccess={handleMutationSuccess}
        />
      )}

      {suspendModal.supplier && (
        <SupplierSuspendModal
          open={suspendModal.open}
          onOpenChange={(open) => setSuspendModal((prev) => ({ ...prev, open }))}
          supplierId={suspendModal.supplier.id}
          supplierName={suspendModal.supplier.companyName}
          onSuccess={handleMutationSuccess}
        />
      )}
    </div>
  );
}
