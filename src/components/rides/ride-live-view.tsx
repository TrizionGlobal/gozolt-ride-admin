'use client';

import { useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { RideLiveMap } from './ride-live-map';
import { RideActiveList } from './ride-active-list';
import { RideDetailPanel } from './ride-detail-panel';
import { useActiveRides, useRideDetail } from '@/hooks/use-rides';

interface RideLiveViewProps {
  onIssueRefund: (rideId: string) => void;
  onFlagDispute: (rideId: string) => void;
}

export function RideLiveView({ onIssueRefund, onFlagDispute }: RideLiveViewProps) {
  const { rides, loading } = useActiveRides();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { detail, loading: detailLoading } = useRideDetail(selectedId);

  const handleSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
          <Skeleton className="h-80 rounded-lg bg-[#1A1A1A]" />
          <Skeleton className="h-80 rounded-lg bg-[#1A1A1A]" />
        </div>
        <Skeleton className="h-48 rounded-lg bg-[#1A1A1A]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top: Map + Active Rides sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        <RideLiveMap rides={rides} />

        <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-3">
          <p className="text-sm font-medium text-white mb-3">Active Rides</p>
          <RideActiveList
            rides={rides}
            loading={false}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>
      </div>

      {/* Bottom: Ride Detail */}
      {selectedId && (
        <RideDetailPanel
          detail={detail}
          loading={detailLoading}
          onIssueRefund={() => onIssueRefund(selectedId)}
          onFlagDispute={() => onFlagDispute(selectedId)}
        />
      )}
    </div>
  );
}
