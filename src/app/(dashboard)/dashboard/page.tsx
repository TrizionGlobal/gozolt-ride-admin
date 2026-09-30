'use client';

import Image from 'next/image';
import { RotateCw } from 'lucide-react';
import { useDashboard } from '@/hooks/use-dashboard';
import { KpiGrid } from '@/components/dashboard/kpi-grid';
import { RidesLineChart } from '@/components/dashboard/rides-line-chart';
import { RidesAreaChart } from '@/components/dashboard/rides-area-chart';
import { VehicleTypeDonut } from '@/components/dashboard/vehicle-type-donut';
import { PeakHoursChart } from '@/components/dashboard/peak-hours-chart';
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
    peakHours,
    isLoading,
    isRefreshing,
    refresh,
  } = useDashboard();

  return (
    <div className="space-y-6">
      {/* Header */}

      {/* Cab Booking Dashboard Header */}
<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
  <div className="flex items-center gap-4">
    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#141414]">
      <Image
        src="/cab-booking-icon.png"
        alt="Cab Booking"
        width={64}
        height={64}
        className="h-full w-full object-cover"
        priority
      />
    </div>

    <div>
      <h1 className="text-2xl font-bold text-white">
        Cab Booking Dashboard
      </h1>

      <p className="mt-1 text-sm text-[#6B7280]">
        Manage live rides, drivers, passengers, suppliers and
        platform-wide cab operations.
      </p>
    </div>
  </div>

  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={refresh}
      disabled={isLoading || isRefreshing}
      className="flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#141414] px-3.5 py-2 text-xs font-medium text-white transition-all hover:border-[#444444] hover:bg-[#1A1A1A] active:scale-95 disabled:pointer-events-none disabled:opacity-50"
      id="dashboard-refresh-btn"
    >
      <RotateCw
        className={`h-3.5 w-3.5 text-[#FACC15] ${
          isRefreshing ? 'animate-spin' : ''
        }`}
      />

      <span>
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </span>
    </button>

    <div className="flex items-center gap-2 rounded-full bg-[#22C55E]/10 px-3 py-1.5">
      <span className="h-2 w-2 animate-pulse rounded-full bg-[#22C55E]" />

      <span className="text-xs font-medium text-[#22C55E]">
        System Online
      </span>
    </div>
  </div>
</div>

      {/* KPI Cards */}
      <KpiGrid kpis={kpis} isLoading={isLoading} />

      {/* First Data Row: Ride Trends & Vehicle Types */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RidesLineChart data={rideTrends} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
          <VehicleTypeDonut data={vehicleTypeBreakdown} isLoading={isLoading} />
        </div>
      </div>

      {/* Second Data Row: Revenue & Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RidesAreaChart data={revenueTrends} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
          <ActionRequired items={actionRequired} isLoading={isLoading} />
        </div>
      </div>

      {/* Third Data Row: Peak Hours & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PeakHoursChart data={peakHours} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
          <LiveActivity items={liveActivity} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
