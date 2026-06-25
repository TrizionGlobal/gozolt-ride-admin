'use client';

import { usePricing } from '@/hooks/use-pricing';
import { FareRulesCard } from '@/components/pricing/fare-rules-card';
import { CancellationPolicyCard } from '@/components/pricing/cancellation-policy-card';
import { Skeleton } from '@/components/ui/skeleton';
import { VehicleType } from '@/types';
import { PREFERRED_VEHICLE_DISPLAY } from '@/services/admin/user.types';

export default function PricingRulesPage() {
  const { rules, selectedType, setSelectedType, loading, error, saving, updateRule } = usePricing();
  
  const currentRule = rules.find((r) => r.vehicleType === selectedType);

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
          <p className="font-medium">Error Loading Pricing Rules</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

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

      {/* Vehicle Type Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.values(VehicleType).map((type) => {
          const display = PREFERRED_VEHICLE_DISPLAY[type];
          const isActive = type === selectedType;
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive 
                  ? 'bg-[#FACC15] text-black' 
                  : 'bg-[#141414] border border-[#2A2A2A] text-[#9CA3AF] hover:text-white hover:border-[#FACC15]/50'
              }`}
            >
              {display ? display.name : type}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-lg bg-[#1A1A1A]" />
          <Skeleton className="h-48 rounded-lg bg-[#1A1A1A]" />
        </div>
      ) : !currentRule ? (
        <div className="flex flex-col items-center justify-center h-96 border border-dashed border-[#2A2A2A] rounded-lg">
          <h3 className="text-lg font-medium text-white">No Pricing Rules Found</h3>
          <p className="text-sm text-[#6B7280] mt-1">
            Please make sure the database is seeded with initial pricing rules for STANDARD vehicle types.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <FareRulesCard rule={currentRule} saving={saving} onSave={updateRule} />
          <CancellationPolicyCard rule={currentRule} saving={saving} onSave={updateRule} />
        </div>
      )}
    </div>
  );
}
