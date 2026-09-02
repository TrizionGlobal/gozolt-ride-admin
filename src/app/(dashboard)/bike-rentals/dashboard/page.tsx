'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bike,
  Car,
  Clock,
  ArrowRight,
  Key,
  Truck,
  MapPin,
  Building2,
  Activity,
  Layers,
  BarChart3,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useBikeRentalDashboard } from '@/hooks/use-bike-rental-dashboard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function BikeRentalDashboardPage() {
  const router = useRouter();
  const { data, loading, refresh } = useBikeRentalDashboard();

  const kpis = data?.kpis;
  const pipeline = data?.lifecyclePipeline;
  const fleetStatus = data?.fleetStatus;
  const handoverTypes = data?.handoverTypes;
  const weeklyActivity = data?.weeklyActivity || [];
  const suppliers = data?.supplierFleetOverview || [];

  const totalFleet = kpis?.totalBikes || 1;
  const availablePct = Math.round(((fleetStatus?.available || 0) / totalFleet) * 100);
  const onRentPct = Math.round(((fleetStatus?.onRent || 0) / totalFleet) * 100);
  const maintenancePct = Math.round(((fleetStatus?.maintenance || 0) / totalFleet) * 100);

  const maxWeeklyCount = Math.max(...weeklyActivity.map((w) => w.count), 1);

  const totalHandovers = (handoverTypes?.doorstepDelivery || 0) + (handoverTypes?.selfPickup || 0) || 1;
  const deliveryPct = Math.round(((handoverTypes?.doorstepDelivery || 0) / totalHandovers) * 100);
  const pickupPct = Math.round(((handoverTypes?.selfPickup || 0) / totalHandovers) * 100);

  return (
    <div className="space-y-6">
      {/* Header with Live Pulse Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Bike Rentals Operational Dashboard</h1>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-sm text-[#6B7280] mt-1">
            Real-time fleet utilization, supplier fulfillment, activity trends, and rental lifecycle pipeline
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={refresh}
            className="bg-[#1F1F1F] border border-[#2A2A2A] text-white hover:bg-[#2A2A2A] transition-all"
          >
            <Activity className="mr-2 h-4 w-4 text-[#FFD700]" /> Refresh Operations
          </Button>
          <Button
            onClick={() => router.push('/bike-rentals')}
            className="bg-[#FFD700] text-black font-semibold hover:bg-[#E6C200] transition-all"
          >
            <Key className="mr-2 h-4 w-4" /> Manage All Fleet
          </Button>
        </div>
      </div>

      {/* Top Operational KPI Stream */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 w-full rounded-lg bg-[#141414] border border-[#2A2A2A]" />
          <Skeleton className="h-32 w-full rounded-lg bg-[#141414] border border-[#2A2A2A]" />
          <Skeleton className="h-32 w-full rounded-lg bg-[#141414] border border-[#2A2A2A]" />
          <Skeleton className="h-32 w-full rounded-lg bg-[#141414] border border-[#2A2A2A]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Pending Supplier Acceptance */}
          <div className="group rounded-lg border border-[#2A2A2A] bg-[#141414] p-5 hover:border-amber-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                Pending Supplier Acceptance
              </span>
              <div className="rounded-full bg-amber-500/10 p-2 text-amber-400 group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-white">
              {kpis?.pendingAcceptance || 0}
            </div>
            <p className="mt-1 text-xs text-amber-400 font-medium">Awaiting Accept / Reject</p>
          </div>

          {/* Card 2: Confirmed Handovers */}
          <div className="group rounded-lg border border-[#2A2A2A] bg-[#141414] p-5 hover:border-[#FFD700]/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                Confirmed Handovers
              </span>
              <div className="rounded-full bg-[#FFD700]/10 p-2 text-[#FFD700] group-hover:scale-110 transition-transform">
                <Key className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-white">
              {kpis?.upcomingHandovers || 0}
            </div>
            <p className="mt-1 text-xs text-[#FFD700] font-medium">Ready for Delivery / Self-Pickup</p>
          </div>

          {/* Card 3: Active Rentals (On Rent) */}
          <div className="group rounded-lg border border-[#2A2A2A] bg-[#141414] p-5 hover:border-blue-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                Active Rentals (On Rent)
              </span>
              <div className="rounded-full bg-blue-500/10 p-2 text-blue-400 group-hover:scale-110 transition-transform">
                <Bike className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-white">
              {kpis?.activeRentals || 0}
            </div>
            <p className="mt-1 text-xs text-blue-400 font-medium">Currently on the road</p>
          </div>

          {/* Card 4: Fleet Utilization Rate */}
          <div className="group rounded-lg border border-[#2A2A2A] bg-[#141414] p-5 hover:border-emerald-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                Fleet Utilization Rate
              </span>
              <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-400 group-hover:scale-110 transition-transform">
                <Zap className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-emerald-400">
              {kpis?.fleetUtilizationRate || 0}%
            </div>
            <p className="mt-1 text-xs text-[#9CA3AF]">Active fleet efficiency</p>
          </div>
        </div>
      )}

      {/* Rental Booking Lifecycle Pipeline Stepper */}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#FFD700]" />
            <div>
              <h2 className="text-base font-semibold text-white">Rental Booking Lifecycle Pipeline</h2>
              <p className="text-xs text-[#6B7280]">End-to-end booking progression tracking</p>
            </div>
          </div>
          <Link
            href="/bike-rentals?tab=bookings"
            className="text-xs text-[#FFD700] hover:underline flex items-center gap-1 font-semibold"
          >
            View Bookings <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            <Skeleton className="h-28 w-full rounded-lg bg-[#1F1F1F]" />
            <Skeleton className="h-28 w-full rounded-lg bg-[#1F1F1F]" />
            <Skeleton className="h-28 w-full rounded-lg bg-[#1F1F1F]" />
            <Skeleton className="h-28 w-full rounded-lg bg-[#1F1F1F]" />
            <Skeleton className="h-28 w-full rounded-lg bg-[#1F1F1F]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            {/* Step 1: Paid */}
            <div className="p-3.5 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] relative overflow-hidden">
              <div className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider">Step 1 • Payment</div>
              <div className="text-sm font-semibold text-white mt-1">Booked & Paid</div>
              <div className="mt-2 text-xl font-bold text-yellow-400">{pipeline?.pendingPayment || 0}</div>
              <div className="h-1 w-full bg-[#2A2A2A] rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full transition-all duration-700" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Step 2: Pending Supplier Acceptance */}
            <div className="p-3.5 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] relative overflow-hidden">
              <div className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider">Step 2 • Review</div>
              <div className="text-sm font-semibold text-white mt-1">Pending Acceptance</div>
              <div className="mt-2 text-xl font-bold text-amber-400">{pipeline?.pendingAcceptance || 0}</div>
              <div className="h-1 w-full bg-[#2A2A2A] rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Step 3: Confirmed Handover */}
            <div className="p-3.5 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] relative overflow-hidden">
              <div className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider">Step 3 • Handover</div>
              <div className="text-sm font-semibold text-white mt-1">Confirmed Pickup/Delivery</div>
              <div className="mt-2 text-xl font-bold text-[#FFD700]">{pipeline?.confirmedHandover || 0}</div>
              <div className="h-1 w-full bg-[#2A2A2A] rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-[#FFD700] rounded-full transition-all duration-700" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Step 4: Active On Road */}
            <div className="p-3.5 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] relative overflow-hidden">
              <div className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider">Step 4 • Active</div>
              <div className="text-sm font-semibold text-white mt-1">Active On-Rent</div>
              <div className="mt-2 text-xl font-bold text-blue-400">{pipeline?.activeOnRoad || 0}</div>
              <div className="h-1 w-full bg-[#2A2A2A] rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Step 5: Completed */}
            <div className="p-3.5 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] relative overflow-hidden">
              <div className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider">Step 5 • Done</div>
              <div className="text-sm font-semibold text-white mt-1">Completed Rental</div>
              <div className="mt-2 text-xl font-bold text-emerald-400">{pipeline?.completed || 0}</div>
              <div className="h-1 w-full bg-[#2A2A2A] rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Charts & Operations Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly Rental Activity Visual Bar Chart */}
        <div className="lg:col-span-2 rounded-lg border border-[#2A2A2A] bg-[#141414] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <div>
                <h2 className="text-base font-semibold text-white">Weekly Rental Activity Distribution</h2>
                <p className="text-xs text-[#6B7280]">Booking volume across days of the week</p>
              </div>
            </div>
          </div>

          {loading ? (
            <Skeleton className="h-56 w-full rounded-lg bg-[#1F1F1F]" />
          ) : (
            <div className="pt-4 flex items-end justify-between gap-3 h-48 px-4 border-b border-[#2A2A2A] pb-2">
              {weeklyActivity.map((w) => {
                const heightPct = Math.max(10, Math.round((w.count / maxWeeklyCount) * 100));
                return (
                  <div key={w.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="text-[11px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {w.count}
                    </div>
                    <div className="w-full bg-[#1F1F1F] rounded-t-md overflow-hidden flex items-end h-36">
                      <div
                        className="w-full bg-gradient-to-t from-[#FFD700] to-[#EAB308] rounded-t-md transition-all duration-700 ease-out group-hover:brightness-125"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-[#9CA3AF] mt-1">{w.day}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Fulfillment Handover Preference Breakdown */}
        <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-6 space-y-4">
          <div className="border-b border-[#2A2A2A] pb-3">
            <h2 className="text-base font-semibold text-white">Fulfillment Handover Method</h2>
            <p className="text-xs text-[#6B7280]">Customer booking preference breakdown</p>
          </div>

          {loading ? (
            <div className="space-y-4 pt-2">
              <Skeleton className="h-20 w-full rounded-lg bg-[#1F1F1F]" />
              <Skeleton className="h-20 w-full rounded-lg bg-[#1F1F1F]" />
            </div>
          ) : (
            <div className="space-y-5 pt-2">
              {/* Doorstep Delivery */}
              <div className="p-4 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-400 flex items-center gap-1.5">
                    <Truck className="h-4 w-4" /> Doorstep Delivery
                  </span>
                  <span className="font-bold text-white">{handoverTypes?.doorstepDelivery || 0} ({deliveryPct}%)</span>
                </div>
                <div className="h-2 w-full bg-[#1F1F1F] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${deliveryPct}%` }}
                  />
                </div>
              </div>

              {/* Self Pickup */}
              <div className="p-4 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> Self Pickup
                  </span>
                  <span className="font-bold text-white">{handoverTypes?.selfPickup || 0} ({pickupPct}%)</span>
                </div>
                <div className="h-2 w-full bg-[#1F1F1F] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${pickupPct}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fleet Availability Status Section */}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
          <div>
            <h2 className="text-base font-semibold text-white">Fleet Availability Status</h2>
            <p className="text-xs text-[#6B7280]">Real-time bike status across all suppliers</p>
          </div>
          <Link
            href="/bike-rentals?tab=bikes"
            className="text-xs text-[#FFD700] hover:underline flex items-center gap-1 font-semibold"
          >
            View All Bikes <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <Skeleton className="h-20 w-full rounded-lg bg-[#1F1F1F]" />
            <Skeleton className="h-20 w-full rounded-lg bg-[#1F1F1F]" />
            <Skeleton className="h-20 w-full rounded-lg bg-[#1F1F1F]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Available */}
            <div className="p-4 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#9CA3AF]">Available for Instant Booking</span>
                <span className="text-emerald-400 font-bold">{fleetStatus?.available || 0} ({availablePct}%)</span>
              </div>
              <div className="h-2 w-full bg-[#1F1F1F] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${availablePct}%` }} />
              </div>
            </div>

            {/* On Rent */}
            <div className="p-4 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#9CA3AF]">On Rent / Active</span>
                <span className="text-blue-400 font-bold">{fleetStatus?.onRent || 0} ({onRentPct}%)</span>
              </div>
              <div className="h-2 w-full bg-[#1F1F1F] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${onRentPct}%` }} />
              </div>
            </div>

            {/* Maintenance */}
            <div className="p-4 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#9CA3AF]">Maintenance / Out of Service</span>
                <span className="text-amber-400 font-bold">{fleetStatus?.maintenance || 0} ({maintenancePct}%)</span>
              </div>
              <div className="h-2 w-full bg-[#1F1F1F] rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${maintenancePct}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Supplier Operations Hub */}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#FFD700]" />
            <div>
              <h2 className="text-base font-semibold text-white">Registered Rental Supplier Operations Hub</h2>
              <p className="text-xs text-[#6B7280]">Suppliers independently managing fleets and bike handovers</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-32 w-full rounded-lg bg-[#1F1F1F]" />
            <Skeleton className="h-32 w-full rounded-lg bg-[#1F1F1F]" />
            <Skeleton className="h-32 w-full rounded-lg bg-[#1F1F1F]" />
          </div>
        ) : suppliers.length === 0 ? (
          <div className="py-6 text-center text-[#6B7280]">No active suppliers found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((sup) => (
              <div
                key={sup.id}
                className="p-4 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] space-y-3 hover:border-[#FFD700]/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-sm">{sup.supplierName}</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                    <ShieldCheck className="h-3 w-3 mr-1" /> Autonomous
                  </Badge>
                </div>
                <div className="text-xs text-[#6B7280]">
                  Contact: <span className="text-[#9CA3AF]">{sup.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2A2A2A] text-center text-xs">
                  <div>
                    <div className="font-bold text-[#FFD700] text-sm">{sup.totalVehicles}</div>
                    <div className="text-[10px] text-[#6B7280]">Total Fleet</div>
                  </div>
                  <div>
                    <div className="font-bold text-emerald-400 text-sm">{sup.availableVehicles}</div>
                    <div className="text-[10px] text-[#6B7280]">Available</div>
                  </div>
                  <div>
                    <div className="font-bold text-blue-400 text-sm">{sup.activeRentals}</div>
                    <div className="text-[10px] text-[#6B7280]">On Rent</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
