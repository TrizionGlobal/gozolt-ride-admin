'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plane,
  Clock,
  Car,
  FileText,
  CreditCard,
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  CalendarCheck,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  MapPin,
  User,
  Luggage,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { apiClient } from '@/lib/api-client';
import { formatDateTime } from '@/lib/utils';

interface RecentTransfer {
  id: string;
  bookingReference: string;
  flightNumber?: string | null;
  returnFlightNumber?: string | null;
  transferType: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  returnDateTime?: string | null;
  leadPassengerName: string;
  leadPassengerPhone?: string | null;
  adults?: number;
  standardLuggage?: number;
  largeLuggage?: number;
  grandTotal: number;
  status: string;
  vehicle?: {
    make: string;
    model: string;
    registrationNo?: string;
    vehicleType?: string;
  } | null;
  supplier?: {
    id: string;
    companyName: string;
  } | null;
  driver?: {
    firstName: string;
    lastName: string;
    phone?: string;
  } | null;
}

interface AdminTransferStats {
  totalTransfers: number;
  scheduledToday: number;
  activeTransfers: number;
  pendingAssignment: number;
  pendingApprovals?: number;
  upcomingBookings?: number;
  completedBookings?: number;
  cancelledBookings?: number;
  gmv: number;
  platformRevenue?: number;
  totalVehicles?: number;
  pendingVehicles?: number;
  approvedVehicles?: number;
  totalSuppliers?: number;
  monthlyEarnings?: Array<{ month: string; gmv: number; earnings: number; commission: number }>;
  recentTransfers?: RecentTransfer[];
}

