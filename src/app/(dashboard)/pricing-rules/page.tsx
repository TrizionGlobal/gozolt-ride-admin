'use client';

import { usePricing } from '@/hooks/use-pricing';
import { FareRulesCard } from '@/components/pricing/fare-rules-card';
import { CancellationPolicyCard } from '@/components/pricing/cancellation-policy-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PricingRulesPage() {
  const { rule, loading, saving, updateRule } = usePricing();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pricing Rules Management</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Manage base fares, rates, and cancellation policies
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#22C55E]/10 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-xs font-medium text-[#22C55E]">System Online</span>
        </div>
      </div>

      {/* Cards */}
      {loading || !rule ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-lg bg-[#1A1A1A]" />
          <Skeleton className="h-48 rounded-lg bg-[#1A1A1A]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <FareRulesCard rule={rule} saving={saving} onSave={updateRule} />
          <CancellationPolicyCard rule={rule} saving={saving} onSave={updateRule} />
        </div>
      )}
    </div>
  );
}
