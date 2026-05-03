'use client';

import { Navigation } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { RideStatusBadge } from './ride-status-badge';
import { RideTimeline } from './ride-timeline';
import { RideInfoPanel } from './ride-info-panel';
import { RideActionButtons } from './ride-action-buttons';
import type { RideDetail } from '@/services/admin/ride.types';

interface RideDetailPanelProps {
  detail: RideDetail | null;
  loading: boolean;
  onIssueRefund: () => void;
  onFlagDispute: () => void;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }) + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function RideDetailPanel({
  detail,
  loading,
  onIssueRefund,
  onFlagDispute,
}: RideDetailPanelProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4 space-y-4">
        <Skeleton className="h-6 w-48 bg-[#2A2A2A]" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-40 bg-[#2A2A2A] rounded-lg" />
          <Skeleton className="h-40 bg-[#2A2A2A] rounded-lg" />
          <Skeleton className="h-40 bg-[#2A2A2A] rounded-lg" />
        </div>
      </div>
    );
  }

  if (!detail) return null;

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">
            Ride {detail._displayId}
          </h3>
          <p className="text-xs text-[#6B7280]">{formatDateTime(detail.requestedAt)}</p>
        </div>
        <RideStatusBadge status={detail.status} isDisputed={detail._isDisputed} />
      </div>

      {/* Three-column layout: Route | Timeline | Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Route placeholder */}
        <div>
          <p className="text-sm font-medium text-white mb-3">Route</p>
          <div className="aspect-square rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] flex flex-col items-center justify-center gap-2">
            <Navigation className="h-10 w-10 text-[#2A2A2A]" />
            <p className="text-xs text-[#4B5563]">Route polyline</p>
          </div>
        </div>

        {/* Timeline */}
        <RideTimeline detail={detail} />

        {/* Info panel */}
        <RideInfoPanel detail={detail} />
      </div>

      {/* Destination Changes */}
      {detail.destinationChanges?.length > 0 && (
        <div>
          <p className="text-sm font-medium text-white mb-2">Destination Changes</p>
          <div className="space-y-2">
            {detail.destinationChanges.map((dc) => (
              <div key={dc.id} className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-3 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#9CA3AF]">{new Date(dc.createdAt).toLocaleString('en-GB')}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    dc.status === 'ACCEPTED' ? 'bg-green-500/20 text-green-400' :
                    dc.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'}`}>{dc.status}</span>
                </div>
                <p className="text-[#9CA3AF]"><span className="text-white">From:</span> {dc.oldDropoffAddress} (€{dc.oldEstimatedFare.toFixed(2)})</p>
                <p className="text-[#9CA3AF]"><span className="text-white">To:</span> {dc.newDropoffAddress} (€{dc.newEstimatedFare.toFixed(2)})</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <RideActionButtons
        onIssueRefund={onIssueRefund}
        onFlagDispute={onFlagDispute}
      />
    </div>
  );
}
