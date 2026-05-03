'use client';

import { useDashboard } from '@/hooks/use-dashboard';
import { KpiGrid } from '@/components/dashboard/kpi-grid';
import { RidesLineChart } from '@/components/dashboard/rides-line-chart';
import { RidesAreaChart } from '@/components/dashboard/rides-area-chart';
import { VehicleTypeDonut } from '@/components/dashboard/vehicle-type-donut';
import { DemandHeatmap } from '@/components/dashboard/demand-heatmap';
import { ActionRequired } from '@/components/dashboard/action-required';
import { LiveActivity } from '@/components/dashboard/live-activity';

export default function DashboardPage() {
  const {
    kpis,
    rideTrends,
    revenueTrends,
    vehicleTypeBreakdown,
    actionRequired,
    liveActivity,
    isLoading,
  } = useDashboard();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Operations command center &middot; Live data
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#22C55E]/10 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-xs font-medium text-[#22C55E]">System Online</span>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiGrid kpis={kpis} isLoading={isLoading} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RidesLineChart data={rideTrends} isLoading={isLoading} />
        <RidesAreaChart data={revenueTrends} isLoading={isLoading} />
        <VehicleTypeDonut data={vehicleTypeBreakdown} isLoading={isLoading} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DemandHeatmap isLoading={isLoading} />
        <ActionRequired items={actionRequired} isLoading={isLoading} />
        <LiveActivity items={liveActivity} isLoading={isLoading} />
      </div>
    </div>
  );
}
