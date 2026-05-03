'use client';

import { useRewards } from '@/hooks/use-rewards';
import { PointEarningRulesCard } from '@/components/rewards/point-earning-rules-card';
import { TierThresholdsCard } from '@/components/rewards/tier-thresholds-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function RewardsPage() {
  const { config, loading, saving, updateConfig } = useRewards();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Rewards</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Configure loyalty points and membership tiers
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#22C55E]/10 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-xs font-medium text-[#22C55E]">System Online</span>
        </div>
      </div>

      {/* Cards */}
      {loading || !config ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-56 rounded-lg bg-[#1A1A1A]" />
          <Skeleton className="h-56 rounded-lg bg-[#1A1A1A]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <PointEarningRulesCard config={config} saving={saving} onSave={updateConfig} />
          <TierThresholdsCard config={config} saving={saving} onSave={updateConfig} />
        </div>
      )}
    </div>
  );
}
