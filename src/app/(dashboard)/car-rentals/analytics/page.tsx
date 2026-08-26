'use client';

import { DollarSign, CalendarCheck, Clock, TrendingUp, Award, RotateCcw, ShieldCheck } from 'lucide-react';
import { useCarRentalAnalytics } from '@/hooks/use-car-rental-analytics';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const CATEGORY_NAMES: Record<string, string> = {
  GO_5P: 'Go - 5P',
  'GO - 5P': 'Go - 5P',
  PREMIUM_5P: 'Premium - 5P',
  'PREMIUM - 5P': 'Premium - 5P',
  SUV_7P: 'SUV - 7P',
  'SUV - 7P': 'SUV - 7P',
  VAN_8P: 'Van - 8P & Above',
  VAN_8P_ABOVE: 'Van - 8P & Above',
  'VAN - 8P & ABOVE': 'Van - 8P & Above',
  ELECTRIC_5P: 'Electric - 5P',
  'ELECTRIC - 5P': 'Electric - 5P',
};

function formatCategoryName(cat: string): string {
  if (!cat) return 'Standard';
  const key = cat.toUpperCase().trim();
  if (CATEGORY_NAMES[key]) return CATEGORY_NAMES[key];
  return cat.replace(/_/g, ' ');
}

export default function CarRentalAnalyticsPage() {
  const { data, loading, refresh } = useCarRentalAnalytics();

  const overview = data?.overview;
  const monthlyRevenue = data?.monthlyRevenue || [];
  const categoryBreakdown = data?.categoryBreakdown || [];
  const topSuppliers = data?.topSuppliers || [];

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Car Rental Financial Analytics & Reports</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Supplier earnings breakdown, customer refund math, monthly trends, and supplier leaderboards
          </p>
        </div>
        <Button
          onClick={refresh}
          className="bg-[#1F1F1F] border border-[#2A2A2A] text-white hover:bg-[#2A2A2A]"
        >
          Refresh Data
        </Button>
      </div>

      {/* Main Financial KPI Cards Banner */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 w-full rounded-lg bg-[#141414] border border-[#2A2A2A]" />
          <Skeleton className="h-32 w-full rounded-lg bg-[#141414] border border-[#2A2A2A]" />
          <Skeleton className="h-32 w-full rounded-lg bg-[#141414] border border-[#2A2A2A]" />
          <Skeleton className="h-32 w-full rounded-lg bg-[#141414] border border-[#2A2A2A]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Gross Upfront Payments */}
          <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                Gross Payments (Stripe)
              </span>
              <div className="rounded-full bg-blue-500/10 p-2 text-blue-400">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold text-white">
              €{(overview?.grossPaidRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="mt-1 text-xs text-[#9CA3AF]">Upfront customer payments</p>
          </div>

          {/* Card 2: Total Customer Refunds */}
          <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                Total Customer Refunds
              </span>
              <div className="rounded-full bg-red-500/10 p-2 text-red-400">
                <RotateCcw className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold text-red-400">
              - €{(overview?.totalRefundedAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="mt-1 text-xs text-red-400">Cancellations, rejections & flexible returns</p>
          </div>

          {/* Card 3: Net Supplier Earnings */}
          <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                Net Supplier Earnings
              </span>
              <div className="rounded-full bg-[#FFD700]/10 p-2 text-[#FFD700]">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold text-[#FFD700]">
              €{(overview?.netSupplierEarnings || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="mt-1 text-xs text-[#10B981]">Adjusted balance for 10-day settlement</p>
          </div>

          {/* Card 4: Avg Booking Value */}
          <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                Avg Net Booking Value
              </span>
              <div className="rounded-full bg-purple-500/10 p-2 text-purple-400">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold text-white">
              €{(overview?.averageBookingValue || 0).toFixed(2)}
            </div>
            <p className="mt-1 text-xs text-[#6B7280]">Per Completed Rental</p>
          </div>
        </div>
      )}

      {/* Secondary Metrics Row */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-24 w-full rounded-lg bg-[#141414] border border-[#2A2A2A]" />
          <Skeleton className="h-24 w-full rounded-lg bg-[#141414] border border-[#2A2A2A]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">Total Rental Bookings</span>
              <div className="mt-1 text-xl font-bold text-white">
                {overview?.totalBookings || 0}
              </div>
              <p className="text-xs text-[#9CA3AF]">
                Fulfillment Rate: <span className="text-emerald-400 font-semibold">{overview?.completionRate || 0}%</span>
              </p>
            </div>
            <div className="rounded-full bg-blue-500/10 p-3 text-blue-400">
              <CalendarCheck className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">Avg Rental Duration</span>
              <div className="mt-1 text-xl font-bold text-white">
                {overview?.averageRentalDuration || 0} Days
              </div>
              <p className="text-xs text-emerald-400 font-medium">Average Rental Period</p>
            </div>
            <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-400">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>
      )}

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-2 rounded-lg border border-[#2A2A2A] bg-[#141414] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
            <div>
              <h2 className="text-base font-semibold text-white">Monthly Revenue Trends</h2>
              <p className="text-xs text-[#6B7280]">Monthly net rental earnings after refunds</p>
            </div>
          </div>

          {loading ? (
            <Skeleton className="h-56 w-full rounded-lg bg-[#1F1F1F]" />
          ) : (
            <div className="pt-4 space-y-3">
              {monthlyRevenue.map((m) => {
                const pct = Math.round((m.revenue / maxRevenue) * 100);
                return (
                  <div key={m.month} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#9CA3AF] font-medium">{m.month}</span>
                      <span className="text-white font-semibold">
                        €{m.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({m.bookings} bookings)
                      </span>
                    </div>
                    <div className="h-3 w-full bg-[#1F1F1F] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FFD700] to-[#EAB308] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pct, m.revenue > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Vehicle Category Breakdown */}
        <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-6 space-y-4">
          <div className="border-b border-[#2A2A2A] pb-3">
            <h2 className="text-base font-semibold text-white">Category Demand</h2>
            <p className="text-xs text-[#6B7280]">Bookings & net earnings by vehicle type</p>
          </div>

          {loading ? (
            <div className="space-y-3 pt-2">
              <Skeleton className="h-16 w-full rounded-lg bg-[#1F1F1F]" />
              <Skeleton className="h-16 w-full rounded-lg bg-[#1F1F1F]" />
              <Skeleton className="h-16 w-full rounded-lg bg-[#1F1F1F]" />
            </div>
          ) : categoryBreakdown.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-[#6B7280]">No category data</div>
          ) : (
            <div className="space-y-4 pt-2">
              {categoryBreakdown.map((cat) => (
                <div key={cat.category} className="p-3 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{formatCategoryName(cat.category)}</span>
                    <span className="text-xs font-bold text-[#FFD700]">
                      €{cat.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-[#9CA3AF]">
                    <span>{cat.count} Total Bookings</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Performing Suppliers Table */}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-3">
          <Award className="h-5 w-5 text-[#FFD700]" />
          <div>
            <h2 className="text-base font-semibold text-white">Top Performing Car Rental Suppliers</h2>
            <p className="text-xs text-[#6B7280]">Highest net earning rental suppliers after refund adjustments</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 py-2">
            <Skeleton className="h-10 w-full bg-[#1F1F1F]" />
            <Skeleton className="h-10 w-full bg-[#1F1F1F]" />
            <Skeleton className="h-10 w-full bg-[#1F1F1F]" />
          </div>
        ) : topSuppliers.length === 0 ? (
          <div className="py-8 text-center text-[#6B7280]">No rental suppliers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#9CA3AF]">
              <thead className="bg-[#1A1A1A] text-xs uppercase text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Supplier Name</th>
                  <th className="px-4 py-3">Bookings Handled</th>
                  <th className="px-4 py-3 text-right">Net Supplier Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {topSuppliers.map((sup, index) => (
                  <tr key={sup.name} className="hover:bg-[#1A1A1A]/50 transition-colors">
                    <td className="px-4 py-3 text-white font-bold">#{index + 1}</td>
                    <td className="px-4 py-3 font-semibold text-white">{sup.name}</td>
                    <td className="px-4 py-3">{sup.completedBookings} bookings</td>
                    <td className="px-4 py-3 text-right font-bold text-[#FFD700]">
                      €{sup.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
