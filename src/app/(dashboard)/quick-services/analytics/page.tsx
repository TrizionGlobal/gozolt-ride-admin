'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Activity,
  CheckCircle2,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

import { useAdminQuickServiceBookings } from '@/hooks/use-admin-quick-services';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'];
const STATUS_COLORS = {
  PENDING: '#F59E0B',
  ASSIGNED: '#3B82F6',
  IN_PROGRESS: '#8B5CF6',
  COMPLETED: '#10B981',
  CANCELLED: '#EF4444',
};

export default function QuickServicesAnalyticsPage() {
  const { data: bookings, loading } = useAdminQuickServiceBookings({ page: 1, limit: 1000 });

  const analytics = useMemo(() => {
    if (!bookings || bookings.length === 0) return null;

    let totalRevenue = 0;
    let totalUpfront = 0;
    let totalMaterial = 0;
    let totalRemaining = 0;
    let totalRefunded = 0;
    let completedCount = 0;
    
    const categoryMap: Record<string, number> = {};
    const statusMap: Record<string, number> = {
      PENDING: 0, ASSIGNED: 0, IN_PROGRESS: 0, COMPLETED: 0, CANCELLED: 0
    };
    let maxDate = new Date();
    maxDate.setHours(0, 0, 0, 0);

    if (bookings && bookings.length > 0) {
      bookings.forEach((b: any) => {
        if (b.bookingDate) {
          const d = new Date(b.bookingDate);
          d.setHours(0, 0, 0, 0);
          if (d > maxDate) maxDate = d;
        }
      });
    }

    const trendMap: Record<string, { date: string; revenue: number; refunded: number; bookings: number; ts: number }> = {};
    
    // Pre-fill exactly 7 days leading up to the maxDate
    for (let i = 6; i >= 0; i--) {
      const d = new Date(maxDate);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const ts = d.getTime();
      const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      trendMap[dateStr] = { date: dateStr, revenue: 0, refunded: 0, bookings: 0, ts };
    }

    bookings.forEach((b: any) => {
      let rawAmount = Number(b.totalAmount) || 0;
      let upfront = Number(b.upfrontFee) || 0;
      let material = Number(b.materialCost) || 0;
      let remaining = Math.max(0, rawAmount - upfront - material);
      let amount = upfront + material + remaining;
      let refunded = 0;

      if (b.status === 'CANCELLED') {
        remaining = 0; // Service was not performed
        if (b.paymentStatus === 'PARTIALLY_REFUNDED') {
          refunded = material;
          material = 0; // it was refunded, so not retained
          amount -= refunded;
        } else if (b.paymentStatus === 'REFUNDED') {
          refunded = upfront + material;
          upfront = 0;
          material = 0;
          amount = 0;
        } else {
          // Cancelled but no refund issued yet. Admin keeps upfront.
          // Remaining is 0, Material might not be provided, but keeping it simple:
          if (b.paymentStatus !== 'PAID') {
            material = 0;
            amount = upfront;
          }
        }
      }

      totalRevenue += amount;
      totalUpfront += upfront;
      totalMaterial += material;
      totalRemaining += remaining;
      totalRefunded += refunded;
      
      const status = b.status || 'PENDING';
      statusMap[status] = (statusMap[status] || 0) + 1;
      if (status === 'COMPLETED') completedCount++;

      const cat = b.serviceTitle || b.serviceCategory || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;

      if (b.bookingDate) {
        const d = new Date(b.bookingDate);
        d.setHours(0, 0, 0, 0);
        const ts = d.getTime();
        const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        
        if (!trendMap[dateStr]) trendMap[dateStr] = { date: dateStr, revenue: 0, refunded: 0, bookings: 0, ts };
        trendMap[dateStr].revenue += amount;
        trendMap[dateStr].refunded += refunded;
        trendMap[dateStr].bookings += 1;
      }
    });

    const categoriesData = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const statusData = Object.entries(statusMap)
      .filter(([name, value]) => value > 0 || ['PENDING', 'ASSIGNED', 'COMPLETED'].includes(name))
      .map(([name, value]) => ({ name, value }));

    const trendData = Object.values(trendMap).sort((a, b) => a.ts - b.ts).slice(-7);

    return {
      totalRevenue,
      totalUpfront,
      totalMaterial,
      totalRemaining,
      totalRefunded,
      totalBookings: bookings.length,
      avgValue: bookings.length > 0 ? totalRevenue / bookings.length : 0,
      completionRate: bookings.length > 0 ? (completedCount / bookings.length) * 100 : 0,
      categoriesData,
      statusData,
      trendData
    };
  }, [bookings]);

  const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <div className="group relative overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#141414] p-3 transition-all duration-300 hover:border-[#FFD700]/30 hover:shadow-lg hover:shadow-[#FFD700]/5">
      <div className="flex items-center justify-between relative z-10">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] group-hover:text-white transition-colors">
          {title}
        </p>
        <div className={`rounded-lg p-1.5 bg-[#1A1A1A] text-${color} border border-[#2A2A2A] group-hover:scale-110 transition-transform`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="mt-2 relative z-10">
        {loading ? (
          <Skeleton className="h-6 w-20 bg-[#2A2A2A]" />
        ) : (
          <p className="text-lg font-extrabold text-white tracking-tight">
            {value}
          </p>
        )}
      </div>
      {loading ? (
        <Skeleton className="mt-2 h-3 w-28 bg-[#2A2A2A]" />
      ) : (
        <p className="mt-2 text-[10px] font-medium text-[#6B7280] flex items-center gap-1.5">
          {sub}
        </p>
      )}
      {/* Decorative gradient blur */}
      <div className={`absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-${color}/10 blur-[50px] pointer-events-none`} />
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#141414]">
          <Image
            src="/quick-services-icon.png"
            alt="Quick Services"
            width={64}
            height={64}
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Advanced Analytics
          </h1>
          <p className="mt-1 text-sm text-[#9CA3AF]">
            Comprehensive insights into quick services performance and revenue.
          </p>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Gross Amount"
          value={analytics ? `€${analytics.totalRevenue.toFixed(2)}` : '€0.00'}
          sub="Upfront + Material + Final"
          icon={DollarSign}
          color="[#FFD700]"
        />
        <StatCard
          title="Total Upfront (Admin)"
          value={analytics ? `€${analytics.totalUpfront.toFixed(2)}` : '€0.00'}
          sub="Platform retained"
          icon={Activity}
          color="purple-400"
        />
        <StatCard
          title="Material Included"
          value={analytics ? `€${analytics.totalMaterial.toFixed(2)}` : '€0.00'}
          sub="Paid for materials"
          icon={CheckCircle2}
          color="emerald-400"
        />
        <StatCard
          title="Final Service Charge"
          value={analytics ? `€${analytics.totalRemaining.toFixed(2)}` : '€0.00'}
          sub="Supplier remaining balance"
          icon={TrendingUp}
          color="blue-400"
        />
        <StatCard
          title="Total Refunded"
          value={analytics ? `€${analytics.totalRefunded.toFixed(2)}` : '€0.00'}
          sub="Cancelled & refunded amounts"
          icon={Activity}
          color="red-400"
        />
        <StatCard
          title="Total Bookings"
          value={analytics?.totalBookings || 0}
          sub="Requested services"
          icon={BarChart3}
          color="amber-400"
        />
        <StatCard
          title="Avg. Booking Value"
          value={analytics ? `€${analytics.avgValue.toFixed(2)}` : '€0.00'}
          sub="Revenue per booking"
          icon={PieChartIcon}
          color="cyan-400"
        />
        <StatCard
          title="Completion Rate"
          value={analytics ? `${analytics.completionRate.toFixed(1)}%` : '0%'}
          sub="Successfully finished jobs"
          icon={CheckCircle2}
          color="purple-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#FFD700]" /> Revenue & Booking Trend
              </h2>
              <p className="text-sm text-[#6B7280] mt-1">7-day rolling performance metrics</p>
            </div>
          </div>
          
          <div className="flex-1 h-[300px] w-full">
            {loading ? (
              <Skeleton className="w-full h-full rounded-lg bg-[#1A1A1A]" />
            ) : analytics?.trendData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="#FFD700" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `€${v}`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#E5E7EB' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" name="Net Revenue (€)" stroke="#FFD700" strokeWidth={3} dot={{ r: 4, fill: '#1A1A1A', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line yAxisId="left" type="monotone" dataKey="refunded" name="Refunds (€)" stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4, fill: '#1A1A1A', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="bookings" name="Bookings" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#1A1A1A', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#6B7280]">No trend data available</div>
            )}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-purple-400" /> Booking Status
            </h2>
            <p className="text-sm text-[#6B7280] mt-1">Current state distribution</p>
          </div>
          
          <div className="flex-1 h-[250px] w-full flex items-center justify-center">
            {loading ? (
              <Skeleton className="w-48 h-48 rounded-full bg-[#1A1A1A]" />
            ) : analytics?.statusData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {analytics.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={(STATUS_COLORS as any)[entry.name] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#E5E7EB' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-[#6B7280]">No data</div>
            )}
          </div>

          {!loading && analytics?.statusData.length && (
            <div className="mt-6 space-y-3">
              {analytics.statusData.map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: (STATUS_COLORS as any)[stat.name] || COLORS[i] }} />
                    <span className="text-sm text-[#9CA3AF] capitalize">{stat.name.replace('_', ' ').toLowerCase()}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Categories */}
      <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-400" /> Top Service Categories
          </h2>
          <p className="text-sm text-[#6B7280] mt-1">Most requested services by volume</p>
        </div>

        <div 
          className="w-full transition-all duration-300" 
          style={{ height: analytics?.categoriesData.length ? Math.max(120, analytics.categoriesData.length * 30 + 30) : 200 }}
        >
          {loading ? (
            <Skeleton className="w-full h-full rounded-lg bg-[#1A1A1A]" />
          ) : analytics?.categoriesData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.categoriesData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#E5E7EB" fontSize={13} tickLine={false} axisLine={false} width={150} />
                <Tooltip 
                  cursor={{ fill: '#1A1A1A' }}
                  contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="value" name="Bookings" radius={[0, 4, 4, 0]} barSize={20}>
                  {analytics.categoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#6B7280]">No category data available</div>
          )}
        </div>
      </div>
    </div>
  );
}
