'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { VehicleStatus, VehicleType } from '@/types';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { useVehicles, useVehicleKpis } from '@/hooks/use-vehicles';
import { VehicleKpiCards } from '@/components/vehicles/vehicle-kpi-cards';
import { VehicleTabs, type VehicleTab } from '@/components/vehicles/vehicle-tabs';
import { VehicleTable } from '@/components/vehicles/vehicle-table';
import { VehicleSuspendModal } from '@/components/vehicles/vehicle-suspend-modal';
import { VehicleRejectModal } from '@/components/vehicles/vehicle-reject-modal';
import { VehicleDetailDrawer } from '@/components/vehicles/vehicle-detail-drawer';
import { VehicleFiltersPopover } from '@/components/vehicles/vehicle-filters-popover';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { VehicleFilterParams } from '@/services/admin/vehicle.types';
import type { VehicleListItem } from '@/services/admin/vehicle.types';

const TAB_STATUS_MAP: Record<VehicleTab, { status?: VehicleStatus }> = {
  all: {},
  active: { status: VehicleStatus.ACTIVE },
  suspended: { status: VehicleStatus.SUSPENDED },
  inactive: { status: VehicleStatus.DECOMMISSIONED },
};

const VALID_TABS: VehicleTab[] = ['all', 'active', 'suspended', 'inactive'];

export default function VehicleManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab state from URL
  const tabParam = (searchParams.get('tab') as VehicleTab) || 'all';
  const activeTab = (VALID_TABS.includes(tabParam) ? tabParam : 'all') as VehicleTab;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Detail drawer state
  const [detailDrawer, setDetailDrawer] = useState<{ open: boolean; vehicleId: string | null }>({
    open: false,
    vehicleId: null,
  });

  // Suspend modal state
  const [suspendModal, setSuspendModal] = useState<{ open: boolean; vehicle: VehicleListItem | null }>({
    open: false,
    vehicle: null,
  });

  // Reject modal state
  const [rejectModal, setRejectModal] = useState<{ open: boolean; vehicle: VehicleListItem | null }>({
    open: false,
    vehicle: null,
  });

  // Build filter params
  const tabConfig = TAB_STATUS_MAP[activeTab];
  const params: VehicleFilterParams = useMemo(
    () => ({
      ...tabConfig,
      search: search || undefined,
      supplierId: supplierId || undefined,
      type: (vehicleType as VehicleType) || undefined,
      page,
      limit: 20,
    }),
    [activeTab, search, supplierId, vehicleType, page, tabConfig],
  );

  const { data, loading, refetch } = useVehicles(params);
  const { kpis, refresh: refreshKpis } = useVehicleKpis();

  const handleTabChange = useCallback(
    (tab: VehicleTab) => {
      setPage(1);
      const newParams = new URLSearchParams();
      if (tab !== 'all') newParams.set('tab', tab);
      router.push(`/vehicle-management${newParams.toString() ? `?${newParams.toString()}` : ''}`);
    },
    [router],
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearch(sanitizeSearchQuery(value));
    setPage(1);
  }, []);

  const handleSuspend = useCallback(
    (id: string) => {
      const vehicle = data?.data.find((v) => v.id === id) ?? null;
      if (vehicle) setSuspendModal({ open: true, vehicle });
    },
    [data],
  );

  const handleReject = useCallback(
    (id: string) => {
      const vehicle = data?.data.find((v) => v.id === id) ?? null;
      if (vehicle) setRejectModal({ open: true, vehicle });
    },
    [data],
  );

  const handleViewDetail = useCallback((id: string) => {
    setDetailDrawer({ open: true, vehicleId: id });
  }, []);

  const handleMutationSuccess = useCallback(() => {
    refetch();
    refreshKpis();
  }, [refetch, refreshKpis]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Vehicle Management</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Fleet overview and vehicle inspections
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-[#22C55E]/10 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-xs font-medium text-[#22C55E]">System Online</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <VehicleKpiCards kpis={kpis} />

      {/* Tabs + Search + Filters */}
      <div className="relative">
        <VehicleTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          search={search}
          onSearchChange={handleSearchChange}
          onFiltersClick={() => setFiltersOpen(!filtersOpen)}
        />
        <VehicleFiltersPopover
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          supplierId={supplierId}
          onSupplierIdChange={(v) => {
            setSupplierId(v);
            setPage(1);
          }}
          vehicleType={vehicleType}
          onVehicleTypeChange={(v) => {
            setVehicleType(v);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <VehicleTable
        data={data}
        loading={loading}
        page={page}
        onPageChange={setPage}
        onSuspend={handleSuspend}
        onReject={handleReject}
        onRefetch={handleMutationSuccess}
        onViewDetail={handleViewDetail}
      />

      {/* Detail Drawer */}
      <VehicleDetailDrawer
        open={detailDrawer.open}
        onOpenChange={(open) => setDetailDrawer((prev) => ({ ...prev, open }))}
        vehicleId={detailDrawer.vehicleId}
      />

      {/* Suspend Modal */}
      {suspendModal.vehicle && (
        <VehicleSuspendModal
          open={suspendModal.open}
          onOpenChange={(open) => setSuspendModal((prev) => ({ ...prev, open }))}
          vehicleId={suspendModal.vehicle.id}
          vehicleName={`${suspendModal.vehicle.make} ${suspendModal.vehicle.model}`}
          plateNumber={suspendModal.vehicle.plateNumber}
          supplierName={suspendModal.vehicle.supplier.companyName}
          driverName={
            suspendModal.vehicle.assignment
              ? `${suspendModal.vehicle.assignment.driver.firstName} ${suspendModal.vehicle.assignment.driver.lastName}`
              : null
          }
          onSuccess={handleMutationSuccess}
        />
      )}

      {/* Reject Modal */}
      {rejectModal.vehicle && (
        <VehicleRejectModal
          open={rejectModal.open}
          onOpenChange={(open) => setRejectModal((prev) => ({ ...prev, open }))}
          vehicleId={rejectModal.vehicle.id}
          vehicleName={`${rejectModal.vehicle.make} ${rejectModal.vehicle.model}`}
          plateNumber={rejectModal.vehicle.plateNumber}
          onSuccess={handleMutationSuccess}
        />
      )}
    </div>
  );
}
