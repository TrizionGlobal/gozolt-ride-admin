'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { RideStatus } from '@/types';
import { sanitizeSearchQuery } from '@/lib/sanitize';
import { useRides } from '@/hooks/use-rides';
import { RideTabs, type RideTab } from '@/components/rides/ride-tabs';
import { RideLiveView } from '@/components/rides/ride-live-view';
import { RideTable } from '@/components/rides/ride-table';
import { RideRefundModal } from '@/components/rides/ride-refund-modal';
import { RideDisputeModal } from '@/components/rides/ride-dispute-modal';
import type { RideFilterParams, RideListItem } from '@/services/admin/ride.types';
import { mockActiveRides, mockAllRides } from '@/services/admin/ride.mock';

const VALID_TABS: RideTab[] = ['active', 'all', 'cancelled', 'disputed'];

export default function RideManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab state from URL
  const tabParam = (searchParams.get('tab') as RideTab) || 'active';
  const activeTab = (VALID_TABS.includes(tabParam) ? tabParam : 'active') as RideTab;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // Refund modal state
  const [refundModal, setRefundModal] = useState<{
    open: boolean;
    rideId: string;
    rideDisplayId: string;
    fare: number;
  }>({ open: false, rideId: '', rideDisplayId: '', fare: 0 });

  // Dispute modal state
  const [disputeModal, setDisputeModal] = useState<{
    open: boolean;
    rideDisplayId: string;
    passengerName: string;
    driverName: string;
  }>({ open: false, rideDisplayId: '', passengerName: '', driverName: '' });

  // Build filter params for table tabs
  const params: RideFilterParams = useMemo(() => {
    if (activeTab === 'active') return { page: 1, limit: 100 }; // Not used for live view
    const base: RideFilterParams = {
      search: search || undefined,
      page,
      limit: 20,
    };
    if (activeTab === 'cancelled') base.status = RideStatus.CANCELLED;
    if (activeTab === 'disputed') base.disputed = true;
    return base;
  }, [activeTab, search, page]);

  const { data, loading, refetch } = useRides(params);

  const handleTabChange = useCallback(
    (tab: RideTab) => {
      setPage(1);
      const newParams = new URLSearchParams();
      if (tab !== 'active') newParams.set('tab', tab);
      router.push(`/ride-management${newParams.toString() ? `?${newParams.toString()}` : ''}`);
    },
    [router],
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearch(sanitizeSearchQuery(value));
    setPage(1);
  }, []);

  // Find ride data for modals
  const findRide = useCallback(
    (id: string): RideListItem | undefined => {
      return (
        mockActiveRides.find((r) => r.id === id) ??
        mockAllRides.find((r) => r.id === id) ??
        data?.data.find((r) => r.id === id)
      );
    },
    [data],
  );

  const handleIssueRefund = useCallback(
    (rideId: string) => {
      const ride = findRide(rideId);
      if (!ride) return;
      setRefundModal({
        open: true,
        rideId: ride.id,
        rideDisplayId: ride._displayId,
        fare: ride.actualFare ?? ride.estimatedFare,
      });
    },
    [findRide],
  );

  const handleFlagDispute = useCallback(
    (rideId: string) => {
      const ride = findRide(rideId);
      if (!ride) return;
      const passengerName = [ride.user.firstName, ride.user.lastName]
        .filter(Boolean)
        .join(' ') || 'Unknown';
      const driverName = ride.driver
        ? `${ride.driver.firstName} ${ride.driver.lastName}`
        : '—';
      setDisputeModal({
        open: true,
        rideDisplayId: ride._displayId,
        passengerName,
        driverName,
      });
    },
    [findRide],
  );

  const handleMutationSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Ride Management</h1>
        <p className="text-sm text-[#6B7280] mt-0.5">
          Monitor &amp; manage all rides in real-time
        </p>
      </div>

      {/* Tabs + Search */}
      <RideTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        search={search}
        onSearchChange={handleSearchChange}
      />

      {/* Content — different per tab */}
      {activeTab === 'active' && (
        <RideLiveView
          onIssueRefund={handleIssueRefund}
          onFlagDispute={handleFlagDispute}
        />
      )}

      {activeTab === 'all' && (
        <RideTable
          data={data}
          loading={loading}
          page={page}
          onPageChange={setPage}
        />
      )}

      {activeTab === 'cancelled' && (
        <RideTable
          data={data}
          loading={loading}
          page={page}
          onPageChange={setPage}
        />
      )}

      {activeTab === 'disputed' && (
        <RideTable
          data={data}
          loading={loading}
          page={page}
          onPageChange={setPage}
        />
      )}

      {/* Refund Modal */}
      {refundModal.rideId && (
        <RideRefundModal
          open={refundModal.open}
          onOpenChange={(open) => setRefundModal((prev) => ({ ...prev, open }))}
          rideId={refundModal.rideId}
          rideDisplayId={refundModal.rideDisplayId}
          fare={refundModal.fare}
          onSuccess={handleMutationSuccess}
        />
      )}

      {/* Dispute Modal */}
      {disputeModal.rideDisplayId && (
        <RideDisputeModal
          open={disputeModal.open}
          onOpenChange={(open) => setDisputeModal((prev) => ({ ...prev, open }))}
          rideDisplayId={disputeModal.rideDisplayId}
          passengerName={disputeModal.passengerName}
          driverName={disputeModal.driverName}
          onSuccess={handleMutationSuccess}
        />
      )}
    </div>
  );
}