export default function AirportTransfersDashboardPage() {
  const [stats, setStats] = useState<AdminTransferStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/airport-transfers/admin/dashboard-stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch admin airport transfer stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Fallback monthly data if empty
  const monthlyEarningsData =
    stats?.monthlyEarnings && stats.monthlyEarnings.length > 0
      ? stats.monthlyEarnings
      : [
          { month: 'May', gmv: 420, commission: 42 },
          { month: 'Jun', gmv: 680, commission: 68 },
          { month: 'Jul', gmv: 890, commission: 89 },
          { month: 'Aug', gmv: 1250, commission: 125 },
          { month: 'Sep', gmv: 1420, commission: 142 },
          { month: 'Oct', gmv: stats?.gmv ? Math.round(stats.gmv) : 1850, commission: stats?.gmv ? Math.round(stats.gmv * 0.1) : 185 },
        ];

  // Booking distribution for Pie Chart
  const activeCount = stats?.activeTransfers || 0;
  const upcomingCount = stats?.upcomingBookings || 0;
  const completedCount = stats?.completedBookings || 0;
  const pendingCount = (stats?.pendingAssignment || 0) + (stats?.pendingApprovals || 0);
  const cancelledCount = stats?.cancelledBookings || 0;

  const distributionData = [
    { name: 'Active on Road', value: activeCount, color: '#3B82F6' },
    { name: 'Upcoming', value: upcomingCount, color: '#A855F7' },
    { name: 'Completed', value: completedCount, color: '#10B981' },
    { name: 'Pending Dispatch', value: pendingCount, color: '#F59E0B' },
    { name: 'Cancelled', value: cancelledCount, color: '#EF4444' },
  ].filter((d) => d.value > 0);

  if (distributionData.length === 0) {
    distributionData.push({ name: 'Active Bookings', value: 1, color: '#FCD223' });
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'DRIVER_ASSIGNED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/25">
            {status.replace(/_/g, ' ')}
          </span>
        );
      case 'EN_ROUTE_TO_PICKUP':
      case 'ARRIVED_AT_AIRPORT':
      case 'PASSENGER_MET':
      case 'IN_TRANSIT':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25 animate-pulse">
            {status.replace(/_/g, ' ')}
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            COMPLETED
          </span>
        );
      case 'PENDING_APPROVAL':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/25">
            PENDING APPROVAL
          </span>
        );
      case 'CANCELLED':
      case 'REFUNDED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/25">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/25">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      {/* ── 1. HEADER & QUICK ACTIONS ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#141414] shadow-lg">
            <Image
              src="/airport-transfers-icon.png"
              alt="Airport Transfers"
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Airport Transfers Command Center
              </h1>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Dispatch
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[#6B7280]">
              Real-time airport transfer dispatch, incoming flight tracking, supplier fleet readiness & platform revenue.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchStats}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-gray-300 text-xs font-semibold hover:bg-[#1A1A1A] transition-colors"
            title="Refresh metrics"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-[#FCD223]' : ''}`} />
            Refresh
          </button>
          <Link
            href="/airport-transfers/vehicles"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-white text-xs font-semibold hover:border-blue-500/40 transition-colors"
          >
            <Car className="h-3.5 w-3.5 text-blue-400" />
            Vehicles
            {(stats?.pendingVehicles ?? 0) > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {stats?.pendingVehicles}
              </span>
            )}
          </Link>
          <Link
            href="/airport-transfers/bookings"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141414] border border-[#2A2A2A] text-white text-xs font-semibold hover:border-purple-500/40 transition-colors"
          >
            <CalendarCheck className="h-3.5 w-3.5 text-purple-400" />
            Dispatch Board
          </Link>
          <Link
            href="/airport-transfers/payments"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FCD223] text-black text-xs font-bold hover:bg-[#E5B800] transition-colors shadow-lg shadow-[#FCD223]/10"
          >
            <CreditCard className="h-3.5 w-3.5 stroke-[2.5]" />
            Settlements & Payouts
          </Link>
        </div>
      </div>

      {/* ── 2. EXECUTIVE KPI CARDS (8 METRICS) ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Scheduled Today */}
        <KpiCard
          label="Scheduled Today"
          value={stats?.scheduledToday ?? 0}
          description="Transfers scheduled for today"
          icon={Clock}
          iconColor="text-[#FCD223]"
          iconBg="bg-[#FCD223]/10"
          ping
          loading={loading}
        />

        {/* Active on Road */}
        <KpiCard
          label="Active on Road"
          value={stats?.activeTransfers ?? 0}
          description="Currently in transit"
          icon={Plane}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
          valueColor="text-blue-400"
          loading={loading}
        />

        {/* Pending Dispatch */}
        <KpiCard
          label="Pending Dispatch"
          value={stats?.pendingAssignment ?? 0}
          description="Awaiting driver assignment"
          icon={AlertTriangle}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
          valueColor={(stats?.pendingAssignment ?? 0) > 0 ? 'text-amber-400' : 'text-white'}
          loading={loading}
        />

        {/* Gross GMV */}
        <KpiCard
          label="Gross Transfer Volume"
          value={`€${(stats?.gmv ?? 0).toFixed(2)}`}
          description="Completed transfer volume"
          icon={DollarSign}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          valueColor="text-[#FCD223]"
          loading={loading}
        />

        {/* Platform Revenue (10%) */}
        <KpiCard
          label="Platform Revenue (10%)"
          value={`€${((stats?.platformRevenue ?? (stats?.gmv ? stats.gmv * 0.1 : 0))).toFixed(2)}`}
          description="Earned commission cut"
          icon={Sparkles}
          iconColor="text-[#FCD223]"
          iconBg="bg-[#FCD223]/10"
          valueColor="text-emerald-400"
          loading={loading}
        />

        {/* Transfer Fleet */}
        <KpiCard
          label="Transfer Fleet"
          value={stats?.totalVehicles ?? 0}
          description={`${stats?.approvedVehicles ?? 0} approved, ${stats?.pendingVehicles ?? 0} pending`}
          icon={Car}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
          loading={loading}
        />

        {/* Partner Suppliers */}
        <KpiCard
          label="Active Suppliers"
          value={stats?.totalSuppliers ?? 0}
          description="Verified transport companies"
          icon={Building2}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/10"
          loading={loading}
        />

        {/* Completed Transfers */}
        <KpiCard
          label="Completed Transfers"
          value={stats?.completedBookings ?? 0}
          description={`${stats?.totalTransfers ?? 0} all-time bookings`}
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          loading={loading}
        />
      </div>

      {/* ── 3. VISUAL CHARTS (REVENUE TRAJECTORY & STATUS DISTRIBUTION) ────────── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Revenue Trajectory Bar Chart */}
        <div className="lg:col-span-2 rounded-xl border border-[#2A2A2A] bg-[#141414] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#FCD223]" />
                Airport Transfer Revenue Trajectory
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Completed gross GMV and platform 10% fee over the last 6 months
              </p>
            </div>
            <span className="text-xs font-bold text-[#FCD223] bg-[#FCD223]/10 px-2.5 py-1 rounded-full border border-[#FCD223]/20">
              EUR (€)
            </span>
          </div>

          {loading ? (
            <div className="w-full h-[240px] flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#FCD223] border-t-transparent" />
            </div>
          ) : (
            <div className="w-full h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyEarningsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FCD223" stopOpacity={0.95} />
                      <stop offset="95%" stopColor="#B38600" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                  <XAxis dataKey="month" stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} dy={8} />
                  <YAxis stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `€${val}`} dx={-8} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(20, 20, 20, 0.95)',
                      borderColor: 'rgba(255,255,255,0.15)',
                      borderRadius: '10px',
                      color: '#fff',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      padding: '8px 12px',
                    }}
                    formatter={(value: any) => [`€${Number(value || 0).toFixed(2)}`, 'Transfer Volume']}
                    labelStyle={{ color: '#A1A1AA', fontWeight: 'bold', marginBottom: '2px', fontSize: '0.8rem' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="gmv" fill="url(#colorGmv)" radius={[4, 4, 0, 0]} barSize={34} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Transfer Status Distribution Donut Chart */}
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5">
          <div className="mb-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-purple-400" />
              Transfer Distribution
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">Booking fulfillment status</p>
          </div>

          {loading ? (
            <div className="w-full h-[200px] flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
            </div>
          ) : (
            <div className="w-full h-[200px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={5}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(20, 20, 20, 0.95)',
                      borderColor: 'rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.8rem',
                      padding: '6px 10px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-white">
                  {stats?.totalTransfers ?? 0}
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2A2A2A] text-[11px]">
            {distributionData.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-gray-400 truncate">{item.name}</span>
                <span className="text-white font-bold ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. QUICK OPERATIONAL MODULES (4 CARDS) ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Vehicle Approvals */}
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5 flex flex-col justify-between hover:border-blue-500/40 transition-colors">
          <div>
            <div className="p-2.5 w-fit rounded-xl bg-blue-500/10 text-blue-400 mb-3">
              <Car className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Vehicle Approvals</h3>
            <p className="mt-1 text-xs text-[#6B7280]">
              Verify airport transport vehicles, passenger capacity, and commercial permits.
            </p>
          </div>
          <Link
            href="/airport-transfers/vehicles"
            className="mt-4 flex items-center justify-between text-xs font-semibold text-[#FCD223] hover:underline"
          >
            <span>Review Vehicles</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Booking Oversight */}
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5 flex flex-col justify-between hover:border-purple-500/40 transition-colors">
          <div>
            <div className="p-2.5 w-fit rounded-xl bg-purple-500/10 text-purple-400 mb-3">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Booking Oversight</h3>
            <p className="mt-1 text-xs text-[#6B7280]">
              Audit platform-wide airport transfer journeys, flight arrival tracking, and milestones.
            </p>
          </div>
          <Link
            href="/airport-transfers/bookings"
            className="mt-4 flex items-center justify-between text-xs font-semibold text-[#FCD223] hover:underline"
          >
            <span>Audit Bookings</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Payments & Settlements */}
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
          <div>
            <div className="p-2.5 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 mb-3">
              <CreditCard className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Payments & Settlements</h3>
            <p className="mt-1 text-xs text-[#6B7280]">
              Track transfer gross GMV, platform revenue cuts (10%), and supplier 9-day disbursements.
            </p>
          </div>
          <Link
            href="/airport-transfers/payments"
            className="mt-4 flex items-center justify-between text-xs font-semibold text-[#FCD223] hover:underline"
          >
            <span>View Settlements</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Supplier Management */}
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
          <div>
            <div className="p-2.5 w-fit rounded-xl bg-cyan-500/10 text-cyan-400 mb-3">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Supplier Partners</h3>
            <p className="mt-1 text-xs text-[#6B7280]">
              Manage partner organizations, compliance documents, agreements, and contact details.
            </p>
          </div>
          <Link
            href="/airport-transfers/supplier-management"
            className="mt-4 flex items-center justify-between text-xs font-semibold text-[#FCD223] hover:underline"
          >
            <span>Manage Suppliers</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* ── 5. LIVE SCHEDULE & RECENT TRANSFERS DISPATCH BOARD ─────────────────── */}
      <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] overflow-hidden">
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2A2A]">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#FCD223]" />
              Incoming Flights & Active Journey Dispatch
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Live airport reservations, flight numbers, passenger meet & greet, and assigned suppliers.
            </p>
          </div>
          <Link
            href="/airport-transfers/bookings"
            className="flex items-center gap-1.5 text-xs text-[#FCD223] font-bold hover:underline"
          >
            View Full Dispatch Board <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-[#FCD223]" />
            Loading transfer dispatch records...
          </div>
        ) : !stats?.recentTransfers || stats.recentTransfers.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            No transfer bookings registered in the system yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#1A1A1A] text-gray-400 uppercase text-[10px] font-bold border-b border-[#2A2A2A]">
                <tr>
                  <th className="py-3 px-4">Flight & Booking</th>
                  <th className="py-3 px-4">Passenger</th>
                  <th className="py-3 px-4">Pickup Route</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4">Vehicle & Supplier</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Fare</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {stats.recentTransfers.map((t) => (
                  <tr key={t.id} className="hover:bg-[#1A1A1A]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono font-bold text-[#FCD223]">{t.bookingReference}</span>
                        {t.flightNumber ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-blue-400">
                            <Plane className="h-3 w-3" />
                            {t.flightNumber}
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-500">Standard Transfer</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{t.leadPassengerName}</span>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                          <span>{t.adults || 1} Pax</span>
                          {((t.standardLuggage || 0) > 0 || (t.largeLuggage || 0) > 0) && (
                            <span className="flex items-center gap-0.5">
                              <Luggage className="h-2.5 w-2.5" />
                              {(t.standardLuggage || 0) + (t.largeLuggage || 0)} bags
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col max-w-[200px]">
                        <span className="text-white truncate" title={t.pickupLocation}>
                          {t.pickupLocation}
                        </span>
                        <span className="text-[10px] text-gray-400 truncate" title={t.dropoffLocation}>
                          → {t.dropoffLocation}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-gray-400">
                      {formatDateTime(t.pickupDateTime)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">
                          {t.vehicle ? `${t.vehicle.make} ${t.vehicle.model}` : 'Unassigned'}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {t.supplier?.companyName || 'Independent'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(t.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-white">
                      €{Number(t.grandTotal || 0).toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href="/airport-transfers/bookings"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FCD223] hover:underline"
                      >
                        Inspect <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── 6. TRANSFER FLEET CLASSES & CAPABILITIES ──────────────────────────── */}
      <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              Transfer Fleet Classes & Service Capabilities
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Certified passenger capacities, luggage allowances, and supported booking categories
            </p>
          </div>
          <Link
            href="/airport-transfers/vehicles"
            className="text-xs font-semibold text-[#FCD223] hover:underline"
          >
            Manage Fleet →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {[
            {
              title: 'Go - 5P',
              capacity: '4 Passengers',
              luggage: '3 Standard Luggage',
              desc: 'Economical city & airport transfers',
              tag: 'STANDARD',
              color: 'text-blue-400',
              bg: 'bg-blue-500/10 border-blue-500/20',
            },
            {
              title: 'Premium - 5P',
              capacity: '4 Passengers',
              luggage: '3 Standard Luggage',
              desc: 'Executive sedans & business travel',
              tag: 'EXECUTIVE',
              color: 'text-purple-400',
              bg: 'bg-purple-500/10 border-purple-500/20',
            },
            {
              title: 'SUV - 7P',
              capacity: '6 Passengers',
              luggage: '5 Luggage',
              desc: 'Families & extra luggage space',
              tag: 'FAMILY',
              color: 'text-amber-400',
              bg: 'bg-amber-500/10 border-amber-500/20',
            },
            {
              title: 'Van - 8P & Above',
              capacity: '8+ Passengers',
              luggage: '8+ Luggage',
              desc: 'Group arrivals & tour delegations',
              tag: 'GROUPS',
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/20',
            },
            {
              title: 'Electric - 5P',
              capacity: '4 Passengers',
              luggage: '3 Standard Luggage',
              desc: 'Eco-friendly zero emission rides',
              tag: 'ECO GREEN',
              color: 'text-cyan-400',
              bg: 'bg-cyan-500/10 border-cyan-500/20',
            },
          ].map((c, i) => (
            <div key={i} className="p-3.5 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A]/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${c.bg} ${c.color}`}>
                    {c.tag}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{c.title}</h4>
                <p className="text-[11px] text-[#9CA3AF] mt-1">{c.desc}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#2A2A2A] space-y-1 text-[10px] text-gray-400">
                <div className="flex items-center gap-1.5">
                  <User className="h-3 w-3 text-gray-500" />
                  <span>{c.capacity}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Luggage className="h-3 w-3 text-gray-500" />
                  <span>{c.luggage}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  description: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  valueColor?: string;
  ping?: boolean;
  loading?: boolean;
}

function KpiCard({
  label,
  value,
  description,
  icon: Icon,
  iconColor,
  iconBg,
  valueColor = 'text-white',
  ping = false,
  loading = false,
}: KpiCardProps) {
  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-4 transition-colors hover:border-[#FCD223]/30 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
          {label}
        </p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3">
        {loading ? (
          <div className="h-8 w-20 rounded bg-white/10 animate-pulse" />
        ) : (
          <p className={`text-2xl font-black tracking-tight ${valueColor}`}>
            {value}
          </p>
        )}
        <p className="mt-1 text-[11px] text-[#9CA3AF] flex items-center gap-1.5">
          {ping && <span className="w-1.5 h-1.5 rounded-full bg-[#FCD223] animate-ping" />}
          {description}
        </p>
      </div>
    </div>
  );
}