'use client';

import { useRewards } from '@/hooks/use-rewards';
import { GoCoinsRulesHeader } from '@/components/rewards/gocoins-rules-header';
import { MembershipTiersTable } from '@/components/rewards/membership-tiers-table';
import { Skeleton } from '@/components/ui/skeleton';

export default function RewardsPage() {
  const { config, loading, saving, updateConfig } = useRewards();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Rewards Management</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Configure GoCoins loyalty rules, membership tier thresholds, and redemption rates
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#22C55E]/10 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-xs font-medium text-[#22C55E]">System Online</span>
        </div>
      </div>

      {/* 1. GoCoins Platform Rules (Earning, Min Redemption & Base Bonus) */}
      {loading || !config ? (
        <Skeleton className="h-40 w-full rounded-xl bg-[#1A1A1A]" />
      ) : (
        <GoCoinsRulesHeader config={config} saving={saving} onSave={updateConfig} />
      )}

      {/* 2. Membership Tiers & Rules Matrix Table (with inline editing for thresholds & rates) */}
      {loading || !config ? (
        <Skeleton className="h-80 w-full rounded-xl bg-[#1A1A1A]" />
      ) : (
        <MembershipTiersTable config={config} saving={saving} onSave={updateConfig} />
      )}
    </div>
  );
}
