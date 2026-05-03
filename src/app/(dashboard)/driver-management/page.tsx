'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DriverStatus } from '@/types';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { useDrivers, useDriverKpis } from '@/hooks/use-drivers';
import { DriverKpiCards } from '@/components/drivers/driver-kpi-cards';
import { DriverTabs, type DriverTab } from '@/components/drivers/driver-tabs';
import { DriverTable } from '@/components/drivers/driver-table';
import { DriverSuspendModal } from '@/components/drivers/driver-suspend-modal';
import { DriverFiltersPopover } from '@/components/drivers/driver-filters-popover';
import type { DriverFilterParams } from '@/services/admin/driver.types';
import type { DriverListItem } from '@/services/admin/driver.types';

const TAB_STATUS_MAP: Record<DriverTab, { status?: DriverStatus; onlineOnly?: boolean }> = {
  all: {},
  online: { onlineOnly: true },
  pending: { status: DriverStatus.PENDING_APPROVAL },
  suspended: { status: DriverStatus.SUSPENDED },
  inactive: { status: DriverStatus.INACTIVE },
};

export default function DriverManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab state from URL
  const tabParam = (searchParams.get('tab') as DriverTab) || 'all';
  const activeTab = (['all', 'online', 'pending', 'suspended', 'inactive'].includes(tabParam)
    ? tabParam
    : 'all') as DriverTab;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Modal state
  const [suspendModal, setSuspendModal] = useState<{ open: boolean; driver: DriverListItem | null }>({
    open: false,
    driver: null,
  });

  // Build filter params
  const tabConfig = TAB_STATUS_MAP[activeTab];
  const params: DriverFilterParams = useMemo(
    () => ({
      ...tabConfig,
      search: search || undefined,
      supplierId: supplierId || undefined,
      page,
      limit: 20,
    }),
    [activeTab, search, supplierId, page, tabConfig],
  );

  // Fetch pending count separately for the tab badge
  const pendingParams: DriverFilterParams = useMemo(
    () => ({ status: DriverStatus.PENDING_APPROVAL, page: 1, limit: 100 }),
    [],
  );

  const { data, loading, refetch } = useDrivers(params);
  const { data: pendingData } = useDrivers(pendingParams);
  const { kpis, refresh: refreshKpis } = useDriverKpis();
  const pendingCount = pendingData?.meta.total ?? 0;

  const handleTabChange = useCallback(
    (tab: DriverTab) => {
      setPage(1);
      const newParams = new URLSearchParams();
      if (tab !== 'all') newParams.set('tab', tab);
      router.push(`/driver-management${newParams.toString() ? `?${newParams.toString()}` : ''}`);
    },
    [router],
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearch(sanitizeSearchQuery(value));
    setPage(1);
  }, []);

  const handleSuspend = useCallback(
    (id: string) => {
      const driver = data?.data.find((d) => d.id === id) ?? null;
      if (driver) setSuspendModal({ open: true, driver });
    },
    [data],
  );

  const handleMutationSuccess = useCallback(() => {
    refetch();
    refreshKpis();
  }, [refetch, refreshKpis]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Driver Management</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Monitor, approve &amp; manage all platform drivers
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#22C55E]/10 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-xs font-medium text-[#22C55E]">System Online</span>
        </div>
      </div>

      {/* KPI Cards */}
      <DriverKpiCards kpis={kpis} />

      {/* Tabs + Search + Filters */}
      <div className="relative">
        <DriverTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          pendingCount={pendingCount}
          search={search}
          onSearchChange={handleSearchChange}
          onFiltersClick={() => setFiltersOpen(!filtersOpen)}
        />
        <DriverFiltersPopover
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          supplierId={supplierId}
          onSupplierIdChange={(v) => {
            setSupplierId(v);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <DriverTable
        data={data}
        loading={loading}
        page={page}
        onPageChange={setPage}
        onSuspend={handleSuspend}
        onRefetch={handleMutationSuccess}
      />

      {/* Suspend Modal */}
      {suspendModal.driver && (
        <DriverSuspendModal
          open={suspendModal.open}
          onOpenChange={(open) => setSuspendModal((prev) => ({ ...prev, open }))}
          driverId={suspendModal.driver.id}
          driverName={`${suspendModal.driver.firstName} ${suspendModal.driver.lastName}`}
          onSuccess={handleMutationSuccess}
        />
      )}
    </div>
  );
}
