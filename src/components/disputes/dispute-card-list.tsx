'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { DisputeCard } from './dispute-card';
import type { Dispute, DisputeReply, DisputeStatus } from '@/services/admin/dispute.types';

interface DisputeCardListProps {
  disputes: Dispute[];
  loading: boolean;
  onStatusChange: (id: string, status: DisputeStatus) => Promise<boolean>;
  onReply: (id: string, message: string) => Promise<DisputeReply | null>;
}

export function DisputeCardList({
  disputes,
  loading,
  onStatusChange,
  onReply,
}: DisputeCardListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg bg-[#1A1A1A]" />
        ))}
      </div>
    );
  }

  if (disputes.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-[#6B7280] text-sm">
        No disputes found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {disputes.map((dispute) => (
        <DisputeCard
          key={dispute.id}
          dispute={dispute}
          onStatusChange={onStatusChange}
          onReply={onReply}
        />
      ))}
    </div>
  );
}
