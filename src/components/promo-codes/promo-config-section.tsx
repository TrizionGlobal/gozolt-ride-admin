'use client';

import { useRewards } from '@/hooks/use-rewards';
import { PointEarningRulesCard } from '@/components/rewards/point-earning-rules-card';
import { TierThresholdsCard } from '@/components/rewards/tier-thresholds-card';
import { Skeleton } from '@/components/ui/skeleton';

export function PromoConfigSection() {
  const { config, loading, saving, updateConfig } = useRewards();

  if (loading || !config) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-56 rounded-lg bg-[#1A1A1A]" />
        <Skeleton className="h-56 rounded-lg bg-[#1A1A1A]" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <PointEarningRulesCard config={config} saving={saving} onSave={updateConfig} />
      <TierThresholdsCard config={config} saving={saving} onSave={updateConfig} />
    </div>
  );
}
