'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
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
  rejected: SupplierStatus.REJECTED,
};

export default function SupplierManagementPage() {
  // Tab state — managed locally, no URL changes (avoids Next.js RSC refetch on tab switch)
  const [activeTab, setActiveTab] = useState<SupplierTab>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

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
      limit,
    }),
    [activeTab, page, limit],
  );


  const { data, loading, refetch } = useSuppliers(params);

  // Derive the pending count from data when on the pending tab.
  // Cache the last known count so the badge persists on other tabs.
  const cachedPendingCount = useRef(0);
  if (activeTab === 'pending' && data?.meta.total !== undefined) {
    cachedPendingCount.current = data.meta.total;
  }
  const pendingCount = cachedPendingCount.current;

  const refetchWithCount = refetch;

  const handleTabChange = useCallback((tab: SupplierTab) => {
    setActiveTab(tab);
    setPage(1);
    setLimit(20);
  }, []);

  // Find supplier by id from current data
  const findSupplier = useCallback(
    (id: string): SupplierListItem | null => {
      return data?.data.find((s) => s.id === id) ?? null;
    },
    [data],
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
    refetchWithCount();
  }, [refetchWithCount]);

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
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(l) => { setLimit(l); setPage(1); }}
            onRefetch={refetchWithCount}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ) : (
          <SupplierTable
            data={data}
            loading={loading}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(l) => { setLimit(l); setPage(1); }}
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
